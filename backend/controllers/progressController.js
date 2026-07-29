import ProgressService from '../services/ProgressService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProgress = async (req, res) => {
    try {
        const { language } = req.params;
        const progress = await ProgressService.getProgress(req.user._id, language);
        return sendSuccess(res, 200, 'Progress retrieved successfully', { progress }, { progress });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateLessonProgress = async (req, res) => {
    try {
        const progress = await ProgressService.completeLesson(req.user._id, req.body);
        return sendSuccess(res, 200, 'Lesson progress updated successfully', { progress }, { progress });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateWordProgress = async (req, res) => {
    try {
        const progress = await ProgressService.addWord(req.user._id, req.body);
        return sendSuccess(res, 200, 'Word progress updated successfully', { progress }, { progress });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateSkillLevels = async (req, res) => {
    try {
        const progress = await ProgressService.updateSkills(req.user._id, req.body);
        return sendSuccess(res, 200, 'Skill levels updated successfully', { progress }, { progress });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const getParentAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const analytics = await ProgressService.getAnalytics(userId);
        return sendSuccess(res, 200, 'Analytics retrieved successfully', { analytics }, { analytics });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
