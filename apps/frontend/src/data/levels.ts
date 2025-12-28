import { Level } from '@/types';

export const levels: Level[] = [
  // ============================================
  // L0: Server Bootstrap
  // ============================================
  {
    id: 'l0-server',
    number: 0,
    title: 'Server Bootstrap',
    shortTitle: 'Server',
    description: 'Set up Express + TypeScript foundation with health endpoints and middleware.',
    objectives: [
      'Initialize Express with TypeScript',
      'Create app.ts and server.ts separation',
      'Implement request logging middleware',
      'Add global error handler',
      'Create health check endpoints'
    ],
    requirements: [
      { id: 'l0-r1', title: 'Project Setup', description: 'npm init, TypeScript, Express installed', verificationHint: 'package.json with dependencies', completed: false },
      { id: 'l0-r2', title: 'TypeScript Config', description: 'tsconfig.json with strict mode', verificationHint: 'Compiles without errors', completed: false },
      { id: 'l0-r3', title: 'App/Server Split', description: 'Separate app.ts (Express) and server.ts (HTTP)', verificationHint: 'Clean testable structure', completed: false },
      { id: 'l0-r4', title: 'JSON Middleware', description: 'app.use(express.json())', verificationHint: 'Can parse JSON bodies', completed: false },
      { id: 'l0-r5', title: 'Request Logger', description: 'Log method, path, timestamp for all requests', verificationHint: 'Console shows request logs', completed: false },
      { id: 'l0-r6', title: 'Error Handler', description: 'Catch-all error middleware at the end', verificationHint: 'Errors return JSON response', completed: false },
      { id: 'l0-r7', title: 'GET /health', description: 'Returns { status: "ok", timestamp }', verificationHint: '200 with JSON body', completed: false },
      { id: 'l0-r8', title: 'GET /ready', description: 'Returns { ready: true }', verificationHint: '200 when server ready', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l0-v1', name: 'Health Check', method: 'GET', path: '/health', expectedStatus: 200, description: 'Health endpoint returns 200' },
      { id: 'l0-v2', name: 'Health Response', method: 'GET', path: '/health', expectedStatus: 200, description: 'Response has status field' },
      { id: 'l0-v3', name: 'Ready Check', method: 'GET', path: '/ready', expectedStatus: 200, description: 'Ready endpoint returns 200' },
      { id: 'l0-v4', name: 'JSON Parsing', method: 'POST', path: '/health', expectedStatus: 404, description: 'POST to health returns 404' },
      { id: 'l0-v5', name: 'Unknown Route', method: 'GET', path: '/unknown', expectedStatus: 404, description: '404 for unknown routes' },
      { id: 'l0-v6', name: 'Error Format', method: 'GET', path: '/error-test', expectedStatus: 500, description: 'Errors return JSON format' }
    ],
    estimatedTime: '30 mins',
    difficulty: 'beginner'
  },

  // ============================================
  // L1: CRUD Operations
  // ============================================
  {
    id: 'l1-crud',
    number: 1,
    title: 'CRUD Operations',
    shortTitle: 'CRUD',
    description: 'Build complete CRUD with layered architecture: Route → Controller → Service.',
    objectives: [
      'Implement layered architecture pattern',
      'Create full CRUD for a resource',
      'Add input validation with Zod',
      'Standardize API responses'
    ],
    requirements: [
      { id: 'l1-r1', title: 'Layered Architecture', description: 'Routes → Controllers → Services pattern', verificationHint: 'No business logic in routes', completed: false },
      { id: 'l1-r2', title: 'In-Memory Store', description: 'Array-based storage for now', verificationHint: 'Data persists during server run', completed: false },
      { id: 'l1-r3', title: 'POST /resources', description: 'Create resource, return 201', verificationHint: 'Response includes generated id', completed: false },
      { id: 'l1-r4', title: 'GET /resources', description: 'List all resources', verificationHint: 'Returns array', completed: false },
      { id: 'l1-r5', title: 'GET /resources/:id', description: 'Get single resource', verificationHint: '404 if not found', completed: false },
      { id: 'l1-r6', title: 'PATCH /resources/:id', description: 'Partial update', verificationHint: 'Only updates provided fields', completed: false },
      { id: 'l1-r7', title: 'DELETE /resources/:id', description: 'Delete resource', verificationHint: 'Returns 204 on success', completed: false },
      { id: 'l1-r8', title: 'Input Validation', description: 'Validate with Zod schema', verificationHint: '400 with validation errors', completed: false },
      { id: 'l1-r9', title: 'UUID Generation', description: 'Generate UUID for new resources', verificationHint: 'Valid UUID format', completed: false },
      { id: 'l1-r10', title: 'Timestamps', description: 'Add createdAt/updatedAt', verificationHint: 'ISO date strings', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l1-v1', name: 'Create Resource', method: 'POST', path: '/resources', expectedStatus: 201, description: 'POST with valid body returns 201' },
      { id: 'l1-v2', name: 'Create Response', method: 'POST', path: '/resources', expectedStatus: 201, description: 'Response contains id field' },
      { id: 'l1-v3', name: 'List Resources', method: 'GET', path: '/resources', expectedStatus: 200, description: 'GET returns array' },
      { id: 'l1-v4', name: 'Get Resource', method: 'GET', path: '/resources/test-id', expectedStatus: 200, description: 'GET by ID returns resource' },
      { id: 'l1-v5', name: 'Resource Not Found', method: 'GET', path: '/resources/nonexistent', expectedStatus: 404, description: '404 for missing resource' },
      { id: 'l1-v6', name: 'Update Resource', method: 'PATCH', path: '/resources/test-id', expectedStatus: 200, description: 'PATCH returns updated resource' },
      { id: 'l1-v7', name: 'Delete Resource', method: 'DELETE', path: '/resources/test-id', expectedStatus: 204, description: 'DELETE returns 204' },
      { id: 'l1-v8', name: 'Validation Error', method: 'POST', path: '/resources', expectedStatus: 400, description: 'Empty body returns 400' },
      { id: 'l1-v9', name: 'Invalid ID Format', method: 'GET', path: '/resources/invalid!id', expectedStatus: 400, description: 'Invalid ID returns 400' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'beginner'
  },

  // ============================================
  // L2: Database Integration
  // ============================================
  {
    id: 'l2-database',
    number: 2,
    title: 'Database Integration',
    shortTitle: 'Database',
    description: 'Connect PostgreSQL with Prisma ORM, migrations, and repository pattern.',
    objectives: [
      'Set up PostgreSQL with Docker',
      'Configure Prisma ORM',
      'Create and run migrations',
      'Implement repository pattern'
    ],
    requirements: [
      { id: 'l2-r1', title: 'Docker Compose', description: 'PostgreSQL in docker-compose.yml', verificationHint: 'docker compose up starts DB', completed: false },
      { id: 'l2-r2', title: 'Prisma Init', description: 'npx prisma init with PostgreSQL', verificationHint: 'prisma/schema.prisma exists', completed: false },
      { id: 'l2-r3', title: 'User Model', description: 'User with id, email, password, createdAt', verificationHint: 'UUID primary key', completed: false },
      { id: 'l2-r4', title: 'Resource Model', description: 'Resource with userId foreign key', verificationHint: 'Proper relation defined', completed: false },
      { id: 'l2-r5', title: 'Migration', description: 'npx prisma migrate dev', verificationHint: 'migrations folder created', completed: false },
      { id: 'l2-r6', title: 'Prisma Client', description: 'Generate and export client', verificationHint: 'Typed client available', completed: false },
      { id: 'l2-r7', title: 'Repository Class', description: 'ResourceRepository with CRUD methods', verificationHint: 'Abstracts Prisma calls', completed: false },
      { id: 'l2-r8', title: 'Connection Check', description: 'Verify DB connection on startup', verificationHint: 'Logs connection status', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l2-v1', name: 'DB Health', method: 'GET', path: '/health/db', expectedStatus: 200, description: 'Database is connected' },
      { id: 'l2-v2', name: 'Create Persists', method: 'POST', path: '/resources', expectedStatus: 201, description: 'Data saved to DB' },
      { id: 'l2-v3', name: 'Read Persisted', method: 'GET', path: '/resources', expectedStatus: 200, description: 'Data retrieved from DB' },
      { id: 'l2-v4', name: 'Unique Constraint', method: 'POST', path: '/users', expectedStatus: 409, description: 'Duplicate email rejected' },
      { id: 'l2-v5', name: 'Cascade Delete', method: 'DELETE', path: '/users/test-id', expectedStatus: 204, description: 'Related resources deleted' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },

  // ============================================
  // L3: Validation & Error Handling
  // ============================================
  {
    id: 'l3-validation',
    number: 3,
    title: 'Validation & Errors',
    shortTitle: 'Validation',
    description: 'Comprehensive input validation with Zod and structured error handling.',
    objectives: [
      'Implement Zod schemas for all inputs',
      'Create custom error classes',
      'Standardize error responses',
      'Add request validation middleware'
    ],
    requirements: [
      { id: 'l3-r1', title: 'Zod Schemas', description: 'Define schemas for all DTOs', verificationHint: 'Type-safe validation', completed: false },
      { id: 'l3-r2', title: 'Validation Middleware', description: 'Reusable validate(schema) middleware', verificationHint: 'Works with body, query, params', completed: false },
      { id: 'l3-r3', title: 'Custom Exceptions', description: 'NotFoundError, ValidationError, etc.', verificationHint: 'Extend base AppError', completed: false },
      { id: 'l3-r4', title: 'Error Response Format', description: '{ error, code, details, requestId }', verificationHint: 'Consistent structure', completed: false },
      { id: 'l3-r5', title: 'Nested Validation', description: 'Validate nested objects', verificationHint: 'Deep validation works', completed: false },
      { id: 'l3-r6', title: 'Transform/Coerce', description: 'Coerce strings to numbers/dates', verificationHint: 'Types are correct', completed: false },
      { id: 'l3-r7', title: 'Custom Validators', description: 'Email, UUID, password strength', verificationHint: 'Reusable validators', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l3-v1', name: 'Required Field', method: 'POST', path: '/resources', expectedStatus: 400, description: 'Missing required field returns 400' },
      { id: 'l3-v2', name: 'Invalid Type', method: 'POST', path: '/resources', expectedStatus: 400, description: 'Wrong type returns 400' },
      { id: 'l3-v3', name: 'Email Format', method: 'POST', path: '/auth/register', expectedStatus: 400, description: 'Invalid email rejected' },
      { id: 'l3-v4', name: 'Password Weak', method: 'POST', path: '/auth/register', expectedStatus: 400, description: 'Weak password rejected' },
      { id: 'l3-v5', name: 'Error Has Code', method: 'POST', path: '/resources', expectedStatus: 400, description: 'Error response has code field' },
      { id: 'l3-v6', name: 'Error Has Details', method: 'POST', path: '/resources', expectedStatus: 400, description: 'Validation errors have details' },
      { id: 'l3-v7', name: 'Query Validation', method: 'GET', path: '/resources?limit=invalid', expectedStatus: 400, description: 'Query params validated' }
    ],
    estimatedTime: '45 mins',
    difficulty: 'intermediate'
  },

  // ============================================
  // L4: Authentication
  // ============================================
  {
    id: 'l4-auth',
    number: 4,
    title: 'Authentication',
    shortTitle: 'Auth',
    description: 'Secure user auth with registration, login, JWT tokens, and refresh flow.',
    objectives: [
      'User registration with validation',
      'Secure password hashing with bcrypt',
      'JWT access and refresh tokens',
      'Protected route middleware'
    ],
    requirements: [
      { id: 'l4-r1', title: 'POST /auth/register', description: 'Create user with hashed password', verificationHint: 'Returns user without password', completed: false },
      { id: 'l4-r2', title: 'Password Hashing', description: 'bcrypt with salt rounds 10+', verificationHint: 'DB stores hash only', completed: false },
      { id: 'l4-r3', title: 'POST /auth/login', description: 'Validate credentials, return tokens', verificationHint: 'Access + refresh tokens', completed: false },
      { id: 'l4-r4', title: 'JWT Access Token', description: '15-30 min expiry with user claims', verificationHint: 'Contains userId, email', completed: false },
      { id: 'l4-r5', title: 'Refresh Token', description: 'Long-lived, stored in DB', verificationHint: '7 day expiry', completed: false },
      { id: 'l4-r6', title: 'POST /auth/refresh', description: 'Exchange refresh for new access', verificationHint: 'Old refresh invalidated', completed: false },
      { id: 'l4-r7', title: 'Auth Middleware', description: 'Verify JWT, attach user to req', verificationHint: '401 for invalid token', completed: false },
      { id: 'l4-r8', title: 'POST /auth/logout', description: 'Invalidate refresh token', verificationHint: 'Token no longer works', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l4-v1', name: 'Register Success', method: 'POST', path: '/auth/register', expectedStatus: 201, description: 'Valid registration returns 201' },
      { id: 'l4-v2', name: 'No Password in Response', method: 'POST', path: '/auth/register', expectedStatus: 201, description: 'Response excludes password' },
      { id: 'l4-v3', name: 'Duplicate Email', method: 'POST', path: '/auth/register', expectedStatus: 409, description: 'Duplicate email rejected' },
      { id: 'l4-v4', name: 'Login Success', method: 'POST', path: '/auth/login', expectedStatus: 200, description: 'Valid login returns tokens' },
      { id: 'l4-v5', name: 'Login Wrong Password', method: 'POST', path: '/auth/login', expectedStatus: 401, description: 'Wrong password rejected' },
      { id: 'l4-v6', name: 'Login No User', method: 'POST', path: '/auth/login', expectedStatus: 401, description: 'Unknown email rejected' },
      { id: 'l4-v7', name: 'Protected No Token', method: 'GET', path: '/resources', expectedStatus: 401, description: 'No token returns 401' },
      { id: 'l4-v8', name: 'Protected Invalid Token', method: 'GET', path: '/resources', expectedStatus: 401, description: 'Invalid token returns 401' },
      { id: 'l4-v9', name: 'Refresh Token', method: 'POST', path: '/auth/refresh', expectedStatus: 200, description: 'Valid refresh returns new tokens' }
    ],
    estimatedTime: '1.5 hours',
    difficulty: 'intermediate'
  },

  // ============================================
  // L5: Authorization
  // ============================================
  {
    id: 'l5-authz',
    number: 5,
    title: 'Authorization',
    shortTitle: 'Authz',
    description: 'Role-based access control (RBAC) and resource ownership enforcement.',
    objectives: [
      'Implement user roles (USER, ADMIN)',
      'Role-based route protection',
      'Resource ownership validation',
      'Admin override capabilities'
    ],
    requirements: [
      { id: 'l5-r1', title: 'Role Field', description: 'Add role enum to User model', verificationHint: 'Default is USER', completed: false },
      { id: 'l5-r2', title: 'Role Middleware', description: 'requireRole("ADMIN") middleware', verificationHint: '403 if role mismatch', completed: false },
      { id: 'l5-r3', title: 'Ownership Check', description: 'Users can only modify own resources', verificationHint: '403 for others resources', completed: false },
      { id: 'l5-r4', title: 'Admin Override', description: 'Admins bypass ownership', verificationHint: 'Can access any resource', completed: false },
      { id: 'l5-r5', title: 'GET /admin/users', description: 'Admin-only user listing', verificationHint: '403 for non-admins', completed: false },
      { id: 'l5-r6', title: 'DELETE /admin/users/:id', description: 'Admin can delete users', verificationHint: 'Cascades resources', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l5-v1', name: 'Own Resource Access', method: 'GET', path: '/resources/own-id', expectedStatus: 200, description: 'User can access own resource' },
      { id: 'l5-v2', name: 'Other Resource Denied', method: 'GET', path: '/resources/other-id', expectedStatus: 403, description: 'Cannot access others resource' },
      { id: 'l5-v3', name: 'Admin Route Denied', method: 'GET', path: '/admin/users', expectedStatus: 403, description: 'User denied admin route' },
      { id: 'l5-v4', name: 'Admin Route Allowed', method: 'GET', path: '/admin/users', expectedStatus: 200, description: 'Admin can access admin route' },
      { id: 'l5-v5', name: 'Admin Override', method: 'PATCH', path: '/resources/any-id', expectedStatus: 200, description: 'Admin can modify any resource' },
      { id: 'l5-v6', name: 'Update Own Resource', method: 'PATCH', path: '/resources/own-id', expectedStatus: 200, description: 'User can update own resource' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },

  // ============================================
  // L6: Testing
  // ============================================
  {
    id: 'l6-testing',
    number: 6,
    title: 'Testing',
    shortTitle: 'Tests',
    description: 'Unit tests, integration tests, and test-driven development practices.',
    objectives: [
      'Set up Jest with TypeScript',
      'Write unit tests for services',
      'Integration tests with supertest',
      'Mock external dependencies'
    ],
    requirements: [
      { id: 'l6-r1', title: 'Jest Config', description: 'jest.config.js with TypeScript', verificationHint: 'npm test runs', completed: false },
      { id: 'l6-r2', title: 'Test Database', description: 'Separate test DB or in-memory', verificationHint: 'Tests dont affect dev data', completed: false },
      { id: 'l6-r3', title: 'Service Unit Tests', description: 'Test services with mocked repos', verificationHint: '80%+ coverage', completed: false },
      { id: 'l6-r4', title: 'API Integration Tests', description: 'Test endpoints with supertest', verificationHint: 'Full request/response cycle', completed: false },
      { id: 'l6-r5', title: 'Auth Tests', description: 'Test protected routes', verificationHint: 'With and without tokens', completed: false },
      { id: 'l6-r6', title: 'Mocking', description: 'Mock external services (email, etc)', verificationHint: 'No real calls in tests', completed: false },
      { id: 'l6-r7', title: 'Test Fixtures', description: 'Factory functions for test data', verificationHint: 'Reusable test helpers', completed: false },
      { id: 'l6-r8', title: 'CI Ready', description: 'Tests pass in CI environment', verificationHint: 'No flaky tests', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l6-v1', name: 'Tests Exist', method: 'GET', path: '/health', expectedStatus: 200, description: 'Test files exist in project' },
      { id: 'l6-v2', name: 'Coverage Report', method: 'GET', path: '/health', expectedStatus: 200, description: 'Coverage > 70%' }
    ],
    estimatedTime: '1.5 hours',
    difficulty: 'intermediate'
  },

  // ============================================
  // L7: File Uploads
  // ============================================
  {
    id: 'l7-uploads',
    number: 7,
    title: 'File Uploads',
    shortTitle: 'Uploads',
    description: 'Handle file uploads with multer, S3 storage, and image processing.',
    objectives: [
      'Configure multer for file handling',
      'Upload to S3 or local storage',
      'Validate file types and sizes',
      'Generate thumbnails for images'
    ],
    requirements: [
      { id: 'l7-r1', title: 'Multer Setup', description: 'Configure multer middleware', verificationHint: 'Handles multipart/form-data', completed: false },
      { id: 'l7-r2', title: 'File Size Limit', description: 'Max 5MB per file', verificationHint: '413 if too large', completed: false },
      { id: 'l7-r3', title: 'File Type Filter', description: 'Only allow images, PDFs', verificationHint: '400 for invalid types', completed: false },
      { id: 'l7-r4', title: 'S3 or Local Storage', description: 'Configurable storage backend', verificationHint: 'Files persist', completed: false },
      { id: 'l7-r5', title: 'POST /upload', description: 'Upload single file', verificationHint: 'Returns file URL', completed: false },
      { id: 'l7-r6', title: 'GET /files/:id', description: 'Retrieve uploaded file', verificationHint: 'Correct content-type', completed: false },
      { id: 'l7-r7', title: 'DELETE /files/:id', description: 'Delete file (owner only)', verificationHint: 'File removed', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l7-v1', name: 'Upload Success', method: 'POST', path: '/upload', expectedStatus: 201, description: 'File upload returns 201' },
      { id: 'l7-v2', name: 'No File', method: 'POST', path: '/upload', expectedStatus: 400, description: 'No file returns 400' },
      { id: 'l7-v3', name: 'Too Large', method: 'POST', path: '/upload', expectedStatus: 413, description: 'Large file rejected' },
      { id: 'l7-v4', name: 'Wrong Type', method: 'POST', path: '/upload', expectedStatus: 400, description: 'Invalid type rejected' },
      { id: 'l7-v5', name: 'Get File', method: 'GET', path: '/files/test-id', expectedStatus: 200, description: 'File retrieved' },
      { id: 'l7-v6', name: 'Delete File', method: 'DELETE', path: '/files/test-id', expectedStatus: 204, description: 'File deleted' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'intermediate'
  },

  // ============================================
  // L8: Caching Layer
  // ============================================
  {
    id: 'l8-caching',
    number: 8,
    title: 'Caching Layer',
    shortTitle: 'Cache',
    description: 'Redis caching with read-through pattern, TTL, and invalidation.',
    objectives: [
      'Connect to Redis',
      'Implement read-through cache',
      'Handle cache invalidation',
      'Graceful degradation'
    ],
    requirements: [
      { id: 'l8-r1', title: 'Redis Connection', description: 'ioredis client setup', verificationHint: 'Logs connection status', completed: false },
      { id: 'l8-r2', title: 'Cache Service', description: 'get, set, del methods', verificationHint: 'Generic cache layer', completed: false },
      { id: 'l8-r3', title: 'Read-Through', description: 'Check cache before DB', verificationHint: 'Cache hit is faster', completed: false },
      { id: 'l8-r4', title: 'TTL', description: '5 min default expiry', verificationHint: 'Data expires', completed: false },
      { id: 'l8-r5', title: 'Invalidation', description: 'Clear cache on update/delete', verificationHint: 'No stale data', completed: false },
      { id: 'l8-r6', title: 'Graceful Fallback', description: 'Works if Redis is down', verificationHint: 'Falls back to DB', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l8-v1', name: 'Cache Health', method: 'GET', path: '/health/cache', expectedStatus: 200, description: 'Cache connected' },
      { id: 'l8-v2', name: 'Cache Hit', method: 'GET', path: '/resources/cached-id', expectedStatus: 200, description: 'X-Cache: HIT header' },
      { id: 'l8-v3', name: 'Cache Miss', method: 'GET', path: '/resources/new-id', expectedStatus: 200, description: 'X-Cache: MISS header' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'advanced'
  },

  // ============================================
  // L9: Background Jobs
  // ============================================
  {
    id: 'l9-jobs',
    number: 9,
    title: 'Background Jobs',
    shortTitle: 'Jobs',
    description: 'Job queues with BullMQ, workers, retries, and dead-letter handling.',
    objectives: [
      'Set up BullMQ with Redis',
      'Create worker processes',
      'Implement retry with backoff',
      'Handle failed jobs'
    ],
    requirements: [
      { id: 'l9-r1', title: 'BullMQ Setup', description: 'Queue connected to Redis', verificationHint: 'Jobs can be added', completed: false },
      { id: 'l9-r2', title: 'Worker Process', description: 'Separate worker script', verificationHint: 'Processes jobs', completed: false },
      { id: 'l9-r3', title: 'Email Job', description: 'Queue email on registration', verificationHint: 'Job added after signup', completed: false },
      { id: 'l9-r4', title: 'Async Processing', description: 'API returns before job done', verificationHint: 'Non-blocking', completed: false },
      { id: 'l9-r5', title: 'Retries', description: 'Retry 3x with backoff', verificationHint: 'Exponential delay', completed: false },
      { id: 'l9-r6', title: 'Dead Letter', description: 'Failed jobs to DLQ', verificationHint: 'Can inspect failures', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l9-v1', name: 'Queue Health', method: 'GET', path: '/health/queue', expectedStatus: 200, description: 'Queue is healthy' },
      { id: 'l9-v2', name: 'Job Status', method: 'GET', path: '/jobs/test-id', expectedStatus: 200, description: 'Job status returned' }
    ],
    estimatedTime: '1.5 hours',
    difficulty: 'advanced'
  },

  // ============================================
  // L10: Observability
  // ============================================
  {
    id: 'l10-observability',
    number: 10,
    title: 'Observability',
    shortTitle: 'Observe',
    description: 'Structured logging, request tracing, rate limiting, and security.',
    objectives: [
      'JSON structured logging',
      'Request ID tracing',
      'Rate limiting',
      'Security headers'
    ],
    requirements: [
      { id: 'l10-r1', title: 'Structured Logs', description: 'JSON format with pino/winston', verificationHint: 'Logs parseable', completed: false },
      { id: 'l10-r2', title: 'Request ID', description: 'UUID per request in headers', verificationHint: 'X-Request-ID present', completed: false },
      { id: 'l10-r3', title: 'Correlation', description: 'Request ID in all logs', verificationHint: 'Can trace requests', completed: false },
      { id: 'l10-r4', title: 'Rate Limiting', description: '100 req/min per IP', verificationHint: '429 when exceeded', completed: false },
      { id: 'l10-r5', title: 'Security Headers', description: 'Helmet middleware', verificationHint: 'CSP, HSTS set', completed: false },
      { id: 'l10-r6', title: 'Graceful Shutdown', description: 'Handle SIGTERM properly', verificationHint: 'No dropped requests', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l10-v1', name: 'Request ID', method: 'GET', path: '/health', expectedStatus: 200, description: 'X-Request-ID in response' },
      { id: 'l10-v2', name: 'Security Headers', method: 'GET', path: '/health', expectedStatus: 200, description: 'Security headers present' },
      { id: 'l10-v3', name: 'Rate Limit', method: 'GET', path: '/health', expectedStatus: 429, description: 'Rate limit enforced' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'advanced'
  },

  // ============================================
  // L11: Production Ready
  // ============================================
  {
    id: 'l11-production',
    number: 11,
    title: 'Production Ready',
    shortTitle: 'Prod',
    description: 'Docker, health probes, CI/CD, and deployment preparation.',
    objectives: [
      'Dockerize application',
      'Kubernetes health probes',
      'API documentation',
      'CI/CD pipeline'
    ],
    requirements: [
      { id: 'l11-r1', title: 'Dockerfile', description: 'Multi-stage production build', verificationHint: 'Image < 200MB', completed: false },
      { id: 'l11-r2', title: 'Docker Compose', description: 'All services defined', verificationHint: 'One command start', completed: false },
      { id: 'l11-r3', title: 'Liveness Probe', description: '/health/live endpoint', verificationHint: '200 if alive', completed: false },
      { id: 'l11-r4', title: 'Readiness Probe', description: '/health/ready checks deps', verificationHint: '503 if not ready', completed: false },
      { id: 'l11-r5', title: 'OpenAPI Docs', description: 'Swagger documentation', verificationHint: '/docs endpoint', completed: false },
      { id: 'l11-r6', title: 'Env Validation', description: 'Fail fast on missing config', verificationHint: 'Startup validation', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l11-v1', name: 'Liveness', method: 'GET', path: '/health/live', expectedStatus: 200, description: 'Liveness probe works' },
      { id: 'l11-v2', name: 'Readiness', method: 'GET', path: '/health/ready', expectedStatus: 200, description: 'Readiness probe works' },
      { id: 'l11-v3', name: 'API Docs', method: 'GET', path: '/docs', expectedStatus: 200, description: 'Swagger docs available' }
    ],
    estimatedTime: '1 hour',
    difficulty: 'advanced'
  },

  // ============================================
  // L12: Speed Run
  // ============================================
  {
    id: 'l12-speedrun',
    number: 12,
    title: 'Speed Run',
    shortTitle: 'Speed',
    description: 'Rebuild everything from scratch. Target: 2 hours. No docs allowed.',
    objectives: [
      'Fresh start from empty directory',
      'All levels passing',
      'Complete in 2 hours or less',
      'No external references'
    ],
    requirements: [
      { id: 'l12-r1', title: 'Fresh Start', description: 'Empty directory, start from scratch', verificationHint: 'No copied code', completed: false },
      { id: 'l12-r2', title: 'All Tests Pass', description: 'Full verification suite passes', verificationHint: 'L0-L11 all green', completed: false },
      { id: 'l12-r3', title: 'Time Target', description: 'Under 2 hours total', verificationHint: 'Timer tracked', completed: false },
      { id: 'l12-r4', title: 'No References', description: 'Build from memory', verificationHint: 'Honor system', completed: false }
    ],
    verificationEndpoints: [
      { id: 'l12-v1', name: 'Full Suite', method: 'GET', path: '/health', expectedStatus: 200, description: 'All tests pass' }
    ],
    estimatedTime: '2 hours',
    difficulty: 'expert'
  }
];

// Helper functions
export const getLevelById = (id: string): Level | undefined => levels.find(l => l.id === id);
export const getNextLevel = (currentId: string): Level | undefined => {
  const idx = levels.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < levels.length - 1 ? levels[idx + 1] : undefined;
};
export const getPreviousLevel = (currentId: string): Level | undefined => {
  const idx = levels.findIndex(l => l.id === currentId);
  return idx > 0 ? levels[idx - 1] : undefined;
};
export const getTotalLevels = (): number => levels.length;
