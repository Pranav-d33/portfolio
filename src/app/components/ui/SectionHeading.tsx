"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MOTION } from "@/lib/motion";
import { TextReveal } from "@/components/TextReveal";

interface SectionHeadingProps {
  title: string;
  className?: string;
  id?: string;
  /** Hide the hairline that draws in under the title. */
  rule?: boolean;
}

export function SectionHeading({ title, className = "", id, rule = true }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <div ref={ref} id={id} className={`section-header ${className}`}>
      <TextReveal as="h2" text={title} className="section-title" />
      {rule && (
        <motion.span
          className="section-rule"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: MOTION.slowest, ease: MOTION.easeOutExpo, delay: 0.15 }}
        />
      )}
    </div>
  );
}
