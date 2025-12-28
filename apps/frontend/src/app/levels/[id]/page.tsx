'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLevelById, getNextLevel, getPreviousLevel } from '@/data/levels';
import { 
  getProgress, 
  getLevelStatus,
  startLevel,
  completeRequirement,
  uncompleteRequirement,
  completeLevel,
  areAllRequirementsCompleted,
  getLevelRequirementsProgress,
  isLevelAccessible
} from '@/lib/progress';
import { getCodeForLevel, saveCode, clearCodeForLevel } from '@/lib/codeStorage';
import { Level, LevelStatus } from '@/types';
import RequirementsList from '@/components/ui/RequirementsList';
import VerifyButton from '@/components/ui/VerifyButton';
import ProgressBar from '@/components/ui/ProgressBar';
import CodeEditor from '@/components/editor/CodeEditor';

// Starter code templates for each level
const levelStarterCode: Record<string, string> = {
  'l0-server': `// src/app.ts
// Build your Express server here!
// Requirements:
// 1. Create Express app with JSON middleware
// 2. Add request logging middleware
// 3. Create /health endpoint
// 4. Create /ready endpoint
// 5. Add global error handler

import express from 'express';

const app = express();

// Add your code here...

export default app;
`,

  'l1-crud': `// src/modules/resources/resource.controller.ts
// Implement the CRUD controller following the layered architecture
// Route → Controller → Service → Repository

import { Request, Response, NextFunction } from 'express';

// Add your ResourceController class here...
`,

  'l2-database': `// prisma/schema.prisma
// Define your database schema here
// Requirements:
// - User model with UUID primary key
// - Resource model with foreign key to User
// - Proper indexes

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add your models here...
`,

  'l3-auth': `// src/modules/auth/auth.service.ts
// Implement authentication service
// Requirements:
// - Password hashing with bcrypt
// - JWT token generation
// - Login and register methods

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Add your AuthService class here...
`,

  'l4-authorization': `// src/middleware/authorize.ts
// Implement authorization middleware
// Requirements:
// - Role-based access control
// - Resource ownership checks

import { Request, Response, NextFunction } from 'express';

// Add your authorization middleware here...
`,

  'l5-caching': `// src/lib/cache.ts
// Implement Redis caching layer
// Requirements:
// - Redis connection
// - Read-through cache pattern
// - Cache invalidation

import Redis from 'ioredis';

// Add your cache implementation here...
`,

  'l6-jobs': `// src/jobs/worker.ts
// Implement background job worker
// Requirements:
// - Queue setup with BullMQ
// - Job processing with retries
// - Dead letter queue handling

import { Worker, Queue } from 'bullmq';

// Add your worker implementation here...
`,

  'l7-observability': `// src/middleware/requestId.ts
// Implement observability middleware
// Requirements:
// - Request ID generation
// - Structured JSON logging
// - Rate limiting

import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

// Add your middleware here...
`,

  'l8-production': `# Dockerfile
# Create a production-ready Docker image
# Requirements:
# - Multi-stage build
# - Non-root user
# - Health check

FROM node:20-alpine AS builder

WORKDIR /app

# Add your Dockerfile content here...
`,

  'l9-speedrun': `// Speed Run Challenge!
// Rebuild everything from scratch
// Target time: 2 hours or less
// No documentation allowed!

// Good luck! 🚀
`,
};

// Reference code snippets for each level (read-only examples)
const levelReferenceCode: Record<string, string> = {
  'l0-server': `// Reference: src/app.ts
import express from 'express';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errors';

const app = express();

app.use(express.json());
app.use(requestLogger);

// Health endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

app.use(errorHandler);

export default app;`,

  'l1-crud': `// Reference: src/modules/resources/resource.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceService } from './resource.service';

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await this.resourceService.create(req.body);
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await this.resourceService.findAll();
      res.json(resources);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await this.resourceService.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(resource);
    } catch (error) {
      next(error);
    }
  }
}`,

  'l2-database': `// Reference: prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  role      Role       @default(USER)
  resources Resource[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Resource {
  id        String   @id @default(uuid())
  title     String
  content   String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

enum Role {
  USER
  ADMIN
}`,

  'l3-auth': `// Reference: src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/user.repository';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({ 
      email, 
      password: hashedPassword 
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    return { 
      accessToken, 
      user: { id: user.id, email: user.email } 
    };
  }
}`,
};

export default function LevelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [status, setStatus] = useState<LevelStatus>('locked');
  const [completedRequirements, setCompletedRequirements] = useState<string[]>([]);
  const [verificationsPassed, setVerificationsPassed] = useState<Record<string, boolean>>({});
  const [showUnlockButton, setShowUnlockButton] = useState(false);
  
  // Code editor state
  const [userCode, setUserCode] = useState<string>('');
  const [hasErrors, setHasErrors] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const foundLevel = getLevelById(resolvedParams.id);
    
    if (!foundLevel) {
      router.push('/levels');
      return;
    }

    // Check if level is accessible
    if (!isLevelAccessible(resolvedParams.id)) {
      router.push('/levels');
      return;
    }

    setLevel(foundLevel);
    
    const currentStatus = getLevelStatus(resolvedParams.id);
    setStatus(currentStatus);
    
    // Start level if it's available
    if (currentStatus === 'available') {
      startLevel(resolvedParams.id);
      setStatus('in_progress');
    }

    // Get completed requirements
    const progress = getProgress();
    setCompletedRequirements(progress.levels[resolvedParams.id]?.requirementsCompleted || []);
    
    // Load saved code or use starter template
    const savedCode = getCodeForLevel(resolvedParams.id);
    setUserCode(savedCode || levelStarterCode[resolvedParams.id] || '// Write your code here...\n');
  }, [resolvedParams.id, router]);

  // Auto-save code on change
  const handleCodeChange = useCallback((value: string | undefined) => {
    const code = value || '';
    setUserCode(code);
    
    // Debounced save
    setIsSaving(true);
    const timeoutId = setTimeout(() => {
      saveCode(resolvedParams.id, code);
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [resolvedParams.id]);

  const handleResetCode = useCallback(() => {
    const starterCode = levelStarterCode[resolvedParams.id] || '// Write your code here...\n';
    setUserCode(starterCode);
    clearCodeForLevel(resolvedParams.id);
  }, [resolvedParams.id]);

  const handleDiagnosticsChange = useCallback((diagnostics: { errors: number; warnings: number }) => {
    setHasErrors(diagnostics.errors > 0);
  }, []);

  const handleToggleRequirement = (requirementId: string) => {
    if (status === 'completed') return;
    
    if (completedRequirements.includes(requirementId)) {
      uncompleteRequirement(resolvedParams.id, requirementId);
      setCompletedRequirements(prev => prev.filter(id => id !== requirementId));
    } else {
      completeRequirement(resolvedParams.id, requirementId);
      setCompletedRequirements(prev => [...prev, requirementId]);
    }
  };

  const handleVerificationResult = (endpointId: string, success: boolean) => {
    setVerificationsPassed(prev => ({ ...prev, [endpointId]: success }));
    
    // Check if all verifications passed
    if (level) {
      const newResults = { ...verificationsPassed, [endpointId]: success };
      const allPassed = level.verificationEndpoints.every(ep => newResults[ep.id] === true);
      const allReqsCompleted = areAllRequirementsCompleted(resolvedParams.id);
      
      setShowUnlockButton(allPassed && allReqsCompleted);
    }
  };

  const handleCompleteLevel = () => {
    completeLevel(resolvedParams.id);
    setStatus('completed');
    setShowUnlockButton(false);
    
    // Redirect to next level or levels page
    const next = level ? getNextLevel(level.id) : null;
    if (next) {
      setTimeout(() => router.push(`/levels/${next.id}`), 1000);
    }
  };

  if (!mounted || !level) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-[var(--text-muted)]">Loading level...</span>
        </div>
      </div>
    );
  }

  const previousLevel = getPreviousLevel(level.id);
  const nextLevel = getNextLevel(level.id);
  const { completed: reqCompleted, total: reqTotal } = getLevelRequirementsProgress(level.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/levels" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Levels
            </Link>
          </li>
          <li className="text-[var(--text-muted)]">/</li>
          <li className="text-[var(--text-primary)] font-medium">
            L{level.number} · {level.shortTitle}
          </li>
        </ol>
      </nav>

      {/* Level Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                status === 'completed' 
                  ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' 
                  : 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]'
              }`}>
                <span className="text-xl font-bold">L{level.number}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {level.title}
                </h1>
                <span className={`badge ${status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                  {status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl">
              {level.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-[var(--text-muted)]">Time</p>
              <p className="font-medium text-[var(--text-primary)]">{level.estimatedTime}</p>
            </div>
            <div className="w-px h-8 bg-[var(--border-color)]" />
            <div className="text-center">
              <p className="text-[var(--text-muted)]">Difficulty</p>
              <p className={`font-medium capitalize ${
                level.difficulty === 'beginner' ? 'text-[var(--accent-green)]' :
                level.difficulty === 'intermediate' ? 'text-[var(--accent-amber)]' :
                'text-[var(--accent-red)]'
              }`}>{level.difficulty}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <ProgressBar 
            value={reqCompleted} 
            max={reqTotal} 
            showLabel 
            label="Requirements" 
            variant={status === 'completed' ? 'success' : 'warning'}
          />
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column - Requirements (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Objectives */}
          <section className="card p-4">
            <h2 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Objectives</h2>
            <ul className="space-y-2">
              {level.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--accent-green)] mt-0.5">→</span>
                  <span className="text-[var(--text-secondary)]">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements Checklist */}
          <section className="card p-4">
            <RequirementsList
              requirements={level.requirements}
              completedIds={completedRequirements}
              onToggle={handleToggleRequirement}
              readOnly={status === 'completed'}
            />
          </section>
        </div>

        {/* Center Column - Code Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Editor Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--text-primary)]">Your Code</h2>
              {isSaving && (
                <span className="text-xs text-[var(--text-muted)] animate-pulse">Saving...</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReference(!showReference)}
                className={`btn btn-ghost text-xs py-1 px-3 ${showReference ? 'text-[var(--accent-blue)]' : ''}`}
              >
                {showReference ? 'Hide' : 'Show'} Reference
              </button>
              <button
                onClick={handleResetCode}
                className="btn btn-ghost text-xs py-1 px-3 text-[var(--accent-amber)]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* User Code Editor */}
          <CodeEditor
            value={userCode}
            onChange={handleCodeChange}
            language={level.id === 'l2-database' ? 'prisma' : level.id === 'l8-production' ? 'dockerfile' : 'typescript'}
            height="500px"
            readOnly={false}
            title={`${level.shortTitle.toLowerCase()}.${level.id === 'l2-database' ? 'prisma' : level.id === 'l8-production' ? 'dockerfile' : 'ts'}`}
            onDiagnosticsChange={handleDiagnosticsChange}
            showDiagnostics={true}
          />

          {/* Reference Code (collapsible) */}
          {showReference && levelReferenceCode[level.id] && (
            <div className="animate-fade-in">
              <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Reference Implementation</h3>
              <CodeEditor
                value={levelReferenceCode[level.id]}
                language={level.id === 'l2-database' ? 'prisma' : 'typescript'}
                height="300px"
                readOnly
                title="reference.ts"
                showDiagnostics={false}
              />
            </div>
          )}
        </div>

        {/* Right Column - Verification (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Verification Tests */}
          <section>
            <h2 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">
              Verification Tests
            </h2>
            <div className="space-y-2">
              {level.verificationEndpoints.map(endpoint => (
                <VerifyButton
                  key={endpoint.id}
                  endpoint={endpoint}
                  onVerified={(success) => handleVerificationResult(endpoint.id, success)}
                  useMock={true}
                />
              ))}
            </div>
          </section>

          {/* Code Quality Status */}
          <section className="card p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Code Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Syntax</span>
                <span className={hasErrors ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}>
                  {hasErrors ? '✗ Errors' : '✓ Valid'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Requirements</span>
                <span className={reqCompleted === reqTotal ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}>
                  {reqCompleted}/{reqTotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Verifications</span>
                <span className={Object.values(verificationsPassed).every(v => v) && Object.keys(verificationsPassed).length > 0 
                  ? 'text-[var(--accent-green)]' 
                  : 'text-[var(--text-muted)]'}>
                  {Object.values(verificationsPassed).filter(v => v).length}/{level.verificationEndpoints.length}
                </span>
              </div>
            </div>
          </section>

          {/* Complete Level Button */}
          {showUnlockButton && status !== 'completed' && (
            <div className="card-highlight p-4 terminal-glow animate-fade-in">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                  All Verifications Passed!
                </h3>
                <button onClick={handleCompleteLevel} className="btn btn-primary btn-sm w-full">
                  Complete Level
                </button>
              </div>
            </div>
          )}

          {/* Completed State */}
          {status === 'completed' && (
            <div className="card p-4 border-[var(--accent-green)]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--accent-green)] text-sm">Completed!</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {nextLevel ? `Next: L${nextLevel.number}` : 'All done!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 pt-6 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          {previousLevel ? (
            <Link 
              href={`/levels/${previousLevel.id}`}
              className="btn btn-ghost text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              L{previousLevel.number} · {previousLevel.shortTitle}
            </Link>
          ) : <div />}
          
          {nextLevel && status === 'completed' ? (
            <Link 
              href={`/levels/${nextLevel.id}`}
              className="btn btn-primary text-sm"
            >
              L{nextLevel.number} · {nextLevel.shortTitle}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : nextLevel ? (
            <span className="btn btn-secondary opacity-50 cursor-not-allowed text-sm">
              L{nextLevel.number} · {nextLevel.shortTitle}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
          ) : (
            <Link href="/speedrun" className="btn btn-primary text-sm">
              Start Speed Run
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
