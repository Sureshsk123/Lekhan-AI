import { Router } from 'express';
import { lessonController } from '../controllers/LessonController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Specific routes MUST come before wildcard /:languageCode
router.get('/details/:lessonId', lessonController.getLessonDetails);
router.post('/complete/:lessonId', authenticate, lessonController.completeLesson);
router.get('/progress', authenticate, lessonController.getUserProgress);
router.get('/progress/:languageCode', authenticate, lessonController.getUserProgress);

// Wildcard (language course view) — last
router.get('/:languageCode', lessonController.getModulesForLanguage);

export default router;
