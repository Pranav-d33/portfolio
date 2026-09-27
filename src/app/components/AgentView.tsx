"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, Copy, ExternalLink, FileText, Terminal, X } from "lucide-react";
import { MOTION } from "@/lib/motion";

const SOURCE = "/llms.txt";
const CURL = "curl -s https://pranavdhiran.me/llms.txt";

type AgentViewProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Agent-readable view of the site: the same portfolio as the plain-text
 * llms.txt an LLM would actually ingest, streamed in line by line.
 */
export function AgentView({ isOpen, onClose }: AgentViewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || content || error) return;
    let cancelled = false;
    fetch(SOURCE)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text.trimEnd());
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, content, error]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the raw link is the fallback
    }
  }, []);

  const lines = content ? content.split("\n") : [];

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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Agent view — llms.txt"
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 18 }}
            transition={{ duration: 0.28, ease: MOTION.easeOutExpo }}
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-y-16 lg:inset-x-24 z-[101] flex flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/75 dark:bg-black/75 backdrop-blur-2xl shadow-[0_0_80px_-15px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-4 bg-white/30 dark:bg-black/30">
              <div className="flex items-center gap-3 min-w-0">
                <span className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-ebony-text dark:text-white">
                  <Terminal className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-medium text-ebony-text dark:text-white">
                    <span className="font-mono truncate">llms.txt</span>
                    <span className="rounded-md border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                      agent view
                    </span>
                  </h2>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-faint truncate">
                    what a crawler or coding agent reads instead of the page
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => copy(content ?? CURL)}
                  className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-medium text-ebony-text dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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
                <a
                  href="/agents"
                  className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-medium !text-ebony-text dark:!text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors !no-underline"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Full page</span>
                </a>
                <a
                  href={SOURCE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-medium !text-ebony-text dark:!text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors !no-underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Raw</span>
                </a>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-ebony-text dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close agent view"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-auto p-4 sm:p-7">
              <div className="mb-5 font-mono text-[11px] text-ink-faint">
                <span className="text-accent">$</span> {CURL}
              </div>

              {error && (
                <p className="font-mono text-sm text-ebony-text/80 dark:text-white/80">
                  Could not load {SOURCE}. Open it directly: <a href={SOURCE}>{SOURCE}</a>
                </p>
              )}

              {!content && !error && (
                <p className="font-mono text-sm text-ink-faint">fetching…</p>
              )}

              <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed text-ebony-text/90 dark:text-white/90">
                {lines.map((line, i) => (
                  <motion.span
                    key={i}
                    className="block min-h-[1.2em]"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(i * 0.012, 0.9),
                      ease: MOTION.easeOutQuart,
                    }}
                  >
                    {line}
                  </motion.span>
                ))}
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 dark:border-white/10 px-4 sm:px-6 py-3 bg-white/30 dark:bg-black/30 font-mono text-[11px] text-ebony-text/70 dark:text-white/70">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  text/plain
                </span>
                {content && <span>{lines.length} lines</span>}
                {content && <span>{content.length} chars</span>}
              </div>
              <span className="opacity-70">esc to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
