import { ApiResponse, VerificationResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

// Verify an endpoint
export const verifyEndpoint = async (
  method: string,
  path: string,
  expectedStatus?: number
): Promise<VerificationResult> => {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    return {
      success: false,
      message: `✗ ${method} ${path} failed`,
      details: error instanceof Error ? error.message : 'Network error',
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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Random success/failure for demo
  const success = Math.random() > 0.3;
  
  return {
    success,
    message: success 
      ? `✓ ${method} ${path} returned ${expectedStatus || 200}` 
      : `✗ Connection refused - Is your backend running?`,
    details: success ? undefined : 'Make sure your backend is running on ' + API_BASE_URL,
    timestamp: new Date().toISOString(),
  };
};

// Health check
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
};

// Get API base URL (for display)
export const getApiBaseUrl = (): string => API_BASE_URL;
