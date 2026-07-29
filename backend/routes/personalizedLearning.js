import express from 'express';
import protect from '../middleware/auth.js';
import { getPersonalizedProfile } from '../controllers/personalizedLearningController.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getPersonalizedProfile);
router.get('/recommendations', getPersonalizedProfile);

export default router;
