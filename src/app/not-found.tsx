"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION.springEditorial}
        className="flex w-full max-w-[720px] flex-col items-center text-center"
      >
        {/* Anime SVG — replace the placeholder with your SVG */}
        <div
          className="mb-10 flex h-56 w-56 items-center justify-center rounded-lg border border-dashed border-fog-border text-[11px] tracking-[0.2em] text-stone-text"
          aria-label="404 illustration"
        >
          ANIME SVG
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-stone-text">
          Lost in a rabbit hole
        </p>

        <h1 className="font-degular text-display-xl leading-display-xl text-ebony-text">
          404
        </h1>

        <p className="mt-6 max-w-md text-body leading-body text-graphite-text">
          The beauty of being lost is that every direction is a new possibility.
          This page just didn&rsquo;t materialize into one.
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={MOTION.springEditorial}
          className="mt-10"
        >
          <Link
            href="/"
            className="cta-button dark:bg-white dark:text-black"
          >
            Back home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}