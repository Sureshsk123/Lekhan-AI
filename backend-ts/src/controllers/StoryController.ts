import { Request, Response, NextFunction } from 'express';
import { storyService } from '../services/StoryService';

export class StoryController {
  async getStories(req: Request, res: Response, next: NextFunction) {
    try {
      const langFromPath = req.params.language as string | undefined;
      const languageCode = req.query.languageCode as string | undefined;
      const level = req.query.level as string | undefined;
      const lang = langFromPath || languageCode || 'en';
      const stories = await storyService.getStories(lang, level);
      res.status(200).json({ status: 'success', data: stories });
    } catch (error) {
      next(error);
    }
  }

  async getStoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const story = await storyService.getStoryById(id as string);
      res.status(200).json({ status: 'success', data: story });
    } catch (error) {
      next(error);
    }
  }
}

export const storyController = new StoryController();
