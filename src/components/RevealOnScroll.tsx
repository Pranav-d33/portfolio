"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

type Direction = "left" | "right" | "bottom";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
  bottom: { x: 0, y: 40 },
};

export function RevealOnScroll({
  children,
  className = "",
  direction = "bottom",
  delay = 0,
  duration = MOTION.standard,
  distance,
}: RevealOnScrollProps) {
  const base = directionOffset[direction];
  const x = direction === "bottom" ? 0 : (distance ?? base.x);
  const y = direction === "bottom" ? (distance ?? base.y) : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: MOTION.easeOutQuart,
      }}
    >
      {children}
    </motion.div>
  );
}
