import { Level } from '@/types';

export const levels: Level[] = [
  {
    id: 'l0-server',
    number: 0,
    title: 'Server Bootstrap',
    shortTitle: 'Server',
    description: 'Set up the foundation: Express server, TypeScript, and basic health endpoints.',
    objectives: [
      'Initialize Express with TypeScript',
      'Create app.ts and server.ts separation',
      'Implement request logging',
      'Add global error handler',
      'Create health check endpoints'
    ],
    requirements: [
      {
        id: 'l0-r1',
        title: 'Express + TypeScript Setup',
        description: 'Initialize a new Express project with TypeScript configuration',
        verificationHint: 'Server should start without errors',
        completed: false
      },
      {
        id: 'l0-r2',
        title: 'App & Server Separation',
        description: 'Create separate app.ts (Express app) and server.ts (HTTP server) files',
        verificationHint: 'Clean separation of concerns',
        completed: false
      },
      {
        id: 'l0-r3',
        title: 'Request Logging Middleware',
        description: 'Add middleware that logs all incoming requests with method, path, and timestamp',
        verificationHint: 'Check console for request logs',
        completed: false
      },
      {
        id: 'l0-r4',
        title: 'Global Error Handler',
        description: 'Implement centralized error handling middleware',
        verificationHint: 'Errors should be caught and formatted',
        completed: false
      },
      {
        id: 'l0-r5',
        title: 'Health Endpoint',
        description: 'GET /health returns { status: "ok", timestamp: ... }',
        verificationHint: 'Should return 200 with JSON',
        completed: false
      },
      {
        id: 'l0-r6',
        title: 'Ready Endpoint',
        description: 'GET /ready returns { ready: true } when server is ready',
        verificationHint: 'Should return 200 with ready status',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l0-v1',
        name: 'Health Check',
        method: 'GET',
        path: '/health',
        expectedStatus: 200,
        description: 'Verify health endpoint returns OK'
      },
      {
        id: 'l0-v2',
        name: 'Ready Check',
        method: 'GET',
        path: '/ready',
        expectedStatus: 200,
        description: 'Verify ready endpoint returns ready status'
      }
    ],
    estimatedTime: '30 mins',
    difficulty: 'beginner'
  },
  {
    id: 'l1-crud',
    number: 1,
    title: 'CRUD Core',
    shortTitle: 'CRUD',
    description: 'Build the core CRUD pattern: Route → Controller → Service → Repository.',
    objectives: [
      'Implement layered architecture',
      'Create a resource with full CRUD',
      'Add input validation',
      'Standardize error responses'
    ],
    requirements: [
      {
        id: 'l1-r1',
        title: 'Layered Architecture',
        description: 'Set up Route → Controller → Service → Repository pattern',
        verificationHint: 'No logic in routes, no DB in controllers',
        completed: false
      },
      {
        id: 'l1-r2',
        title: 'POST /resources',
        description: 'Create a new resource with validation',
        verificationHint: 'Returns 201 with created resource',
        completed: false
      },
      {
        id: 'l1-r3',
        title: 'GET /resources',
        description: 'List all resources with pagination',
        verificationHint: 'Returns array of resources',
        completed: false
      },
      {
        id: 'l1-r4',
        title: 'GET /resources/:id',
        description: 'Get a single resource by ID',
        verificationHint: 'Returns 404 for non-existent IDs',
        completed: false
      },
      {
        id: 'l1-r5',
        title: 'PATCH /resources/:id',
        description: 'Update a resource partially',
        verificationHint: 'Returns updated resource',
        completed: false
      },
      {
        id: 'l1-r6',
        title: 'DELETE /resources/:id',
        description: 'Delete a resource by ID',
        verificationHint: 'Returns 204 on success',
        completed: false
      },
      {
        id: 'l1-r7',
        title: 'Input Validation',
        description: 'Validate request bodies and parameters',
        verificationHint: 'Returns 400 with validation errors',
        completed: false
      },
      {
        id: 'l1-r8',
        title: 'Standard Error Format',
        description: 'All errors follow { error: string, code: string, details?: any }',
        verificationHint: 'Consistent error structure',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l1-v1',
        name: 'Create Resource',
        method: 'POST',
        path: '/resources',
        expectedStatus: 201,
        description: 'Verify resource creation'
      },
      {
        id: 'l1-v2',
        name: 'List Resources',
        method: 'GET',
        path: '/resources',
        expectedStatus: 200,
        description: 'Verify resource listing'
      },
      {
        id: 'l1-v3',
        name: 'Get Resource',
        method: 'GET',
        path: '/resources/:id',
        expectedStatus: 200,
        description: 'Verify single resource retrieval'
      },
      {
        id: 'l1-v4',
        name: 'Validation Error',
        method: 'POST',
        path: '/resources',
        expectedStatus: 400,
        description: 'Verify validation returns 400'
      }
    ],
    estimatedTime: '45 mins',
    difficulty: 'beginner'
  },
  {
    id: 'l2-database',
    number: 2,
    title: 'Database Integration',
    shortTitle: 'Database',
    description: 'Connect to PostgreSQL, set up ORM, migrations, and repository pattern.',
    objectives: [
      'Connect to PostgreSQL',
      'Configure ORM (Prisma/TypeORM)',
      'Create and run migrations',
      'Implement repository pattern'
    ],
    requirements: [
      {
        id: 'l2-r1',
        title: 'PostgreSQL Connection',
        description: 'Establish connection to PostgreSQL database',
        verificationHint: 'Connection should be verified on startup',
        completed: false
      },
      {
        id: 'l2-r2',
        title: 'ORM Setup',
        description: 'Configure Prisma or TypeORM with TypeScript',
        verificationHint: 'ORM client should be typed',
        completed: false
      },
      {
        id: 'l2-r3',
        title: 'User Schema',
        description: 'Create User model with id, email, password, createdAt',
        verificationHint: 'UUID primary key, unique email',
        completed: false
      },
      {
        id: 'l2-r4',
        title: 'Resource Schema',
        description: 'Create Resource model with proper relations',
        verificationHint: 'Foreign key to User, indexed',
        completed: false
      },
      {
        id: 'l2-r5',
        title: 'Migrations',
        description: 'Create and apply database migrations',
        verificationHint: 'Schema changes tracked in migrations',
        completed: false
      },
      {
        id: 'l2-r6',
        title: 'Repository Pattern',
        description: 'All DB access through repository classes',
        verificationHint: 'No ORM calls outside repositories',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l2-v1',
        name: 'Database Health',
        method: 'GET',
        path: '/health/db',
        expectedStatus: 200,
        description: 'Verify database connection is healthy'
      },
      {
        id: 'l2-v2',
        name: 'Create with Persistence',
        method: 'POST',
        path: '/resources',
        expectedStatus: 201,
        description: 'Verify data persists in database'
      }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },
  {
    id: 'l3-auth',
    number: 3,
    title: 'Authentication',
    shortTitle: 'Auth',
    description: 'Implement user registration, login, JWT tokens, and password hashing.',
    objectives: [
      'User registration with validation',
      'Secure password hashing',
      'JWT access token generation',
      'Refresh token flow'
    ],
    requirements: [
      {
        id: 'l3-r1',
        title: 'POST /auth/register',
        description: 'Register new user with email and password',
        verificationHint: 'Returns 201 with user (no password)',
        completed: false
      },
      {
        id: 'l3-r2',
        title: 'Password Hashing',
        description: 'Hash passwords with bcrypt before storing',
        verificationHint: 'Passwords never stored in plain text',
        completed: false
      },
      {
        id: 'l3-r3',
        title: 'POST /auth/login',
        description: 'Authenticate user and return tokens',
        verificationHint: 'Returns access and refresh tokens',
        completed: false
      },
      {
        id: 'l3-r4',
        title: 'JWT Access Token',
        description: 'Generate short-lived JWT with user claims',
        verificationHint: 'Token expires in 15-30 minutes',
        completed: false
      },
      {
        id: 'l3-r5',
        title: 'Refresh Token Flow',
        description: 'Issue long-lived refresh tokens stored in DB',
        verificationHint: 'Can exchange refresh for new access token',
        completed: false
      },
      {
        id: 'l3-r6',
        title: 'POST /auth/refresh',
        description: 'Exchange refresh token for new access token',
        verificationHint: 'Old refresh token invalidated',
        completed: false
      },
      {
        id: 'l3-r7',
        title: 'Auth Middleware',
        description: 'Middleware to verify JWT on protected routes',
        verificationHint: 'Returns 401 for invalid/missing token',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l3-v1',
        name: 'Register',
        method: 'POST',
        path: '/auth/register',
        expectedStatus: 201,
        description: 'Verify user registration'
      },
      {
        id: 'l3-v2',
        name: 'Login',
        method: 'POST',
        path: '/auth/login',
        expectedStatus: 200,
        description: 'Verify login returns tokens'
      },
      {
        id: 'l3-v3',
        name: 'Protected Route',
        method: 'GET',
        path: '/resources',
        expectedStatus: 401,
        description: 'Verify protected routes require auth'
      }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },
  {
    id: 'l4-authorization',
    number: 4,
    title: 'Authorization',
    shortTitle: 'Authz',
    description: 'Add role-based access control and resource ownership checks.',
    objectives: [
      'Implement user roles',
      'Role-based route protection',
      'Resource ownership validation',
      'Admin-only endpoints'
    ],
    requirements: [
      {
        id: 'l4-r1',
        title: 'User Roles',
        description: 'Add role field to User (USER, ADMIN)',
        verificationHint: 'Default role is USER',
        completed: false
      },
      {
        id: 'l4-r2',
        title: 'Role Middleware',
        description: 'Middleware to check user role permissions',
        verificationHint: 'Returns 403 for insufficient permissions',
        completed: false
      },
      {
        id: 'l4-r3',
        title: 'Resource Ownership',
        description: 'Users can only modify their own resources',
        verificationHint: 'Returns 403 for others resources',
        completed: false
      },
      {
        id: 'l4-r4',
        title: 'Admin Override',
        description: 'Admins can access any resource',
        verificationHint: 'Admin bypasses ownership check',
        completed: false
      },
      {
        id: 'l4-r5',
        title: 'GET /admin/users',
        description: 'Admin-only endpoint to list all users',
        verificationHint: 'Returns 403 for non-admins',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l4-v1',
        name: 'Ownership Check',
        method: 'PATCH',
        path: '/resources/:id',
        expectedStatus: 403,
        description: 'Verify ownership is enforced'
      },
      {
        id: 'l4-v2',
        name: 'Admin Route',
        method: 'GET',
        path: '/admin/users',
        expectedStatus: 403,
        description: 'Verify admin routes are protected'
      }
    ],
    estimatedTime: '45 mins',
    difficulty: 'intermediate'
  },
  {
    id: 'l5-caching',
    number: 5,
    title: 'Caching Layer',
    shortTitle: 'Cache',
    description: 'Add Redis caching with read-through pattern and invalidation.',
    objectives: [
      'Connect to Redis',
      'Implement read-through cache',
      'Handle cache invalidation',
      'Graceful degradation'
    ],
    requirements: [
      {
        id: 'l5-r1',
        title: 'Redis Connection',
        description: 'Establish connection to Redis server',
        verificationHint: 'Connection verified on startup',
        completed: false
      },
      {
        id: 'l5-r2',
        title: 'Cache Health Check',
        description: 'GET /health/cache returns Redis status',
        verificationHint: 'Returns connected/disconnected status',
        completed: false
      },
      {
        id: 'l5-r3',
        title: 'Read-Through Cache',
        description: 'GET /resources/:id checks cache first',
        verificationHint: 'Cache hit should be faster',
        completed: false
      },
      {
        id: 'l5-r4',
        title: 'TTL Expiration',
        description: 'Cache entries expire after configured TTL',
        verificationHint: 'Default 5 minute TTL',
        completed: false
      },
      {
        id: 'l5-r5',
        title: 'Cache Invalidation',
        description: 'Invalidate cache on update/delete',
        verificationHint: 'Stale data never served',
        completed: false
      },
      {
        id: 'l5-r6',
        title: 'Graceful Degradation',
        description: 'API works if Redis is down',
        verificationHint: 'Falls back to database',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l5-v1',
        name: 'Cache Health',
        method: 'GET',
        path: '/health/cache',
        expectedStatus: 200,
        description: 'Verify cache connection'
      },
      {
        id: 'l5-v2',
        name: 'Cached Response',
        method: 'GET',
        path: '/resources/:id',
        expectedStatus: 200,
        description: 'Verify caching header present'
      }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },
  {
    id: 'l6-jobs',
    number: 6,
    title: 'Background Jobs',
    shortTitle: 'Jobs',
    description: 'Set up job queues with workers, retries, and dead-letter handling.',
    objectives: [
      'Configure job queue',
      'Create worker processes',
      'Implement retry logic',
      'Handle failed jobs'
    ],
    requirements: [
      {
        id: 'l6-r1',
        title: 'Queue Setup',
        description: 'Configure BullMQ or similar job queue',
        verificationHint: 'Queue connected to Redis',
        completed: false
      },
      {
        id: 'l6-r2',
        title: 'Worker Process',
        description: 'Create separate worker to process jobs',
        verificationHint: 'Worker runs independently',
        completed: false
      },
      {
        id: 'l6-r3',
        title: 'User Creation Job',
        description: 'Enqueue welcome email job on user signup',
        verificationHint: 'Job created after registration',
        completed: false
      },
      {
        id: 'l6-r4',
        title: 'Async Processing',
        description: 'Jobs processed asynchronously',
        verificationHint: 'API returns before job completes',
        completed: false
      },
      {
        id: 'l6-r5',
        title: 'Retry with Backoff',
        description: 'Failed jobs retry with exponential backoff',
        verificationHint: 'Max 3 retries with increasing delay',
        completed: false
      },
      {
        id: 'l6-r6',
        title: 'Dead Letter Queue',
        description: 'Failed jobs moved to DLQ after max retries',
        verificationHint: 'DLQ jobs can be inspected',
        completed: false
      },
      {
        id: 'l6-r7',
        title: 'Idempotency',
        description: 'Jobs are idempotent (safe to retry)',
        verificationHint: 'Same job ID processed once',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l6-v1',
        name: 'Queue Health',
        method: 'GET',
        path: '/health/queue',
        expectedStatus: 200,
        description: 'Verify queue is healthy'
      },
      {
        id: 'l6-v2',
        name: 'Job Status',
        method: 'GET',
        path: '/jobs/:id',
        expectedStatus: 200,
        description: 'Verify job status endpoint'
      }
    ],
    estimatedTime: '1.5 hours',
    difficulty: 'advanced'
  },
  {
    id: 'l7-observability',
    number: 7,
    title: 'Observability',
    shortTitle: 'Observe',
    description: 'Add structured logging, request tracing, rate limiting, and security headers.',
    objectives: [
      'Structured JSON logging',
      'Request ID tracing',
      'Rate limiting',
      'Security hardening'
    ],
    requirements: [
      {
        id: 'l7-r1',
        title: 'Structured Logging',
        description: 'All logs in JSON format with level, message, timestamp',
        verificationHint: 'Logs parseable as JSON',
        completed: false
      },
      {
        id: 'l7-r2',
        title: 'Request ID',
        description: 'Each request gets unique ID, included in all logs',
        verificationHint: 'X-Request-ID header in response',
        completed: false
      },
      {
        id: 'l7-r3',
        title: 'Error Stack Traces',
        description: 'Stack traces logged for errors (not in response)',
        verificationHint: 'Stack visible in logs only',
        completed: false
      },
      {
        id: 'l7-r4',
        title: 'Rate Limiting',
        description: 'Limit requests per IP (100/minute default)',
        verificationHint: 'Returns 429 when exceeded',
        completed: false
      },
      {
        id: 'l7-r5',
        title: 'Security Headers',
        description: 'Add helmet middleware for security headers',
        verificationHint: 'CSP, HSTS, X-Frame-Options set',
        completed: false
      },
      {
        id: 'l7-r6',
        title: 'Env Validation',
        description: 'Validate all env vars on startup',
        verificationHint: 'Fails fast if config missing',
        completed: false
      },
      {
        id: 'l7-r7',
        title: 'Graceful Shutdown',
        description: 'Handle SIGTERM, finish requests, close connections',
        verificationHint: 'No dropped requests on shutdown',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l7-v1',
        name: 'Request ID Header',
        method: 'GET',
        path: '/health',
        expectedStatus: 200,
        description: 'Verify X-Request-ID header present'
      },
      {
        id: 'l7-v2',
        name: 'Rate Limit',
        method: 'GET',
        path: '/health',
        expectedStatus: 429,
        description: 'Verify rate limiting works'
      }
    ],
    estimatedTime: '1 hour',
    difficulty: 'advanced'
  },
  {
    id: 'l8-production',
    number: 8,
    title: 'Production Ready',
    shortTitle: 'Prod',
    description: 'Final production hardening: Docker, health checks, and deployment prep.',
    objectives: [
      'Dockerize the application',
      'Configure for production',
      'Add comprehensive health checks',
      'Documentation'
    ],
    requirements: [
      {
        id: 'l8-r1',
        title: 'Dockerfile',
        description: 'Multi-stage Dockerfile for production build',
        verificationHint: 'Image size under 200MB',
        completed: false
      },
      {
        id: 'l8-r2',
        title: 'Docker Compose',
        description: 'Compose file with all dependencies',
        verificationHint: 'One command to start everything',
        completed: false
      },
      {
        id: 'l8-r3',
        title: 'Production Config',
        description: 'Separate config for production environment',
        verificationHint: 'No debug mode in production',
        completed: false
      },
      {
        id: 'l8-r4',
        title: 'Liveness Probe',
        description: '/health/live for Kubernetes liveness',
        verificationHint: 'Returns 200 if process alive',
        completed: false
      },
      {
        id: 'l8-r5',
        title: 'Readiness Probe',
        description: '/health/ready checks all dependencies',
        verificationHint: 'Returns 503 if not ready',
        completed: false
      },
      {
        id: 'l8-r6',
        title: 'API Documentation',
        description: 'OpenAPI/Swagger documentation',
        verificationHint: 'All endpoints documented',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l8-v1',
        name: 'Liveness',
        method: 'GET',
        path: '/health/live',
        expectedStatus: 200,
        description: 'Verify liveness probe'
      },
      {
        id: 'l8-v2',
        name: 'Readiness',
        method: 'GET',
        path: '/health/ready',
        expectedStatus: 200,
        description: 'Verify readiness probe'
      }
    ],
    estimatedTime: '1 hour',
    difficulty: 'advanced'
  },
  {
    id: 'l9-speedrun',
    number: 9,
    title: 'Speed Run',
    shortTitle: 'Speed',
    description: 'Rebuild everything from scratch. Target time: 2 hours or less.',
    objectives: [
      'Rebuild entire backend',
      'No documentation allowed',
      'No copy-paste from previous',
      'Beat your best time'
    ],
    requirements: [
      {
        id: 'l9-r1',
        title: 'Fresh Start',
        description: 'Delete everything and start from empty directory',
        verificationHint: 'No existing code to reference',
        completed: false
      },
      {
        id: 'l9-r2',
        title: 'All Levels Passing',
        description: 'All L0-L8 verification tests must pass',
        verificationHint: 'Run full verification suite',
        completed: false
      },
      {
        id: 'l9-r3',
        title: 'Time Under 2 Hours',
        description: 'Complete rebuild in 2 hours or less',
        verificationHint: 'Timer tracked automatically',
        completed: false
      },
      {
        id: 'l9-r4',
        title: 'No External Reference',
        description: 'Build from memory, no docs or tutorials',
        verificationHint: 'Honor system',
        completed: false
      }
    ],
    verificationEndpoints: [
      {
        id: 'l9-v1',
        name: 'Full Suite',
        method: 'POST',
        path: '/verify/all',
        expectedStatus: 200,
        description: 'Run all verification tests'
      }
    ],
    estimatedTime: '2 hours',
    difficulty: 'advanced'
  }
];

export const getLevelById = (id: string): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getLevelByNumber = (number: number): Level | undefined => {
  return levels.find(level => level.number === number);
};

export const getNextLevel = (currentId: string): Level | undefined => {
  const current = getLevelById(currentId);
  if (!current) return undefined;
  return getLevelByNumber(current.number + 1);
};

export const getPreviousLevel = (currentId: string): Level | undefined => {
  const current = getLevelById(currentId);
  if (!current || current.number === 0) return undefined;
  return getLevelByNumber(current.number - 1);
};
