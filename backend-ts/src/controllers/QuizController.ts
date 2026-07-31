import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/QuizService';

export class QuizController {
  async getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const quiz = await quizService.getQuizData(quizId as string);
      res.status(200).json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  }

  async getQuizByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      const quiz = await quizService.getQuizByLesson(lessonId as string);
      res.status(200).json({ status: 'success', data: quiz });
    } catch (error) {
      next(error);
    }
  }

  async submitAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const result = await quizService.evaluateAttempt(userId, quizId as string, answers);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const history = await quizService.getAttemptHistory(userId);
      res.status(200).json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();
