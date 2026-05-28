"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
}

export function ScrollReveal({
  children,
  className = "",
  y = 40,
  x = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const xTransform = useTransform(scrollYProgress, [0, 1], [x, 0]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.25, 1], [0, 0.2, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: yTransform,
        x: xTransform,
        opacity: opacityTransform,
        overflow: 'visible' as const,
      }}
    >
      {children}
    </motion.div>
  );
}
