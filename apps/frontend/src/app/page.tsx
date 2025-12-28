'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Animated code typing effect
const codeLines = [
  "import express from 'express';",
  "",
  "const app = express();",
  "app.use(express.json());",
  "",
  "app.get('/health', (req, res) => {",
  "  res.json({ status: 'ok' });",
  "});",
  "",
  "app.listen(3000);",
];

export default function LandingPage() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Typing animation
  useEffect(() => {
    if (!mounted) return;
    if (currentLineIndex >= codeLines.length) return;

    const currentLine = codeLines[currentLineIndex];
    
    if (currentCharIndex <= currentLine.length) {
      const timer = setTimeout(() => {
        setTypedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, currentLineIndex, currentCharIndex]);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Build Muscle Memory",
      description: "Repetition is the mother of learning. Build APIs from scratch until it becomes second nature."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Instant Verification",
      description: "Connect your backend and get real-time feedback. No guessing if your code works."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Speed Run Mode",
      description: "Race against the clock. Target: build a complete backend in under 2 hours."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "10 Progressive Levels",
      description: "From basic Express setup to production-ready Docker deployment. Master it all."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Real Code, Real Skills",
      description: "Write actual Express + TypeScript code. No toy examples or simulations."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Track Your Progress",
      description: "See your improvement over time. Beat your personal best with each run."
    },
  ];

  const levels = [
    { num: 0, title: "Server Bootstrap", desc: "Express + TypeScript + health endpoints" },
    { num: 1, title: "CRUD Operations", desc: "RESTful API with layered architecture" },
    { num: 2, title: "Database Integration", desc: "Prisma + PostgreSQL setup" },
    { num: 3, title: "Authentication", desc: "JWT tokens + password hashing" },
    { num: 4, title: "Authorization", desc: "RBAC + resource ownership" },
    { num: 5, title: "Caching Layer", desc: "Redis integration" },
    { num: 6, title: "Background Jobs", desc: "BullMQ workers" },
    { num: 7, title: "Observability", desc: "Logging + rate limiting" },
    { num: 8, title: "Production Ready", desc: "Docker + CI/CD" },
    { num: 9, title: "Speed Run", desc: "Build everything from scratch!" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-green)]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--accent-blue)]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 text-[var(--accent-green)] text-sm mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                FreeCodeCamp-style learning
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Build Backend APIs<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)]">
                  Until It&apos;s Muscle Memory
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Stop watching tutorials. Start building. Practice Express + TypeScript backends 
                through repetition until you can build production-ready APIs in your sleep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link 
                  href="/levels" 
                  className="btn btn-primary text-lg px-8 py-4 group"
                >
                  Start Training
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/speedrun" 
                  className="btn btn-secondary text-lg px-8 py-4"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Speed Run
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 justify-center lg:justify-start mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div>
                  <p className="text-3xl font-bold text-[var(--accent-green)]">10</p>
                  <p className="text-sm text-[var(--text-muted)]">Levels</p>
                </div>
                <div className="w-px bg-[var(--border-color)]" />
                <div>
                  <p className="text-3xl font-bold text-[var(--accent-blue)]">2h</p>
                  <p className="text-sm text-[var(--text-muted)]">Target Time</p>
                </div>
                <div className="w-px bg-[var(--border-color)]" />
                <div>
                  <p className="text-3xl font-bold text-[var(--accent-purple)]">∞</p>
                  <p className="text-sm text-[var(--text-muted)]">Practice</p>
                </div>
              </div>
            </div>

            {/* Right - Code Animation */}
            <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent-green)]/20 to-[var(--accent-blue)]/20 rounded-2xl blur-xl" />
                
                <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-amber)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                    <span className="ml-3 text-sm text-[var(--text-muted)] font-mono">app.ts</span>
                  </div>
                  
                  {/* Code */}
                  <div className="p-6 font-mono text-sm leading-relaxed min-h-[320px]">
                    {typedLines.map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 text-right pr-4 text-[var(--text-muted)] select-none">{i + 1}</span>
                        <span className={
                          line.includes('import') || line.includes('const') || line.includes('app.') 
                            ? 'text-[var(--accent-purple)]'
                            : line.includes("'") || line.includes('"')
                            ? 'text-[var(--accent-green)]'
                            : 'text-[var(--text-primary)]'
                        }>
                          {line}
                          {i === currentLineIndex && <span className="animate-pulse text-[var(--accent-green)]">|</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Three simple steps to building backend muscle memory
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Choose a Level", desc: "Start from L0 (basics) or jump to where you need practice" },
              { step: 2, title: "Write Real Code", desc: "Build an actual Express + TypeScript backend from scratch" },
              { step: 3, title: "Verify & Repeat", desc: "Connect your backend for instant verification. Repeat until mastered." },
            ].map((item, index) => (
              <div 
                key={item.step}
                className="relative p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/50 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)]">{item.desc}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-[var(--accent-green)]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Built for Backend Developers
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to master backend development through practice
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--border-light)] transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-green)]/20 to-[var(--accent-blue)]/20 flex items-center justify-center text-[var(--accent-green)] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Preview */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              10 Levels to Mastery
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              From zero to production-ready. Each level builds on the last.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {levels.map((level, index) => (
              <div 
                key={level.num}
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-green)]/50 transition-all group cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mb-3 ${
                  level.num === 9 
                    ? 'bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-red)] text-white'
                    : 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]'
                } group-hover:scale-110 transition-transform`}>
                  L{level.num}
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1">{level.title}</h3>
                <p className="text-xs text-[var(--text-muted)]">{level.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/levels" className="btn btn-primary">
              View All Levels
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-green)]/10 via-transparent to-[var(--accent-blue)]/10" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20 text-[var(--accent-amber)] text-sm mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Target: 2 hours from zero to production
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Ready to Build Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)]">
              Backend Muscle Memory?
            </span>
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            No signup required. No tutorials to watch. Just you, your code editor, 
            and the goal of building backends so fast it becomes automatic.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/levels" className="btn btn-primary text-lg px-10 py-4">
              Start Level 0
            </Link>
            <Link href="/dashboard" className="btn btn-secondary text-lg px-10 py-4">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-blue)] flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-sm">{'</>'}</span>
              </div>
              <span className="font-bold text-[var(--text-primary)]">
                Backend<span className="text-[var(--accent-green)]">Muscle</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Build backends until it&apos;s muscle memory.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
