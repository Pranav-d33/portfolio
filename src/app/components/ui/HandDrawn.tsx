"use client";

import { motion, useReducedMotion } from "framer-motion";

type Variant = "circle" | "squiggle" | "underline" | "arrow";

const PATHS: Record<Variant, string> = {
  circle:
    "M 6 18 C -10 6, 10 -6, 30 0 C 50 6, 62 -2, 58 12 C 54 26, 30 34, 10 28 C -4 22, -2 13, 8 12",
  squiggle: "M 2 8 Q 12 1, 22 8 T 42 8 T 62 8 T 82 8 T 102 8",
  underline: "M 2 5 Q 15 -1, 28 5 T 54 5 T 80 5 T 106 5",
  arrow: "M 6 14 C 30 2, 60 4, 82 6 C 70 1, 60 0, 56 3 M 82 6 C 74 3, 70 4, 66 6",
};

interface HandDrawnProps {
  variant: Variant;
  className?: string;
}

export function HandDrawn({ variant, className = "" }: HandDrawnProps) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 110 28"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <motion.path
        d={PATHS[variant]}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}