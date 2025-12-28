'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { levels } from '@/data/levels';
import { 
  getProgress, 
  getCompletionPercentage, 
  getCurrentLevel,
  getLevelRequirementsProgress 
} from '@/lib/progress';
import { getApiBaseUrl } from '@/lib/api';
import ProgressBar from '@/components/ui/ProgressBar';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [completionPercent, setCompletionPercent] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, remaining: 0 });
  const [currentLevelProgress, setCurrentLevelProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    setCompletionPercent(getCompletionPercentage());
    
    const current = getCurrentLevel();
    if (current) {
      setCurrentLevel(current);
      setCurrentLevelProgress(getLevelRequirementsProgress(current.id));
    }

    // Find last completed level
    const completedLevels = Object.values(progress.levels)
      .filter(l => l.status === 'completed')
      .sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
    
    if (completedLevels.length > 0) {
      const lastLevel = levels.find(l => l.id === completedLevels[0].levelId);
      if (lastLevel) {
        setLastCompleted(`L${lastLevel.number} · ${lastLevel.shortTitle}`);
      }
    }

    // Calculate stats
    const completed = Object.values(progress.levels).filter(l => l.status === 'completed').length;
    const inProgress = Object.values(progress.levels).filter(l => l.status === 'in_progress').length;
    setStats({
      completed,
      inProgress,
      remaining: levels.length - completed - inProgress
    });
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="card-highlight p-8 terminal-glow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
                Backend <span className="text-[var(--accent-green)]">Muscle Memory</span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Build backend APIs from scratch until it becomes second nature.
                No magic, no generators—just pure repetition.
              </p>
            </div>
            
            <Link 
              href={`/levels/${currentLevel.id}`}
              className="btn btn-primary text-lg px-8 py-4 flex-shrink-0 animate-pulse-green"
            >
              Continue Training
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Level Card */}
      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-4">Current Level</h2>
        <Link href={`/levels/${currentLevel.id}`} className="block">
          <div className="card p-6 hover-lift cursor-pointer border-[var(--accent-amber)]/30">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-amber)] to-[var(--accent-red)] flex flex-col items-center justify-center text-[var(--bg-primary)]">
                <span className="text-sm font-medium opacity-70">Level</span>
                <span className="text-3xl font-bold">{currentLevel.number}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">
                    {currentLevel.title}
                  </h3>
                  <span className="badge badge-warning">In Progress</span>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">
                  {currentLevel.description}
                </p>
                
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Requirements</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {currentLevelProgress.completed}/{currentLevelProgress.total} completed
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Time</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {currentLevel.estimatedTime}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <ProgressBar 
                    value={currentLevelProgress.completed} 
                    max={currentLevelProgress.total} 
                    variant="warning"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-4">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Progress */}
          <div className="card p-5">
            <p className="text-xs text-[var(--text-muted)] mb-1">Overall Progress</p>
            <p className="text-3xl font-bold text-[var(--accent-green)]">{completionPercent}%</p>
            <div className="mt-3">
              <ProgressBar value={completionPercent} size="sm" />
            </div>
          </div>
          
          {/* Completed */}
          <div className="card p-5">
            <p className="text-xs text-[var(--text-muted)] mb-1">Completed</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.completed}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">levels done</p>
          </div>
          
          {/* Remaining */}
          <div className="card p-5">
            <p className="text-xs text-[var(--text-muted)] mb-1">Remaining</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.remaining}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">levels to go</p>
          </div>
          
          {/* Last Completed */}
          <div className="card p-5">
            <p className="text-xs text-[var(--text-muted)] mb-1">Last Completed</p>
            <p className="text-lg font-bold text-[var(--text-primary)] truncate">
              {lastCompleted || 'None yet'}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">keep going!</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/levels" className="card p-5 hover-lift group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/15 flex items-center justify-center group-hover:bg-[var(--accent-blue)]/25 transition-colors">
                <svg className="w-6 h-6 text-[var(--accent-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">View All Levels</h3>
                <p className="text-sm text-[var(--text-secondary)]">Browse the complete curriculum</p>
              </div>
            </div>
          </Link>
          
          <Link href="/speedrun" className="card p-5 hover-lift group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/15 flex items-center justify-center group-hover:bg-[var(--accent-purple)]/25 transition-colors">
                <svg className="w-6 h-6 text-[var(--accent-purple)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Speed Run</h3>
                <p className="text-sm text-[var(--text-secondary)]">Challenge yourself against time</p>
              </div>
            </div>
          </Link>
          
          <div className="card p-5 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Settings</h3>
                <p className="text-sm text-[var(--text-secondary)]">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Connection Status */}
      <section>
        <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-4">Backend Connection</h2>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Backend API URL</p>
                <code className="text-xs text-[var(--text-muted)] font-mono">{getApiBaseUrl()}</code>
              </div>
            </div>
            
            <span className="badge badge-warning">Mock Mode</span>
          </div>
          
          <p className="text-xs text-[var(--text-muted)] mt-4">
            Connect your backend to start verifying your implementations. The console is currently in mock mode.
          </p>
        </div>
      </section>
    </div>
  );
}
