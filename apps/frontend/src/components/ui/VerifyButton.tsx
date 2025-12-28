'use client';

import { useState, useEffect } from 'react';
import { VerificationEndpoint, VerificationResult } from '@/types';
import { smartVerifyEndpoint } from '@/lib/api';
import { getSettings } from '@/lib/settings';

interface VerifyButtonProps {
  endpoint: VerificationEndpoint;
  onVerified?: (success: boolean) => void;
  useMock?: boolean; // Deprecated - now uses settings
}

export default function VerifyButton({ endpoint, onVerified }: VerifyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setIsLiveMode(!settings.useMockMode);
  }, []);

  const handleVerify = async () => {
    setStatus('loading');
    setResult(null);

    try {
      // Generate test body for POST endpoints
      let testBody: Record<string, unknown> | undefined;
      if (endpoint.method === 'POST') {
        if (endpoint.path.includes('/auth/register')) {
          testBody = { email: `test-${Date.now()}@example.com`, password: 'TestPass123!' };
        } else if (endpoint.path.includes('/auth/login')) {
          testBody = { email: 'test@example.com', password: 'TestPass123!' };
        } else if (endpoint.path.includes('/resources')) {
          testBody = { title: 'Test Resource', content: 'Test content' };
        }
      }

      const response = await smartVerifyEndpoint(
        endpoint.method,
        endpoint.path,
        endpoint.expectedStatus,
        testBody
      );

      setResult(response);
      setStatus(response.success ? 'success' : 'error');
      onVerified?.(response.success);
    } catch (error) {
      setResult({
        success: false,
        message: 'Verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      setStatus('error');
      onVerified?.(false);
    }
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-[var(--accent-blue)]/15 text-[var(--accent-blue)]',
    POST: 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]',
    PUT: 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]',
    PATCH: 'bg-[var(--accent-purple)]/15 text-[var(--accent-purple)]',
    DELETE: 'bg-[var(--accent-red)]/15 text-[var(--accent-red)]',
  };

  return (
    <div className="card p-3">
      <div className="flex items-start gap-3">
        {/* Endpoint Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${methodColors[endpoint.method] || 'bg-[var(--bg-tertiary)]'}`}>
              {endpoint.method}
            </span>
            <code className="text-xs font-mono text-[var(--text-primary)] truncate">
              {endpoint.path}
            </code>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
            {endpoint.description}
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={status === 'loading'}
          className={`btn btn-sm flex-shrink-0 ${
            status === 'idle' 
              ? 'btn-secondary' 
              : status === 'loading'
              ? 'btn-secondary cursor-wait'
              : status === 'success'
              ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/30'
              : 'bg-[var(--accent-red)]/20 text-[var(--accent-red)] border border-[var(--accent-red)]/30'
          }`}
        >
          {status === 'loading' ? (
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : status === 'success' ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : status === 'error' ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            isLiveMode ? 'Test' : 'Mock'
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-2 p-2 rounded text-xs ${
          result.success 
            ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20' 
            : 'bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20'
        }`}>
          <p className={result.success ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
            {result.message}
          </p>
          {result.details && (
            <p className="text-[var(--text-muted)] mt-1 font-mono break-all">
              {result.details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
