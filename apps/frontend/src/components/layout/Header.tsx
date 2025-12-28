'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompletionPercentage, getCurrentLevel } from '@/lib/progress';
import { getSettings, BackendSettings } from '@/lib/settings';
import SettingsModal from '@/components/ui/SettingsModal';

export default function Header() {
  const pathname = usePathname();
  const [completionPercent, setCompletionPercent] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<{ number: number; shortTitle: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<BackendSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompletionPercent(getCompletionPercentage());
    setSettings(getSettings());
    const level = getCurrentLevel();
    if (level) {
      setCurrentLevel({ number: level.number, shortTitle: level.shortTitle });
    }
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/levels', label: 'Levels' },
    { href: '/speedrun', label: 'Speed Run' },
  ];

  return (
    <>
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

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Mode Indicator */}
              {mounted && settings && (
                <button
                  onClick={() => setShowSettings(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    settings.useMockMode
                      ? 'bg-[var(--accent-amber)]/10 border-[var(--accent-amber)]/30 text-[var(--accent-amber)] hover:bg-[var(--accent-amber)]/20'
                      : 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/30 text-[var(--accent-green)] hover:bg-[var(--accent-green)]/20'
                  }`}
                  title="Click to configure backend settings"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    settings.useMockMode ? 'bg-[var(--accent-amber)]' : 'bg-[var(--accent-green)] animate-pulse'
                  }`} />
                  {settings.useMockMode ? 'Mock' : 'Live'}
                </button>
              )}

              {/* Progress Indicator */}
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

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

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

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
