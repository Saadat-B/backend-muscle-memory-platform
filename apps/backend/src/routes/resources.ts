import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory fallback when DB is not available
let inMemoryResources: Array<{
  id: string;
  name: string;
  description: string | null;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}> = [];

// Check if database is available
const isDbAvailable = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

// Validation schemas
const createResourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

const updateResourceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

// Middleware to get userId (mock for now, will use auth later)
const getUserId = (req: Request): string => {
  return (req.headers['x-user-id'] as string) || 'demo-user-123';
};

// POST /resources - Create a new resource
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = createResourceSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors,
      });
    }
    
    const { name, description, status = 'active' } = validation.data;
    const userId = getUserId(req);
    
    // Try database first, fallback to in-memory
    if (await isDbAvailable()) {
      const resource = await prisma.resource.create({
        data: {
          name,
          description,
          status,
          userId,
        },
      });
      return res.status(201).json(resource);
    }
    
    // In-memory fallback
    const resource = {
      id: uuidv4(),
      name,
      description: description || null,
      status,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryResources.push(resource);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
});

// GET /resources - List all resources
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    
    if (await isDbAvailable()) {
      const resources = await prisma.resource.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
      return res.json(resources);
    }
    
    // In-memory fallback
    const userResources = inMemoryResources.filter(r => r.userId === userId);
    res.json(userResources.slice(offset, offset + limit));
  } catch (error) {
    next(error);
  }
});

// GET /resources/:id - Get a single resource
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: 'Invalid ID format',
        code: 'INVALID_ID',
      });
    }
    
    if (await isDbAvailable()) {
      const resource = await prisma.resource.findFirst({
        where: { id, userId },
      });
      
      if (!resource) {
        return res.status(404).json({
          error: 'Resource not found',
          code: 'NOT_FOUND',
        });
      }
      
      return res.json(resource);
    }
    
    // In-memory fallback
    const resource = inMemoryResources.find(r => r.id === id && r.userId === userId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found',
        code: 'NOT_FOUND',
      });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// PATCH /resources/:id - Update a resource
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    
    const validation = updateResourceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors,
      });
    }
    
    if (await isDbAvailable()) {
      // Check ownership
      const existing = await prisma.resource.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          error: 'Resource not found',
          code: 'NOT_FOUND',
        });
      }
      
      const resource = await prisma.resource.update({
        where: { id },
        data: validation.data,
      });
      
      return res.json(resource);
    }
    
    // In-memory fallback
    const index = inMemoryResources.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) {
      return res.status(404).json({
        error: 'Resource not found',
        code: 'NOT_FOUND',
      });
    }
    
    inMemoryResources[index] = {
      ...inMemoryResources[index],
      ...validation.data,
      updatedAt: new Date(),
    };
    res.json(inMemoryResources[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE /resources/:id - Delete a resource
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    
    if (await isDbAvailable()) {
      const existing = await prisma.resource.findFirst({
        where: { id, userId },
      });
      
      if (!existing) {
        return res.status(404).json({
          error: 'Resource not found',
          code: 'NOT_FOUND',
        });
      }
      
      await prisma.resource.delete({ where: { id } });
      return res.status(204).send();
    }
    
    // In-memory fallback
    const index = inMemoryResources.findIndex(r => r.id === id && r.userId === userId);
    if (index === -1) {
      return res.status(404).json({
        error: 'Resource not found',
        code: 'NOT_FOUND',
      });
    }
    
    inMemoryResources.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as resourceRouter };
