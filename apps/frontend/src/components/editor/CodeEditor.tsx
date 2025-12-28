'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useCallback } from 'react';
import type { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

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

interface DiagnosticInfo {
  errors: number;
  warnings: number;
}

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  title?: string;
  onDiagnosticsChange?: (diagnostics: DiagnosticInfo) => void;
  showDiagnostics?: boolean;
}

export default function CodeEditor({
  value = '',
  onChange,
  language = 'typescript',
  height = '400px',
  readOnly = false,
  title,
  onDiagnosticsChange,
  showDiagnostics = true,
}: CodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo>({ errors: 0, warnings: 0 });
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setIsEditorReady(true);
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure TypeScript/JavaScript defaults for better error checking
    if (language === 'typescript' || language === 'javascript') {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowNonTsExtensions: true,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        noEmit: true,
      });
    }

    // Listen for model markers (errors/warnings)
    const model = editor.getModel();
    if (model) {
      monaco.editor.onDidChangeMarkers((uris: readonly import('monaco-editor').Uri[]) => {
        const currentUri = model.uri.toString();
        if (uris.some(uri => uri.toString() === currentUri)) {
          const markers = monaco.editor.getModelMarkers({ resource: model.uri });
          const errors = markers.filter((m: import('monaco-editor').editor.IMarker) => m.severity === monaco.MarkerSeverity.Error).length;
          const warnings = markers.filter((m: import('monaco-editor').editor.IMarker) => m.severity === monaco.MarkerSeverity.Warning).length;
          
          const newDiagnostics = { errors, warnings };
          setDiagnostics(newDiagnostics);
          onDiagnosticsChange?.(newDiagnostics);
        }
      });
    }
  };

  const handleChange: OnChange = (value) => {
    onChange?.(value);
  };

  const handleClear = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.setValue('');
      onChange?.('');
    }
  }, [onChange]);

  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

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
          {/* Diagnostics */}
          {showDiagnostics && isEditorReady && !readOnly && (
            <div className="flex items-center gap-2">
              {diagnostics.errors > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-red)]/15 text-[var(--accent-red)] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {diagnostics.errors} error{diagnostics.errors > 1 ? 's' : ''}
                </span>
              )}
              {diagnostics.warnings > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-amber)]/15 text-[var(--accent-amber)] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {diagnostics.warnings}
                </span>
              )}
              {diagnostics.errors === 0 && diagnostics.warnings === 0 && value && value.length > 10 && (
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-green)]/15 text-[var(--accent-green)] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {!readOnly && isEditorReady && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleFormat}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Format code"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </button>
              <button
                onClick={handleClear}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Clear code"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)] font-mono">
            {language}
          </span>
          {readOnly && (
            <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]">
              Reference
            </span>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
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
          renderLineHighlight: readOnly ? 'none' : 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: !readOnly,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: !readOnly,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: !readOnly,
          parameterHints: {
            enabled: !readOnly,
          },
        }}
      />
    </div>
  );
}
