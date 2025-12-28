'use client';

import { Requirement } from '@/types';

interface RequirementsListProps {
  requirements: Requirement[];
  completedIds: string[];
  onToggle?: (requirementId: string) => void;
  readOnly?: boolean;
}

export default function RequirementsList({
  requirements,
  completedIds,
  onToggle,
  readOnly = false,
}: RequirementsListProps) {
  const completedCount = completedIds.length;
  const totalCount = requirements.length;
  const allCompleted = completedCount === totalCount;

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--text-primary)]">
          Requirements Checklist
        </h3>
        <span className={`text-sm font-medium ${allCompleted ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)]'}`}>
          {completedCount}/{totalCount} completed
        </span>
      </div>

      {/* List */}
      <div className="space-y-2">
        {requirements.map((req, index) => {
          const isCompleted = completedIds.includes(req.id);
          
          return (
            <div
              key={req.id}
              className={`group relative flex items-start gap-3 p-4 rounded-lg transition-all ${
                isCompleted 
                  ? 'bg-[var(--accent-green)]/5 border border-[var(--accent-green)]/20' 
                  : 'bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-light)]'
              } ${!readOnly && onToggle ? 'cursor-pointer' : ''}`}
              onClick={() => !readOnly && onToggle && onToggle(req.id)}
            >
              {/* Checkbox */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-[var(--accent-green)] border-[var(--accent-green)]'
                  : 'border-[var(--border-light)] group-hover:border-[var(--accent-green)]'
              }`}>
                {isCompleted && (
                  <svg className="w-4 h-4 text-[var(--bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className={`font-medium transition-colors ${
                    isCompleted ? 'text-[var(--accent-green)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {req.title}
                  </h4>
                </div>
                
                <p className={`text-sm mt-1 ${isCompleted ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>
                  {req.description}
                </p>
                
                {req.verificationHint && !isCompleted && (
                  <p className="text-xs text-[var(--accent-blue)] mt-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req.verificationHint}
                  </p>
                )}
              </div>

              {/* Status Indicator */}
              {isCompleted && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-[var(--accent-green)]">Done</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All Complete Message */}
      {allCompleted && (
        <div className="mt-4 p-4 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[var(--accent-green)]">All requirements completed!</p>
              <p className="text-sm text-[var(--text-secondary)]">Run verification to unlock the next level.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
