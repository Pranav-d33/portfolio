"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { academicService, profile, publications, researchInterests } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";

const EASE = MOTION.easeOutExpo;

export function ResearchProfile() {
  const reduce = useReducedMotion();
  const enter = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(6px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <div className="research-grid">
      <div className="research-col">
        <div className="research-block">
          <h3 className="research-label">Publications</h3>
          <ul className="research-list">
            {publications.map((paper, i) => (
              <motion.li key={paper.href} {...enter(i * 0.08)}>
                <a href={paper.href} target="_blank" rel="noopener noreferrer" className="pub-card">
                  <span className="pub-status">{paper.status}</span>
                  <span className="pub-title">
                    {paper.title}
                    <ArrowUpRight className="pub-arrow" aria-hidden="true" />
                  </span>
                  <span className="pub-subtitle">{paper.subtitle}</span>
                  <span className="pub-authors">
                    {paper.authors.map((name, j) => (
                      <span key={name}>
                        {name === profile.name ? <strong>{name}</strong> : name}
                        {j < paper.authors.length - 1 ? ", " : null}
                      </span>
                    ))}
                  </span>
                  <span className="pub-meta">
                    {paper.authorship} · {paper.venue}
                  </span>
                  <span className="pub-source">OpenReview</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="research-block">
          <h3 className="research-label">Peer review</h3>
          <ul className="research-list">
            {academicService.map((service, i) => (
              <motion.li key={service.href} className="service-row" {...enter(0.1 + i * 0.08)}>
                <div className="service-main">
                  <span className="service-role">{service.role}</span>
                  <span className="service-venue">{service.venue}</span>
                </div>
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-link"
                >
                  {service.linkLabel}
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="research-block">
        <h3 className="research-label">Interests</h3>
        <motion.ol
          className="interest-list"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {researchInterests.map((interest, i) => (
            <motion.li
              key={interest}
              className="interest-item"
              variants={{
                hidden: { opacity: 0, x: -14 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              <span className="interest-n">{String(i + 1).padStart(2, "0")}</span>
              {interest}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}
