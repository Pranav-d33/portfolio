"use client";

import { ElementType, Fragment, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Tag the words render into — h2 for section titles, p for deks. */
  as?: ElementType;
  /** Seconds between word entrances. */
  stagger?: number;
  delay?: number;
  id?: string;
}

/**
 * Line-mask word reveal: each word rises out of its own clipped box.
 * The clip lives on an inline-block wrapper so words still wrap naturally
 * and the text stays a single selectable/screen-readable string.
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

  if (reduce) {
    const Plain = as;
    return (
      <Plain id={id} className={className}>
        {text}
      </Plain>
    );
  }

  const words = text.split(" ");

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
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="text-reveal-mask">
            <motion.span
              className="text-reveal-word"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.7, ease: MOTION.easeOutExpo },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
