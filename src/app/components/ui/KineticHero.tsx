"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { Grainient } from "./Grainient";

const CYCLE = ["systems", "models", "tools"] as const;

function Cycler() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((v) => (v + 1) % CYCLE.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);
  const w = CYCLE[reduced ? 0 : i];
  return (
    <span className="hero-cycler" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={w}
          className="hero-cycler-word"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.6, ease: MOTION.easeOutQuart }}
        >
          {w}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const NOW = [
  { n: "01", t: "LFX’26 mentee", d: "Hyperledger Cello" },
  { n: "02", t: "Neurosymbolic SLMs", d: "Pre-train + RL" },
  { n: "03", t: "Agri-language model", d: "Knowledge graphs" },
];

// Theme-aware Grainient palette — paper tones per mode so text contrast holds.
const HERO_BG = {
  light: { color1: "#EBE7DD", color2: "#F4F1EA", color3: "#D8D2C5" },
  dark: { color1: "#222222", color2: "#1A1A1A", color3: "#374151" },
} as const;

function subscribeDark(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerDarkSnapshot() {
  return false;
}

export function KineticHero() {
  const reduced = useReducedMotion();
  const isDark = useSyncExternalStore(subscribeDark, getDarkSnapshot, getServerDarkSnapshot);
  const palette = isDark ? HERO_BG.dark : HERO_BG.light;
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % NOW.length), 3000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="hero-scratch">
      {!reduced && (
        <div className="hero-bg" aria-hidden="true">
          <Grainient
            key={isDark ? "dark" : "light"}
            color1={palette.color1}
            color2={palette.color2}
            color3={palette.color3}
            timeSpeed={0.25}
            colorBalance={0.0}
            warpStrength={1.0}
            warpFrequency={5.0}
            warpSpeed={2.0}
            warpAmplitude={50.0}
            blendAngle={0.0}
            blendSoftness={0.05}
            rotationAmount={500.0}
            noiseScale={2.0}
            grainAmount={0.1}
            grainScale={2.0}
            grainAnimated={false}
            contrast={1.1}
            gamma={1.0}
            saturation={0.7}
            centerX={0.0}
            centerY={0.0}
            zoom={0.9}
          />
        </div>
      )}
      <div className="hero-scratch-inner">
        {/* TOP — hairline, single line, no eyebrow spam */}
        <motion.div
          className="hero-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <span className="hero-top-sig">
            <span className="hero-top-mark" aria-hidden="true" />
            Pranav Dhiran
            <span className="hero-top-sep" aria-hidden="true">
              —
            </span>
            <span className="hero-top-role">AI Engineer · Researcher</span>
          </span>
          <span className="hero-top-rule" aria-hidden="true" />
        </motion.div>

        {/* CENTER — editorial split, owns viewport */}
        <div className="hero-stage">
          <motion.div
            className="hero-copy"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: MOTION.easeOutQuart, delay: 0.14 }}
          >
            <h1 className="hero-display font-degular">
              I build <Cycler />
              <span className="hero-display-line hero-display-italic">that reason.</span>
            </h1>

            <p className="hero-dek">
              I keep digging into <span className="hero-hi">rabbit holes</span>, some become
              <span className="hero-hi"> systems</span>.
            </p>

            <div className="hero-actions">
              <a href="/resume_v4.pdf" target="_blank" rel="noreferrer" className="hero-primary">
                Download resume
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
              <button type="button" onClick={() => scrollToSection("projects")} className="hero-secondary">
                Selected work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.figure
            className="hero-media"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: MOTION.easeOutQuart, delay: 0.22 }}
          >
            <div className="hero-media-frame">
              <Image
                src="/portfolio_image.jpeg"
                alt="Portrait of Pranav Dhiran"
                width={760}
                height={932}
                priority
                sizes="(max-width: 1024px) 100vw, 380px"
                className="hero-media-img"
              />
              <span className="hero-corner hero-corner--tl" aria-hidden="true" />
              <span className="hero-corner hero-corner--br" aria-hidden="true" />
            </div>
            <figcaption className="hero-media-cap">
              <span className="hero-cap-rule" aria-hidden="true" />
              Pranav Dhiran
              <span className="hero-cap-dot" aria-hidden="true" />
              <span className="hero-cap-sub">ECE + AI · 2026</span>
            </figcaption>
          </motion.figure>
        </div>

        {/* BOTTOM — anchored to viewport bottom, not floating mid-page */}
        <div className="hero-foot">
          <div className="hero-foot-left">
            <span className="hero-foot-label">Currently</span>
            <ol className="hero-foot-grid">
              {NOW.map((item, idx) => {
                const on = idx === active;
                return (
                  <li key={item.n} className={`hero-foot-item ${on ? "is-on" : ""}`}>
                    <motion.span
                      className="hero-foot-bar"
                      aria-hidden="true"
                      animate={{ scaleX: on ? 1 : 0 }}
                      transition={{ duration: 0.55, ease: MOTION.easeOutQuart }}
                      style={{ originX: 0 }}
                    />
                    <span className="hero-foot-n">{item.n}</span>
                    <span className="hero-foot-t">{item.t}</span>
                    <span className="hero-foot-d">{item.d}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {!reduced && (
            <motion.div
              className="hero-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              aria-hidden="true"
            >
              <motion.span
                className="hero-scroll-line"
                animate={{ scaleY: [0.5, 1, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originY: 0 }}
              />
              <span className="hero-scroll-txt">Scroll</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
