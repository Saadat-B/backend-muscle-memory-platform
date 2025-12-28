'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { levels } from '@/data/levels';
import { getProgress, updateSpeedRunTime } from '@/lib/progress';
import { smartVerifyEndpoint } from '@/lib/api';
import Timer, { useTimer } from '@/components/ui/Timer';

interface LevelResult {
  levelId: string;
  levelNumber: number;
  levelTitle: string;
  passed: boolean;
  time: number;
  verifications: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

export default function SpeedRunPage() {
  const [mounted, setMounted] = useState(false);
  const [runState, setRunState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [results, setResults] = useState<LevelResult[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const { time, isRunning, start, stop, reset } = useTimer();

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    if (progress.speedRunBestTime) {
      setBestTime(progress.speedRunBestTime);
    }
  }, []);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  const runVerifications = async () => {
    setRunState('running');
    setResults([]);
    setCurrentLevelIndex(0);
    reset();
    start();

    const allResults: LevelResult[] = [];

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      setCurrentLevelIndex(i);
      
      const levelStartTime = Date.now();
      const verifications: LevelResult['verifications'] = [];
      let allPassed = true;

      for (const endpoint of level.verificationEndpoints) {
        const result = await smartVerifyEndpoint(
          endpoint.method,
          endpoint.path,
          endpoint.expectedStatus
        );
        
        verifications.push({
          name: endpoint.name,
          passed: result.success,
          message: result.message,
        });

        if (!result.success) {
          allPassed = false;
        }
      }

      const levelTime = Date.now() - levelStartTime;
      
      allResults.push({
        levelId: level.id,
        levelNumber: level.number,
        levelTitle: level.title,
        passed: allPassed,
        time: levelTime,
        verifications,
      });

      setResults([...allResults]);
    }

    stop();
    setRunState('completed');

    // Update best time if this run was faster
    const passedAll = allResults.every(r => r.passed);
    if (passedAll) {
      updateSpeedRunTime(time);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  const handleReset = () => {
    setRunState('idle');
    setResults([]);
    setCurrentLevelIndex(0);
    reset();
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  const totalTests = results.reduce((acc, r) => acc + r.verifications.length, 0);
  const passedTests = results.reduce((acc, r) => acc + r.verifications.filter(v => v.passed).length, 0);

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-[var(--text-muted)]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-red)] flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Speed Run</h1>
            <p className="text-[var(--text-secondary)]">Build everything from scratch. Beat the clock.</p>
          </div>
        </div>

        {/* Best Time */}
        {bestTime && runState === 'idle' && (
          <div className="card p-4 border-[var(--accent-purple)]/30">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Personal Best</p>
                <p className="text-lg font-bold text-[var(--accent-purple)]">{formatTime(bestTime)}</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Timer & Controls */}
      <section className="mb-8">
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Timer isRunning={isRunning} initialTime={time} />
            
            <div className="flex items-center gap-3">
              {runState === 'idle' && (
                <button onClick={runVerifications} className="btn btn-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Speed Run
                </button>
              )}
              
              {runState === 'running' && (
                <div className="flex items-center gap-3">
                  <div className="badge badge-warning">
                    Running L{levels[currentLevelIndex]?.number || 0}...
                  </div>
                </div>
              )}
              
              {runState === 'completed' && (
                <button onClick={handleReset} className="btn btn-secondary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              )}
            </div>
          </div>
          
          {/* Progress during run */}
          {runState === 'running' && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)]">Progress</span>
                <span className="text-[var(--text-primary)]">{currentLevelIndex + 1}/{levels.length}</span>
              </div>
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-red)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentLevelIndex + 1) / levels.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Summary */}
      {runState === 'completed' && (
        <section className="mb-8">
          <div className={`card-highlight p-6 ${passedCount === levels.length ? 'terminal-glow' : 'terminal-glow-amber'}`}>
            <div className="flex items-center gap-4 mb-4">
              {passedCount === levels.length ? (
                <div className="w-16 h-16 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--accent-amber)]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--accent-amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {passedCount === levels.length ? 'Speed Run Complete! 🎉' : 'Speed Run Finished'}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {passedCount === levels.length 
                    ? `Amazing! You completed in ${formatTime(time)}` 
                    : `${failedCount} level(s) need attention`}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[var(--bg-secondary)]/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent-green)]">{passedCount}</p>
                <p className="text-xs text-[var(--text-muted)]">Levels Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent-red)]">{failedCount}</p>
                <p className="text-xs text-[var(--text-muted)]">Levels Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text-primary)]">{passedTests}/{totalTests}</p>
                <p className="text-xs text-[var(--text-muted)]">Tests Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--accent-blue)]">{formatTime(time)}</p>
                <p className="text-xs text-[var(--text-muted)]">Total Time</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results List */}
      {results.length > 0 && (
        <section>
          <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-4">
            Level Results
          </h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={result.levelId}
                className={`card p-4 animate-slide-in ${
                  result.passed 
                    ? 'border-[var(--accent-green)]/20' 
                    : 'border-[var(--accent-red)]/20'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      result.passed 
                        ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' 
                        : 'bg-[var(--accent-red)]/15 text-[var(--accent-red)]'
                    }`}>
                      {result.passed ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        L{result.levelNumber} · {result.levelTitle}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {result.verifications.filter(v => v.passed).length}/{result.verifications.length} verifications passed
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-mono text-[var(--text-secondary)]">
                      {formatTime(result.time)}
                    </p>
                  </div>
                </div>
                
                {!result.passed && (
                  <div className="mt-3 pl-13 space-y-1">
                    {result.verifications.filter(v => !v.passed).map((v, i) => (
                      <p key={i} className="text-xs text-[var(--accent-red)]">
                        {v.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Idle State Instructions */}
      {runState === 'idle' && results.length === 0 && (
        <section className="mt-8">
          <div className="card p-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">How Speed Run Works</h2>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-green)] font-bold">1.</span>
                <span>Click &ldquo;Start Speed Run&rdquo; to begin the timer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-green)] font-bold">2.</span>
                <span>All {levels.length} levels will be verified automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-green)] font-bold">3.</span>
                <span>Build your backend as fast as you can</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent-green)] font-bold">4.</span>
                <span>Target time: 2 hours or less</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-muted)] mb-2">💡 Pro Tip</p>
              <p className="text-sm text-[var(--text-secondary)]">
                For a real speed run, start your backend from scratch in a new directory 
                and keep this page open to verify as you build.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Back to Levels */}
      <nav className="mt-8 pt-8 border-t border-[var(--border-color)]">
        <Link href="/levels" className="btn btn-ghost">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Levels
        </Link>
      </nav>
    </div>
  );
}
