import express from 'express';
import protect from '../middleware/auth.js';
import { getSmartDashboard } from '../controllers/smartDashboardController.js';

const router = express.Router();

router.use(protect);

router.get('/smart', getSmartDashboard);

export default router;
