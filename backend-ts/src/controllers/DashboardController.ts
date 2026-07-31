import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/DashboardService';

export class DashboardController {
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const languageCode = req.query.language as string | undefined;
      const data = await dashboardService.getDashboardData(userId, languageCode);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
