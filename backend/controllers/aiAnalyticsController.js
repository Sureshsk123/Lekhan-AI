import { getAIAnalyticsDashboard, getAIUsageHistory } from '../services/aiAnalyticsService.js';

export const getAIAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, feature } = req.query;
    const summary = await getAIAnalyticsDashboard({
      startDate,
      endDate,
      feature,
      userId: req.user ? req.user._id : null
    });

    res.status(200).json({
      success: true,
      message: 'AI Analytics Dashboard data retrieved successfully',
      data: summary
    });
  } catch (error) {
    console.error('Error fetching AI analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve AI analytics',
      errors: [{ field: 'ai_analytics', message: error.message }]
    });
  }
};

export const getAIUsageLogsController = async (req, res) => {
  try {
    const { page = 1, limit = 10, feature } = req.query;
    const history = await getAIUsageHistory({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      feature,
      userId: req.user ? req.user._id : null
    });

    res.status(200).json({
      success: true,
      message: 'AI Usage logs retrieved successfully',
      data: history.logs,
      pagination: history.pagination
    });
  } catch (error) {
    console.error('Error fetching AI usage logs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve AI usage logs',
      errors: [{ field: 'ai_logs', message: error.message }]
    });
  }
};

export default {
  getAIAnalytics,
  getAIUsageLogsController
};
