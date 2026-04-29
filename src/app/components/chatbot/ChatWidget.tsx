"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useChat } from "@/lib/useChat";
import { useTextSelection, type SelectionState } from "@/hooks/useTextSelection";
import { ChatDrawer } from "./ChatDrawer";
import { NavigationToast } from "./NavigationToast";
import { SelectionPopup } from "./SelectionPopup";

type ChatContext = {
  preview: string;
  fullText: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext | null>(null);
  const chatState = useChat();
  const selection = useTextSelection(!isOpen);

  const openBlankChat = () => {
    setChatContext(null);
    setIsOpen(true);
  };

  const openContextChat = (selected: NonNullable<SelectionState>) => {
    setChatContext({
      preview: selected.text,
      fullText: selected.fullText,
    });
    setIsOpen(true);
    window.getSelection()?.removeAllRanges();
  };

  const closeChat = () => {
    setIsOpen(false);
    setChatContext(null);
  };

  return (
    <LayoutGroup>
      {/* Toast */}
      <NavigationToast message={chatState.toastMsg} />

      {/* Text selection trigger */}
      <SelectionPopup selection={selection} onAsk={openContextChat} />

      {/* Drawer */}
      <ChatDrawer 
        isOpen={isOpen} 
        onClose={closeChat}
        chatState={chatState} 
        context={chatContext?.preview}
        messageContext={chatContext?.fullText}
        onClearContext={() => setChatContext(null)}
      />

      {/* Ambient trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="group fixed bottom-6 right-6 z-[55] flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            data-chat-surface
          >
            <motion.div
              initial={false}
              animate={{ x: 0 }}
              className="pointer-events-none relative hidden origin-right translate-x-3 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0a]/85 px-3.5 py-2 text-right opacity-0 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block"
            >
              <span className="absolute inset-y-2 right-0 w-px bg-gradient-to-b from-transparent via-teal-300/70 to-transparent" />
              <div className="text-[12px] font-medium tracking-[0.14em] text-white/80">
                wonder anything?
              </div>
              <div className="mt-0.5 text-[10px] tracking-[0.08em] text-white/35">
                ask in context
              </div>
            </motion.div>

            <motion.div
              className="relative"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <motion.span
                aria-hidden="true"
                variants={{
                  rest: { opacity: 0.28, scale: 1 },
                  hover: { opacity: 0.55, scale: 1.18 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-[-8px] rounded-full bg-teal-400/10 blur-md"
              />
              <motion.span
                aria-hidden="true"
                variants={{
                  rest: { opacity: 0.35, scale: 1 },
                  hover: { opacity: 0.75, scale: 1.1 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-teal-300/25"
              />
              <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 1.45, 1.45], opacity: [0.28, 0, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-teal-300/35"
              />
              <motion.button
                layoutId="contextual-chat-surface"
                type="button"
                onClick={openBlankChat}
                whileTap={{ scale: 0.96 }}
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.1] bg-[#0a0a0a]/90 text-teal-300 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur transition-colors duration-200 hover:border-teal-400/60 hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/60"
                aria-label="Open chat"
              >
                <span className="absolute inset-[5px] rounded-full border border-white/[0.05]" />
                <Sparkles className="relative h-5 w-5 animate-[spin_8s_linear_infinite]" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
