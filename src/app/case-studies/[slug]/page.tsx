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
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <Link href="/#projects" className="inline-flex items-center gap-1 text-lg text-stone-text hover:text-ebony-text transition-colors mb-12">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to selected work
        </Link>

        <header className="pb-10 border-b border-fog-border mb-10">
          <p className="text-lg text-stone-text uppercase tracking-widest mb-3 font-degular">Case Study</p>
          <h1 className="text-5xl font-degular font-medium text-ebony-text leading-tight mb-6 max-w-4xl">
            {project.title}
          </h1>
          <p className="text-2xl text-graphite-text leading-relaxed max-w-4xl">
            {project.thesis}
          </p>
          <div className="mt-8 p-6 border border-fog-border rounded-lg max-w-4xl">
            <span className="text-base text-stone-text block mb-2">{project.proofTitle}</span>
            <strong className="block text-xl text-ebony-text font-medium">{project.proofDesc}</strong>
          </div>
        </header>

        {/* Case study hero image */}
        {(() => {
          const caseStudyImages: Record<string, string> = {
            'medaura': '/langfuse_medaura.png',
            'rf-watch': '/rfwatch_inspector.png',
            'tinystories': '/loss_function.png',
          };
          const heroImage = caseStudyImages[project.slug];
          if (!heroImage) return null;
          return (
            <div className="mb-10 overflow-hidden rounded-lg border border-fog-border bg-fog-bg dark:bg-graphite-bg">
              <img
                src={heroImage}
                alt={`${project.title} — technical overview`}
                className="w-full h-auto object-contain"
              />
            </div>
          );
        })()}

        <div className="md:grid md:grid-cols-[240px_1fr] gap-16 items-start max-w-6xl">
          <nav className="sticky top-8 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0" aria-label="Sections">
            <span className="text-lg text-stone-text uppercase tracking-widest hidden md:block mb-2">Read</span>
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-xl text-stone-text hover:text-ebony-text transition-colors whitespace-nowrap">
                {label}
              </a>
            ))}
          </nav>

          <div className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="flex flex-col gap-2 p-5 border border-fog-border rounded-lg">
                <span className="text-base text-stone-text">Role</span>
                <strong className="text-lg text-ebony-text font-medium">{project.role}</strong>
              </div>
              <div className="flex flex-col gap-2 p-5 border border-fog-border rounded-lg">
                <span className="text-base text-stone-text">Status</span>
                <strong className="text-lg text-ebony-text font-medium">{project.status}</strong>
              </div>
              <div className="flex flex-col gap-2 p-5 border border-fog-border rounded-lg">
                <span className="text-base text-stone-text">Stack</span>
                <strong className="text-lg text-ebony-text font-medium">{project.stack.join(" / ")}</strong>
              </div>
            </div>

            <section id="problem" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-6">Problem</h2>
              <p className="text-xl text-graphite-text leading-relaxed">{project.problem}</p>
            </section>

            <section id="architecture" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-6">Architecture</h2>
              <div className="flex flex-col gap-4">
                {project.architecture.map((row, i) => (
                  <div key={i} className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                    {row.map((node) => (
                      <div key={node.label} className="p-5 border border-fog-border rounded-lg">
                        <strong className="text-lg text-ebony-text font-medium">{node.label}</strong>
                        {node.sub && <span className="block text-base text-stone-text mt-2">{node.sub}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section id="decisions" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-8">Key Decisions</h2>
              <div className="flex flex-col gap-10">
                {project.decisions.map((d) => (
                  <div key={d.title} className="pl-6 border-l-4 border-ebony-text">
                    <h3 className="text-2xl font-degular font-medium text-ebony-text mb-3">{d.title}</h3>
                    <p className="text-xl text-graphite-text leading-relaxed">{d.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="lessons" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-6">Lessons / Results</h2>
              <ul className="space-y-4">
                {project.lessons.map((lesson) => (
                  <li key={lesson} className="text-xl text-graphite-text leading-relaxed pl-8 relative before:content-['→'] before:absolute before:left-0 before:text-stone-text before:font-mono">
                    {lesson}
                  </li>
                ))}
              </ul>
            </section>

            <section id="papers" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-6">Theoretical Foundation</h2>
              <div className="flex flex-wrap gap-4">
                {project.relatedPapers.map((paper) => (
                  <a key={paper.id} href={paper.href} target="_blank" rel="noopener noreferrer" className="block p-5 border border-fog-border hover:border-ebony-text transition-colors rounded-lg w-full max-w-sm">
                    <span className="text-lg text-ebony-text font-medium block mb-2">{paper.title}</span>
                    <strong className="block text-base text-stone-text font-normal">{paper.note}</strong>
                  </a>
                ))}
              </div>
            </section>

            <section id="links" className="py-12 border-t border-fog-border/80">
              <h2 className="text-3xl font-degular font-medium text-ebony-text mb-6">Proof Links</h2>
              <div className="flex flex-wrap gap-4">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="btn btn-primary text-lg py-3 px-6">
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
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-lg text-stone-text">&copy; {new Date().getFullYear()} Pranav Dhiran</p>
          <Link href="/#contact" className="text-lg text-stone-text hover:text-ebony-text transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </article>
  );
}
