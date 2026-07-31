import { Router } from 'express';
import { shopController } from '../controllers/ShopController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/catalog', shopController.getCatalog);
router.post('/purchase', authenticate, shopController.purchaseItem);
router.get('/inventory', authenticate, shopController.getUserInventory);
router.post('/equip', authenticate, shopController.equipItem);

export default router;
