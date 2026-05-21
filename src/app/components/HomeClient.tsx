"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ExternalLink, Download } from "lucide-react";
import { caseStudyPath, projectCaseStudies, paperLibrary, baseUrl } from "@/lib/portfolioData";
import { SystemPromptModal } from "./SystemPromptModal";
import { ChatWidget } from "./chatbot/ChatWidget";
import { Sidebar } from "./navigation/Sidebar";
import { MobileNav } from "./navigation/MobileNav";
import { ScrollProgress } from "./navigation/ScrollProgress";
import { Button } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";
import { Tag, Tags } from "./ui/Tag";
import { ResumeEntry } from "./ui/ResumeEntry";

const NAV_HEIGHT = 64;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

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

function useTypingEffect(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pause = 2000) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = phrases[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === current) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx((p) => (p + 1) % phrases.length);
    } else {
      const speed = deleting ? deletingSpeed : typingSpeed;
      const step = Math.floor(Math.random() * 3) + 2;
      t = setTimeout(() => {
        setText(deleting ? current.slice(0, Math.max(0, text.length - step)) : current.slice(0, Math.min(current.length, text.length + step)));
      }, speed);
    }
    return () => clearTimeout(t);
  }, [text, deleting, idx, phrases, typingSpeed, deletingSpeed, pause]);
  return { text };
}

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function HomeClient() {
  const activeSection = useActiveSection();
  const { text: typedPhrase } = useTypingEffect(
    ["training transformers from scratch", "building multi-agent pipelines", "engineering MCP servers"],
    45, 25, 1800
  );
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  const projects = projectCaseStudies;

  return (
    <>
      <ScrollProgress />
      <Sidebar activeSection={activeSection} />
      <MobileNav />

      <div className="md:pl-[200px]">
        <main className="min-h-screen">
          {/* ═══ HERO ═══ */}
          <section id="about" className="section pt-32 md:pt-40">
            <div className="container">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="max-w-3xl"
              >
                <motion.h1
                  variants={fadeUp}
                  className="text-display font-degular font-medium text-ebony-text leading-display mb-4"
                >
                  Pranav Dhiran
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-heading-lg text-graphite-text leading-heading-lg font-degular mb-3"
                >
                  AI Engineer & Researcher
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-body text-graphite-text leading-body max-w-2xl mb-6"
                >
                  I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware. ECE + AI.
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-body text-ash-text leading-body font-blanco italic mb-8"
                >
                  Currently {typedPhrase}
                  <span className="inline-block w-[2px] h-[1em] bg-ebony-text ml-1 animate-pulse" />
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3 items-center">
                  <a href="/pranav_dhiran_resume.pdf" download className="btn btn-primary">
                    Resume <Download className="w-4 h-4" />
                  </a>
                  <a href="https://github.com/Pranav-d33" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    GitHub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://linkedin.com/in/prannav-dhiran" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    LinkedIn <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ═══ ABOUT ═══ */}
          <section id="experience" className="section">
            <div className="container">
              <SectionHeading title="About" subtitle="Background & focus" />
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
                <div>
                  <p className="text-body text-graphite-text leading-body mb-4">
                    I started in RF and signals. Turns out the most interesting signal to decode is language.
                    Now I build the systems that do both — from transformers to multi-agent pipelines to LLM-controlled hardware.
                  </p>
                  <p className="text-body text-graphite-text leading-body">
                    B.Tech — Electronics & Telecom Engineering at SGGSIE&T, Nanded (2023–Present).
                  </p>
                </div>
                <div>
                  <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-4">Achievements</h3>
                  <ul className="space-y-3">
                    {[
                      "National Finalist — Smart India Hackathon 2024",
                      "National Finalist — Smart India Hackathon 2025",
                      "Global Finalist Top 6 — UWA Hack For Impact 2026",
                    ].map((a) => (
                      <li key={a} className="text-body text-graphite-text leading-body pl-4 border-l-2 border-ebony-text">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE ═══ */}
          <section id="projects" className="section">
            <div className="container">
              <SectionHeading title="Experience" subtitle="Research & engineering" />
              <div className="max-w-3xl space-y-12">
                <ResumeEntry
                  title="AI Research Intern"
                  org="AIISC, University of South Carolina"
                  date="Jan 2026 – Present"
                  description="Working on multi-agent systems and LLM orchestration at the AI Institute."
                  details={[
                    "Building agentic pipelines for complex task decomposition",
                    "Researching coordination strategies between specialized LLM agents",
                    "Contributing to open-source agent frameworks",
                  ]}
                />
                <ResumeEntry
                  title="Open Source Contributor"
                  org="Meshery (CNCF) / Hyperledger Cello"
                  date="2024 – Present"
                  description="Contributing to cloud-native and blockchain infrastructure projects."
                  details={[
                    "Developed service mesh management features for Meshery",
                    "Contributed to Hyperledger Cello's blockchain deployment tooling",
                    "Focused on infrastructure-as-code and observability patterns",
                  ]}
                />
              </div>
            </div>
          </section>

          {/* ═══ PROJECTS ═══ */}
          <section className="section">
            <div className="container">
              <SectionHeading title="Projects" subtitle="Selected work" />
              <div className="max-w-3xl space-y-8">
                {projects.map((project) => (
                  <a
                    key={project.slug}
                    href={caseStudyPath(project.slug)}
                    className="block group"
                  >
                    <article className="resume-entry">
                      <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h3 className="resume-entry-title group-hover:text-graphite-text transition-colors">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-stone-text shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="resume-entry-desc mb-3">{project.hook}</p>
                      <Tags>
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </Tags>
                    </article>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ RESEARCH ═══ */}
          <section id="research" className="section">
            <div className="container">
              <SectionHeading title="Research" subtitle="Papers & interests" />
              <div className="max-w-3xl">
                <p className="text-body text-graphite-text leading-body mb-6">
                  Reading and building on foundational ML research. Here are papers that shaped my thinking.
                </p>
                <div className="space-y-4">
                  {Object.values(paperLibrary).map((paper) => (
                    <a
                      key={paper.id}
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border border-fog-border hover:border-ebony-text transition-colors rounded-sm"
                    >
                      <h3 className="text-body text-ebony-text font-medium mb-1">{paper.title}</h3>
                      <p className="text-body-sm text-stone-text font-blanco italic">{paper.note}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section id="contact" className="section">
            <div className="container">
              <SectionHeading title="Contact" subtitle="Get in touch" />
              <div className="max-w-3xl space-y-6">
                <p className="text-body text-graphite-text leading-body">
                  I'm always open to research discussions, collaboration, and building things that matter.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:dhiranpranav72@gmail.com" className="btn btn-email">
                    dhiranpranav72@gmail.com
                  </a>
                  <a href="https://github.com/Pranav-d33" target="_blank" rel="noopener noreferrer" className="btn btn-ghost gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/prannav-dhiran" target="_blank" rel="noopener noreferrer" className="btn btn-ghost gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </a>
                  <a href="https://x.com/Prannav_ai" target="_blank" rel="noopener noreferrer" className="btn btn-ghost gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M19.5 4l-6.768 6.768"/></svg>
                    X
                  </a>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSystemPromptOpen(true)}
                    className="btn btn-ghost gap-2 text-body-sm text-stone-text"
                    type="button"
                  >
                    View system prompt →
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer className="footer">
            <div className="container">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-body-sm text-stone-text">
                  &copy; {new Date().getFullYear()} Pranav Dhiran
                </p>
                <p className="text-body-sm text-ash-text font-blanco italic">
                  Built with intent
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* System Prompt Modal */}
      <SystemPromptModal isOpen={isSystemPromptOpen} onClose={() => setIsSystemPromptOpen(false)} />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
