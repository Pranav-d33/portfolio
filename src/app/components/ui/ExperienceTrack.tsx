"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { ResumeEntry } from "./ResumeEntry";
import { MOTION } from "@/lib/motion";
import { isTouch, prefersReducedMotion } from "@/lib/scroll";

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
    offset: ["start 65%", "end 65%"],
  });

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
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState<string | null>(null);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const svg = svgRef.current;
    if (!track || !svg) return;
    const svgRect = svg.getBoundingClientRect();

    const points = Array.from(
      track.querySelectorAll<HTMLElement>(".experience-track-row"),
    )
      .map((row) => {
        const title = row.querySelector<HTMLElement>(".resume-entry-title");
        const node = row.querySelector<HTMLElement>(".experience-track-node");
        const dot = row.querySelector<HTMLElement>(".experience-track-dot");
        if (!title || !node || !dot) return null;
        const titleRect = title.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        return {
          y: titleRect.top - svgRect.top + titleRect.height / 2,
          spineX: nodeRect.left + nodeRect.width / 2 - svgRect.left,
          dotX: dotRect.left + dotRect.width / 2 - svgRect.left,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    if (points.length === 0) return;

    const spineX = points[0].spineX;
    let d = `M ${spineX} 0 V ${svgRect.height} `;
    for (const p of points) {
      d += `M ${spineX} ${p.y} H ${p.dotX} `;
    }
    setPathD(d);
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    const raf = requestAnimationFrame(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [measure, entries]);

  useEffect(() => {
    if (!pathD) return;
    const path = pathRef.current;
    if (!path) return;
    if (isTouch() || prefersReducedMotion()) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let ctx: { revert: () => void } | null = null;
    // lazy-load GSAP only when spine is in view — no upfront bundle
    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.5,
            },
          });
        }, trackRef);
      }),
    );

    return () => {
      if (ctx) ctx.revert();
    };
  }, [pathD]);

  return (
    <div ref={trackRef} className="experience-track">
      <svg
        ref={svgRef}
        className="experience-spine-svg"
        aria-hidden="true"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {pathD && (
          <path
            ref={pathRef}
            className="experience-spine-path"
            d={pathD}
          />
        )}
      </svg>
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
