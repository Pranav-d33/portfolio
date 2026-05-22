"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudyPath, projectCaseStudies, paperLibrary } from "@/lib/portfolioData";
import { SystemPromptModal } from "./SystemPromptModal";
import { ChatWidget } from "./chatbot/ChatWidget";
import { Sidebar } from "./navigation/Sidebar";
import { MobileNav } from "./navigation/MobileNav";
import { ScrollProgress } from "./navigation/ScrollProgress";
import { SectionHeading } from "./ui/SectionHeading";
import { Tag, Tags } from "./ui/Tag";
import { ResumeEntry } from "./ui/ResumeEntry";

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

export default function HomeClient() {
  const activeSection = useActiveSection();
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  const projects = projectCaseStudies;

  return (
    <>
      <ScrollProgress />
      <Sidebar activeSection={activeSection} />
      <MobileNav />

      <main className="min-h-screen pt-20 px-6 lg:px-12 ml-0 lg:ml-80 mr-0 lg:mr-32 flex-1 flex justify-end max-w-[1600px] relative">
        <div className="w-full max-w-[1400px]">
{/* ═══ HERO / INTRO ═══ */}
          <section className="hero-section">
            <div className="hero-images">
              <div className="hero-image-pair">
                <figure className="hero-image studio" />
                <figure className="hero-image daniel" />
              </div>
            </div>
            <div className="hero-content prose prose-lg font-degular w-full max-w-lg ml-auto lg:pt-[25vh] pt-[6vh] dark:prose-invert">
              <h2 className="home-subtitle mt-0 text-black dark:text-white">AI Engineer & Researcher</h2>
              <div className="introduction">
                <span className="callout">
                  I dig into <span className="intro-underline">rabbit holes</span>, some become <span className="intro-strong">systems</span>.
                </span>
                <ul className="intro-recent" aria-label="Recent work">
                  <li className="intro-recent-label">Recently</li>
                  <li>Active contributor to Meshery (CNCF)</li>
                  <li>Researching and prototyping domain-specific small language models</li>
                  <li>Picking up Go for systems-level tooling</li>
                </ul>
                <a href="/resume_v4.pdf" download className="cta-button dark:bg-white dark:text-black mt-6">
                  Download resume
                </a>
              </div>
            </div>
          </section>

          {/* ═══ ABOUT ═══ */}
          <section id="about" className="section about-section">
            <SectionHeading title="About" subtitle="Background & focus" className="max-w-4xl ml-auto" />
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl ml-auto">
              <div>
                <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body mb-4">
                  I started in RF and signals. Turns out the most interesting signal to decode is language.
                  Now I build the systems that do both — from transformers to multi-agent pipelines to LLM-controlled hardware.
                </p>
                <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body">
                  B.Tech — Electronics & Telecom Engineering at SGGSIE&T, Nanded (2023–Present).
                </p>
              </div>
              <div>
                <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-10">Achievements</h3>
                <ul className="space-y-5 about-achievements">
                  {[
                    "National Finalist — Smart India Hackathon 2024",
                    "National Finalist — Smart India Hackathon 2025",
                    "Global Finalist Top 6 — UWA Hack For Impact 2026",
                  ].map((a) => (
                    <li key={a} className="text-body text-ebony-text/70 dark:text-white/50 leading-body pl-4 border-l-2 border-ebony-text">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE ═══ */}
          <section id="experience" className="section">
            <SectionHeading title="Experience" subtitle="Research & engineering" className="max-w-3xl ml-auto" />
            <div className="max-w-3xl ml-auto space-y-10">
              <ResumeEntry
                title="AI Research Intern"
                org={<span className="org-underline">AIISC, University of South Carolina</span>}
                date="Apr 2026 – Present"
                description="Working on multi-agent systems and LLM orchestration at the AI Institute."
                details={[
                  "Building agentic pipelines for complex task decomposition",
                  "Researching coordination strategies between specialized LLM agents",
                  "Contributing to open-source agent frameworks",
                ]}
              />
              <ResumeEntry
                title="Open Source Contributor"
                org={<span className="org-underline">Meshery (CNCF) / Hyperledger Cello</span>}
                date="Feb 2026 – Present"
                description="Contributing to cloud-native and blockchain infrastructure projects."
                details={[
                  "Developed service mesh management features for Meshery",
                  "Contributed to Hyperledger Cello's blockchain deployment tooling",
                  "Focused on infrastructure-as-code and observability patterns",
                ]}
              />
            </div>
          </section>

          {/* ═══ PROJECTS ═══ */}
          <section id="projects" className="section">
            <SectionHeading title="Projects" subtitle="Selected work" className="max-w-3xl ml-auto" />
            <div className="max-w-3xl ml-auto space-y-8">
              {projects.map((project) => {
                const githubLink = project.links.find((link) => link.href.includes("github.com"));
                const fallbackLink = !githubLink ? project.links[0] : undefined;

                return (
                  <article key={project.slug} className="resume-entry">
                    <Link
                      href={caseStudyPath(project.slug)}
                      className="group flex items-baseline justify-between gap-4 mb-1"
                    >
                      <h3 className="resume-entry-title group-hover:opacity-60 transition-opacity">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-t3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <p className="resume-entry-desc mb-3">{project.hook}</p>
                    <Tags>
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Tags>
                    {(githubLink || fallbackLink) && (
                      <div className="project-links">
                        {githubLink ? (
                          <a
                            href={githubLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            GitHub →
                          </a>
                        ) : fallbackLink ? (
                          <a
                            href={fallbackLink.href}
                            target={fallbackLink.external ? "_blank" : undefined}
                            rel={fallbackLink.external ? "noopener noreferrer" : undefined}
                            className="project-link"
                          >
                            {fallbackLink.label} →
                          </a>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* ═══ RESEARCH ═══ */}
          <section id="research" className="section">
            <SectionHeading title="Research" subtitle="Papers & interests" className="max-w-3xl ml-auto" />
            <div className="research-content max-w-3xl ml-auto">
              <p className="research-intro">
                Reading and building on foundational ML research. Here are papers that shaped my thinking.
              </p>
              <div className="research-list">
                {Object.values(paperLibrary).map((paper) => (
                  <a
                    key={paper.id}
                    href={paper.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="research-paper"
                  >
                    <h3 className="research-paper-title">{paper.title}</h3>
                    <p className="research-paper-note">{paper.note}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section id="contact" className="section contact-section">
            <SectionHeading title="Contact" subtitle="Get in touch" className="max-w-4xl ml-auto" />
            <div className="contact-content max-w-4xl ml-auto">
              <p className="contact-intro">
                I&apos;m always open to research discussions, collaboration, and building things that matter.
              </p>
              <div className="contact-actions flex flex-wrap gap-6">
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
              <div className="pt-6">
                <button
                  onClick={() => setIsSystemPromptOpen(true)}
                  className="btn btn-ghost gap-2 text-body-sm text-ebony-text/50"
                  type="button"
                >
                  View system prompt →
                </button>
              </div>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer className="footer">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-body-sm text-ebony-text/50">
                &copy; {new Date().getFullYear()} Pranav Dhiran
              </p>
              <p className="text-body-sm text-ebony-text/40 font-blanco italic">
                Built with intent
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* System Prompt Modal */}
      <SystemPromptModal isOpen={isSystemPromptOpen} onClose={() => setIsSystemPromptOpen(false)} />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
