import { createUsageLog, getAIAnalyticsSummary, getAIUsageLogs } from '../repositories/aiAnalyticsRepository.js';

/**
 * Rates per 1000 tokens for Gemini 1.5 Flash estimation:
 * Input: $0.000075 / 1k tokens
 * Output: $0.0003 / 1k tokens
 */
export const calculateEstimatedCost = (inputTokens = 0, outputTokens = 0) => {
  const inputCost = (inputTokens / 1000) * 0.000075;
  const outputCost = (outputTokens / 1000) * 0.0003;
  return parseFloat((inputCost + outputCost).toFixed(6));
};

export const recordAIUsage = async ({
  userId,
  feature,
  modelName,
  inputTokens = 0,
  outputTokens = 0,
  totalTokens = 0,
  latencyMs = 0,
  success = true,
  error = null
}) => {
  const estimatedCostUsd = calculateEstimatedCost(inputTokens, outputTokens);
  return await createUsageLog({
    userId,
    feature,
    modelName: modelName || 'gemini-1.5-flash',
    inputTokens,
    outputTokens,
    totalTokens: totalTokens || (inputTokens + outputTokens),
    latencyMs,
    success,
    error,
    estimatedCostUsd
  });
};

export const getAIAnalyticsDashboard = async (query = {}) => {
  return await getAIAnalyticsSummary(query);
};

export const getAIUsageHistory = async (params) => {
  return await getAIUsageLogs(params);
};

export default {
  calculateEstimatedCost,
  recordAIUsage,
  getAIAnalyticsDashboard,
  getAIUsageHistory
};
