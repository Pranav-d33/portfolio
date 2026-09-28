"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { essays, speakingSeries, talks, type Essay } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";

/* ══════════════════════════════════════════════
   Speaking — two sessions, so give them the room.
   The credential is the series, not the video count.
   ══════════════════════════════════════════════ */

function TalkFeature({ talk, index }: { talk: (typeof talks)[number]; index: number }) {
  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.src.includes("maxresdefault")) img.src = img.src.replace("maxresdefault", "hqdefault");
    else if (img.src.includes("hqdefault")) img.src = img.src.replace("hqdefault", "mqdefault");
  }

  return (
    <motion.a
      href={talk.href}
      target="_blank"
      rel="noopener noreferrer"
      className="talk-feature"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...MOTION.springEditorial, delay: index * 0.1 }}
    >
      <div className="talk-feature__frame">
        <img
          src={talk.thumbnail}
          alt={talk.title}
          className="talk-feature__still"
          loading="lazy"
          onError={handleImgError}
        />
        <span className="talk-feature__scrim" aria-hidden="true" />
        <span className="talk-feature__play" aria-hidden="true">
          <Play className="w-5 h-5" fill="currentColor" strokeWidth={0} />
        </span>
        {talk.session && <span className="talk-feature__session">{talk.session}</span>}
      </div>

      <div className="talk-feature__body">
        <h3 className="talk-feature__title">{talk.title}</h3>
        <p className="talk-feature__dek">{talk.dek}</p>
        <span className="talk-feature__cta">
          Watch the session
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

/* ══════════════════════════════════════════════
   Writing — an index built to grow. No thumbnails
   in the row; the cursor carries them instead.
   ══════════════════════════════════════════════ */

function EssayRow({
  essay,
  index,
  onEnter,
  onLeave,
}: {
  essay: Essay;
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.a
      href={essay.href}
      target="_blank"
      rel="noopener noreferrer"
      className="essay-row"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ ...MOTION.springEditorial, delay: Math.min(index * 0.05, 0.3) }}
    >
      <span className="essay-row__index">{String(index + 1).padStart(2, "0")}</span>
      <span className="essay-row__body">
        <span className="essay-row__title">{essay.title}</span>
        <span className="essay-row__dek">{essay.dek}</span>
      </span>
      <span className="essay-row__meta">
        <span className="essay-row__venue">{essay.venue}</span>
        <span className="essay-row__stamp">
          {essay.date}
          {essay.readTime ? ` · ${essay.readTime}` : ""}
        </span>
      </span>
      <ArrowUpRight className="essay-row__arrow" aria-hidden="true" />
    </motion.a>
  );
}

/** Floats the hovered essay's cover beside the cursor. */
function CursorPreview({ essay }: { essay: Essay | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.6 });
  const velocityX = useVelocity(springX);
  const rotate = useTransform(velocityX, [-1200, 0, 1200], [-9, 0, 9], { clamp: true });
  const smoothRotate = useSpring(rotate, { stiffness: 220, damping: 26 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 90);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="essay-preview"
      aria-hidden="true"
      style={{ x: springX, y: springY, rotate: smoothRotate }}
    >
      <AnimatePresence>
        {essay && (
          <motion.div
            key={essay.id}
            className="essay-preview__inner"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.26, ease: MOTION.easeOutExpo }}
          >
            <img src={essay.thumbnail} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WritingAndTalks() {
  const [active, setActive] = useState<Essay | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="wt-section">
      {talks.length > 0 && (
        <section className="wt-speaking">
          <header className="wt-lede">
            <span className="wt-lede__label">Speaking</span>
            <h3 className="wt-lede__headline">
              {talks.length === 2 ? "Two sessions" : `${talks.length} sessions`} taught at the{" "}
              <em>{speakingSeries.name}</em>
            </h3>
            <p className="wt-lede__sub">
              {speakingSeries.cohort} · {speakingSeries.year} — {speakingSeries.blurb}
            </p>
          </header>

          <div className="talk-grid">
            {talks.map((talk, i) => (
              <TalkFeature key={talk.id} talk={talk} index={i} />
            ))}
          </div>
        </section>
      )}

      {essays.length > 0 && (
        <section className="wt-writing">
          <header className="wt-lede wt-lede--tight">
            <span className="wt-lede__label">Writing</span>
            <h3 className="wt-lede__headline">
              Essays on training, alignment, and going back to first principles
            </h3>
            <span className="wt-lede__count">
              {String(essays.length).padStart(2, "0")} published
            </span>
          </header>

          <div className="essay-index">
            {essays.map((essay, i) => (
              <EssayRow
                key={essay.id}
                essay={essay}
                index={i}
                onEnter={() => setActive(essay)}
                onLeave={() => setActive((cur) => (cur?.id === essay.id ? null : cur))}
              />
            ))}
          </div>
        </section>
      )}

      {!reduce && <CursorPreview essay={active} />}
    </div>
  );
}
