interface VerifyEndpointParams {
  backendUrl: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  expectedStatus?: number;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

interface VerifyLevelParams {
  backendUrl: string;
  levelId: string;
  endpoints: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    expectedStatus?: number;
    body?: Record<string, unknown>;
  }>;
}

interface EndpointResult {
  success: boolean;
  method: string;
  path: string;
  expectedStatus: number;
  actualStatus: number;
  message: string;
  responseTime: number;
  details?: string;
}

interface LevelResult {
  levelId: string;
  passed: boolean;
  passedCount: number;
  failedCount: number;
  totalTime: number;
  results: EndpointResult[];
}

interface FullVerificationResult {
  completed: boolean;
  totalTime: number;
  passedCount: number;
  failedCount: number;
  levelResults: LevelResult[];
}

// Response validators for specific endpoints
const validators: Record<string, (data: unknown) => { valid: boolean; reason?: string }> = {
  'GET /health': (data) => {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, reason: 'Response should be an object' };
    }
    if (!('status' in data)) {
      return { valid: false, reason: 'Response should have "status" field' };
    }
    return { valid: true };
  },
  'GET /ready': (data) => {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, reason: 'Response should be an object' };
    }
    if (!('ready' in data)) {
      return { valid: false, reason: 'Response should have "ready" field' };
    }
    return { valid: true };
  },
  'GET /resources': (data) => {
    if (!Array.isArray(data) && !(typeof data === 'object' && data !== null && 'data' in data)) {
      return { valid: false, reason: 'Response should be an array or object with data array' };
    }
    return { valid: true };
  },
  'POST /resources': (data) => {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, reason: 'Response should be an object' };
    }
    if (!('id' in data)) {
      return { valid: false, reason: 'Created resource should have "id" field' };
    }
    return { valid: true };
  },
  'POST /auth/login': (data) => {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, reason: 'Response should be an object' };
    }
    if (!('accessToken' in data) && !('token' in data)) {
      return { valid: false, reason: 'Response should have "accessToken" or "token" field' };
    }
    return { valid: true };
  },
};

class VerificationService {
  private readonly timeout = 10000; // 10 seconds

  async verifyEndpoint(params: VerifyEndpointParams): Promise<EndpointResult> {
    const { backendUrl, method, path, expectedStatus = 200, body, headers = {} } = params;
    const startTime = Date.now();
    const endpointKey = `${method} ${path}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(`${backendUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      let data: unknown = null;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          // Not valid JSON
        }
      }
      
      // Check status
      const statusMatch = response.status === expectedStatus;
      
      // Check response structure if validator exists
      const validator = validators[endpointKey];
      let validationResult = { valid: true, reason: undefined as string | undefined };
      if (validator && statusMatch) {
        validationResult = validator(data);
      }
      
      const success = statusMatch && validationResult.valid;
      
      return {
        success,
        method,
        path,
        expectedStatus,
        actualStatus: response.status,
        message: success 
          ? `✓ ${method} ${path} returned ${response.status}` 
          : validationResult.reason || `✗ Expected ${expectedStatus}, got ${response.status}`,
        responseTime,
        details: success ? undefined : JSON.stringify(data)?.slice(0, 200),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          method,
          path,
          expectedStatus,
          actualStatus: 0,
          message: `✗ ${method} ${path} timed out after ${this.timeout}ms`,
          responseTime,
        };
      }
      
      return {
        success: false,
        method,
        path,
        expectedStatus,
        actualStatus: 0,
        message: `✗ ${method} ${path} failed to connect`,
        responseTime,
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async verifyLevel(params: VerifyLevelParams): Promise<LevelResult> {
    const { backendUrl, levelId, endpoints } = params;
    const startTime = Date.now();
    const results: EndpointResult[] = [];
    
    for (const endpoint of endpoints) {
      const result = await this.verifyEndpoint({
        backendUrl,
        method: endpoint.method,
        path: endpoint.path,
        expectedStatus: endpoint.expectedStatus,
        body: endpoint.body,
      });
      results.push(result);
    }
    
    const passedCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    
    return {
      levelId,
      passed: failedCount === 0,
      passedCount,
      failedCount,
      totalTime: Date.now() - startTime,
      results,
    };
  }

  async verifyAll(backendUrl: string): Promise<FullVerificationResult> {
    const startTime = Date.now();
    
    // Define all levels and their test endpoints
    const levelTests = [
      {
        levelId: 'l0-server',
        endpoints: [
          { method: 'GET' as const, path: '/health', expectedStatus: 200 },
          { method: 'GET' as const, path: '/ready', expectedStatus: 200 },
        ],
      },
      {
        levelId: 'l1-crud',
        endpoints: [
          { method: 'GET' as const, path: '/resources', expectedStatus: 200 },
          { method: 'POST' as const, path: '/resources', expectedStatus: 201, body: { name: 'test' } },
        ],
      },
      {
        levelId: 'l2-database',
        endpoints: [
          { method: 'GET' as const, path: '/health/db', expectedStatus: 200 },
        ],
      },
      // Add more levels as needed
    ];
    
    const levelResults: LevelResult[] = [];
    let totalPassed = 0;
    let totalFailed = 0;
    
    for (const level of levelTests) {
      const result = await this.verifyLevel({
        backendUrl,
        levelId: level.levelId,
        endpoints: level.endpoints,
      });
      levelResults.push(result);
      totalPassed += result.passedCount;
      totalFailed += result.failedCount;
    }
    
    return {
      completed: true,
      totalTime: Date.now() - startTime,
      passedCount: totalPassed,
      failedCount: totalFailed,
      levelResults,
    };
  }
}

export const verificationService = new VerificationService();
