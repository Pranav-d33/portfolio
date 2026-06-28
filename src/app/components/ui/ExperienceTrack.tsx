"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ResumeEntry } from "./ResumeEntry";
import { MOTION } from "@/lib/motion";

type ExperienceEntry = {
  title: string;
  org?: React.ReactNode;
  date?: string;
  description?: string;
  details?: string[];
};

interface ExperienceTrackProps {
  entries: ExperienceEntry[];
}

function ExperienceRow({
  entry,
  index,
}: {
  entry: ExperienceEntry;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-18% 0px -18% 0px" });
  const [branchTop, setBranchTop] = useState<number | null>(null);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const title = row.querySelector<HTMLElement>(".resume-entry-title");
    if (!title) return;
    const rowRect = row.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    setBranchTop(titleRect.top - rowRect.top + titleRect.height / 2);
  }, []);

  useLayoutEffect(() => {
    measure();
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, entry.title]);

  return (
    <div ref={rowRef} className="experience-track-row">
      <motion.div
        className="experience-track-marker"
        aria-hidden="true"
        style={
          branchTop !== null
            ? ({ "--branch-top": `${branchTop}px` } as React.CSSProperties)
            : undefined
        }
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: MOTION.fast, ease: MOTION.easeOutQuart }}
      >
        <motion.span
          className="experience-track-branch"
          style={{ transformOrigin: "left", y: "-50%" }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: MOTION.easeOutQuart, delay: 0.2 }}
        />
        <span className="experience-track-node" />
        <span className="experience-track-dot" />
      </motion.div>
      <div className="experience-track-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: MOTION.standard, delay: index * MOTION.staggerSlow, ease: MOTION.easeOutQuart }}
        >
          <ResumeEntry {...entry} />
        </motion.div>
      </div>
    </div>
  );
}

export function ExperienceTrack({ entries }: ExperienceTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(trackRef, { once: true, margin: "-5% 0px" });

  return (
    <div ref={trackRef} className="experience-track">
      <motion.div
        className="experience-spine-rail"
        aria-hidden="true"
        style={{ transformOrigin: "top" }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: MOTION.easeOutExpo }}
      />
      {entries.map((entry, i) => (
        <ExperienceRow
          key={entry.title}
          entry={entry}
          index={i}
        />
      ))}
    </div>
  );
}
