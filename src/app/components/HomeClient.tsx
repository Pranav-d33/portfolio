"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { ScrollReveal } from "@/components/ScrollReveal";

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

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.4 },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 35 },
  },
} as const;

const editorialSpring = { type: "spring" as const, stiffness: 180, damping: 35 };

export default function HomeClient() {
  const activeSection = useActiveSection();
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const router = useRouter();

  const projects = projectCaseStudies;

  return (
    <>
      <ScrollProgress />
      <Sidebar activeSection={activeSection} />
      <MobileNav />

      <main
        className="min-h-screen pt-20 px-6 lg:px-12 ml-0 lg:ml-80 mr-0 lg:mr-32 flex-1 flex justify-end max-w-[1600px] relative"
      >
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
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
              <motion.h2
                className="home-subtitle mt-0 text-black dark:text-white"
                variants={fadeUp}
              >
                AI Engineer & Researcher
              </motion.h2>
              <motion.div className="introduction" variants={fadeUp}>
                <span className="callout">
                  I keep digging into <span className="intro-underline">rabbit holes</span>, some become{" "}
                  <span className="intro-strong">systems</span>.
                </span>
              </motion.div>
              <motion.ul className="intro-recent" variants={fadeUp} aria-label="Recent work">
                <li className="intro-recent-label">Recently</li>
                <li>LFX'26 @ Hyperledger Cello</li>
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
                transition={editorialSpring}
              >
                Download resume
              </motion.a>
            </motion.div>
          </div>
          </section>

          {/* ═══ ABOUT ═══ */}
          <section id="about" className="section about-section" style={{ position: 'relative', overflow: 'visible' }}>
            <SectionHeading title="About" label="Background & focus" className="max-w-4xl ml-auto" />
            <div className="relative max-w-4xl ml-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <ScrollReveal x={-24} y={0} className="relative">
                  <div className="relative lg:absolute lg:right-[100%] lg:mr-12 lg:top-0 flip-card w-[340px] h-[340px] mx-auto lg:mx-0 mb-6 lg:mb-0">
                    <div className="flip-card-inner h-full">
                      <div className="flip-card-front rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img src="/football.jpeg" alt="Playing football" className="w-full h-full object-contain" style={{ objectPosition: 'right center', filter: 'grayscale(85%)' }} />
                      </div>
                      <div className="flip-card-back rounded-lg overflow-hidden border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg">
                        <img src="/anime_.jpeg" alt="Anime" className="w-full h-full object-contain" style={{ objectPosition: 'right center', filter: 'grayscale(85%)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex lg:flex-col lg:min-h-[340px]">
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure mb-4 lg:mb-0">
                      I started in RF and signals. Turns out the most interesting signal to decode is language.
                      Now I build the systems that do both — from transformers to multi-agent pipelines to LLM-controlled hardware.
                    </p>
                    <div className="hidden lg:block flex-1" />
                    <p className="text-body text-ebony-text/70 dark:text-white/50 leading-body measure">
                      B.Tech — Electronics & Telecom Engineering at SGGSIE&T, Nanded (2023–Present).
                    </p>
                  </div>
                </ScrollReveal>
              <ScrollReveal x={24} y={0}>
                <h3 className="text-subheading text-ebony-text leading-subheading font-medium mb-16">Achievements</h3>
                <ul className="space-y-5 about-achievements">
                  {[
                    "National Finalist — Smart India Hackathon 2024",
                    "National Finalist — Smart India Hackathon 2025",
                    "Global Finalist Top 6 — UWA Hack For Impact 2026",
                  ].map((a, i) => (
                    <motion.li
                      key={a}
                      className="text-body text-ebony-text/70 dark:text-white/50 leading-body pl-4 border-l-2 border-ebony-text"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 280, damping: 30, delay: i * 0.12 }}
                    >
                      {a}
                    </motion.li>
                  ))}
                </ul>

              </ScrollReveal>
            </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE ═══ */}
          <section id="experience" className="section">
            <SectionHeading title="Experience" label="Research & engineering" className="max-w-3xl ml-auto" />
            <div className="max-w-3xl ml-auto space-y-10">
              <ResumeEntry
                title="LFX Mentee"
                org={<span className="org-underline">Hyperledger Cello · Linux Foundation</span>}
                date="Jun 2026 – Present"
                description="Building an AI agent that turns Hyperledger Fabric network operations and Chaincode debugging into a conversation."
                details={[
                  "Designing an AI agent that takes natural language, reasons over Cello API call sequences, and executes operations — eliminating manual dashboard interaction",
                  "Hyperledger Cello manages the full lifecycle of Hyperledger Fabric networks",
                ]}
              />
              <ResumeEntry
                title="AI Research Intern"
                org={<span className="org-underline">IRT, University of South Carolina</span>}
                date="Apr 2026 – Present"
                description="Researching neurosymbolic SLM architectures with RL-based alignment."
                details={[
                  "Researching neurosymbolic SLM architecture and pre-training pipelines — integrating symbolic reasoning constraints into small language model training for structured knowledge tasks",
                  "Working on RL-based fine-tuning (GRPO/RLHF) for SLM alignment — reward modeling, policy optimization, and evaluation on neurosymbolic reasoning benchmarks",
                ]}
              />
              <ResumeEntry
                title="Open Source Contributor"
                org={<span className="org-underline">Meshery — CNCF Sandbox Project</span>}
                date="Mar 2026 – Present"
                description="5+ merged PRs across service mesh management, UI, and API integrations."
                details={[
                  "5+ merged PRs — service mesh management features, UI components, and API integrations across Go backend and React frontend",
                  "Active in code reviews, issue triage, and community discussions per CNCF contributor guidelines",
                ]}
              />
            </div>
          </section>

          {/* ═══ PROJECTS ═══ */}
          <section id="projects" className="section">
            <SectionHeading title="Projects" label="Selected work" className="max-w-3xl ml-auto" />
            <div className="max-w-3xl ml-auto flex flex-col gap-y-16">
              {projects.map((project, index) => {
                const githubLink = project.links.find((link) => link.href.includes("github.com"));
                const fallbackLink = !githubLink ? project.links[0] : undefined;

                // UI image shown inline above the project card
                const projectImages: Record<string, string> = {
                  'medaura': '/medaura_ui.png',
                  'rf-watch': '/rfwatch_signaldetails.png',
                  'tinystories': '/training_progress.png',
                };
                const coverImage = projectImages[project.slug] || null;

                return (
                  <React.Fragment key={project.slug}>
                    <div className="w-full">
                    <motion.article
                      className="resume-entry relative group/card cursor-pointer"
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={editorialSpring}
                      onClick={() => router.push(caseStudyPath(project.slug))}
                    >
                      
                      {coverImage && (
                        <div className="mb-6 overflow-hidden rounded-lg border border-black/5 dark:border-white/10 bg-fog-bg dark:bg-graphite-bg relative z-10 pointer-events-none">
                          <img
                            src={coverImage}
                            alt={project.title}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-baseline justify-between gap-4 mb-1 pointer-events-none relative z-10">
                        <h3 className="resume-entry-title group-hover/card:opacity-60 transition-opacity">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-t3 shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                      <p className="resume-entry-desc mb-3 relative z-10 pointer-events-none">{project.hook}</p>
                      <Tags className="relative z-10 pointer-events-none">
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </Tags>
                       <div className="project-links relative z-10">
                         <Link href={caseStudyPath(project.slug)} className="project-link project-link-case" onClick={(e) => e.stopPropagation()}>
                           View case study →
                         </Link>
                         {githubLink ? (
                           <a
                             href={githubLink.href}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="project-link"
                             onClick={(e) => e.stopPropagation()}
                           >
                             GitHub →
                           </a>
                         ) : fallbackLink ? (
                           <a
                             href={fallbackLink.href}
                             target={fallbackLink.external ? "_blank" : undefined}
                             rel={fallbackLink.external ? "noopener noreferrer" : undefined}
                             className="project-link"
                             onClick={(e) => e.stopPropagation()}
                           >
                             {fallbackLink.label} →
                           </a>
                         ) : null}
                       </div>
                    </motion.article>
                  </div>
                  {index !== projects.length - 1 && (
                    <div className="w-full h-px bg-fog-border/80 dark:bg-white/10 my-4" />
                  )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          {/* ═══ RESEARCH ═══ */}
          <section id="research" className="section">
            <SectionHeading title="Research" label="Papers & interests" className="max-w-3xl ml-auto" />
            <div className="research-content max-w-3xl ml-auto">
              <ScrollReveal y={24}>
                <p className="research-intro">
                  Reading and building on foundational ML research. Here are papers that shaped my thinking.
                </p>
              </ScrollReveal>
              <div className="research-list">
                {Object.values(paperLibrary).map((paper) => (
                  <ScrollReveal y={24} key={paper.id}>
                    <motion.a
                      href={paper.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="research-paper"
                      whileHover={{ x: 6 }}
                      transition={editorialSpring}
                    >
                      <h3 className="research-paper-title">{paper.title}</h3>
                      <p className="research-paper-note">{paper.note}</p>
                    </motion.a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section id="contact" className="section contact-section">
            <SectionHeading title="Contact" label="Get in touch" className="max-w-4xl ml-auto" />
            <ScrollReveal y={32}>
              <div className="contact-content max-w-4xl ml-auto">
                <p className="contact-intro">
                  I&apos;m always open to research discussions, collaboration, and building things that matter.
                </p>
                <div className="contact-actions flex flex-wrap gap-6">
                  <motion.a
                    href="mailto:dhiranpranav72@gmail.com"
                    className="btn btn-email"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={editorialSpring}
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
                    transition={editorialSpring}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    GitHub
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/prannav-dhiran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={editorialSpring}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </motion.a>
                  <motion.a
                    href="https://x.com/Prannav_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={editorialSpring}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M19.5 4l-6.768 6.768"/></svg>
                    X
                  </motion.a>
                </div>
                <div className="pt-6">
                  <motion.button
                    onClick={() => setIsSystemPromptOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 mt-4 text-lg font-medium border border-fog-border hover:border-ebony-text text-ebony-text dark:border-white/10 dark:hover:border-white/40 dark:text-white transition-colors rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={editorialSpring}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>
                    View system prompt
                  </motion.button>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* ═══ FOOTER ═══ */}
          <motion.footer
            className="footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px 0px" }}
            transition={{ duration: 0.4 }}
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
