import { Router, Request, Response } from 'express';
import { verificationService } from '../services/verification.service.js';
import { z } from 'zod';

const router = Router();

// Schema for endpoint verification request
const verifyEndpointSchema = z.object({
  backendUrl: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  path: z.string().startsWith('/'),
  expectedStatus: z.number().optional(),
  body: z.record(z.unknown()).optional(),
  headers: z.record(z.string()).optional(),
});

// Schema for level verification request
const verifyLevelSchema = z.object({
  backendUrl: z.string().url(),
  levelId: z.string(),
  endpoints: z.array(z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    path: z.string(),
    expectedStatus: z.number().optional(),
    body: z.record(z.unknown()).optional(),
  })),
});

// POST /verify/endpoint - Verify a single endpoint
router.post('/endpoint', async (req: Request, res: Response) => {
  try {
    const validation = verifyEndpointSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }
    
    const { backendUrl, method, path, expectedStatus, body, headers } = validation.data;
    
    const result = await verificationService.verifyEndpoint({
      backendUrl,
      method,
      path,
      expectedStatus,
      body,
      headers,
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

// POST /verify/level - Verify all endpoints for a level
router.post('/level', async (req: Request, res: Response) => {
  try {
    const validation = verifyLevelSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }
    
    const { backendUrl, levelId, endpoints } = validation.data;
    
    const results = await verificationService.verifyLevel({
      backendUrl,
      levelId,
      endpoints,
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Level verification failed',
    });
  }
});

// POST /verify/all - Run full verification suite (speed run)
router.post('/all', async (req: Request, res: Response) => {
  try {
    const { backendUrl } = req.body;
    
    if (!backendUrl || typeof backendUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'backendUrl is required',
      });
    }
    
    const result = await verificationService.verifyAll(backendUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Full verification failed',
    });
  }
});

// GET /verify/health - Check if verification service is ready
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'verification',
    timestamp: new Date().toISOString(),
  });
});

export { router as verifyRouter };
