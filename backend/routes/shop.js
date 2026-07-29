import express from 'express';
import { protect } from './auth.js';
import {
    getCatalog,
    purchaseItem,
    getInventory,
    equipItem
} from '../controllers/shopController.js';
import { purchaseItemValidation, equipItemValidation } from '../validators/shopValidator.js';

const router = express.Router();

router.get('/catalog', protect, getCatalog);
router.post('/purchase', protect, purchaseItemValidation, purchaseItem);
router.get('/inventory', protect, getInventory);
router.post('/equip', protect, equipItemValidation, equipItem);

export default router;
