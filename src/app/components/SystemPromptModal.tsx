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
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-24 z-[101] flex flex-col overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-[0_0_80px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_80px_-15px_rgba(255,255,255,0.05)] rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-5 bg-white/30 dark:bg-black/30 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 text-ebony-text dark:text-white">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-ebony-text dark:text-white flex items-center gap-3">
                    system_directive.prompt
                    <span className="px-2 py-1 text-[11px] font-bold tracking-widest uppercase border border-black/20 dark:border-white/20 text-black dark:text-white font-mono bg-black/5 dark:bg-white/10 rounded-md">
                      read-only
                    </span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ebony-text dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-black/10 dark:border-white/10"
                  type="button"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-ebony-text dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-transparent p-6 sm:p-8">
              <pre className="text-ebony-text/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap font-mono text-sm sm:text-base">
                {SYSTEM_PROMPT_CONTENT}
              </pre>
            </div>

            <div className="border-t border-black/10 dark:border-white/10 px-6 py-4 bg-white/30 dark:bg-black/30 backdrop-blur-md">
              <div className="flex items-center justify-between text-sm sm:text-base text-ebony-text dark:text-white font-medium">
                <div className="flex items-center gap-6 opacity-70">
                  <span className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    XML
                  </span>
                  <span>{SYSTEM_PROMPT_CONTENT.split('\n').length} lines</span>
                  <span>{SYSTEM_PROMPT_CONTENT.length} chars</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800/30">
                  <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                  <span className="tracking-wide">system active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
