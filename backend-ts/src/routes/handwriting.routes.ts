import { Router } from 'express';
import { handwritingController } from '../controllers/HandwritingController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/evaluate', authenticate, handwritingController.evaluate);

export default router;
