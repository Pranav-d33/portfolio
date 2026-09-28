"use client";

import { useCallback, useSyncExternalStore } from "react";

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/**
 * Reads the `dark` class off <html> — the pre-paint script in layout.tsx owns
 * the initial value. Dark is the default, so that's the server snapshot too.
 */
export function useTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  return { isDark, toggle };
}
