import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Message } from "@/lib/useChat";

type ChatMessageProps = {
  message: Message;
  isStreaming?: boolean;
};

const THINKING_STEPS = [
  "retrieving context...",
  "analyzing query...",
  "structuring response...",
  "generating tokens...",
];

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;
  const [thinkingStep, setThinkingStep] = useState(0);

  // Cycle through thinking steps during streaming
  useEffect(() => {
    if (!isStreaming || !isEmpty) return;
    
    const interval = setInterval(() => {
      setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 800);
    
    return () => clearInterval(interval);
  }, [isStreaming, isEmpty]);

  // Reset thinking step when message changes
  useEffect(() => {
    if (!isStreaming) {
      setThinkingStep(0);
    }
  }, [message.content, isStreaming]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-2 text-sm leading-relaxed tracking-wide font-mono ${
          isUser
            ? "bg-accent text-background rounded-2xl rounded-br-sm"
            : "bg-foreground/5 text-t2 rounded-2xl rounded-bl-sm border border-border-dim/50"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="relative">
            {/* Terminal-style output with streaming effect */}
            <span className="whitespace-pre-wrap">{message.content}</span>
            
            {/* Streaming cursor - shows when actively receiving tokens */}
            {isStreaming && !isEmpty && (
              <span className="inline-block w-[2px] h-4 bg-accent animate-pulse ml-0.5 align-middle" />
            )}
            
            {/* Initial loading state - thinking indicator with cycling steps */}
            {isEmpty && (
              <div className="flex flex-col gap-1 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-accent/80 text-xs font-medium">
                    {THINKING_STEPS[thinkingStep]}
                  </span>
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
                <div className="text-t3/50 text-[10px]">
                  reasoning trace active
                </div>
              </div>
            )}
            
            {/* End-of-response marker */}
            {!isStreaming && !isEmpty && (
              <span className="text-t3/40 text-[10px] ml-1">&lt;|end|&gt;</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
