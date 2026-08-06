import GamificationService from '../services/GamificationService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { getPaginationOptions, buildPaginatedResponse } from '../utils/pagination.js';

export const getAchievements = async (req, res) => {
    try {
        const data = await GamificationService.getAchievements(req.user);
        return sendSuccess(res, 200, 'Achievements retrieved successfully', data, {
            catalog: data.catalog,
            userAchievements: data.userAchievements
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const claimAchievement = async (req, res) => {
    try {
        const { achievementId } = req.body;
        if (!achievementId) {
            return sendError(res, 400, 'Achievement ID is required');
        }
        const result = await GamificationService.claimAchievement(req.user, achievementId);
        return sendSuccess(res, 200, 'Achievement reward claimed successfully', result);
    } catch (error) {
        return sendError(res, 400, error.message);
    }
};

export const checkAchievements = async (req, res) => {
    try {
        const result = await GamificationService.checkAchievements(req.user);
        return sendSuccess(res, 200, 'Achievements checked successfully', result, {
            newlyEarned: result.newlyEarned,
            totalAchievements: result.totalAchievements
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const getXPHistory = async (req, res) => {
    try {
        const options = getPaginationOptions(req.query);
        const { data, total } = await GamificationService.getXPHistory(req.user._id, {
            skip: options.skip,
            limit: options.limit
        });

        const result = buildPaginatedResponse({ data, total, page: options.page, limit: options.limit });
        return sendSuccess(res, 200, 'XP History retrieved successfully', result, { history: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const leaderboard = await GamificationService.getLeaderboard(limit);
        return sendSuccess(res, 200, 'Leaderboard retrieved successfully', { leaderboard }, { leaderboard });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
