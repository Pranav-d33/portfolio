"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { SelectionState } from "@/hooks/useTextSelection";

type SelectionPopupProps = {
  selection: SelectionState;
  onAsk: (selection: NonNullable<SelectionState>) => void;
};

const POPUP_WIDTH = 160;
const POPUP_HEIGHT = 32;
const EDGE_GUTTER = 12;
const TOP_SAFE_AREA = 60;

export function SelectionPopup({ selection, onAsk }: SelectionPopupProps) {
  const rect = selection?.rect;
  const shouldFlipBelow = rect ? rect.top < TOP_SAFE_AREA : false;
  const rawLeft = rect ? rect.left + rect.width / 2 - POPUP_WIDTH / 2 : 0;
  const left =
    typeof window === "undefined"
      ? rawLeft
      : Math.min(
          Math.max(rawLeft, EDGE_GUTTER),
          window.innerWidth - POPUP_WIDTH - EDGE_GUTTER
        );
  const top = rect
    ? shouldFlipBelow
      ? rect.bottom + 8
      : Math.max(EDGE_GUTTER, rect.top - POPUP_HEIGHT - 12)
    : 0;

  return (
    <AnimatePresence>
      {selection && (
        <motion.button
          id="selection-popup"
          data-selection-popup
          type="button"
          initial={{ opacity: 0, y: shouldFlipBelow ? -4 : 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: shouldFlipBelow ? -2 : 2, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ top, left }}
          onClick={() => onAsk(selection)}
          className="fixed z-[70] flex h-8 w-40 items-center justify-center gap-2 rounded-lg border border-border-dim bg-background text-xs tracking-[0.04em] text-t2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-accent hover:text-t1"
          aria-label="Ask about selected text"
        >
          <span
            className={`absolute left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent ${
              shouldFlipBelow
                ? "-top-[6px] border-b-[6px] border-b-background"
                : "-bottom-[6px] border-t-[6px] border-t-background"
            }`}
            aria-hidden="true"
          />
          <Sparkles className="h-3 w-3 text-accent" />
          <span>Ask about this</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
