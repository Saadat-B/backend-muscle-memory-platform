'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getSettings, 
  saveSettings, 
  testConnection, 
  BackendSettings 
} from '@/lib/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<BackendSettings | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [useMockMode, setUseMockMode] = useState(true);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [testLatency, setTestLatency] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const s = getSettings();
      setSettings(s);
      setApiUrl(s.apiUrl);
      setUseMockMode(s.useMockMode);
      setTestStatus('idle');
    }
  }, [isOpen]);

  const handleTestConnection = useCallback(async () => {
    setTestStatus('testing');
    setTestMessage('');
    setTestLatency(null);
    
    const result = await testConnection(apiUrl);
    
    setTestStatus(result.success ? 'success' : 'error');
    setTestMessage(result.message);
    if (result.latency) {
      setTestLatency(result.latency);
    }
  }, [apiUrl]);

  const handleSave = useCallback(() => {
    saveSettings({ apiUrl, useMockMode });
    onClose();
    // Trigger a page refresh to apply changes
    window.location.reload();
  }, [apiUrl, useMockMode, onClose]);

  const handleMockModeToggle = useCallback(() => {
    setUseMockMode(!useMockMode);
    if (!useMockMode) {
      // Switching to mock mode
      setTestStatus('idle');
    }
  }, [useMockMode]);

  if (!isOpen || !settings) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 card p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)]/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Backend Settings</h2>
              <p className="text-xs text-[var(--text-muted)]">Configure your backend connection</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <label className="text-sm text-[var(--text-secondary)] mb-2 block">Verification Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUseMockMode(true)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                useMockMode 
                  ? 'bg-[var(--accent-amber)]/15 border-[var(--accent-amber)]/50 text-[var(--accent-amber)]' 
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border-light)]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Mock Mode</span>
              </div>
              <p className="text-xs mt-1 opacity-70">Simulated responses</p>
            </button>
            <button
              onClick={() => setUseMockMode(false)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                !useMockMode 
                  ? 'bg-[var(--accent-green)]/15 border-[var(--accent-green)]/50 text-[var(--accent-green)]' 
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--border-light)]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <span className="font-medium">Live Mode</span>
              </div>
              <p className="text-xs mt-1 opacity-70">Real API calls</p>
            </button>
          </div>
        </div>

        {/* API URL (only show when not in mock mode) */}
        {!useMockMode && (
          <div className="mb-6 animate-fade-in">
            <label className="text-sm text-[var(--text-secondary)] mb-2 block">Backend API URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3001"
                className="input flex-1"
              />
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="btn btn-secondary px-4"
              >
                {testStatus === 'testing' ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  'Test'
                )}
              </button>
            </div>
            
            {/* Test Result */}
            {testStatus !== 'idle' && testStatus !== 'testing' && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                testStatus === 'success' 
                  ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20' 
                  : 'bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20'
              }`}>
                <div className="flex items-center gap-2">
                  {testStatus === 'success' ? (
                    <svg className="w-4 h-4 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[var(--accent-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={testStatus === 'success' ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'}>
                    {testMessage}
                  </span>
                  {testLatency && (
                    <span className="text-[var(--text-muted)] ml-auto">{testLatency}ms</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Help Text */}
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Enter the URL where your backend is running. We&apos;ll call your API endpoints to verify your implementation.
            </p>
          </div>
        )}

        {/* Mock Mode Info */}
        {useMockMode && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[var(--accent-amber)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-[var(--accent-amber)] font-medium">Mock Mode Active</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Verification results are simulated. Switch to Live Mode and connect your backend for real testing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
