import { Router, Request, Response } from 'express';

const router = Router();

// GET /health - Basic health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// GET /ready - Readiness probe
router.get('/ready', (_req: Request, res: Response) => {
  res.json({
    ready: true,
    timestamp: new Date().toISOString(),
  });
});

// GET /health/db - Database health (placeholder for now)
router.get('/health/db', (_req: Request, res: Response) => {
  // TODO: Add actual DB check when database is added
  res.json({
    status: 'ok',
    database: 'not_configured',
    message: 'Database health check - no database configured yet',
  });
});

// GET /health/cache - Cache health (placeholder for now)
router.get('/health/cache', (_req: Request, res: Response) => {
  // TODO: Add actual Redis check when cache is added
  res.json({
    status: 'ok',
    cache: 'not_configured',
    message: 'Cache health check - no Redis configured yet',
  });
});

// GET /health/live - Kubernetes liveness probe
router.get('/health/live', (_req: Request, res: Response) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };
