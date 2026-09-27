"use client";

import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Travel in px across the element's full scroll pass. Negative = rises faster. */
  distance?: number;
}

/** Gentle scroll-linked drift. Silent no-op under reduced motion. */
export function Parallax({ children, className = "", distance = -36 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
