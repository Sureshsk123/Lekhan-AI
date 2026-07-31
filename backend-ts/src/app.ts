import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

// Flexible CORS for development and production
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', environment: env.NODE_ENV });
});

// Root handler to prevent 404 when user visits backend URL directly in browser
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0fdf4; color: #166534;">
        <div style="text-align: center;">
          <h1>✅ LangSphere AI Backend is Running</h1>
          <p>Please return to the Frontend app (e.g. http://localhost:5173) to sign in.</p>
        </div>
      </body>
    </html>
  `);
});

// API Routes with full prefix aliases (Express 5 compatible)
app.use(['/api/v1/v1', '/api/v1', '/api', '/v1'], routes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  console.warn(`[404 NOT FOUND] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
