import Link from 'next/link';
import { Level, LevelStatus } from '@/types';

interface LevelCardProps {
  level: Level;
  status: LevelStatus;
  completedRequirements?: number;
}

export default function LevelCard({ level, status, completedRequirements = 0 }: LevelCardProps) {
  const isAccessible = status !== 'locked';
  const totalRequirements = level.requirements.length;
  const progress = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0;

  const statusConfig = {
    locked: {
      icon: '🔒',
      badge: 'badge-locked',
      badgeText: 'Locked',
      border: 'border-[var(--border-color)]',
      opacity: 'opacity-60',
    },
    available: {
      icon: '○',
      badge: 'badge-info',
      badgeText: 'Available',
      border: 'border-[var(--border-color)] hover:border-[var(--accent-blue)]',
      opacity: '',
    },
    in_progress: {
      icon: '◐',
      badge: 'badge-warning',
      badgeText: 'In Progress',
      border: 'border-[var(--accent-amber)]/50',
      opacity: '',
    },
    completed: {
      icon: '✓',
      badge: 'badge-success',
      badgeText: 'Completed',
      border: 'border-[var(--accent-green)]/30',
      opacity: '',
    },
  };

  const config = statusConfig[status];

  const CardContent = () => (
    <div className={`card p-5 ${config.border} ${config.opacity} ${isAccessible ? 'hover-lift cursor-pointer' : 'cursor-not-allowed'}`}>
      <div className="flex items-start gap-4">
        {/* Level Number & Status Icon */}
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
            status === 'completed' 
              ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' 
              : status === 'in_progress'
              ? 'bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]'
              : status === 'available'
              ? 'bg-[var(--accent-blue)]/15 text-[var(--accent-blue)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
          }`}>
            <span className="text-xs font-medium opacity-70">L{level.number}</span>
            <span className="text-lg">{config.icon}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {level.title}
            </h3>
            <span className={`badge ${config.badge} hidden sm:inline-flex`}>
              {config.badgeText}
            </span>
          </div>
          
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
            {level.description}
          </p>

          {/* Progress & Meta */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[var(--text-muted)]">
              {level.requirements.length} requirements
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)]">
              {level.estimatedTime}
            </span>
            
            {(status === 'in_progress' || status === 'completed') && (
              <>
                <span className="text-[var(--text-muted)]">•</span>
                <span className={status === 'completed' ? 'text-[var(--accent-green)]' : 'text-[var(--accent-amber)]'}>
                  {completedRequirements}/{totalRequirements} done
                </span>
              </>
            )}
          </div>

          {/* Progress Bar for In Progress */}
          {status === 'in_progress' && (
            <div className="mt-3">
              <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent-amber)] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Arrow */}
        {isAccessible && (
          <div className="flex-shrink-0 self-center">
            <svg 
              className="w-5 h-5 text-[var(--text-muted)]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (isAccessible) {
    return (
      <Link href={`/levels/${level.id}`} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
