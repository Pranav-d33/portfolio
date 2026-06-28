"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeSlideLeft } from "@/lib/motion";

interface SectionHeadingProps {
  title: string;
  label?: string;
  className?: string;
  id?: string;
}

export function SectionHeading({ title, label, className = "", id }: SectionHeadingProps) {
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
      {label && <span className="section-label block mb-3">{label}</span>}
      <h2 className="section-title">{title}</h2>
    </motion.div>
  );
}
