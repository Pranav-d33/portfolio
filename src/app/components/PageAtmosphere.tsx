"use client";

import { useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

function subscribeDark(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerDarkSnapshot() {
  return true;
}

export function PageAtmosphere() {
  const prefersReducedMotion = useReducedMotion();
  const isDark = useSyncExternalStore(subscribeDark, getDarkSnapshot, getServerDarkSnapshot);
  const { scrollYProgress } = useScroll();

  const warmthOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    isDark ? [0.04, 0.06, 0.05, 0.05] : [0.06, 0.1, 0.08, 0.08]
  );

  const topGlowOpacity = useTransform(scrollYProgress, [0, 0.15], [0, isDark ? 0.05 : 0.08]);

  if (prefersReducedMotion) return null;

  return (
    <div className="page-atmosphere" aria-hidden="true">
      <motion.div
        className="page-atmosphere-warmth"
        style={{
          opacity: warmthOpacity,
          background: isDark
            ? "linear-gradient(180deg, var(--color-canvas-deep) 0%, var(--color-canvas) 50%, var(--color-canvas-deep) 100%)"
            : "linear-gradient(180deg, var(--color-canvas) 0%, var(--color-paper-deep) 50%, var(--color-canvas) 100%)",
        }}
      />
      <motion.div
        className="page-atmosphere-glow"
        style={{
          opacity: topGlowOpacity,
          background: isDark
            ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(100, 130, 160, 0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(251, 236, 200, 0.2) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
