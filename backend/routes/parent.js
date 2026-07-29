import express from 'express';
import protect from '../middleware/auth.js';
import { requireRole } from '../middleware/roleAuth.js';
import {
  linkChildController,
  getChildrenOverview,
  getChildDashboardController
} from '../controllers/parentController.js';
import { validateLinkChild } from '../validators/parentValidator.js';

const router = express.Router();

router.use(protect);

router.post('/link-child', validateLinkChild, linkChildController);
router.get('/children', getChildrenOverview);
router.get('/dashboard/:childId', getChildDashboardController);

export default router;
