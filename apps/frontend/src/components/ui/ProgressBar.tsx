interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning';
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
  variant = 'default',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  const gradients = {
    default: 'bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)]',
    success: 'bg-[var(--accent-green)]',
    warning: 'bg-[var(--accent-amber)]',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-[var(--text-secondary)]">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {percentage}%
          </span>
        </div>
      )}
      <div className={`progress-bar ${heights[size]}`}>
        <div
          className={`progress-bar-fill ${gradients[variant]} ${
            animated ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        >
          {animated && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
}
