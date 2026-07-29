import express from 'express';
import protect from '../middleware/auth.js';
import {
  createReport,
  exportReportPDFController,
  fetchUserReports
} from '../controllers/reportingController.js';

const router = express.Router();

router.use(protect);

router.post('/generate', createReport);
router.get('/my-reports', fetchUserReports);
router.get('/export-pdf/:reportId', exportReportPDFController);

export default router;
