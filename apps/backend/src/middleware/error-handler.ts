import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;
  
  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error & { statusCode?: number; code?: string; details?: unknown },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error
  console.error('Error:', {
    requestId: req.requestId,
    statusCode,
    message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
  
  // Build response object
  const response: Record<string, unknown> = {
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    requestId: req.requestId,
  };
  
  if (process.env.NODE_ENV !== 'production' && err.details) {
    response.details = err.details;
  }
  
  res.status(statusCode).json(response);
};
