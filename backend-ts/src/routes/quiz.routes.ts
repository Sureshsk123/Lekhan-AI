import { Router } from 'express';
import { quizController } from '../controllers/QuizController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/history', authenticate, quizController.getHistory);
router.get('/lesson/:lessonId', quizController.getQuizByLesson);
router.post('/generate/:lessonId', authenticate, quizController.getQuizByLesson); // Map POST /generate/:lessonId to getQuizByLesson for backwards compatibility
router.get('/:quizId', quizController.getQuiz);
router.post('/:quizId/submit', authenticate, quizController.submitAttempt);

export default router;
