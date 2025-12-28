'use client';

import { useEffect, useState } from 'react';
import { levels } from '@/data/levels';
import { getProgress, getLevelRequirementsProgress } from '@/lib/progress';
import { LevelStatus } from '@/types';
import LevelCard from '@/components/ui/LevelCard';
import ProgressBar from '@/components/ui/ProgressBar';

export default function LevelsPage() {
  const [mounted, setMounted] = useState(false);
  const [levelStatuses, setLevelStatuses] = useState<Record<string, LevelStatus>>({});
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>({});
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const progress = getProgress();
    
    const statuses: Record<string, LevelStatus> = {};
    const completed: Record<string, number> = {};
    
    levels.forEach(level => {
      statuses[level.id] = progress.levels[level.id]?.status || 'locked';
      completed[level.id] = getLevelRequirementsProgress(level.id).completed;
    });
    
    setLevelStatuses(statuses);
    setLevelProgress(completed);
    setCompletedCount(Object.values(statuses).filter(s => s === 'completed').length);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-[var(--text-muted)]">Loading levels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Training Levels
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Complete each level to unlock the next. Master backend development through repetition.
        </p>
        
        {/* Progress Overview */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--text-secondary)]">Overall Progress</span>
            <span className="text-sm font-bold text-[var(--accent-green)]">
              {completedCount}/{levels.length} Levels
            </span>
          </div>
          <ProgressBar value={completedCount} max={levels.length} size="md" />
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--accent-green)]">✓</span>
              <span className="text-[var(--text-secondary)]">Completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--accent-amber)]">◐</span>
              <span className="text-[var(--text-secondary)]">In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--accent-blue)]">○</span>
              <span className="text-[var(--text-secondary)]">Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-muted)]">🔒</span>
              <span className="text-[var(--text-secondary)]">Locked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Levels List */}
      <section>
        <div className="space-y-4">
          {levels.map((level, index) => (
            <div 
              key={level.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <LevelCard
                level={level}
                status={levelStatuses[level.id] || 'locked'}
                completedRequirements={levelProgress[level.id] || 0}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      {completedCount === levels.length && (
        <section className="mt-8">
          <div className="card-highlight p-8 text-center terminal-glow">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              All Levels Completed! 🎉
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              You've mastered the backend fundamentals. Ready for a speed run?
            </p>
            <a href="/speedrun" className="btn btn-primary">
              Start Speed Run
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
