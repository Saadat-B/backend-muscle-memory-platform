import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = uuidv4();
  req.requestId = requestId;
  
  const start = Date.now();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };
    
    // Color code based on status
    if (res.statusCode >= 500) {
      console.error('❌', JSON.stringify(log));
    } else if (res.statusCode >= 400) {
      console.warn('⚠️', JSON.stringify(log));
    } else {
      console.log('✓', JSON.stringify(log));
    }
  });
  
  next();
};
