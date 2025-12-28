import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Backend Muscle Memory | Training Console",
  description: "FreeCodeCamp-style practice platform for backend development. Build muscle memory through repetition.",
  keywords: ["backend", "training", "practice", "express", "nodejs", "typescript"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            
            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] py-6 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-muted)]">
                    Backend Muscle Memory Training Console
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    v0.1.0
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
