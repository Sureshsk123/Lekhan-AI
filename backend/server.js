import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

import connectDB from './config/mongodb.js';
import setupSwagger from './config/swagger.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import lessonRoutes from './routes/lessons.js';
import storyRoutes from './routes/stories.js';
import progressRoutes from './routes/progress.js';
import ocrRoutes from './routes/ocr.js';
import quizRoutes from './routes/quiz.js';
import gamificationRoutes from './routes/gamification.js';
import shopRoutes from './routes/shop.js';
import analyticsRoutes from './routes/analytics.js';
import handwritingEvalRoutes from './routes/handwriting-eval.js';

import aiTutorRoutes from './routes/aiTutor.js';
import sttRoutes from './routes/stt.js';
import ttsRoutes from './routes/tts.js';
import aiAnalyticsRoutes from './routes/aiAnalytics.js';

import personalizedRoutes from './routes/personalizedLearning.js';
import smartDashboardRoutes from './routes/smartDashboard.js';
import notificationRoutes from './routes/notifications.js';
import parentRoutes from './routes/parent.js';
import adminRoutes from './routes/admin.js';
import searchRoutes from './routes/search.js';
import reportingRoutes from './routes/reporting.js';

dotenv.config();

const app = express();

// ─── Security Middlewares ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(mongoSanitize());

// ─── CORS Configuration ────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    errors: [{ field: 'rate_limit', message: 'Rate limit exceeded' }]
  }
});
app.use('/api', limiter);

// ─── Swagger Documentation ─────────────────────────────────────────────────────
setupSwagger(app);

// ─── Core Enterprise Routes (Supports /api and /api/v1 prefixes) ───────────────
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/api/v1/user', userRoutes);

app.use('/api/lessons', lessonRoutes);
app.use('/api/v1/lessons', lessonRoutes);

app.use('/api/stories', storyRoutes);
app.use('/api/v1/stories', storyRoutes);

app.use('/api/progress', progressRoutes);
app.use('/api/v1/progress', progressRoutes);

app.use('/api/ocr', ocrRoutes);
app.use('/api/v1/ocr', ocrRoutes);

app.use('/api/quiz', quizRoutes);
app.use('/api/v1/quiz', quizRoutes);

app.use('/api/gamification', gamificationRoutes);
app.use('/api/v1/gamification', gamificationRoutes);

app.use('/api/shop', shopRoutes);
app.use('/api/v1/shop', shopRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use('/api/handwriting', handwritingEvalRoutes);
app.use('/api/v1/handwriting', handwritingEvalRoutes);

// ─── Phase 4A AI Learning Engine Routes ───────────────────────────────────────
app.use('/api/ai-tutor', aiTutorRoutes);
app.use('/api/stt', sttRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/analytics/ai', aiAnalyticsRoutes);

// ─── Phase 4B Intelligent Learning Platform Routes ────────────────────────────
app.use('/api/personalized', personalizedRoutes);
app.use('/api/dashboard', smartDashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportingRoutes);

// ─── Health Check Endpoint ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.status(200).json({
    success: true,
    message: 'LangSphere API is healthy',
    data: {
      status: 'ok',
      database: {
        status: dbStateMap[dbState] || 'unknown',
        connected: dbState === 1
      },
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '2.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// ─── 404 Catch-All ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [{ field: 'route', message: 'The requested endpoint does not exist' }]
  });
});

// ─── Centralized Error Handling Middleware ─────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(`💥 Unhandled Error: ${err.message}`, err.stack);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: [{ field: 'server', message: err.message || 'An unexpected error occurred' }]
  });
});

// ─── Process Error Handlers ────────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection:', reason);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message, error.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 5005;

// ─── Bootstrap: Connect MongoDB Atlas → Start Listening ───────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 LangSphere API Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Database: MongoDB Atlas`);
      console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📑 API Docs: http://localhost:${PORT}/api/docs`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(`❌ Startup Error: Failed to start server - ${error.message}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
