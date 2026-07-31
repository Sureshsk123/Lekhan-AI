import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({
          status: 'error',
          message: 'Full name, email and password are required'
        });
      }

      const result = await authService.register(email, password, fullName);
      res.status(201).json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);
      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
      const user = await authService.getProfile(userId);
      res.status(200).json({ status: 'success', data: { user } });
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
      const user = await authService.getProfile(userId);
      res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
      }
      const message = await authService.forgotPassword(email);
      res.status(200).json({ status: 'success', message });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'Token and new password are required' });
      }
      await authService.resetPassword(token, newPassword);
      res.status(200).json({ status: 'success', message: 'Password has been reset successfully' });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { refreshToken } = req.body;
      if (userId && refreshToken) {
        await authService.logout(userId, refreshToken);
      }
      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
