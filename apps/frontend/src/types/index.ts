// Level status types
export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'completed';

// Requirement for a level
export interface Requirement {
  id: string;
  title: string;
  description: string;
  verificationHint?: string;
  completed: boolean;
}

// Verification endpoint configuration
export interface VerificationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  expectedStatus?: number;
  expectedResponse?: Record<string, unknown>;
  description: string;
}

// Level definition
export interface Level {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  objectives: string[];
  requirements: Requirement[];
  verificationEndpoints: VerificationEndpoint[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// User progress for a level
export interface LevelProgress {
  levelId: string;
  status: LevelStatus;
  completedAt?: string;
  startedAt?: string;
  requirementsCompleted: string[];
}

// Overall user progress
export interface UserProgress {
  currentLevelId: string;
  levels: Record<string, LevelProgress>;
  totalCompleted: number;
  lastActivity?: string;
  speedRunBestTime?: number;
}

// Verification result
export interface VerificationResult {
  success: boolean;
  message: string;
  details?: string;
  timestamp: string;
}

// Speed run result
export interface SpeedRunResult {
  completed: boolean;
  totalTime: number;
  levelResults: {
    levelId: string;
    passed: boolean;
    time: number;
  }[];
  passedCount: number;
  failedCount: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
