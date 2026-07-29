import AIUsageLog from '../models/AIUsageLog.js';

export const createUsageLog = async (logData) => {
  try {
    const log = new AIUsageLog(logData);
    return await log.save();
  } catch (error) {
    console.error('Failed to create AIUsageLog in DB:', error.message);
    return null;
  }
};

export const getAIAnalyticsSummary = async (query = {}) => {
  const { startDate, endDate, feature, userId } = query;
  const matchFilter = {};

  if (userId) matchFilter.userId = userId;
  if (feature) matchFilter.feature = feature;
  if (startDate || endDate) {
    matchFilter.timestamp = {};
    if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
    if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
  }

  const summary = await AIUsageLog.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        successfulRequests: { $sum: { $cond: ['$success', 1, 0] } },
        failedRequests: { $sum: { $cond: ['$success', 0, 1] } },
        totalInputTokens: { $sum: '$inputTokens' },
        totalOutputTokens: { $sum: '$outputTokens' },
        totalTokens: { $sum: '$totalTokens' },
        avgLatencyMs: { $avg: '$latencyMs' },
        totalCostUsd: { $sum: '$estimatedCostUsd' }
      }
    }
  ]);

  const featureBreakdown = await AIUsageLog.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$feature',
        count: { $sum: 1 },
        totalTokens: { $sum: '$totalTokens' },
        avgLatencyMs: { $avg: '$latencyMs' }
      }
    }
  ]);

  const data = summary[0] || {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    avgLatencyMs: 0,
    totalCostUsd: 0
  };

  const successRate = data.totalRequests > 0 ? (data.successfulRequests / data.totalRequests) * 100 : 100;

  return {
    ...data,
    successRate: parseFloat(successRate.toFixed(2)),
    avgLatencyMs: Math.round(data.avgLatencyMs || 0),
    featureBreakdown
  };
};

export const getAIUsageLogs = async ({ page = 1, limit = 10, feature, userId }) => {
  const matchFilter = {};
  if (userId) matchFilter.userId = userId;
  if (feature) matchFilter.feature = feature;

  const skip = (page - 1) * limit;
  const logs = await AIUsageLog.find(matchFilter)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await AIUsageLog.countDocuments(matchFilter);

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export default {
  createUsageLog,
  getAIAnalyticsSummary,
  getAIUsageLogs
};
