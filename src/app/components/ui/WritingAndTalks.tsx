"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { essays, talks, type Essay, type Talk } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const ESSAY_LIST_THRESHOLD = 4; // switch to prose rows once ≥ this many essays

type CardEntry = {
  kind: "essay" | "talk";
  title: string;
  dek: string;
  meta: string; // "venue · date · duration"
  href: string;
  thumbnail: string;
  cta: string;
};

function toCard(e: Essay | Talk, kind: "essay" | "talk"): CardEntry {
  if (kind === "essay") {
    const es = e as Essay;
    return {
      kind,
      title: es.title,
      dek: es.dek,
      meta: [es.venue, es.date, es.readTime && `${es.readTime} read`].filter(Boolean).join(" · "),
      href: es.href,
      thumbnail: es.thumbnail,
      cta: "Read essay",
    };
  }
  const tk = e as Talk;
  return {
    kind,
    title: tk.title,
    dek: tk.dek,
    meta: [tk.event, tk.date].filter(Boolean).join(" · "),
    href: tk.href,
    thumbnail: tk.thumbnail,
    cta: "Watch session",
  };
}

function Card({ entry, index }: { entry: CardEntry; index: number }) {
  function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.src.includes("maxresdefault")) img.src = img.src.replace("maxresdefault", "hqdefault");
    else if (img.src.includes("hqdefault")) img.src = img.src.replace("hqdefault", "mqdefault");
  }

  const typeLabel = entry.kind === "essay" ? "Essay" : "Session";

  return (
    <motion.a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      className="wt-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...MOTION.springEditorial, delay: index * 0.08 }}
    >
      <div className="wt-card-thumb">
        <img
          src={entry.thumbnail}
          alt={entry.title}
          className="wt-card-thumb-img"
          loading="lazy"
          onError={handleImgError}
        />
        {entry.kind === "talk" && (
          <div className="wt-card-play" aria-hidden="true">
            <div className="wt-card-play-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
        <span className="wt-card-type">{typeLabel}</span>
      </div>

      <div className="wt-card-body">
        <span className="wt-card-meta">{entry.meta}</span>
        <h3 className="wt-card-title">{entry.title}</h3>
        <p className="wt-card-dek">{entry.dek}</p>
        <span className="wt-card-cta">
          {entry.cta}
          <ArrowUpRight className="wt-card-arrow" aria-hidden="true" />
        </span>
      </div>
    </motion.a>
  );
}

/* Prose row — used once essays.length ≥ ESSAY_LIST_THRESHOLD */
function EssayRow({ essay, index }: { essay: Essay; index: number }) {
  return (
    <motion.a
      href={essay.href}
      target="_blank"
      rel="noopener noreferrer"
      className="wt-row"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...MOTION.springEditorial, delay: index * 0.05 }}
    >
      <div className="wt-row-main">
        <span className="wt-row-title">{essay.title}</span>
        <span className="wt-row-dek">{essay.dek}</span>
      </div>
      <div className="wt-row-right">
        <span className="wt-row-meta">{essay.venue}</span>
        <span className="wt-row-date">{essay.date}</span>
        <ArrowUpRight className="wt-row-arrow" aria-hidden="true" />
      </div>
    </motion.a>
  );
}

function BlockHeader({ label, desc }: { label: string; desc: string }) {
  return (
    <RevealOnScroll direction="bottom">
      <div className="wt-block-header">
        <span className="wt-block-label">{label}</span>
        <p className="wt-block-desc">{desc}</p>
      </div>
    </RevealOnScroll>
  );
}

export function WritingAndTalks() {
  const useProseList = essays.length >= ESSAY_LIST_THRESHOLD;

  return (
    <div className="wt-section">
      {/* Writing */}
      {essays.length > 0 && (
        <div className="wt-block">
          <BlockHeader
            label="Writing"
            desc="Thinking out loud — same act as building, different medium."
          />
          {useProseList ? (
            <div className="wt-list">
              {essays.map((e, i) => (
                <EssayRow key={e.id} essay={e} index={i} />
              ))}
            </div>
          ) : (
            <div className="wt-grid">
              {essays.map((e, i) => (
                <Card key={e.id} entry={toCard(e, "essay")} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Speaking */}
      {talks.length > 0 && (
        <div className="wt-block">
          <BlockHeader
            label="Speaking"
            desc="Sessions and lectures — building in public, out loud."
          />
          <div className="wt-grid">
            {talks.map((t, i) => (
              <Card key={t.id} entry={toCard(t, "talk")} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
