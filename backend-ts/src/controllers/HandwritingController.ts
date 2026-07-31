import { Request, Response, NextFunction } from 'express';
import { handwritingService } from '../services/HandwritingService';

export class HandwritingController {
  async evaluate(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageBase64, expectedText } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      if (!imageBase64 || !expectedText) {
        res.status(400).json({ status: 'error', message: 'imageBase64 and expectedText are required' });
        return;
      }

      const result = await handwritingService.evaluateHandwriting(userId, imageBase64, expectedText);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const handwritingController = new HandwritingController();
