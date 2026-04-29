"use client";

import { useEffect, useState } from "react";

export type SelectionRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type SelectionState = {
  text: string;
  fullText: string;
  rect: SelectionRect;
} | null;

const MIN_SELECTION_LENGTH = 3;
const CONTEXT_PREVIEW_LIMIT = 300;
const DISMISS_SCROLL_DISTANCE = 40;

function isSelectionInsideIgnoredSurface(selection: Selection) {
  const node = selection.anchorNode?.parentElement;

  return Boolean(
    node?.closest("[data-chat-surface], [data-selection-popup], input, textarea")
  );
}

function toSelectionRect(range: Range): SelectionRect | null {
  const rects = Array.from(range.getClientRects()).filter(
    (rect) => rect.width > 0 && rect.height > 0
  );

  if (rects.length === 0) return null;

  const top = Math.min(...rects.map((rect) => rect.top));
  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));

  return {
    top,
    left,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}

function truncateContext(text: string) {
  if (text.length <= CONTEXT_PREVIEW_LIMIT) return text;
  return `${text.slice(0, CONTEXT_PREVIEW_LIMIT).trim()}...`;
}

export function useTextSelection(isEnabled = true) {
  const [selection, setSelection] = useState<SelectionState>(null);

  useEffect(() => {
    if (!isEnabled) return;

    let scrollStartY = window.scrollY;

    const updateSelection = () => {
      const currentSelection = window.getSelection();
      const fullText = currentSelection?.toString().trim() || "";

      if (
        !currentSelection ||
        currentSelection.rangeCount === 0 ||
        fullText.length < MIN_SELECTION_LENGTH ||
        currentSelection.isCollapsed ||
        isSelectionInsideIgnoredSurface(currentSelection)
      ) {
        setSelection(null);
        return;
      }

      const rect = toSelectionRect(currentSelection.getRangeAt(0));
      if (!rect) {
        setSelection(null);
        return;
      }

      scrollStartY = window.scrollY;
      setSelection({
        fullText,
        text: truncateContext(fullText),
        rect,
      });
    };

    const handlePointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-selection-popup]")) return;

      window.setTimeout(() => {
        const currentSelection = window.getSelection();
        if (!currentSelection?.toString().trim()) setSelection(null);
      }, 120);
    };

    const handleScroll = () => {
      if (Math.abs(window.scrollY - scrollStartY) > DISMISS_SCROLL_DISTANCE) {
        setSelection(null);
      }
    };

    document.addEventListener("selectionchange", updateSelection);
    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("selectionchange", updateSelection);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEnabled]);

  return isEnabled ? selection : null;
}
