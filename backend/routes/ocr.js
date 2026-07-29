import express from 'express';
import multer from 'multer';
import protect from '../middleware/auth.js';
import {
  processVisionOCR,
  getOCRHistory,
  processHandwritingOCR,
  processPrintedOCR
} from '../controllers/ocrController.js';
import { validateVisionOCR, validateOCRHistoryQuery } from '../validators/ocrValidator.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.use(protect);

router.post('/vision', upload.single('image'), validateVisionOCR, processVisionOCR);
router.get('/history', validateOCRHistoryQuery, getOCRHistory);
router.post('/handwriting', upload.single('image'), processHandwritingOCR);
router.post('/printed', upload.single('image'), processPrintedOCR);

export default router;
