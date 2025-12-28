import { ApiResponse, VerificationResult } from '@/types';
import { getSettings, getApiUrl } from './settings';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// Get API base URL from settings
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  return getApiUrl();
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

// Expected response validators for each level/endpoint
type ResponseValidator = (response: Response, data: unknown) => { valid: boolean; reason?: string };

const validators: Record<string, ResponseValidator> = {
  // L0 - Server Bootstrap
  'GET /health': (response, data) => {
    if (response.status !== 200) return { valid: false, reason: `Expected 200, got ${response.status}` };
    if (typeof data !== 'object' || data === null) return { valid: false, reason: 'Response should be an object' };
    if (!('status' in data)) return { valid: false, reason: 'Response should have "status" field' };
    return { valid: true };
  },
  'GET /ready': (response, data) => {
    if (response.status !== 200) return { valid: false, reason: `Expected 200, got ${response.status}` };
    if (typeof data !== 'object' || data === null) return { valid: false, reason: 'Response should be an object' };
    if (!('ready' in data)) return { valid: false, reason: 'Response should have "ready" field' };
    return { valid: true };
  },
  
  // L1 - CRUD
  'GET /resources': (response, data) => {
    if (response.status !== 200) return { valid: false, reason: `Expected 200, got ${response.status}` };
    if (!Array.isArray(data) && !(typeof data === 'object' && data !== null && 'data' in data)) {
      return { valid: false, reason: 'Response should be an array or object with data array' };
    }
    return { valid: true };
  },
  'POST /resources': (response, data) => {
    if (response.status !== 201) return { valid: false, reason: `Expected 201, got ${response.status}` };
    if (typeof data !== 'object' || data === null) return { valid: false, reason: 'Response should be an object' };
    if (!('id' in data)) return { valid: false, reason: 'Created resource should have "id" field' };
    return { valid: true };
  },
  
  // L3 - Auth
  'POST /auth/register': (response, data) => {
    if (response.status !== 201 && response.status !== 200) {
      return { valid: false, reason: `Expected 201 or 200, got ${response.status}` };
    }
    return { valid: true };
  },
  'POST /auth/login': (response, data) => {
    if (response.status !== 200) return { valid: false, reason: `Expected 200, got ${response.status}` };
    if (typeof data !== 'object' || data === null) return { valid: false, reason: 'Response should be an object' };
    if (!('accessToken' in data) && !('token' in data)) {
      return { valid: false, reason: 'Response should have "accessToken" or "token" field' };
    }
    return { valid: true };
  },
};

// Verify an endpoint against user's backend
export const verifyEndpoint = async (
  method: string,
  path: string,
  expectedStatus?: number,
  testBody?: Record<string, unknown>
): Promise<VerificationResult> => {
  const baseUrl = getBaseUrl();
  const endpointKey = `${method} ${path}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: testBody ? JSON.stringify(testBody) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    let data: unknown = null;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        // Not valid JSON
      }
    }

    // Use validator if available, otherwise just check status
    const validator = validators[endpointKey];
    if (validator) {
      const { valid, reason } = validator(response, data);
      return {
        success: valid,
        message: valid 
          ? `✓ ${method} ${path} returned ${response.status}` 
          : `✗ ${reason}`,
        details: valid ? undefined : `Response: ${JSON.stringify(data).slice(0, 100)}`,
        timestamp: new Date().toISOString(),
      };
    }

    // Fallback: just check the expected status
    const success = expectedStatus 
      ? response.status === expectedStatus 
      : response.ok;

    return {
      success,
      message: success 
        ? `✓ ${method} ${path} returned ${response.status}` 
        : `✗ Expected ${expectedStatus || '2xx'}, got ${response.status}`,
      details: success ? undefined : `Response status: ${response.status}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: `✗ ${method} ${path} timed out`,
        details: 'Request took longer than 10 seconds',
        timestamp: new Date().toISOString(),
      };
    }
    
    return {
      success: false,
      message: `✗ ${method} ${path} failed`,
      details: error instanceof Error 
        ? (error.message.includes('Failed to fetch') 
          ? `Cannot connect to ${baseUrl}. Is your backend running?` 
          : error.message)
        : 'Network error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Mock verification for demo (when no backend is running)
export const mockVerifyEndpoint = async (
  method: string,
  path: string,
  expectedStatus?: number
): Promise<VerificationResult> => {
  const baseUrl = getBaseUrl();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Random success/failure for demo (70% success rate)
  const success = Math.random() > 0.3;
  
  return {
    success,
    message: success 
      ? `✓ ${method} ${path} returned ${expectedStatus || 200}` 
      : `✗ Mock failure - This is simulated. Connect a real backend for actual testing.`,
    details: success ? undefined : 'Enable Live Mode in settings to test against your backend',
    timestamp: new Date().toISOString(),
  };
};

// Smart verify - uses mock or real based on settings
export const smartVerifyEndpoint = async (
  method: string,
  path: string,
  expectedStatus?: number,
  testBody?: Record<string, unknown>
): Promise<VerificationResult> => {
  const settings = getSettings();
  
  if (settings.useMockMode) {
    return mockVerifyEndpoint(method, path, expectedStatus);
  }
  
  return verifyEndpoint(method, path, expectedStatus, testBody);
};

// Health check
export const checkHealth = async (): Promise<boolean> => {
  const baseUrl = getBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// Get API base URL (for display)
export const getApiBaseUrl = (): string => getBaseUrl();
