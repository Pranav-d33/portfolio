import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudyPath, projectBySlug, projectCaseStudies } from "@/lib/portfolioData";

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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projectBySlug[slug];
  if (!project) notFound();

  const sections = [
    ["problem", "Problem"],
    ["architecture", "Architecture"],
    ["decisions", "Decisions"],
    ["lessons", "Lessons"],
    ["papers", "Papers"],
    ["links", "Links"],
  ] as const;

  return (
    <article className="case-study-page min-h-screen text-ebony-text font-degular">
      <div className="max-w-[900px] mx-auto px-6 py-16 md:py-24">
        <Link href="/#projects" className="inline-flex items-center gap-1 text-body-sm text-stone-text hover:text-ebony-text transition-colors mb-12">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to selected work
        </Link>

        <header className="pb-10 border-b border-fog-border mb-10">
          <p className="text-body-sm text-stone-text uppercase tracking-widest mb-3 font-degular">Case Study</p>
          <h1 className="text-display font-degular font-medium text-ebony-text leading-display mb-4 max-w-[700px]">
            {project.title}
          </h1>
          <p className="text-body text-graphite-text leading-body max-w-[650px]">
            {project.thesis}
          </p>
          <div className="mt-6 p-4 border border-fog-border rounded-sm">
            <span className="text-body-sm text-stone-text">{project.proofTitle}</span>
            <strong className="block text-body text-ebony-text font-medium mt-1">{project.proofDesc}</strong>
          </div>
        </header>

        <div className="md:grid md:grid-cols-[160px_1fr] gap-10 items-start">
          <nav className="sticky top-8 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0" aria-label="Sections">
            <span className="text-body-sm text-stone-text uppercase tracking-widest hidden md:block">Read</span>
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-body-sm text-stone-text hover:text-ebony-text transition-colors whitespace-nowrap">
                {label}
              </a>
            ))}
          </nav>

          <div>
            <div className="grid grid-cols-3 gap-3 mb-10">
              <div className="flex flex-col gap-1.5 p-3 border border-fog-border rounded-sm">
                <span className="text-body-sm text-stone-text">Role</span>
                <strong className="text-body text-ebony-text font-medium">{project.role}</strong>
              </div>
              <div className="flex flex-col gap-1.5 p-3 border border-fog-border rounded-sm">
                <span className="text-body-sm text-stone-text">Status</span>
                <strong className="text-body text-ebony-text font-medium">{project.status}</strong>
              </div>
              <div className="flex flex-col gap-1.5 p-3 border border-fog-border rounded-sm">
                <span className="text-body-sm text-stone-text">Stack</span>
                <strong className="text-body text-ebony-text font-medium">{project.stack.join(" / ")}</strong>
              </div>
            </div>

            <section id="problem" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Problem</h2>
              <p className="text-body text-graphite-text leading-body">{project.problem}</p>
            </section>

            <section id="architecture" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Architecture</h2>
              <div className="flex flex-col gap-3">
                {project.architecture.map((row, i) => (
                  <div key={i} className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                    {row.map((node) => (
                      <div key={node.label} className="p-3 border border-fog-border rounded-sm">
                        <strong className="text-body text-ebony-text font-medium">{node.label}</strong>
                        {node.sub && <span className="block text-body-sm text-stone-text mt-1">{node.sub}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section id="decisions" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Key Decisions</h2>
              <div className="flex flex-col gap-6">
                {project.decisions.map((d) => (
                  <div key={d.title} className="pl-4 border-l-2 border-ebony-text">
                    <h3 className="text-subheading font-degular font-medium text-ebony-text mb-2">{d.title}</h3>
                    <p className="text-body text-graphite-text leading-body">{d.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="lessons" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Lessons / Results</h2>
              <ul className="space-y-3">
                {project.lessons.map((lesson) => (
                  <li key={lesson} className="text-body text-graphite-text leading-body pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-stone-text before:font-mono">
                    {lesson}
                  </li>
                ))}
              </ul>
            </section>

            <section id="papers" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Theoretical Foundation</h2>
              <div className="flex flex-wrap gap-3">
                {project.relatedPapers.map((paper) => (
                  <a key={paper.id} href={paper.href} target="_blank" rel="noopener noreferrer" className="block p-4 border border-fog-border hover:border-ebony-text transition-colors rounded-sm max-w-[280px]">
                    <span className="text-body text-ebony-text font-medium">{paper.title}</span>
                    <strong className="block text-body-sm text-stone-text mt-1">{paper.note}</strong>
                  </a>
                ))}
              </div>
            </section>

            <section id="links" className="py-8 border-t border-fog-border/80">
              <h2 className="text-heading font-degular font-medium text-ebony-text mb-4">Proof Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="btn btn-primary">
                    {link.label}
                    {link.external ? " →" : ""}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="border-t border-fog-border py-8">
        <div className="max-w-[900px] mx-auto px-6 flex justify-between items-center">
          <p className="text-body-sm text-stone-text">&copy; {new Date().getFullYear()} Pranav Dhiran</p>
          <Link href="/#contact" className="text-body-sm text-stone-text hover:text-ebony-text transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </article>
  );
}
