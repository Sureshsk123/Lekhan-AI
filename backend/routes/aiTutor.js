import express from 'express';
import protect from '../middleware/auth.js';
import {
  createChatSession,
  getSessions,
  askAiTutor,
  fetchSessionHistory,
  removeSession
} from '../controllers/aiTutorController.js';
import { validateChatQuery, validateSessionId } from '../validators/aiTutorValidator.js';

const router = express.Router();

router.use(protect);

router.post('/session', createChatSession);
router.get('/session', getSessions);
router.post('/chat', validateChatQuery, askAiTutor);
router.get('/history/:sessionId', validateSessionId, fetchSessionHistory);
router.delete('/clear/:sessionId', validateSessionId, removeSession);

export default router;
