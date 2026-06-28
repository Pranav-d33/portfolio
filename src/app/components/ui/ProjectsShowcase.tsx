"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudyPath, projectCaseStudies } from "@/lib/portfolioData";
import { MOTION } from "@/lib/motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionHeading } from "./SectionHeading";
import { Tag, Tags } from "./Tag";

function ProjectMedia({
  src,
  alt,
  featured = false,
}: {
  src: string;
  alt: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <div
      ref={ref}
      className={`project-block__media ${featured ? "project-block__media--featured" : ""}`}
    >
      <motion.div
        className="project-block__media-inner"
        style={prefersReducedMotion ? undefined : { y }}
      >
        <img src={src} alt={alt} className="project-block__image" />
      </motion.div>
    </div>
  );
}

function ProjectBlock({
  project,
  index,
}: {
  project: (typeof projectCaseStudies)[number];
  index: number;
}) {
  const router = useRouter();
  const githubLink = project.links.find((link) => link.href.includes("github.com"));
  const fallbackLink = !githubLink ? project.links[0] : undefined;
  const reverse = index % 2 === 1 && index !== 2;
  const featured = index === 2;
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <RevealOnScroll delay={index * MOTION.staggerSlow} duration={MOTION.slow}>
      <motion.article
        className={`project-block ${reverse ? "project-block--reverse" : ""} ${featured ? "project-block--featured" : ""}`}
        whileHover={{ y: -4 }}
        transition={MOTION.springEditorial}
        onClick={() => router.push(caseStudyPath(project.slug))}
      >
        {!featured && (
          <span className="section-label project-block__index">{indexLabel}</span>
        )}

        {project.coverImage && (
          <ProjectMedia
            src={project.coverImage}
            alt={project.title}
            featured={featured}
          />
        )}

        <div className="project-block__body">
          {featured && (
            <span className="section-label project-block__index project-block__index--inline">
              {indexLabel}
            </span>
          )}
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h3 className="resume-entry-title">{project.title}</h3>
            <ArrowUpRight className="w-4 h-4 text-t3 shrink-0 opacity-60" />
          </div>
          <p className="resume-entry-desc mb-3">{project.hook}</p>
          <Tags>
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
          <div className="project-links">
            <Link
              href={caseStudyPath(project.slug)}
              className="project-link project-link-case"
              onClick={(e) => e.stopPropagation()}
            >
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
        </div>
      </motion.article>
    </RevealOnScroll>
  );
}

export function ProjectsShowcase() {
  return (
    <section id="projects" className="section projects-section">
      <SectionHeading
        title="Projects"
        label="Selected work"
        className="max-w-5xl mx-auto lg:translate-x-[-3%]"
      />
      <div className="projects-showcase max-w-5xl mx-auto lg:translate-x-[-3%]">
        {projectCaseStudies.map((project, index) => (
          <ProjectBlock key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
