"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, FileCode } from "lucide-react";

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

type SystemPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SystemPromptModal({ isOpen, onClose }: SystemPromptModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SYSTEM_PROMPT_CONTENT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
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
            className="fixed inset-0 z-[100] bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-[101] flex flex-col overflow-hidden border border-fog-border bg-canvas-porcelain shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-fog-border px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 border border-ebony-text/20">
                  <FileCode className="w-4 h-4 text-ebony-text" />
                </div>
                <div>
                  <h2 className="text-body-sm font-medium text-ebony-text flex items-center gap-2">
                    system_directive.prompt
                    <span className="px-1.5 py-0.5 text-[10px] border border-fog-border text-stone-text font-mono">
                      read-only
                    </span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-body-sm text-graphite-text hover:text-ebony-text border border-fog-border hover:border-ebony-text transition-colors"
                  type="button"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
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
                  className="flex items-center justify-center w-8 h-8 text-stone-text hover:text-ebony-text transition-colors"
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#f5f5f0] dark:bg-[#1a1a1a] font-mono text-body-sm">
              <pre className="p-6 text-graphite-text leading-relaxed whitespace-pre-wrap">
                {SYSTEM_PROMPT_CONTENT}
              </pre>
            </div>

            <div className="border-t border-fog-border px-4 py-3 sm:px-6 bg-canvas-porcelain">
              <div className="flex items-center justify-between text-body-sm text-stone-text">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    XML
                  </span>
                  <span>{SYSTEM_PROMPT_CONTENT.split('\n').length} lines</span>
                  <span>{SYSTEM_PROMPT_CONTENT.length} chars</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ebony-text" />
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
