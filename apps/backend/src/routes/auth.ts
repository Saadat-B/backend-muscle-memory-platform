import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory fallback for when DB is not available
const inMemoryUsers: Array<{
  id: string;
  email: string;
  password: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}> = [];

const inMemoryTokens: Array<{
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
}> = [];

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

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
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Generate tokens
const generateAccessToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
};

const generateRefreshToken = (): string => {
  return uuidv4() + '-' + uuidv4();
};

// POST /auth/register - Register new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors,
      });
    }
    
    const { email, password, name } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (await isDbAvailable()) {
      // Check if email exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({
          error: 'Email already registered',
          code: 'EMAIL_EXISTS',
        });
      }
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      
      return res.status(201).json(user);
    }
    
    // In-memory fallback
    const existing = inMemoryUsers.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({
        error: 'Email already registered',
        code: 'EMAIL_EXISTS',
      });
    }
    
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || null,
      role: 'USER' as const,
      createdAt: new Date(),
    };
    inMemoryUsers.push(user);
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// POST /auth/login - Login user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors,
      });
    }
    
    const { email, password } = validation.data;
    
    let user: { id: string; email: string; password: string; role: string } | null = null;
    
    if (await isDbAvailable()) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      const found = inMemoryUsers.find(u => u.email === email);
      if (found) {
        user = { id: found.id, email: found.email, password: found.password, role: found.role };
      }
    }
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES);
    
    // Store refresh token
    if (await isDbAvailable()) {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });
    } else {
      inMemoryTokens.push({
        id: uuidv4(),
        token: refreshToken,
        userId: user.id,
        expiresAt,
      });
    }
    
    res.json({
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer',
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token required',
        code: 'MISSING_TOKEN',
      });
    }
    
    let storedToken: { userId: string; expiresAt: Date } | null = null;
    
    if (await isDbAvailable()) {
      storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      
      if (storedToken) {
        // Delete old token
        await prisma.refreshToken.delete({ where: { token: refreshToken } });
      }
    } else {
      const index = inMemoryTokens.findIndex(t => t.token === refreshToken);
      if (index !== -1) {
        storedToken = inMemoryTokens[index];
        inMemoryTokens.splice(index, 1);
      }
    }
    
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
        code: 'INVALID_TOKEN',
      });
    }
    
    // Get user
    let user: { id: string; email: string; role: string } | null = null;
    
    if (await isDbAvailable()) {
      user = await prisma.user.findUnique({
        where: { id: storedToken.userId },
        select: { id: true, email: true, role: true },
      });
    } else {
      const found = inMemoryUsers.find(u => u.id === storedToken!.userId);
      if (found) {
        user = { id: found.id, email: found.email, role: found.role };
      }
    }
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES);
    
    // Store new refresh token
    if (await isDbAvailable()) {
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt,
        },
      });
    } else {
      inMemoryTokens.push({
        id: uuidv4(),
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      });
    }
    
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    });
  } catch (error) {
    next(error);
  }
});

// POST /auth/logout - Logout (invalidate refresh token)
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      if (await isDbAvailable()) {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
      } else {
        const index = inMemoryTokens.findIndex(t => t.token === refreshToken);
        if (index !== -1) {
          inMemoryTokens.splice(index, 1);
        }
      }
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /auth/me - Get current user (requires auth)
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization required',
        code: 'UNAUTHORIZED',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
      
      let user = null;
      
      if (await isDbAvailable()) {
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, name: true, role: true, createdAt: true },
        });
      } else {
        const found = inMemoryUsers.find(u => u.id === decoded.userId);
        if (found) {
          const { password: _, ...userWithoutPassword } = found;
          user = userWithoutPassword;
        }
      }
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: 'NOT_FOUND',
        });
      }
      
      res.json(user);
    } catch {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
