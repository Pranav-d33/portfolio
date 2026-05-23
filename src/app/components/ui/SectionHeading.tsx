"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeSlideLeft } from "@/hooks/useSpringAnimation";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
}

export function SectionHeading({ title, subtitle, className = "", id }: SectionHeadingProps) {
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
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}
