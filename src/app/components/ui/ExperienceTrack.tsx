"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
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

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 65%", "end 65%"]
  });

  const branchScaleXRaw = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const branchScaleX = useSpring(branchScaleXRaw, { stiffness: 100, damping: 25 });
  
  const dotScaleRaw = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const dotScale = useSpring(dotScaleRaw, { stiffness: 150, damping: 20 });
  
  const nodeScaleRaw = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const nodeScale = useSpring(nodeScaleRaw, { stiffness: 150, damping: 20 });

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
      >
        <motion.span
          className="experience-track-branch"
          style={{ transformOrigin: "left", y: "-50%", scaleX: branchScaleX }}
        />
        <motion.span 
          className="experience-track-node" 
          style={{ scale: nodeScale }}
        />
        <motion.span 
          className="experience-track-dot" 
          style={{ scale: dotScale }}
        />
      </motion.div>
      <div className="experience-track-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: MOTION.standard, delay: index * MOTION.staggerStandard, ease: MOTION.easeOutQuart }}
        >
          <ResumeEntry {...entry} />
        </motion.div>
      </div>
    </div>
  );
}

export function ExperienceTrack({ entries }: ExperienceTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 65%"]
  });

  const spineScaleYRaw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const spineScaleY = useSpring(spineScaleYRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={trackRef} className="experience-track">
      <motion.div
        className="experience-spine-rail"
        aria-hidden="true"
        style={{ transformOrigin: "top", scaleY: spineScaleY }}
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
