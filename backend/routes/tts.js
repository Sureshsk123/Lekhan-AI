import express from 'express';
import protect from '../middleware/auth.js';
import { synthesizeSpeech } from '../controllers/ttsController.js';
import { validateTTSRequest } from '../validators/ttsValidator.js';

const router = express.Router();

router.use(protect);

router.post('/generate', validateTTSRequest, synthesizeSpeech);

export default router;
