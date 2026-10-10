"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MOTION } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";
import { Grainient } from "./Grainient";
import { resumePath } from "@/lib/portfolioData";

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

const EASE = MOTION.easeOutExpo;

const choreo = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const lineUp = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 1, ease: EASE } },
};

const rise = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
};

function HeroPortrait({ ready, reduced }: { ready: boolean; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const show = reduced || (ready && inView);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <motion.figure
      className="hero-media"
      initial={reduced ? false : { opacity: 0 }}
      animate={show ? { opacity: 1 } : undefined}
      transition={{ duration: 0.4 }}
    >
      <div ref={ref} className="hero-media-frame">
        <motion.div
          className="hero-media-clip"
          initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={show ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.25, ease: [0.77, 0, 0.18, 1], delay: 0.15 }}
        >
          <motion.div
            className="hero-media-drift"
            style={reduced ? undefined : { y: drift }}
            initial={reduced ? false : { scale: 1.22 }}
            animate={show ? { scale: 1.1 } : undefined}
            transition={{ duration: 1.8, ease: EASE, delay: 0.15 }}
          >
            <Image
              src="/portfolio_image.jpeg"
              alt="Portrait of Pranav Dhiran"
              width={760}
              height={932}
              priority
              sizes="(max-width: 1024px) 100vw, 380px"
              className="hero-media-img"
            />
          </motion.div>
        </motion.div>
        <motion.span
          className="hero-corner hero-corner--tl"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, x: 10, y: 10 }}
          animate={show ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
        />
        <motion.span
          className="hero-corner hero-corner--br"
          aria-hidden="true"
          initial={reduced ? false : { opacity: 0, x: -10, y: -10 }}
          animate={show ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: 1.05 }}
        />
      </div>
    </motion.figure>
  );
}

export function KineticHero({ ready = true }: { ready?: boolean }) {
  const reduced = !!useReducedMotion();
  const isDark = useSyncExternalStore(subscribeDark, getDarkSnapshot, getServerDarkSnapshot);
  const palette = isDark ? HERO_BG.dark : HERO_BG.light;
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % NOW.length), 3000);
    return () => clearInterval(id);
  }, [reduced]);

  // Scroll-out: the copy lifts and dims as the hero leaves, so the page
  // reads as one continuous surface instead of a hard cut.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const play = reduced ? false : "hidden";
  const state = reduced || ready ? "visible" : "hidden";

  return (
    <div ref={heroRef} className="hero-scratch">
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
          initial={reduced ? false : { opacity: 0 }}
          animate={state === "visible" ? { opacity: 1 } : undefined}
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
          <motion.span
            className="hero-top-rule"
            aria-hidden="true"
            style={{ originX: 0 }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={state === "visible" ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
          />
        </motion.div>

        {/* CENTER — editorial split, owns viewport */}
        <div className="hero-stage">
          <motion.div
            className="hero-copy"
            style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
            variants={choreo}
            initial={play}
            animate={state}
          >
            <motion.div className="hero-avatar-row" variants={rise}>
              <img src="/avatar.jpg" alt="" className="hero-avatar" width={72} height={72} />
            </motion.div>

            <h1 className="hero-display font-degular">
              <span className="hero-line">
                <motion.span className="hero-line-inner" variants={lineUp}>
                  I build <Cycler />
                </motion.span>
              </span>
              <span className="hero-line">
                <motion.span className="hero-line-inner hero-display-italic" variants={lineUp}>
                  that reason.
                </motion.span>
              </span>
            </h1>

            <motion.p className="hero-dek" variants={rise}>
              I keep digging into <span className="hero-hi">rabbit holes</span>, some become
              <span className="hero-hi"> systems</span>.
            </motion.p>

            <motion.div className="hero-accolade" variants={rise}>
              <span className="hero-accolade-tag">Accepted</span>
              <p className="hero-accolade-body">
                <span className="hero-accolade-title">Navigate, Don’t Generate</span>
                <span className="hero-accolade-meta">
                  First author · NeurIPS 2026, AI4Good Workshop
                </span>
              </p>
            </motion.div>

            <motion.div className="hero-actions" variants={rise}>
              <a href={resumePath} target="_blank" rel="noreferrer" className="hero-primary">
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
            </motion.div>
          </motion.div>

          <HeroPortrait ready={ready} reduced={reduced} />
        </div>

        {/* BOTTOM — anchored to viewport bottom, not floating mid-page */}
        <motion.div
          className="hero-foot"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={state === "visible" ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
        >
          <div className="hero-foot-left">
            <span className="hero-foot-label">Currently</span>
            {/* When the cycle runs, phones show only the active item — all three
                still come round. With reduced motion nothing rotates, so they
                all stay on screen instead. */}
            <ol className={`hero-foot-grid ${reduced ? "" : "is-rotating"}`}>
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
        </motion.div>
      </div>
    </div>
  );
}
