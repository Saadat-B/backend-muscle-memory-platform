'use client';

import { useState } from 'react';
import { VerificationEndpoint, VerificationResult } from '@/types';
import { mockVerifyEndpoint, verifyEndpoint } from '@/lib/api';

interface VerifyButtonProps {
  endpoint: VerificationEndpoint;
  onVerified?: (success: boolean) => void;
  useMock?: boolean;
}

export default function VerifyButton({ endpoint, onVerified, useMock = true }: VerifyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    setStatus('loading');
    setResult(null);

    try {
      const verifyFn = useMock ? mockVerifyEndpoint : verifyEndpoint;
      const response = await verifyFn(
        endpoint.method,
        endpoint.path,
        endpoint.expectedStatus
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
    <div className="card p-4">
      <div className="flex items-start gap-4">
        {/* Endpoint Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColors[endpoint.method] || 'bg-[var(--bg-tertiary)]'}`}>
              {endpoint.method}
            </span>
            <code className="text-sm font-mono text-[var(--text-primary)]">
              {endpoint.path}
            </code>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {endpoint.description}
          </p>
          {endpoint.expectedStatus && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Expected: {endpoint.expectedStatus}
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={status === 'loading'}
          className={`btn flex-shrink-0 min-w-[100px] ${
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
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Testing...
            </span>
          ) : status === 'success' ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pass
            </span>
          ) : status === 'error' ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Fail
            </span>
          ) : (
            'Verify'
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          result.success 
            ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20' 
            : 'bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20'
        }`}>
          <p className={result.success ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
            {result.message}
          </p>
          {result.details && (
            <p className="text-[var(--text-muted)] mt-1 text-xs font-mono">
              {result.details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
