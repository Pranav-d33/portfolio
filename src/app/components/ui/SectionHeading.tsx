"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeSlideLeft } from "@/lib/motion";

interface SectionHeadingProps {
  title: string;
  label?: string;
  chapter?: string;
  className?: string;
  id?: string;
}

export function SectionHeading({ title, label, chapter, className = "", id }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`section-header ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeSlideLeft}
    >
      {(chapter || label) && (
        <div className="flex items-center gap-3 mb-4">
          {chapter && (
            <span className="font-meta !text-[10px] tracking-[0.24em] text-ink-faint uppercase">
              {chapter}
            </span>
          )}
          {chapter && label && (
            <span className="h-px w-8 bg-rule flex-shrink-0" aria-hidden="true" />
          )}
          {label && (
            <span className="font-meta !text-[10px] tracking-[0.24em] text-ink-faint uppercase">
              {label}
            </span>
          )}
        </div>
      )}
      <h2 className="section-title">{title}</h2>
    </motion.div>
  );
}
