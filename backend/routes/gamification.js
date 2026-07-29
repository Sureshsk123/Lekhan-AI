import express from 'express';
import { protect } from './auth.js';
import {
    getAchievements,
    checkAchievements,
    getXPHistory,
    getLeaderboard
} from '../controllers/gamificationController.js';

const router = express.Router();

router.get('/achievements', protect, getAchievements);
router.post('/check', protect, checkAchievements);
router.get('/xp-history', protect, getXPHistory);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
