/**
 * Resilient Gemini AI Service Wrapper
 * Handles retries with exponential backoff, timeout protection, rate limiting,
 * fallback responses, token estimation, and integration with AI Analytics.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { recordAIUsage } from './aiAnalyticsService.js';

dotenv.config();

const RAW_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'MOCK_KEY';
const isDummyKey = RAW_KEY === 'MOCK_KEY' || RAW_KEY.includes('your_') || RAW_KEY.includes('YOUR_') || RAW_KEY.length < 20;
const API_KEY = isDummyKey ? 'MOCK_KEY' : RAW_KEY;
const aiClient = new GoogleGenerativeAI(API_KEY === 'MOCK_KEY' ? 'MOCK_KEY_STRING_LONG_ENOUGH_TO_PASS_INIT' : API_KEY);

/**
 * Exponential delay helper
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Clean Markdown backticks from AI JSON string response
 */
export const parseAIJsonResponse = (text) => {
  if (typeof text !== 'string') return text;
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return cleaned;
  }
};

/**
 * Estimates token count from text length (~4 chars per token)
 */
export const estimateTokens = (text = '') => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

/**
 * Generates content using Gemini model with retry, timeout, and fallback handling
 */
export const generateGeminiContent = async ({
  prompt,
  systemInstruction = '',
  modelName = 'gemini-1.5-flash',
  mimeType = null,
  imageBuffer = null,
  audioBuffer = null,
  maxRetries = 3,
  timeoutMs = 15000,
  fallback = null,
  userId = null,
  feature = 'general'
}) => {
  const startTime = Date.now();
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      if (API_KEY === 'MOCK_KEY' || process.env.NODE_ENV === 'test') {
        // If in test mode or unconfigured key, return fallback immediately
        if (fallback) {
          const latencyMs = Date.now() - startTime;
          await recordAIUsage({
            userId,
            feature,
            modelName,
            inputTokens: estimateTokens(prompt),
            outputTokens: estimateTokens(JSON.stringify(fallback)),
            totalTokens: estimateTokens(prompt) + estimateTokens(JSON.stringify(fallback)),
            latencyMs,
            success: true,
            error: null
          });
          return fallback;
        }
      }

      const modelOptions = { model: modelName };
      if (systemInstruction) {
        modelOptions.systemInstruction = systemInstruction;
      }

      const model = aiClient.getGenerativeModel(modelOptions);

      // Timeout wrapper
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Gemini API Request timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      let parts = [prompt];
      if (imageBuffer && mimeType) {
        parts.push({
          inlineData: {
            data: Buffer.isBuffer(imageBuffer) ? imageBuffer.toString('base64') : imageBuffer,
            mimeType
          }
        });
      } else if (audioBuffer && mimeType) {
        parts.push({
          inlineData: {
            data: Buffer.isBuffer(audioBuffer) ? audioBuffer.toString('base64') : audioBuffer,
            mimeType
          }
        });
      }

      const apiPromise = model.generateContent(parts);
      const result = await Promise.race([apiPromise, timeoutPromise]);
      const response = await result.response;
      const textOutput = response.text();

      const latencyMs = Date.now() - startTime;
      const inputTokens = estimateTokens(prompt);
      const outputTokens = estimateTokens(textOutput);

      await recordAIUsage({
        userId,
        feature,
        modelName,
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        latencyMs,
        success: true,
        error: null
      });

      return textOutput;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Gemini API Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries) {
        const backoff = Math.pow(2, attempt) * 500;
        await delay(backoff);
      }
    }
  }

  // All retries failed
  const latencyMs = Date.now() - startTime;
  await recordAIUsage({
    userId,
    feature,
    modelName,
    inputTokens: estimateTokens(prompt),
    outputTokens: 0,
    totalTokens: estimateTokens(prompt),
    latencyMs,
    success: false,
    error: lastError ? lastError.message : 'All retries failed'
  });

  if (fallback !== null) {
    console.warn(`🔄 Returning fallback response for feature '${feature}' due to API failure.`);
    return typeof fallback === 'string' ? fallback : fallback;
  }

  throw new Error(`Gemini AI service unavailable: ${lastError ? lastError.message : 'Unknown error'}`);
};

export default {
  generateGeminiContent,
  parseAIJsonResponse,
  estimateTokens
};
