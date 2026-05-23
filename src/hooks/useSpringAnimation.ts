"use client";

import { useReducedMotion } from "framer-motion";

// Editorial spring settings — slow, fluid, deliberate. No bounce.
export const SPRING_EDITORIAL = { type: "spring" as const, stiffness: 180, damping: 35 };
export const SPRING_GENTLE = { type: "spring" as const, stiffness: 140, damping: 30 };
export const SPRING_HOVER = { type: "spring" as const, stiffness: 200, damping: 40 };

export const staggerContainer = (delay = 0.2) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: delay },
  },
});

export const fadeSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_EDITORIAL,
  },
} as const;

export const fadeSlideLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_EDITORIAL,
  },
} as const;

export function useSpringAnimation() {
  const prefersReducedMotion = useReducedMotion();
  return { prefersReducedMotion: !!prefersReducedMotion };
}
