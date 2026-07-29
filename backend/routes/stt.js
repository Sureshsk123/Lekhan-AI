import express from 'express';
import multer from 'multer';
import protect from '../middleware/auth.js';
import { transcribeSpeech, fetchSTTHistory } from '../controllers/sttController.js';
import { validateSTTUpload, validateSTTHistoryQuery } from '../validators/sttValidator.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.use(protect);

router.post('/transcribe', upload.single('audio'), validateSTTUpload, transcribeSpeech);
router.get('/history', validateSTTHistoryQuery, fetchSTTHistory);

export default router;
