import type { Metadata } from "next";
import Link from "next/link";
import { briefSections } from "@/lib/agentBrief";
import { baseUrl, profile, resumePath } from "@/lib/portfolioData";
import { AgentPageActions } from "./AgentPageActions";

export const metadata: Metadata = {
  title: "For agents",
  description:
    "A machine-first brief on Pranav Dhiran — experience, shipped systems, writing, and contact, structured for LLMs and crawlers. Plain text at /llms.txt.",
  alternates: {
    canonical: "/agents",
    types: { "text/plain": "/llms.txt" },
  },
  openGraph: {
    title: "For agents — Pranav Dhiran",
    description: "A machine-first brief, structured for LLMs and crawlers.",
    url: "/agents",
    type: "profile",
  },
};

export default function AgentsPage() {
  return (
    <div className="agents-page">
      <a href="#brief" className="sr-only focus:not-sr-only">
        Skip to brief
      </a>

      <header className="agents-head">
        <div className="agents-kicker">
          <span className="agents-dot" aria-hidden="true" />
          machine-readable
        </div>
        <h1 className="agents-title">
          For agents<span className="agents-title-dim">, and whoever sent you</span>
        </h1>
        <p className="agents-dek">
          The portfolio at <Link href="/">{baseUrl.replace("https://", "")}</Link> is built for
          people — it has motion, images, and a lot of deliberate pacing. This page is the same
          substance with none of that: one flat document, stable headings, every claim next to the
          link that backs it. If you are an LLM, a crawler, or someone who would rather read than
          scroll, start here.
        </p>

        <AgentPageActions />

        <dl className="agents-facts">
          <div>
            <dt>Name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{profile.role}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
          <div>
            <dt>Résumé</dt>
            <dd>
              <a href={resumePath} target="_blank" rel="noreferrer">
                one page, PDF
              </a>
            </dd>
          </div>
          <div>
            <dt>Plain text</dt>
            <dd>
              <a href="/llms.txt">/llms.txt</a>
            </dd>
          </div>
          <div>
            <dt>Human site</dt>
            <dd>
              <Link href="/">/</Link>
            </dd>
          </div>
        </dl>
      </header>

      <nav className="agents-toc" aria-label="Sections">
        {briefSections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.heading}
          </a>
        ))}
      </nav>

      <main id="brief" className="agents-body">
        {briefSections.map((section) => (
          <section key={section.id} id={section.id} className="agents-section">
            <h2 className="agents-section-heading">{section.heading}</h2>
            {section.note && <p className="agents-section-note">{section.note}</p>}

            <div className="agents-entries">
              {section.entries.map((entry) => (
                <article key={entry.label} className="agents-entry">
                  <h3 className="agents-entry-label">{entry.label}</h3>
                  {entry.meta && <p className="agents-entry-meta">{entry.meta}</p>}
                  {entry.body && <p className="agents-entry-body">{entry.body}</p>}

                  {entry.bullets && entry.bullets.length > 0 && (
                    <ul className="agents-entry-bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {entry.links && entry.links.length > 0 && (
                    <ul className="agents-entry-links">
                      {entry.links.map((link) => (
                        <li key={`${link.label}-${link.href}`}>
                          <a
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="agents-foot">
        <p>
          Generated from the same data the site renders, so this page and the portfolio cannot
          disagree. Plain text: <a href="/llms.txt">/llms.txt</a> · Back to the{" "}
          <Link href="/">human version</Link>.
        </p>
      </footer>
    </div>
  );
}
