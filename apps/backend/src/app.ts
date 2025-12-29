import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { verifyRouter } from './routes/verify.js';
import { requestLogger } from './middleware/request-logger.js';
import { errorHandler } from './middleware/error-handler.js';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS - allow frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// JSON parsing
app.use(express.json());

// Request logging
app.use(requestLogger);

// Routes
app.use('/', healthRouter);
app.use('/verify', verifyRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// Global error handler
app.use(errorHandler);

export { app };
