import express from 'express';
import { protect } from './auth.js';
import {
    getProgress,
    updateLessonProgress,
    updateWordProgress,
    updateSkillLevels,
    getParentAnalytics
} from '../controllers/progressController.js';
import { updateLessonProgressValidation, updateWordProgressValidation } from '../validators/progressValidator.js';

const router = express.Router();

router.get('/:language', protect, getProgress);
router.post('/lesson', protect, updateLessonProgressValidation, updateLessonProgress);
router.post('/word', protect, updateWordProgressValidation, updateWordProgress);
router.put('/skills', protect, updateSkillLevels);
router.get('/analytics/:userId', protect, getParentAnalytics);

export default router;
