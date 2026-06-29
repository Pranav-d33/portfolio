"use client";

import { ArrowUpRight } from "lucide-react";
import { paperLibrary } from "@/lib/portfolioData";

const papers = Object.values(paperLibrary);

function extractArxivId(href: string) {
  const match = href.match(/abs\/(\d+\.\d+)/);
  return match ? match[1] : null;
}

export function ResearchMarquee() {
  const loop = [...papers, ...papers];

  return (
    <div className="research-marquee-wrap">
      <div className="research-marquee">
        <div className="research-marquee-track">
          {loop.map((paper, i) => {
            const index = (i % papers.length) + 1;
            const arxivId = extractArxivId(paper.href);

            return (
              <a
                key={`${paper.id}-${i}`}
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="research-marquee-item"
              >
                <div className="research-marquee-item-header">
                  <span className="research-marquee-index">
                    {String(index).padStart(2, "0")}
                  </span>
                  <span className="research-marquee-source">arXiv</span>
                  <ArrowUpRight className="research-marquee-arrow" aria-hidden="true" />
                </div>
                <h3 className="research-marquee-title">{paper.title}</h3>
                <p className="research-marquee-note">{paper.note}</p>
                {arxivId && (
                  <span className="research-marquee-id">{arxivId}</span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
