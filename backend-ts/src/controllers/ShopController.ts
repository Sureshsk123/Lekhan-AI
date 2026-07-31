import { Request, Response, NextFunction } from 'express';
import { shopService } from '../services/ShopService';

export class ShopController {
  async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const items = await shopService.getCatalog(category as string || 'all');
      res.status(200).json({ status: 'success', data: items });
    } catch (error) {
      next(error);
    }
  }

  async purchaseItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) { res.status(401).json({ status: 'error', message: 'Unauthorized' }); return; }
      const result = await shopService.purchaseItem(userId, itemId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) { res.status(401).json({ status: 'error', message: 'Unauthorized' }); return; }
      const result = await shopService.getUserInventory(userId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async equipItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) { res.status(401).json({ status: 'error', message: 'Unauthorized' }); return; }
      const result = await shopService.equipItem(userId, itemId);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const shopController = new ShopController();
