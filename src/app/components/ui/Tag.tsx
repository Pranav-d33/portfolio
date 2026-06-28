"use client";

import React from "react";
import { motion } from "framer-motion";
import { SPRING_EDITORIAL } from "@/lib/motion";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className = "" }: TagProps) {
  return (
    <motion.span
      className={`tag font-mono ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING_EDITORIAL}
    >
      {children}
    </motion.span>
  );
}

export function Tags({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>;
}
