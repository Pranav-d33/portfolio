"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { MOTION } from "@/lib/motion";

interface HeroParallaxProps {
  photos: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function HeroParallax({ photos, content, className = "" }: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, MOTION.springEditorial);
  const springY = useSpring(rawY, MOTION.springEditorial);

  const rotateY = useTransform(springX, [-1, 1], [-1.5, 1.5]);
  const rotateX = useTransform(springY, [-1, 1], [1.5, -1.5]);
  const photoX = useTransform(springX, [-1, 1], [-12, 12]);
  const photoY = useTransform(springY, [-1, 1], [-12, 12]);
  const textX = useTransform(springX, [-1, 1], [5, -5]);
  const textY = useTransform(springY, [-1, 1], [5, -5]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const photoScrollY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const textScrollY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex flex-col"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={`relative w-full h-full hero-parallax ${className}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div style={{ y: photoScrollY }}>
          <motion.div
            style={{
              x: photoX,
              y: photoY,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {photos}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: textScrollY, opacity: textOpacity }}>
          <motion.div style={{ x: textX, y: textY, willChange: "transform" }}>
            {content}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
