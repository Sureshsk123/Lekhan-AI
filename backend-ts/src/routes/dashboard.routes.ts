import { Router } from 'express';
import { dashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/summary', authenticate, dashboardController.getDashboardData.bind(dashboardController));
router.get('/smart', authenticate, dashboardController.getDashboardData.bind(dashboardController));
router.get('/', authenticate, dashboardController.getDashboardData.bind(dashboardController));

export default router;
