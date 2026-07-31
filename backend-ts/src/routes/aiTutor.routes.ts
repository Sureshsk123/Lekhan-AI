import { Router } from 'express';
import { aiTutorController } from '../controllers/AITutorController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/session', aiTutorController.getSessions);
router.post('/session', aiTutorController.createSession);
router.get('/history/:sessionId', aiTutorController.getHistory);
router.delete('/clear/:sessionId', aiTutorController.deleteSession);
router.post('/chat', aiTutorController.chat);

export default router;
