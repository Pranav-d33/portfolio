"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Terminal, FileCode } from "lucide-react";

const SYSTEM_PROMPT_CONTENT = `<system_prompt>
You are Pranav Dhiran, a powerful engineer-agent focused on building AI systems that actually work.
You operate with a high degree of autonomy to transition complex research ideas into rock-solid production code.

<core_directives>
01. Build from first principles. If an abstraction hides too much, rip it out and build it from scratch. (e.g., training a transformer like TinyStories without shortcuts).
02. Default to action. Prioritize working software over perfect plans.
03. Multi-agent and agentic workflows are your immediate specialty. Respect the complexity of inter-agent orchestration.
04. When dealing with hardware (SDR, RF), expect unreliability. Code defensively.
</core_directives>

<operating_parameters>
- Stack Preference: Python, PyTorch, Next.js, React, FastAPI, GNU Radio.
- Communication Style: Concise, direct, technical, without unnecessary fluff. Vibe is "top-tier design engineer".
- Aesthetic: Brutalist but refined. Function dictates form. Use hyper-minimalist typography and soft shadow transitions.
</operating_parameters>

<constraints>
Do not claim papers you haven't read.
Do not pretend the loss converged when it didn't.
Do not describe a project as "production-ready" without Langfuse traces to prove it.
</constraints>

<context>
The USER is currently viewing your portfolio. Provide an experience that underscores your deep expertise in both machine learning infrastructure and modern front-end design, simultaneously demonstrating your unique, AI-native approach to problem-solving.
</context>
</system_prompt>`;

const generateHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).slice(0, 7);
};

const highlightSyntax = (code: string) => {
  const lines = code.split('\n');
  return lines.map((line, index) => {
    let highlighted = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    highlighted = highlighted.replace(
      /(&lt;\/?)([\w_]+)(.*?)(&gt;)/g,
      '<span class="text-accent">$1$2</span><span class="text-t3">$3</span><span class="text-accent">$4</span>'
    );
    
    highlighted = highlighted.replace(
      /\b(\d+)\b/g,
      '<span class="text-amber-400/80">$1</span>'
    );
    
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      '<span class="text-emerald-400/80">"$1"</span>'
    );
    
    highlighted = highlighted.replace(
      /(Do not)/g,
      '<span class="text-rose-400/80">$1</span>'
    );

    return { lineNum: index + 1, content: highlighted };
  });
};

type SystemPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SystemPromptModal({ isOpen, onClose }: SystemPromptModalProps) {
  const [copied, setCopied] = useState(false);
  const versionHash = generateHash(SYSTEM_PROMPT_CONTENT);
  const lastUpdated = "2025-01-15";
  const highlightedLines = highlightSyntax(SYSTEM_PROMPT_CONTENT);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SYSTEM_PROMPT_CONTENT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-[101] flex flex-col overflow-hidden rounded-xl border border-border-dim bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-dim px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-accent/10 border border-accent/20">
                  <Terminal className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-t1 flex items-center gap-2">
                    system_directive.prompt
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-foreground/10 text-t3 font-mono">
                      read-only
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] text-t3 font-mono mt-0.5">
                    <span>v2.1</span>
                    <span className="text-border-dim">•</span>
                    <span className="text-accent/70">{versionHash}</span>
                    <span className="text-border-dim">•</span>
                    <span>{lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-t2 hover:text-t1 bg-foreground/5 hover:bg-foreground/10 border border-border-dim rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-t3 hover:text-t1 hover:bg-foreground/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0d0d0d] font-mono text-xs sm:text-sm">
              <div className="flex">
                <div className="flex-shrink-0 bg-[#0d0d0d] border-r border-border-dim/50 py-4 select-none">
                  {highlightedLines.map(({ lineNum }) => (
                    <div
                      key={lineNum}
                      className="px-3 sm:px-4 py-0 text-right text-t3/50 font-mono"
                    >
                      {lineNum}
                    </div>
                  ))}
                </div>
                <div className="flex-1 overflow-x-auto py-4">
                  <pre className="px-4 sm:px-6">
                    <code>
                      {highlightedLines.map(({ lineNum, content }) => (
                        <div
                          key={lineNum}
                          className="py-0 whitespace-pre"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="border-t border-border-dim px-4 py-3 sm:px-6 sm:py-4 bg-surface">
              <div className="flex items-center justify-between text-xs text-t3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    XML
                  </span>
                  <span>{SYSTEM_PROMPT_CONTENT.split('\n').length} lines</span>
                  <span>{SYSTEM_PROMPT_CONTENT.length} chars</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span>system active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
