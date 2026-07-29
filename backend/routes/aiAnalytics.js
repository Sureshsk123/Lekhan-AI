import express from 'express';
import protect from '../middleware/auth.js';
import { getAIAnalytics, getAIUsageLogsController } from '../controllers/aiAnalyticsController.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getAIAnalytics);
router.get('/logs', getAIUsageLogsController);

export default router;
