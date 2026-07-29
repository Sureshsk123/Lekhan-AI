import AnalyticsService from '../services/AnalyticsService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getDashboard = async (req, res) => {
    try {
        const dashboard = await AnalyticsService.getDashboard(req.user);
        return sendSuccess(res, 200, 'Dashboard analytics retrieved successfully', dashboard, {
            stats: dashboard.stats,
            weakVocabulary: dashboard.weakVocabulary,
            progressOverTime: dashboard.progressOverTime
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
