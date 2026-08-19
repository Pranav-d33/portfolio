"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { staggerContainer, fadeUp, MOTION } from "@/lib/motion";
import { SystemPromptModal } from "./SystemPromptModal";
import { ChatWidget } from "./chatbot/ChatWidget";
import { Sidebar } from "./navigation/Sidebar";
import { MobileNav } from "./navigation/MobileNav";
import { ScrollProgress } from "./navigation/ScrollProgress";
import { SectionHeading } from "./ui/SectionHeading";
import { HeroParallax } from "./ui/HeroParallax";
import { ExperienceTrack } from "./ui/ExperienceTrack";
import { ProjectsShowcase } from "./ui/ProjectsShowcase";
import { ResearchMarquee } from "./ui/ResearchMarquee";
import { ClosingQuote } from "./ui/ClosingQuote";
import { WritingAndTalks } from "./ui/WritingAndTalks";

function useActiveSection() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const onScroll = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
      const anchor = window.innerHeight * 0.32;
      let current = "about";
      let closest = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const dist = Math.abs(rect.top - anchor);
        if (rect.top <= anchor && rect.bottom >= 96 && dist < closest) {
          closest = dist;
          current = section.id;
        }
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

const experienceEntries = [
  {
    title: "LFX Mentee",
    org: <span className="org-underline">Hyperledger Cello · Linux Foundation</span>,
    date: "Jun 2026 – Present",
    description:
      "Fabric has an operations problem: steep learning curve, verbose tooling, too much that shouldn't require an expert. I'm building an agent that collapses that — natural language in, Cello API call sequence out, operation executed. The hard part isn't the LLM; it's knowing which API calls compose into what the user actually meant.",
    details: [
      "Designing an AI agent that takes natural language, reasons over Cello API call sequences, and executes operations — eliminating manual dashboard interaction",
      "Hyperledger Cello manages the full lifecycle of Hyperledger Fabric networks",
    ],
  },
  {
    title: "AI Research Intern",
    org: <span className="org-underline">IRT, University of South Carolina</span>,
    date: "Apr 2026 – Present",
    description:
      "The bet here is that small models with symbolic constraints can do things large models can't — not in spite of their size, but because of it. Working on pre-training pipelines that bake reasoning structure in from the start, and RL-based alignment (GRPO/RLHF) that shapes behaviour without erasing the model's edge.",
    details: [
      "Researching neurosymbolic SLM architecture and pre-training pipelines — integrating symbolic reasoning constraints into small language model training for structured knowledge tasks",
      "Working on RL-based fine-tuning (GRPO/RLHF) for SLM alignment — reward modeling, policy optimization, and evaluation on neurosymbolic reasoning benchmarks",
    ],
  },
  {
    title: "Open Source Contributor",
    org: <span className="org-underline">Meshery — CNCF Sandbox Project</span>,
    date: "Mar 2026 – Present",
    description:
      "Five-plus merged PRs into a CNCF sandbox project — service mesh management, UI components, API work across a Go backend and React frontend. The PRs matter less than what you absorb reading other people's production code at scale.",
    details: [
      "5+ merged PRs — service mesh management features, UI components, and API integrations across Go backend and React frontend",
      "Active in code reviews, issue triage, and community discussions per CNCF contributor guidelines",
    ],
  },
];

interface HomeClientProps {
  mainRef?: React.RefObject<HTMLElement | null>;
  introComplete?: boolean;
}

export default function HomeClient({ mainRef, introComplete = true }: HomeClientProps) {
  const activeSection = useActiveSection();
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const experienceRef = useRef<HTMLElement>(null);
  const internalMainRef = useRef<HTMLElement>(null);
  const resolvedMainRef = mainRef ?? internalMainRef;

  return (
    <>
      <ScrollProgress />
      <Sidebar activeSection={activeSection} />
      <MobileNav activeSection={activeSection} />

      <main
        ref={resolvedMainRef}
        tabIndex={introComplete ? -1 : undefined}
        className="min-h-screen pt-20 px-6 lg:px-12 w-full relative outline-none"
      >
        <div className="w-full">
          {/* ═══ HERO / INTRO ═══ */}
          <section className="hero-section mb-12">
            <HeroParallax
              photos={
                <div className="hero-images">
                  <div className="hero-image-pair">
                    <figure className="hero-image studio" />
                    <figure className="hero-image daniel" />
                  </div>
                </div>
              }
              content={
                <div className="hero-content prose prose-lg font-degular w-full max-w-lg ml-auto pt-[6vh] lg:pt-0 dark:prose-invert">
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <motion.h2
                      className="home-subtitle mt-0"
                      variants={fadeUp}
                    >
                      AI Engineer &amp; Researcher
                    </motion.h2>
                    <motion.div className="introduction" variants={fadeUp}>
                      <span className="callout">
                        I keep digging into <span className="intro-underline">rabbit holes</span>, some become{" "}
                        <span className="intro-strong">systems</span>.
                      </span>
                    </motion.div>
                    <motion.ul className="intro-recent" variants={fadeUp} aria-label="Recent work">
                      <li className="intro-recent-label">Recently</li>
                      <li>LFX&apos;26 @ Hyperledger Cello</li>
                      <li>Active contributor to Meshery (CNCF)</li>
                      <li>Researching and prototyping domain-specific small language models</li>
                    </motion.ul>
                    <motion.a
                      href="/resume_v4.pdf"
                      download
                      className="cta-button dark:bg-white dark:text-black mt-6"
                      variants={fadeUp}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={MOTION.springEditorial}
                    >
                      Download resume
                    </motion.a>
                  </motion.div>
                </div>
              }
            />
          </section>

          {/* ═══ ABOUT ═══ */}
          <section id="about" className="section about-section relative py-[180px]">
            <SectionHeading title="About" label="Background & focus" className="max-w-4xl mx-auto" />
            <div className="relative w-full mt-12 max-w-[1284px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full">
                <RevealOnScroll direction="left" className="shrink-0 mx-auto lg:mx-0">
                  <div className="flip-card w-[340px] h-[340px] mb-6 lg:mb-0">
                    <div className="flip-card-inner h-full">
                      <div className="flip-card-front rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/football.jpeg"
                          alt="Playing football"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                      <div className="flip-card-back rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img
                          src="/anime_.jpeg"
                          alt="Anime"
                          className="w-full h-full object-contain"
                          style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                        />
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                <div className="flex-1 w-full max-w-4xl mx-auto lg:mx-0">
                  <div className="grid md:grid-cols-2 gap-12">
                    <RevealOnScroll direction="bottom">
                      <div className="lg:flex lg:flex-col lg:min-h-[340px]">
                        <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure mb-4 lg:mb-0">
                          Everything started with a question about what lives inside a signal — not the carrier wave, but the structure underneath. RF taught me that meaning is always encoded, never obvious. Language turned out to be the same problem at a higher layer. Now I build at both ends: systems that can parse a noisy channel and systems that can reason about what they find.
                        </p>
                        <div className="hidden lg:block flex-1" />
                        <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure">
                          Final-year B.Tech, Electronics & Telecom at SGGSIE&T Nanded. Tier-3 college, self-taught in most of what matters.
                        </p>
                      </div>
                    </RevealOnScroll>

                    <RevealOnScroll direction="right">
                      <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-16">
                        Recognition
                      </h3>
                      <ul className="space-y-5 about-achievements">
                        {[
                          "Twice took a team to the Smart India Hackathon national finals — 2024 and 2025.",
                          "Top 6 globally at UWA Hack For Impact 2026.",
                        ].map((a, i) => (
                          <motion.li
                            key={a}
                            className="text-body text-ebony-text/70 dark:text-white/50 leading-body pl-4 border-l-2 border-ebony-text"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              ...MOTION.springEditorial,
                              delay: i * MOTION.staggerStandard,
                            }}
                          >
                            {a}
                          </motion.li>
                        ))}
                      </ul>
                    </RevealOnScroll>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE ═══ */}
          <section
            id="experience"
            ref={experienceRef}
            className="section experience-section relative"
          >
            <div className="experience-inner max-w-[1200px] mx-auto">
              <SectionHeading title="Experience" label="Research & engineering" />
              <ExperienceTrack entries={experienceEntries} />
            </div>
          </section>

          {/* ═══ PROJECTS ═══ */}
          <ProjectsShowcase />

          {/* ═══ RESEARCH ═══ */}
          <section id="research" className="section research-section py-[180px]">
            <div className="research-inner">
              <SectionHeading
                title="Research"
                label="Papers, writing & talks"
              />
              <RevealOnScroll direction="bottom">
                <p className="research-intro">
                  The papers that gave me the vocabulary. Not a reading list — each one changed what I thought was possible.
                </p>
              </RevealOnScroll>
            </div>
            <div className="research-marquee-outer">
              <ResearchMarquee />
            </div>
            <div className="research-inner" style={{ marginTop: "5rem" }}>
              <WritingAndTalks />
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section id="contact" className="section contact-section">
            <SectionHeading title="Contact" label="Get in touch" className="max-w-[1200px] mx-auto" />
            <RevealOnScroll direction="bottom">
              <div className="contact-content max-w-[1200px] mx-auto">
                <p className="contact-intro">
                  Currently interested in AI research internships, open-source collaborations, and systems engineering opportunities.
                </p>
                <div className="contact-actions flex flex-wrap gap-6">
                  <motion.a
                    href="mailto:dhiranpranav72@gmail.com"
                    className="btn btn-email"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={MOTION.springEditorial}
                  >
                    dhiranpranav72@gmail.com
                  </motion.a>
                  <motion.a
                    href="https://github.com/Pranav-d33"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={MOTION.springEditorial}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    GitHub
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/prannav-dhiran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={MOTION.springEditorial}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </motion.a>
                  <motion.a
                    href="https://x.com/Prannav_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={MOTION.springEditorial}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M19.5 4l-6.768 6.768"/></svg>
                    X
                  </motion.a>
                </div>
                <div className="pt-6">
                  <motion.button
                    onClick={() => setIsSystemPromptOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 mt-4 text-lg font-medium border border-fog-border hover:border-ebony-text text-ebony-text dark:border-white/10 dark:hover:border-white/40 dark:text-white transition-colors rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={MOTION.springEditorial}
                    type="button"
                  >
                    View system prompt
                  </motion.button>
                </div>
              </div>
            </RevealOnScroll>
          </section>

          {/* ═══ CLOSING QUOTE ═══ */}
          <ClosingQuote />

          {/* ═══ FOOTER ═══ */}
          <motion.footer
            className="footer pb-12 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px 0px" }}
            transition={{ duration: MOTION.fast }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-body-sm text-ebony-text/50">
                &copy; {new Date().getFullYear()} Pranav Dhiran
              </p>
              <p className="text-body-sm text-ebony-text/40 font-blanco italic">
                Built with intent
              </p>
            </div>
          </motion.footer>
        </div>
      </main>

      <SystemPromptModal isOpen={isSystemPromptOpen} onClose={() => setIsSystemPromptOpen(false)} />
      <ChatWidget />
    </>
  );
}
