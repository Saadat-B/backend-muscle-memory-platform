'use client';

import { useEffect, useState, use } from 'react';
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
import { Level, LevelStatus } from '@/types';
import RequirementsList from '@/components/ui/RequirementsList';
import VerifyButton from '@/components/ui/VerifyButton';
import ProgressBar from '@/components/ui/ProgressBar';
import CodeEditor from '@/components/editor/CodeEditor';

// Sample code snippets for each level
const levelCodeSnippets: Record<string, string> = {
  'l0-server': `// src/app.ts
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

  'l1-crud': `// src/modules/resources/resource.controller.ts
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
}`,

  'l2-database': `// prisma/schema.prisma
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
}`,

  'l3-auth': `// src/modules/auth/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../users/user.repository';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({ email, password: hashedPassword });
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
    
    return { accessToken, user: { id: user.id, email: user.email } };
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
  }, [resolvedParams.id, router]);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Requirements */}
        <div className="space-y-8">
          {/* Objectives */}
          <section className="card p-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Objectives</h2>
            <ul className="space-y-2">
              {level.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-[var(--accent-green)] mt-0.5">→</span>
                  <span className="text-[var(--text-secondary)]">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements Checklist */}
          <section className="card p-6">
            <RequirementsList
              requirements={level.requirements}
              completedIds={completedRequirements}
              onToggle={handleToggleRequirement}
              readOnly={status === 'completed'}
            />
          </section>
        </div>

        {/* Right Column - Code & Verification */}
        <div className="space-y-8">
          {/* Reference Code */}
          <section>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Reference Code</h2>
            <CodeEditor
              value={levelCodeSnippets[level.id] || `// Code reference for ${level.title}\n// Implement the requirements above`}
              language="typescript"
              height="320px"
              readOnly
              title={`${level.shortTitle.toLowerCase()}.ts`}
            />
          </section>

          {/* Verification Tests */}
          <section>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">
              Verification Tests
            </h2>
            <div className="space-y-3">
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

          {/* Complete Level Button */}
          {showUnlockButton && status !== 'completed' && (
            <div className="card-highlight p-6 terminal-glow animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  All Verifications Passed!
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Great work! You can now proceed to the next level.
                </p>
                <button onClick={handleCompleteLevel} className="btn btn-primary">
                  Complete Level & Continue
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Completed State */}
          {status === 'completed' && (
            <div className="card p-6 border-[var(--accent-green)]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--accent-green)]">Level Completed!</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {nextLevel ? `Next up: L${nextLevel.number} · ${nextLevel.title}` : 'All levels completed!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-12 pt-8 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          {previousLevel ? (
            <Link 
              href={`/levels/${previousLevel.id}`}
              className="btn btn-ghost"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              L{previousLevel.number} · {previousLevel.shortTitle}
            </Link>
          ) : <div />}
          
          {nextLevel && status === 'completed' ? (
            <Link 
              href={`/levels/${nextLevel.id}`}
              className="btn btn-primary"
            >
              L{nextLevel.number} · {nextLevel.shortTitle}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : nextLevel ? (
            <span className="btn btn-secondary opacity-50 cursor-not-allowed">
              L{nextLevel.number} · {nextLevel.shortTitle}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
          ) : (
            <Link href="/speedrun" className="btn btn-primary">
              Start Speed Run
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
