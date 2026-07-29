import express from 'express';
import protect from '../middleware/auth.js';
import {
  generateQuiz,
  submitQuiz,
  generateAIQuiz,
  submitAIQuiz
} from '../controllers/quizController.js';
import { generateQuizValidation, submitQuizValidation } from '../validators/quizValidator.js';

const router = express.Router();

router.use(protect);

router.post('/ai-generate', generateAIQuiz);
router.post('/ai-submit', submitAIQuiz);

router.post('/generate/:lessonId', generateQuizValidation, generateQuiz);
router.post('/submit', submitQuizValidation, submitQuiz);

export default router;
