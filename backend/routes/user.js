import express from 'express';
import { protect } from './auth.js';
import {
    getUserProfile,
    updateUserProfile,
    addXP,
    updateDiamonds,
    addAchievement
} from '../controllers/userController.js';
import {
    updateUserProfileValidation,
    updateXPValidation,
    updateDiamondsValidation
} from '../validators/userValidator.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfileValidation, updateUserProfile);
router.post('/xp', protect, updateXPValidation, addXP);
router.post('/diamonds', protect, updateDiamondsValidation, updateDiamonds);
router.post('/achievement', protect, addAchievement);

export default router;
