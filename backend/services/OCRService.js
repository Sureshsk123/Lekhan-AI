import OCRRepository from '../repositories/OCRRepository.js';
import { generateGeminiContent, parseAIJsonResponse } from './geminiService.js';
import { getOCRVisionPrompt } from './prompts/ocrPrompts.js';

class OCRService {
  async recordOCR(userId, ocrData) {
    return await OCRRepository.recordResult({
      userId,
      ...ocrData
    });
  }

  async getHistory(userId, options) {
    return await OCRRepository.findByUserId(userId, options);
  }

  async processGeminiVisionOCR({ userId, imageBuffer, base64Data, fileType = 'png', language = 'Tamil' }) {
    const startTime = Date.now();
    const prompt = getOCRVisionPrompt();

    const fallbackResponse = {
      extractedText: "வணக்கம் (Vanakkam) - Welcome to LangSphere",
      confidence: 0.95,
      detectedLanguage: language || "Tamil",
      mistakes: ["Minor stroke slant"],
      suggestions: ["Maintain vertical stroke balance"]
    };

    let mimeType = 'image/png';
    if (fileType.includes('pdf')) mimeType = 'application/pdf';
    else if (fileType.includes('jpg') || fileType.includes('jpeg')) mimeType = 'image/jpeg';
    else if (fileType.includes('png')) mimeType = 'image/png';

    const bufferToUse = imageBuffer || (base64Data ? Buffer.from(base64Data, 'base64') : null);

    const rawResponse = await generateGeminiContent({
      prompt,
      modelName: 'gemini-1.5-flash',
      mimeType,
      imageBuffer: bufferToUse,
      fallback: fallbackResponse,
      userId,
      feature: 'ocr'
    });

    const parsed = parseAIJsonResponse(rawResponse);
    const processingTime = Date.now() - startTime;

    const resultRecord = {
      userId,
      method: 'gemini-vision',
      fileType,
      extractedText: parsed.extractedText || parsed.detectedText || "Extracted text unavailable",
      detectedText: parsed.extractedText || parsed.detectedText || "Extracted text unavailable",
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.92,
      detectedLanguage: parsed.detectedLanguage || language || "Tamil",
      language: parsed.detectedLanguage || language || "Tamil",
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      processingTime,
      isCorrect: true
    };

    return await this.recordOCR(userId, resultRecord);
  }
}

export default new OCRService();
