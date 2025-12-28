'use client';

import { useEffect, useState, useCallback } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
  initialTime?: number;
}

export default function Timer({ isRunning, onTimeUpdate, initialTime = 0 }: TimerProps) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 100;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 100);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${milliseconds}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${milliseconds}`;
  }, []);

  const getTimeColor = () => {
    const seconds = time / 1000;
    if (seconds < 3600) return 'text-[var(--accent-green)]'; // Under 1 hour - green
    if (seconds < 7200) return 'text-[var(--accent-amber)]'; // Under 2 hours - amber
    return 'text-[var(--accent-red)]'; // Over 2 hours - red
  };

  return (
    <div className="inline-flex items-center gap-3">
      {/* Timer Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isRunning 
          ? 'bg-[var(--accent-green)]/15 animate-pulse-green' 
          : 'bg-[var(--bg-tertiary)]'
      }`}>
        <svg 
          className={`w-6 h-6 ${isRunning ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      {/* Time Display */}
      <div>
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
          {isRunning ? 'Elapsed Time' : 'Timer'}
        </p>
        <p className={`text-3xl font-mono font-bold tracking-tight ${getTimeColor()}`}>
          {formatTime(time)}
        </p>
      </div>
    </div>
  );
}

// Reset function to use imperatively
export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 100);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  return { time, isRunning, start, stop, reset };
}
