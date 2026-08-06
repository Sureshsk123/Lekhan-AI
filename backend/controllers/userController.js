import UserService from '../services/UserService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await UserService.getProfile(req.user._id);
        const userObj = user.toObject ? user.toObject() : user;
        const { password, ...safeUser } = userObj;
        return sendSuccess(res, 200, 'Profile retrieved successfully', { user: safeUser }, { user: safeUser });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { username, avatar, enrolledLanguages, preferredLanguage, language, activeTheme, activeTitle } = req.body;
        const updateData = {};

        if (username !== undefined) updateData.username = username;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (preferredLanguage !== undefined || language !== undefined) {
            const langVal = (preferredLanguage || language).toLowerCase();
            updateData.preferredLanguage = langVal;
            if (!updateData.enrolledLanguages) updateData.enrolledLanguages = [langVal];
        }
        if (enrolledLanguages !== undefined) updateData.enrolledLanguages = enrolledLanguages;
        if (activeTheme !== undefined) updateData.activeTheme = activeTheme;
        if (activeTitle !== undefined) updateData.activeTitle = activeTitle;

        const updatedUser = await UserService.updateProfile(req.user._id, updateData);
        const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
        const { password, ...safeUser } = userObj;

        return sendSuccess(res, 200, 'Profile updated successfully', { user: safeUser }, { user: safeUser });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const addXP = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount === undefined || isNaN(amount)) {
            return sendError(res, 400, 'Valid XP amount is required');
        }

        const result = await UserService.addXP(req.user, parseInt(amount, 10));
        return sendSuccess(res, 200, 'XP updated successfully', result, {
            xp: result.xp,
            level: result.level,
            diamonds: result.diamonds
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateDiamonds = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount === undefined || isNaN(amount)) {
            return sendError(res, 400, 'Valid diamond amount is required');
        }

        const result = await UserService.updateDiamonds(req.user, parseInt(amount, 10));
        return sendSuccess(res, 200, 'Diamonds updated successfully', result, {
            diamonds: result.diamonds
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const addAchievement = async (req, res) => {
    try {
        const { name, icon, description } = req.body;
        if (!name) return sendError(res, 400, 'Achievement name is required');

        const achievements = await UserService.addAchievement(req.user, { name, icon, description });
        return sendSuccess(res, 200, 'Achievement added successfully', { achievements }, { achievements });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
