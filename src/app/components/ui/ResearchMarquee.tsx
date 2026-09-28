"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { paperLibrary } from "@/lib/portfolioData";

const papers = Object.values(paperLibrary);

/** px/s the track drifts at when the page is still. */
const BASE_VELOCITY = -28;

function extractArxivId(href: string) {
  const match = href.match(/abs\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function PaperCard({ paper, index }: { paper: (typeof papers)[number]; index: number }) {
  const arxivId = extractArxivId(paper.href);

  return (
    <a
      href={paper.href}
      target="_blank"
      rel="noopener noreferrer"
      className="research-marquee-item"
    >
      <div className="research-marquee-item-header">
        <span className="research-marquee-index">{String(index).padStart(2, "0")}</span>
        <span className="research-marquee-source">arXiv</span>
        <ArrowUpRight className="research-marquee-arrow" aria-hidden="true" />
      </div>
      <h3 className="research-marquee-title">{paper.title}</h3>
      <p className="research-marquee-note">{paper.note}</p>
      {arxivId && <span className="research-marquee-id">{arxivId}</span>}
    </a>
  );
}

export function ResearchMarquee() {
  const loop = [...papers, ...papers];
  const reduce = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewRef, { margin: "200px 0px" });
  const [hovered, setHovered] = useState(false);

  // Scroll velocity feeds the drift: scrolling down pushes the track along,
  // scrolling up drags it back. Springing it keeps the reaction from snapping.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 340,
  });
  // Clamped: desktop scroll arrives smoothed by Lenis, but touch flings deliver
  // raw velocities many times higher — unclamped, those made the track lurch.
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-5, 1, 5], {
    clamp: true,
  });
  // Slight lean in the direction of travel — the paper "gives" a little.
  const skew = useTransform(smoothVelocity, [-1800, 0, 1800], [2.5, 0, -2.5], {
    clamp: true,
  });
  const smoothSkew = useSpring(skew, { damping: 40, stiffness: 200 });

  const x = useMotionValue(0);
  const percent = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const width = wrapRef.current?.scrollWidth ?? 0;
    if (!width) return;
    const half = width / 2;
    const factor = hovered ? 0.12 : 1;
    const moveBy = BASE_VELOCITY * (delta / 1000) * velocityFactor.get() * factor;
    percent.set(percent.get() + moveBy);
    x.set(wrap(-half, 0, percent.get()));
  });

  return (
    <div className="research-marquee-wrap" ref={viewRef}>
      <motion.div className="research-marquee" style={reduce ? undefined : { skewX: smoothSkew }}>
        <motion.div
          ref={wrapRef}
          className={`research-marquee-track${reduce ? "" : " research-marquee-track--js"}`}
          style={reduce ? undefined : { x }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {loop.map((paper, i) => (
            <PaperCard key={`${paper.id}-${i}`} paper={paper} index={(i % papers.length) + 1} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
