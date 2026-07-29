import express from 'express';
import protect from '../middleware/auth.js';
import {
  evaluateHandwriting,
  getHandwritingHistory,
  getProgressGraphController
} from '../controllers/handwritingController.js';
import { evaluateHandwritingValidation, handwritingHistoryValidation } from '../validators/handwritingValidator.js';

const router = express.Router();

router.use(protect);

router.post('/evaluate', evaluateHandwritingValidation, evaluateHandwriting);
router.get('/history', handwritingHistoryValidation, getHandwritingHistory);
router.get('/progress-graph', getProgressGraphController);

export default router;
