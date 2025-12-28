'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import Monaco to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[var(--bg-tertiary)] rounded-lg">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 animate-spin text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-[var(--text-muted)]">Loading editor...</span>
      </div>
    </div>
  ),
});

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  title?: string;
}

export default function CodeEditor({
  value = '',
  onChange,
  language = 'typescript',
  height = '400px',
  readOnly = false,
  title,
}: CodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border-color)]">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          {/* Window Controls */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-amber)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
          </div>
          
          {title && (
            <span className="text-sm text-[var(--text-secondary)] font-mono">
              {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] font-mono">
            {language}
          </span>
          {readOnly && (
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]">
              Read Only
            </span>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: false,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
