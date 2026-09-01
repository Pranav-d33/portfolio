"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { MOTION } from "@/lib/motion";
import { SystemPromptModal } from "./SystemPromptModal";
import { ChatWidget } from "./chatbot/ChatWidget";
import { Sidebar } from "./navigation/Sidebar";
import { MobileNav } from "./navigation/MobileNav";
import { ScrollProgress } from "./navigation/ScrollProgress";
import { SectionHeading } from "./ui/SectionHeading";
import { KineticHero } from "./ui/KineticHero";
import { ExperienceTrack } from "./ui/ExperienceTrack";
import { ProjectsShowcase } from "./ui/ProjectsShowcase";
import { ResearchMarquee } from "./ui/ResearchMarquee";
import { InkFooter } from "./ui/InkFooter";
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
      "Fabric has an operations problem: steep learning curve, verbose tooling, too much that shouldn't require an expert. I'm building an agent that collapses that — natural language in, Cello API call sequence out, operation executed.",
    details: [
      "Designing an AI agent that takes natural language, reasons over Cello API call sequences, and executes operations — eliminating manual dashboard interaction",
      "The hard part isn't the LLM; it's knowing which API calls compose into what the user actually meant",
    ],
  },
  {
    title: "AI Research Intern",
    org: <span className="org-underline">IRT, University of South Carolina</span>,
    date: "Apr 2026 – Present",
    description:
      "The bet: small models with symbolic constraints can do things large models can't — not in spite of their size, but because of it.",
    details: [
      "Researching neurosymbolic SLM architecture and pre-training pipelines — integrating symbolic reasoning constraints into small language model training",
      "Working on RL-based fine-tuning (GRPO/RLHF) for SLM alignment — reward modeling, policy optimization, and evaluation on neurosymbolic reasoning benchmarks",
    ],
  },
  {
    title: "Open Source Contributor",
    org: <span className="org-underline">Meshery — CNCF Sandbox Project</span>,
    date: "Mar 2026 – Present",
    description:
      "Five-plus merged PRs into a CNCF sandbox project. The PRs matter less than what you absorb reading other people's production code at scale.",
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
  const [copied, setCopied] = useState(false);
  const internalMainRef = useRef<HTMLElement>(null);
  const resolvedMainRef = mainRef ?? internalMainRef;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("dhiranpranav72@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:dhiranpranav72@gmail.com";
    }
  };

  return (
    <>
      <ScrollProgress />
      <Sidebar activeSection={activeSection} />
      <MobileNav activeSection={activeSection} />

      <main
        ref={resolvedMainRef}
        tabIndex={introComplete ? -1 : undefined}
        className="min-h-screen w-full relative outline-none lg:pl-[280px]"
      >
        {/* ═══ CHAPTER 00 ═══ HERO ═══ */}
        <section className="hero-section">
          <KineticHero />
        </section>

        {/* ═══ CHAPTER 01 ═══ BACKGROUND ═══ */}
        <section id="about" className="section about-section relative">
          <SectionHeading
            chapter="01"
            label="Background"
            title="Everything I build started as a question I couldn't leave alone."
            className="max-w-[1200px] mx-auto"
          />
          <div className="relative w-full mt-12 max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full">
              <RevealOnScroll direction="left" className="shrink-0 mx-auto lg:mx-0">
                <div className="flip-card w-[340px] h-[340px] mb-6 lg:mb-0">
                  <div className="flip-card-inner h-full">
                    <div className="flip-card-front rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
                      <img
                        src="/football.jpeg"
                        alt="Playing football"
                        className="w-full h-full object-contain"
                        style={{ objectPosition: "right center", filter: "grayscale(85%)" }}
                      />
                    </div>
                    <div className="flip-card-back rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
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

              <div className="flex-1 w-full">
                <div className="grid md:grid-cols-2 gap-12">
                  <RevealOnScroll direction="bottom">
                    <div className="lg:flex lg:flex-col lg:min-h-[340px]">
                      <p className="text-body text-ink-soft leading-body measure mb-4 lg:mb-0">
                        Everything started with a question I couldn&apos;t put down. I didn&apos;t pick a field so much as a habit — follow a question until it turns into something you can build, test, and hand to someone else. Some questions became models; some became tools; a few became stories worth telling.
                      </p>
                      <div className="hidden lg:block flex-1" />
                      <p className="text-body text-ink-soft leading-body measure">
                        Final-year B.Tech, Electronics &amp; Telecom at SGGSIE&amp;T Nanded. Tier-3 college, self-taught in most of what matters.
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
                          className="text-body text-ink-soft leading-body pl-4 border-l-2 border-ebony-text"
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

        {/* ═══ CHAPTER 02 ═══ EXPERIENCE ═══ */}
        <section id="experience" className="section experience-section relative bg-paper-deep/40 dark:bg-white/[0.02]">
          <div className="experience-inner max-w-[1200px] mx-auto">
            <SectionHeading
              chapter="02"
              label="Experience"
              title="Every role is a different vantage on the same question."
            />
            <ExperienceTrack entries={experienceEntries} />
          </div>
        </section>

        {/* ═══ CHAPTER 03 ═══ SELECTED WORK ═══ */}
        <ProjectsShowcase chapter="03" />

        {/* ═══ CHAPTER 04 ═══ RESEARCH ═══ */}
        <section id="research" className="section research-section bg-paper-deep/40 dark:bg-white/[0.02]">
          <div className="research-inner">
            <SectionHeading
              chapter="04"
              label="The vocabulary"
              title="The papers that gave me the vocabulary."
            />
            <RevealOnScroll direction="bottom">
              <p className="research-intro">
                Not a reading list — each one changed what I thought was possible.
              </p>
            </RevealOnScroll>
          </div>
          <div className="research-marquee-outer">
            <ResearchMarquee />
          </div>
        </section>

        {/* ═══ CHAPTER 05 ═══ WRITING & TALKS ═══ */}
        <section id="writing" className="section relative">
          <div className="max-w-[1200px] mx-auto px-6 md:px-16 lg:px-24">
            <SectionHeading
              chapter="05"
              label="Writing & Talks"
              title="Thinking out loud — same act as building, different medium."
            />
            <WritingAndTalks />
          </div>
        </section>

        {/* ═══ CHAPTER 06 ═══ CONTACT ═══ */}
        <section id="contact" className="section contact-section bg-paper-deep/40 dark:bg-white/[0.02]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-16 lg:px-24">
            <SectionHeading
              chapter="06"
              label="Contact"
              title="If any of this resonated, let's talk."
            />
            <RevealOnScroll direction="bottom">
              <p className="contact-intro">
                Currently interested in AI research internships, open-source collaborations, and systems engineering opportunities. Cold emails work.
              </p>
            </RevealOnScroll>

            <div className="mt-14 grid md:grid-cols-12 gap-10 items-start">
              <RevealOnScroll direction="bottom" className="md:col-span-6">
                <div className="font-meta !text-[11px] tracking-[0.14em] text-ink-faint mb-3">
                  Primary channel
                </div>
                <button
                  onClick={copyEmail}
                  className="group inline-flex items-center gap-3 text-[clamp(20px,3vw,30px)] font-degular italic text-ebony-text hover:text-accent transition-colors text-left"
                  type="button"
                >
                  dhiranpranav72@gmail.com
                  <span className="w-9 h-9 shrink-0 rounded-full border border-rule flex items-center justify-center group-hover:bg-ebony-text group-hover:text-paper group-hover:border-ebony-text transition-colors">
                    {copied ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    )}
                  </span>
                </button>
                <div className="mt-2 font-meta !text-[11px] text-ink-faint h-4">
                  {copied ? "copied to clipboard" : "click to copy"}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/resume_v4.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink !text-paper border border-ink px-5 py-2.5 font-blanco text-[13px] font-medium hover:bg-accent hover:border-accent hover:!text-paper transition-colors no-underline dark:bg-[#e5e7eb] dark:!text-[#1A1A1A] dark:border-[#e5e7eb] dark:hover:bg-accent dark:hover:!text-[#1A1A1A] dark:hover:border-accent"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download resume
                  </a>
                  <button
                    onClick={() => setIsSystemPromptOpen(true)}
                    className="inline-flex items-center gap-2 font-meta !text-[11px] tracking-[0.18em] text-ink-soft hover:text-ebony-text border border-rule rounded-sm px-4 py-2.5 hover:border-ebony-text transition-colors bg-transparent"
                    type="button"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19h8"/><path d="m4 17 6-6-6-6"/></svg>
                    View system prompt
                  </button>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="bottom" className="md:col-span-5 md:col-start-8">
                <div className="font-meta !text-[11px] tracking-[0.14em] text-ink-faint mb-3">
                  Elsewhere on the internet
                </div>
                <div className="space-y-0">
                  {[
                    { label: "GitHub", handle: "Pranav-d33", href: "https://github.com/Pranav-d33" },
                    { label: "LinkedIn", handle: "prannav-dhiran", href: "https://linkedin.com/in/prannav-dhiran" },
                    { label: "Substack", handle: "ashborn2", href: "https://ashborn2.substack.com" },
                    { label: "X", handle: "@Prannav_ai", href: "https://x.com/Prannav_ai" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 border-b border-rule hover:pl-2 hover:border-ebony-text transition-all duration-300 !no-underline"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-degular text-[20px] text-ebony-text">{link.label}</span>
                        <span className="font-meta !text-[11px] text-ink-faint">{link.handle}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint group-hover:text-ebony-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    </a>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ EPILOGUE ═══ FOOTER ═══ */}
      <InkFooter />

      <SystemPromptModal isOpen={isSystemPromptOpen} onClose={() => setIsSystemPromptOpen(false)} />
      <ChatWidget />
    </>
  );
}
