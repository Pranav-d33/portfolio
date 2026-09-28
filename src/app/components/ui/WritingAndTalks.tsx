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
import { essays, talks, type Essay, type Talk } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";

type FeedItem = {
  id: string;
  kind: "essay" | "talk";
  title: string;
  dek: string;
  source: string;
  date: string;
  tail?: string;
  href: string;
  thumbnail: string;
};

const fromEssay = (essay: Essay): FeedItem => ({
  id: essay.id,
  kind: "essay",
  title: essay.title,
  dek: essay.dek,
  source: essay.venue,
  date: essay.date,
  tail: essay.readTime,
  href: essay.href,
  thumbnail: essay.thumbnail,
});

const fromTalk = (talk: Talk): FeedItem => ({
  id: talk.id,
  kind: "talk",
  title: talk.title,
  dek: talk.dek,
  source: talk.event,
  date: talk.date,
  tail: talk.duration,
  href: talk.href,
  thumbnail: talk.thumbnail,
});

/** Trailing 4-digit year, so "Aug 2026" and "2026" sort together. */
function year(date: string) {
  const match = date.match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
}

/** One feed, newest year first, authored order preserved inside a year. */
const feed: FeedItem[] = [...essays.map(fromEssay), ...talks.map(fromTalk)].sort(
  (a, b) => year(b.date) - year(a.date),
);

const essayCount = feed.filter((item) => item.kind === "essay").length;
const talkCount = feed.length - essayCount;

function FeedRow({
  item,
  index,
  onEnter,
  onLeave,
}: {
  item: FeedItem;
  index: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const isTalk = item.kind === "talk";

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.src.includes("maxresdefault")) img.src = img.src.replace("maxresdefault", "hqdefault");
    else if (img.src.includes("hqdefault")) img.src = img.src.replace("hqdefault", "mqdefault");
  }

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wt-item wt-item--${item.kind}`}
      // a talk already shows its still; only an essay's media needs the cursor
      onMouseEnter={isTalk ? undefined : onEnter}
      onMouseLeave={isTalk ? undefined : onLeave}
      onFocus={isTalk ? undefined : onEnter}
      onBlur={isTalk ? undefined : onLeave}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ ...MOTION.springEditorial, delay: index * 0.06 }}
    >
      <span className="wt-item-index">{String(index + 1).padStart(2, "0")}</span>

      <span className={`wt-item-kind wt-item-kind--${item.kind}`}>
        {isTalk && <Play className="w-[9px] h-[9px]" fill="currentColor" strokeWidth={0} />}
        {item.kind}
      </span>

      {/* The slot that separates the two: a talk shows footage, an essay
          shows the one thing footage can't — how long it asks for. */}
      {isTalk ? (
        <span className="wt-item-still" aria-hidden="true">
          <img src={item.thumbnail} alt="" loading="lazy" onError={handleImgError} />
          <span className="wt-item-still-play">
            <Play className="w-3 h-3" fill="currentColor" strokeWidth={0} />
          </span>
        </span>
      ) : (
        <span className="wt-item-length" aria-hidden="true">
          {item.tail ? (
            <>
              <span className="wt-item-length-num">{item.tail.replace(/\s*min$/i, "")}</span>
              <span className="wt-item-length-unit">min read</span>
            </>
          ) : (
            <span className="wt-item-length-unit">essay</span>
          )}
        </span>
      )}

      <span className="wt-item-main">
        <span className="wt-item-title">{item.title}</span>
        <span className="wt-item-dek">{item.dek}</span>
      </span>

      <span className="wt-item-meta">
        <span className="wt-item-source">{item.source}</span>
        <span className="wt-item-stamp">{item.date}</span>
      </span>

      <ArrowUpRight className="wt-item-arrow" aria-hidden="true" />
    </motion.a>
  );
}

/** Floats the hovered row's media next to the cursor, leaning into the motion. */
function CursorPreview({ item }: { item: FeedItem | null }) {
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
      className="wt-preview"
      aria-hidden="true"
      style={{ x: springX, y: springY, rotate: smoothRotate }}
    >
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            className="wt-preview-inner"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.26, ease: MOTION.easeOutExpo }}
          >
            <img src={item.thumbnail} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WritingAndTalks() {
  const [active, setActive] = useState<FeedItem | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="wt-section">
      <div className="wt-ledger">
        <span className="wt-ledger-count">{String(feed.length).padStart(2, "0")}</span>
        <span className="wt-ledger-split">
          {essayCount} essays · {talkCount} talks
        </span>
        <span className="wt-ledger-hint">
          Essays about training, alignment, and going back to first principles — and the lectures
          where I had to say it out loud.
        </span>
      </div>

      <div className="wt-list">
        {feed.map((item, i) => (
          <FeedRow
            key={item.id}
            item={item}
            index={i}
            onEnter={() => setActive(item)}
            onLeave={() => setActive((current) => (current?.id === item.id ? null : current))}
          />
        ))}
      </div>

      {!reduce && <CursorPreview item={active} />}
    </div>
  );
}
