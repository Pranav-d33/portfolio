import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseUrl, caseStudyPath, projectBySlug, projectCaseStudies } from "@/lib/portfolioData";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectCaseStudies.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug[slug];

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} | Pranav Dhiran`,
    description: project.thesis,
    alternates: {
      canonical: caseStudyPath(project.slug),
    },
    openGraph: {
      title: project.title,
      description: project.thesis,
      url: caseStudyPath(project.slug),
      type: "article",
      images: [
        {
          url: "/portfolio_image.jpeg",
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = projectBySlug[slug];

  if (!project) {
    notFound();
  }

  const pageUrl = `${baseUrl}${caseStudyPath(project.slug)}`;
  const sections = [
    ["problem", "Problem"],
    ["architecture", "Architecture"],
    ["decisions", "Decisions"],
    ["lessons", "Lessons"],
    ["papers", "Papers"],
    ["links", "Links"],
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: pageUrl,
    author: { "@type": "Person", name: "Pranav Dhiran" },
    description: project.thesis,
    keywords: project.stack.join(", "),
    sameAs: project.links.filter((link) => link.external).map((link) => link.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="case-study-page container">
        <Link href="/#projects" className="case-study-back link link-muted">
          Back to selected work
        </Link>

        <header className="case-study-hero">
          <div className="case-study-kicker">Case study</div>
          <h1 className="type-t1 case-study-title">{project.title}</h1>
          <p className="case-study-thesis">{project.thesis}</p>
          <div className="case-study-proof">
            <span>{project.proofTitle}</span>
            <strong>{project.proofDesc}</strong>
          </div>
        </header>

        <div className="case-study-layout">
          <aside className="case-study-toc" aria-label="Case study sections">
            <div className="case-study-toc-label">Read</div>
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </aside>

          <article className="case-study-content">
            <section className="case-study-meta" aria-label="Project metadata">
              <div>
                <span>Role</span>
                <strong>{project.role}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{project.status}</strong>
              </div>
              <div>
                <span>Stack</span>
                <strong>{project.stack.join(" / ")}</strong>
              </div>
            </section>

            <section id="problem" className="case-study-section">
              <h2>Problem</h2>
              <p>{project.problem}</p>
            </section>

            <section id="architecture" className="case-study-section">
              <h2>Architecture</h2>
              <div className="case-study-arch">
                {project.architecture.map((row, rowIndex) => (
                  <div key={rowIndex} className="case-study-arch-row">
                    {row.map((node) => (
                      <div key={node.label} className="case-study-arch-node">
                        <strong>{node.label}</strong>
                        {node.sub && <span>{node.sub}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section id="decisions" className="case-study-section">
              <h2>Key Decisions</h2>
              <div className="case-study-list">
                {project.decisions.map((decision) => (
                  <div key={decision.title} className="case-study-callout">
                    <h3>{decision.title}</h3>
                    <p>{decision.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="lessons" className="case-study-section">
              <h2>Lessons / Results</h2>
              <ul className="case-study-lessons">
                {project.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </section>

            <section id="papers" className="case-study-section">
              <h2>Theoretical Foundation</h2>
              <div className="case-study-paper-grid">
                {project.relatedPapers.map((paper) => (
                  <a key={paper.id} href={paper.href} target="_blank" rel="noopener noreferrer">
                    <span>{paper.title}</span>
                    <strong>{paper.note}</strong>
                  </a>
                ))}
              </div>
            </section>

            <section id="links" className="case-study-section">
              <h2>Proof Links</h2>
              <div className="case-study-actions">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="button"
                  >
                    {link.label}
                    {link.external ? " ->" : ""}
                  </a>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
    </>
  );
}
