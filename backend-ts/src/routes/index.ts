import { Router } from 'express';
import lessonRoutes from './lesson.routes';
import quizRoutes from './quiz.routes';
import shopRoutes from './shop.routes';
import aiTutorRoutes from './aiTutor.routes';
import storyRoutes from './story.routes';
import dashboardRoutes from './dashboard.routes';
import authRoutes from './auth.routes';

const router = Router();

// Primary Application Modules
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/shop', shopRoutes);
router.use('/ai/tutor', aiTutorRoutes);
router.use('/stories', storyRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/auth', authRoutes);

// Secondary Module Stubs using Express router.use (matches all subpaths natively in Express 5)
router.use('/notifications', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/gamification', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/admin', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/parent', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/personalized', (req, res) => res.status(200).json({ status: 'success', data: {} }));
router.use('/reports', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/stt', (req, res) => res.status(200).json({ status: 'success', data: {} }));
router.use('/search', (req, res) => res.status(200).json({ status: 'success', data: [] }));
router.use('/quiz', quizRoutes);

export default router;
