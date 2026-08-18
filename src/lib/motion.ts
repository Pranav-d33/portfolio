// Motion timing constants — single source of truth for editorial pacing

export const MOTION = {
  fast: 0.25,
  standard: 0.5,
  slow: 0.8,
  slowest: 1.2,

  staggerStandard: 0.1,
  staggerSlow: 0.15,

  easeStandard: [0.25, 0.1, 0.25, 1] as const,
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  easeOutExpo: [0.16, 1, 0.3, 1] as const,

  springEditorial: { type: "spring" as const, stiffness: 180, damping: 35 },
} as const;

export const SPRING_EDITORIAL = MOTION.springEditorial;

export const fadeSlideLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: SPRING_EDITORIAL,
  },
} as const;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.4 },
  },
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_EDITORIAL,
  },
} as const;
