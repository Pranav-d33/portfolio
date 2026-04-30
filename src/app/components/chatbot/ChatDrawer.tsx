import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Sparkles, X } from "lucide-react";
import { useChat } from "@/lib/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

type ChatDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  chatState: ReturnType<typeof useChat>;
  context?: string;
  messageContext?: string;
  onClearContext: () => void;
};

const SUGGESTED_PROMPTS = [
  "What's your strongest project?",
  "What are you looking for?",
  "How do you approach building?",
  "Tell me about your research interests"
];

export function ChatDrawer({
  isOpen,
  onClose,
  chatState,
  context,
  messageContext,
  onClearContext,
}: ChatDrawerProps) {
  const { messages, input, setInput, sendMessage, isStreaming } = chatState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasContext = Boolean(context?.trim());

  const handleSend = (text: string) => {
    sendMessage(text, hasContext ? { context: messageContext ?? context } : undefined);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          layoutId="contextual-chat-surface"
          data-chat-surface
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[60] flex h-[68vh] w-full flex-col overflow-hidden rounded-t-[20px] border border-border-dim bg-background/95 shadow-2xl shadow-black/40 backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:h-[520px] sm:w-[390px] sm:rounded-b-2xl sm:rounded-t-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-dim px-4 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-t1">Pranav</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-t3 hover:bg-foreground/5 hover:text-t1 transition-colors"
            >
              <Minus size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-dim">
            {hasContext && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-r-lg border-l-2 border-accent bg-foreground/5 px-4 py-4"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-t3">
                    Selected text
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClearContext();
                    }}
                    className="rounded-full p-2 text-t3 transition-colors hover:bg-foreground/5 hover:text-t1"
                    aria-label="Clear selected text context"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p className="line-clamp-4 text-sm italic leading-relaxed text-t2">
                  &ldquo;{context}&rdquo;
                </p>
              </motion.div>
            )}

            {messages.length === 0 && !hasContext ? (
              <div className="flex h-full flex-col justify-end pb-2">
                <motion.div 
                  initial="hidden" 
                  animate="visible" 
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 4 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      onClick={() => {
                        sendMessage(prompt);
                      }}
                      className="rounded-full border border-border-dim px-4 py-2 text-sm text-t2 transition-colors hover:bg-foreground/5 hover:text-t1"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            ) : (
              messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            disabled={isStreaming}
            placeholder={
              hasContext ? "What do you want to know about this?" : "Ask anything..."
            }
            autoFocus={isOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
