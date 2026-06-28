"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const OPENING_QUOTE = {
  line1: "The beauty of being lost is",
  line2: ",that every direction is a new possibility",
};

interface SiteIntroProps {
  onComplete: () => void;
}

export function SiteIntro({ onComplete }: SiteIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    document.body.style.overflow = "hidden";

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 2800));
    const fontsReady =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();

    Promise.all([fontsReady, minDelay]).then(() => {
      setExiting(true);
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(onComplete, MOTION.slow * 1000);
    return () => clearTimeout(timer);
  }, [exiting, onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) onComplete();
  }, [prefersReducedMotion, onComplete]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="site-intro"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-intro-quote"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: MOTION.slow, ease: MOTION.easeStandard }}
    >
      <motion.div
        className="site-intro-content"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
        }}
      >
        <motion.span className="section-label site-intro-label" variants={fadeLine}>
          Entering
        </motion.span>

        <blockquote id="site-intro-quote" className="site-intro-quote">
          <motion.span className="site-intro-quote-line" variants={fadeLine}>
            {OPENING_QUOTE.line1}
          </motion.span>
          <motion.span className="site-intro-quote-line" variants={fadeLine}>
            {OPENING_QUOTE.line2}
          </motion.span>
        </blockquote>

        <motion.div className="site-intro-progress" aria-hidden="true" variants={fadeLine}>
          <motion.div
            className="site-intro-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1.6,
              ease: MOTION.easeStandard,
              delay: 0.3,
            }}
            style={{ transformOrigin: "left center" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const fadeLine = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.slow, ease: MOTION.easeOutExpo },
  },
};
