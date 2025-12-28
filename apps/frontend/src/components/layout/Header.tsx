'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompletionPercentage, getCurrentLevel } from '@/lib/progress';

export default function Header() {
  const pathname = usePathname();
  const [completionPercent, setCompletionPercent] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<{ number: number; shortTitle: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompletionPercent(getCompletionPercentage());
    const level = getCurrentLevel();
    if (level) {
      setCurrentLevel({ number: level.number, shortTitle: level.shortTitle });
    }
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/levels', label: 'Levels' },
    { href: '/speedrun', label: 'Speed Run' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-lg">{'</>'}</span>
              </div>
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] opacity-0 group-hover:opacity-30 blur transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-[var(--text-primary)] text-lg">
                Backend<span className="text-[var(--accent-green)]">Muscle</span>
              </h1>
              <p className="text-xs text-[var(--text-muted)] -mt-1">Memory Training</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[var(--bg-tertiary)] text-[var(--accent-green)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            {mounted && currentLevel && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">Current Level</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    L{currentLevel.number} · {currentLevel.shortTitle}
                  </p>
                </div>
                <div className="w-px h-8 bg-[var(--border-color)]" />
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">Progress</p>
                  <p className="text-sm font-bold text-[var(--accent-green)]">{completionPercent}%</p>
                </div>
              </div>
            )}

            {/* Mobile Progress */}
            {mounted && (
              <div className="md:hidden flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--accent-green)]">{completionPercent}%</span>
                <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
