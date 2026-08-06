import { Request, Response, NextFunction } from 'express';
import { lessonService } from '../services/LessonService';

export class LessonController {
  async getModulesForLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { languageCode } = req.params;
      const modules = await lessonService.getModulesForLanguage(languageCode as string);
      res.status(200).json({ status: 'success', data: modules });
    } catch (error) {
      next(error);
    }
  }

  async getLessonDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user?.id;
      const lesson = await lessonService.getLessonDetails(lessonId as string, userId);
      res.status(200).json({ status: 'success', data: lesson });
    } catch (error) {
      next(error);
    }
  }

  async completeLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { lessonId } = req.params;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const result = await lessonService.completeLesson(userId, lessonId as string);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const languageCode = req.params.languageCode as string | undefined;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const progress = await lessonService.getUserProgress(userId, languageCode);
      res.status(200).json({ status: 'success', data: { progress } });
    } catch (error) {
      next(error);
    }
  }
}

export const lessonController = new LessonController();
