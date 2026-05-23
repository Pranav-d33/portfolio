"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 120, damping: 30, mass: 0.2 });

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const p = Math.min(scrollTop / docHeight, 1);
        setProgress(p);
        scaleX.set(p);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  if (progress === 0) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-ebony-text pointer-events-none origin-left"
      style={{ scaleX }}
    />
  );
}
