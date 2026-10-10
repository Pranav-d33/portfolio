"use client";

import { ElementType, Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

interface TextRevealProps {
  /** Wrap words in *asterisks* to mark them as the accent: pop colour plus a drawn underline. */
  text: string;
  className?: string;
  /** Tag the words render into — h2 for section titles, p for deks. */
  as?: ElementType;
  /** Seconds between word entrances. */
  stagger?: number;
  delay?: number;
  id?: string;
}

type Segment = { accent: boolean; words: string[] };

function segment(text: string): Segment[] {
  const segments: Segment[] = [];
  let accent = false;
  for (const raw of text.split(" ")) {
    const opens = raw.startsWith("*");
    if (opens) accent = true;
    const closes = /\*[.,!?]?$/.test(raw);
    const word = raw.replace(/\*/g, "");
    const last = segments[segments.length - 1];
    if (last && last.accent === accent) last.words.push(word);
    else segments.push({ accent, words: [word] });
    if (closes) accent = false;
  }
  return segments;
}

const UNDERLINE = "M3 13 C 50 5, 112 3, 162 9 S 252 17, 297 6";

/**
 * Line-mask word reveal: each word rises out of its own clipped box with a
 * slight tilt. The clip lives on an inline-block wrapper so words still wrap
 * naturally and the text stays a single selectable/screen-readable string.
 */
export function TextReveal({
  text,
  className = "",
  as = "span",
  stagger = 0.035,
  delay = 0,
  id,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduce = useReducedMotion();
  const Tag = motion[as as keyof typeof motion] as ElementType;
  const segments = segment(text);
  const total = segments.reduce((n, s) => n + s.words.length, 0);

  if (reduce) {
    const Plain = as;
    return (
      <Plain id={id} className={className}>
        {segments.map((s, i) => (
          <Fragment key={i}>
            {s.accent ? <span className="text-reveal-accent">{s.words.join(" ")}</span> : s.words.join(" ")}
            {i < segments.length - 1 ? " " : null}
          </Fragment>
        ))}
      </Plain>
    );
  }

  let n = 0;
  const word = (w: string, accent: boolean) => (
    <span className="text-reveal-mask" key={`${w}-${n}`}>
      <motion.span
        className={accent ? "text-reveal-word text-reveal-word--accent" : "text-reveal-word"}
        variants={{
          hidden: { y: "105%", rotate: 4, opacity: 0 },
          visible: {
            y: "0%",
            rotate: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: MOTION.easeOutExpo },
          },
        }}
      >
        {w}
      </motion.span>
    </span>
  );

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {segments.map((s, si) => {
        const words = s.words.map((w, wi) => {
          const el = word(w, s.accent);
          n++;
          return (
            <Fragment key={wi}>
              {el}
              {wi < s.words.length - 1 ? " " : null}
            </Fragment>
          );
        });
        return (
          <Fragment key={si}>
            {s.accent ? (
              <span className="text-reveal-accent">
                {words}
                <svg className="text-reveal-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d={UNDERLINE}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isInView ? 1 : 0 }}
                    transition={{ duration: 0.9, ease: MOTION.easeOutExpo, delay: delay + total * stagger + 0.45 }}
                  />
                </svg>
              </span>
            ) : (
              words
            )}
            {si < segments.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
