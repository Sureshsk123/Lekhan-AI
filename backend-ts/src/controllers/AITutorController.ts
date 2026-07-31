import { Request, Response, NextFunction } from 'express';
import { aiTutorService } from '../services/AITutorService';

export class AITutorController {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { languageCode, message, sessionId } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const result = await aiTutorService.chatWithTutor(userId, languageCode || 'ta', message, sessionId);
      res.status(200).json({ status: 'success', data: { reply: result.response, sessionId: result.sessionId } });
    } catch (error) {
      next(error);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const result = await aiTutorService.getSessions(userId);
      const formatted = result.map(r => ({ sessionId: r.id, title: `Chat in ${r.languageCode}` }));
      res.status(200).json({ status: 'success', data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const result = await aiTutorService.getHistory(userId, sessionId as string);
      const messages = result.map(m => ({ role: m.role, content: m.content, timestamp: m.createdAt }));
      res.status(200).json({ status: 'success', data: { messages } });
    } catch (error) {
      next(error);
    }
  }

  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const { languageCode } = req.body;
      const result = await aiTutorService.createSession(userId, languageCode || 'ta');
      res.status(200).json({ status: 'success', data: { sessionId: result.id, title: `Chat in ${result.languageCode}` } });
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const result = await aiTutorService.deleteSession(userId, sessionId as string);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const aiTutorController = new AITutorController();
