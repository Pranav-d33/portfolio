import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudyPath, projectBySlug, projectCaseStudies } from "@/lib/portfolioData";
import { ZoomableArchDiagram } from "@/app/components/ui/ZoomableArchDiagram";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectCaseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug[slug];
  if (!project) return {};

  return {
    title: `${project.title} | Pranav Dhiran`,
    description: project.thesis,
    alternates: { canonical: caseStudyPath(project.slug) },
    openGraph: {
      title: project.title,
      description: project.thesis,
      url: caseStudyPath(project.slug),
      type: "article",
      images: [{ url: "/portfolio_image.jpeg", width: 1200, height: 630, alt: project.title }],
    },
  };
}

const caseStudyImages: Record<string, string> = {
  medaura: "/langfuse_medaura.png",
  "rf-watch": "/rfwatch_inspector.png",
  tinystories: "/loss_function.png",
  "gnuradio-mcp": "/gnu-radio-mcp.png",
};

const sectionNav = [
  ["problem", "Problem"],
  ["architecture", "Architecture"],
  ["decisions", "Decisions"],
  ["lessons", "Lessons"],
  ["papers", "Papers"],
  ["links", "Links"],
] as const;

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug[slug];
  if (!project) notFound();

  const idx = projectCaseStudies.findIndex((p) => p.slug === slug);
  const heroImage = caseStudyImages[project.slug];

  return (
    <article className="min-h-screen bg-paper text-ink font-blanco selection:bg-accent selection:text-paper">
      {/* Top rule — editorial */}
      <div className="border-b border-rule">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 py-7 flex items-center justify-between">
          <Link href="/#projects" className="inline-flex items-center gap-2 font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint hover:text-ink transition-colors no-underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Selected work
          </Link>
          <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">
            {String(idx + 1).padStart(2, "0")} / {String(projectCaseStudies.length).padStart(2, "0")} — Case Study
          </span>
        </div>
      </div>

      {/* Hero */}
      <header className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 pt-12 md:pt-16 pb-10">
        <span className="font-geist-mono text-[11px] tracking-[0.16em] uppercase text-ink-faint">Case Study</span>
        <h1 className="font-degular text-[clamp(2rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.03em] text-ink max-w-[20ch] mt-3 text-balance">
          {project.title}
        </h1>
        <p className="font-blanco text-[clamp(1.05rem,1.5vw,1.28rem)] leading-[1.6] text-ink-soft max-w-[42rem] mt-6 text-pretty">
          {project.thesis}
        </p>

        {/* Proof — editorial, not yellow box */}
        <div className="mt-8 max-w-[42rem] border border-rule bg-paper-deep/40 py-5 px-6 flex flex-col gap-1">
          <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">{project.proofTitle}</span>
          <strong className="font-degular text-[18px] tracking-[-0.01em] text-ink font-medium">{project.proofDesc}</strong>
        </div>

        {/* Meta — 3 cols, consistent with system */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[48rem]">
          <div className="border border-rule rounded-[3px] p-5 bg-transparent">
            <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint block mb-2">Role</span>
            <strong className="font-degular text-[16px] font-medium text-ink tracking-[-0.01em]">{project.role}</strong>
          </div>
          <div className="border border-rule rounded-[3px] p-5 bg-transparent">
            <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint block mb-2">Status</span>
            <strong className="font-degular text-[16px] font-medium text-ink tracking-[-0.01em]">{project.status}</strong>
          </div>
          <div className="border border-rule rounded-[3px] p-5 bg-transparent">
            <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint block mb-2">Stack</span>
            <strong className="font-blanco text-[13px] font-medium text-ink leading-[1.4]">{project.stack.join(" · ")}</strong>
          </div>
        </div>
      </header>

      {/* Cover image — editorial frame like hero */}
      {heroImage && (
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 pb-10">
          <div className="border border-rule bg-paper p-2 max-w-[900px]">
            <div className="relative overflow-hidden bg-paper-deep aspect-[16/9]">
              <Image
                src={heroImage}
                alt={`${project.title} — technical overview`}
                fill
                sizes="(max-width: 900px) 100vw, 900px"
                className="object-contain"
              />
              <span className="absolute top-3 left-3 font-geist-mono text-[11px] tracking-[0.14em] uppercase bg-paper/90 border border-rule px-2 py-1 text-ink-faint">Fig. — Overview</span>
            </div>
          </div>
        </div>
      )}

      {/* Body — sticky nav + content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 pb-20 md:pb-24">
        <div className="md:grid md:grid-cols-[200px_1fr] gap-12 lg:gap-16 items-start">
          <nav className="hidden md:block sticky top-8" aria-label="Sections">
            <span className="font-geist-mono text-[11px] tracking-[0.16em] uppercase text-ink-faint block mb-4">On this page</span>
            <div className="flex flex-col gap-1 border-l border-rule pl-5">
              {sectionNav.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="font-blanco text-[14px] text-ink-soft hover:text-ink transition-colors py-1.5 no-underline">
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile nav */}
          <nav className="md:hidden flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 hide-scrollbar" aria-label="Sections">
            {sectionNav.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="whitespace-nowrap font-geist-mono text-[11px] tracking-[0.12em] uppercase px-3 py-2 border border-rule rounded-full text-ink-soft hover:text-ink hover:border-ink no-underline">
                {label}
              </a>
            ))}
          </nav>

          <div className="max-w-[720px]">
            <section id="problem" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">01 — Problem</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-6">Problem</h2>
              <p className="font-blanco text-[17px] leading-[1.65] text-ink-soft max-w-[65ch]">{project.problem}</p>
            </section>

            <section id="architecture" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">02 — Architecture</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-8">Architecture</h2>
              <div className="border border-rule rounded-[3px] p-4 md:p-6 bg-paper">
                <ZoomableArchDiagram architecture={project.architecture} />
              </div>
            </section>

            <section id="decisions" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">03 — Decisions</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-8">Key Decisions</h2>
              <div className="flex flex-col gap-8">
                {project.decisions.map((d, i) => (
                  <div key={d.title} className="grid grid-cols-[32px_1fr] gap-4">
                    <span className="font-geist-mono text-[11px] tracking-[0.14em] text-accent pt-1.5">{String(i + 1).padStart(2, "0")}</span>
                    <div className="border-l border-rule pl-5">
                      <h3 className="font-degular text-[18px] leading-[1.3] tracking-[-0.01em] text-ink font-medium mb-2">{d.title}</h3>
                      <p className="font-blanco text-[16px] leading-[1.6] text-ink-soft max-w-[65ch]">{d.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="lessons" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">04 — Lessons</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-6">Lessons / Results</h2>
              <ul className="flex flex-col gap-4">
                {project.lessons.map((lesson) => (
                  <li key={lesson} className="grid grid-cols-[16px_1fr] gap-3 font-blanco text-[16px] leading-[1.6] text-ink-soft">
                    <span aria-hidden="true" className="text-accent font-geist-mono text-[12px] leading-[1.6]">→</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="papers" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">05 — Theory</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-6">Theoretical Foundation</h2>
              <div className="flex flex-col gap-3">
                {project.relatedPapers.map((paper) => (
                  <a key={paper.id} href={paper.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-1.5 p-5 border border-rule rounded-[3px] hover:border-ink-soft hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors no-underline">
                    <span className="font-geist-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint">arXiv · {paper.href.match(/abs\/(\d+\.\d+)/)?.[1] ?? ""}</span>
                    <span className="font-degular text-[17px] leading-[1.35] tracking-[-0.01em] text-ink group-hover:text-accent transition-colors">{paper.title}</span>
                    <span className="font-blanco text-[14px] leading-[1.5] text-ink-faint">{paper.note}</span>
                  </a>
                ))}
              </div>
            </section>

            <section id="links" className="py-10 md:py-14 border-t border-rule/70 scroll-mt-8">
              <span className="font-geist-mono text-[11px] tracking-[0.14em] uppercase text-ink-faint">06 — Proof</span>
              <h2 className="font-degular text-[28px] leading-[1.1] tracking-[-0.02em] text-ink mt-3 mb-6">Proof Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-medium no-underline transition-colors ${link.external ? "bg-ink text-paper border border-ink hover:bg-accent hover:border-accent hover:text-paper" : "bg-ink text-paper border border-ink hover:bg-accent hover:border-accent hover:text-paper"}`}
                  >
                    {link.label}
                    {link.external && <span aria-hidden="true">↗</span>}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="border-t border-rule py-8">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-12 flex justify-between items-center">
          <p className="font-geist-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint">© {new Date().getFullYear()} Pranav Dhiran</p>
          <Link href="/#contact" className="font-geist-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint hover:text-ink transition-colors no-underline">
            Contact
          </Link>
        </div>
      </footer>
    </article>
  );
}
