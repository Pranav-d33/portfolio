"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { essays, talks, type Essay, type Talk } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";

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
      <div className="wt-row-index">{String(index + 1).padStart(2, "0")}</div>
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

function TalkCard({ talk, index }: { talk: Talk; index: number }) {
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
      className="wt-talk"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ ...MOTION.springEditorial, delay: index * 0.08 }}
    >
      <div className="wt-talk-thumb">
        <img
          src={talk.thumbnail}
          alt={talk.title}
          className="wt-talk-thumb-img"
          loading="lazy"
          onError={handleImgError}
        />
        <div className="wt-talk-play" aria-hidden="true">
          <div className="wt-talk-play-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>
      <div className="wt-talk-body">
        <span className="wt-talk-meta">{[talk.event, talk.date].filter(Boolean).join(" · ")}</span>
        <h3 className="wt-talk-title">{talk.title}</h3>
      </div>
    </motion.a>
  );
}

function BlockHeader({ label, count, desc }: { label: string; count: number; desc: string }) {
  return (
    <RevealOnScroll direction="bottom">
      <div className="wt-block-header">
        <div className="flex items-baseline gap-3">
          <span className="wt-block-label">{label}</span>
          <span className="wt-block-count">{String(count).padStart(2, "0")}</span>
        </div>
        <p className="wt-block-desc">{desc}</p>
      </div>
    </RevealOnScroll>
  );
}

export function WritingAndTalks() {
  return (
    <div className="wt-section">
      {essays.length > 0 && (
        <div className="wt-block">
          <BlockHeader
            label="Writing"
            count={essays.length}
            desc="Essays about training, alignment, and why I keep going back to first principles."
          />
          <div className="wt-list">
            {essays.map((e, i) => (
              <EssayRow key={e.id} essay={e} index={i} />
            ))}
          </div>
        </div>
      )}

      {talks.length > 0 && (
        <div className="wt-block">
          <BlockHeader
            label="Speaking"
            count={talks.length}
            desc="Gave lectures at IAIRO SLM++ Bootcamp (2026) — Vanilla GPT-2 Architecture & Evolution of LLM Design Decisions — Scaling Laws, Cost Accounting & Case Studies."
          />
          <div className="wt-talks">
            {talks.map((t, i) => (
              <TalkCard key={t.id} talk={t} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
