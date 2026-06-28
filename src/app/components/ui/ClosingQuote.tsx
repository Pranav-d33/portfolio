"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MOTION } from "@/lib/motion";

const CLOSING_QUOTE =
  "Not everything is meant to be but everything is worth trying";

export function ClosingQuote() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section ref={ref} className="closing-quote-section" aria-label="Closing reflection">
      <motion.div
        className="closing-quote-inner"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: MOTION.slowest, ease: MOTION.easeOutExpo }}
      >
        <div className="closing-quote-rule" aria-hidden="true" />
        <blockquote className="closing-quote-text">
          <p>{CLOSING_QUOTE}</p>
        </blockquote>
        <div className="closing-quote-rule" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
