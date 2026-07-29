import express from 'express';
import protect from '../middleware/auth.js';
import { globalSearchController } from '../controllers/searchController.js';

const router = express.Router();

router.use(protect);

router.get('/', globalSearchController);

export default router;
