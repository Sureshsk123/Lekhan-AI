import express from 'express';
import { protect } from './auth.js';
import { getDashboard } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);

export default router;
