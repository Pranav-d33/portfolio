import {
  awards,
  baseUrl,
  caseStudyPath,
  essays,
  experience,
  paperLibrary,
  profile,
  projectCaseStudies,
  resumePath,
  skills,
  socialLinks,
  talks,
} from "./portfolioData";

export type BriefEntry = {
  /** Headline of the entry. */
  label: string;
  /** Meta line — dates, venue, stack. */
  meta?: string;
  /** Prose body. */
  body?: string;
  /** Bulleted facts. */
  bullets?: string[];
  /** Canonical URLs for this entry. */
  links?: { label: string; href: string }[];
};

export type BriefSection = {
  id: string;
  heading: string;
  /** Why this section exists — one line, for human readers of /agents. */
  note?: string;
  entries: BriefEntry[];
};

const abs = (path: string) => (path.startsWith("http") ? path : `${baseUrl}${path}`);

/**
 * The single agent-facing description of this portfolio.
 * `/llms.txt` serializes it to plain text; `/agents` renders it as a page.
 * Both read from portfolioData, so neither can drift from the site.
 */
export const briefSections: BriefSection[] = [
  {
    id: "identity",
    heading: "Identity",
    entries: [
      {
        label: profile.name,
        meta: `${profile.role} · ${profile.location}`,
        body: profile.summary,
        bullets: [
          `Currently seeking: ${profile.seeking}`,
          `${profile.education.degree} — ${profile.education.school} (${profile.education.dates})`,
        ],
        links: [
          { label: "Site", href: baseUrl },
          { label: "Résumé (PDF)", href: abs(resumePath) },
          { label: "Email", href: `mailto:${profile.email}` },
        ],
      },
    ],
  },
  {
    id: "experience",
    heading: "Experience",
    note: "Roles, with the concrete work under each.",
    entries: experience.map((role) => ({
      label: `${role.title} — ${role.org}`,
      meta: role.date,
      body: role.description,
      bullets: role.details,
    })),
  },
  {
    id: "work",
    heading: "Selected work",
    note: "Each has a written case study on this site and source you can read.",
    entries: projectCaseStudies.map((project) => ({
      label: project.title,
      meta: `${project.status} · ${project.stack.join(" · ")}`,
      body: project.thesis,
      bullets: [project.proofDesc],
      links: [
        { label: "Case study", href: abs(caseStudyPath(project.slug)) },
        ...project.links.map((link) => ({ label: link.label, href: link.href })),
      ],
    })),
  },
  {
    id: "writing",
    heading: "Writing",
    entries: essays.map((essay) => ({
      label: essay.title,
      meta: `${essay.venue} · ${essay.date}`,
      body: essay.dek,
      links: [{ label: "Read", href: essay.href }],
    })),
  },
  {
    id: "talks",
    heading: "Talks",
    entries: talks.map((talk) => ({
      label: talk.title,
      meta: `${talk.event} · ${talk.date}`,
      body: talk.dek,
      links: [{ label: "Watch", href: talk.href }],
    })),
  },
  {
    id: "skills",
    heading: "Skills",
    entries: skills.map((group) => ({
      label: group.label,
      bullets: group.items,
    })),
  },
  {
    id: "recognition",
    heading: "Recognition",
    entries: [{ label: "Awards", bullets: [...awards] }],
  },
  {
    id: "reading",
    heading: "Papers that shaped the work",
    note: "Not a reading list — each one changed what I thought was possible.",
    entries: Object.values(paperLibrary).map((paper) => ({
      label: paper.title,
      body: paper.note,
      links: [{ label: "arXiv", href: paper.href }],
    })),
  },
  {
    id: "contact",
    heading: "Contact",
    entries: [
      {
        label: "Cold emails work",
        body: `Reach ${profile.name} at ${profile.email}.`,
        links: socialLinks.map((link) => ({ label: link.label, href: link.href })),
      },
    ],
  },
];

/** Serialize the brief to the markdown-flavoured plain text served at /llms.txt. */
export function briefToMarkdown(): string {
  const out: string[] = [
    `# ${profile.name} — ${profile.role}`,
    "",
    profile.summary,
    "",
    `> Machine-readable brief for LLMs and agents. Human site: ${baseUrl} · this file: ${baseUrl}/llms.txt · rendered version: ${baseUrl}/agents`,
    "",
  ];

  for (const section of briefSections) {
    out.push(`## ${section.heading}`);
    if (section.note) out.push(`_${section.note}_`);
    out.push("");

    for (const entry of section.entries) {
      out.push(`### ${entry.label}`);
      if (entry.meta) out.push(entry.meta);
      if (entry.body) out.push(entry.body);
      if (entry.bullets?.length) {
        out.push(...entry.bullets.map((b) => `- ${b}`));
      }
      if (entry.links?.length) {
        out.push(...entry.links.map((l) => `- ${l.label}: ${l.href}`));
      }
      out.push("");
    }
  }

  out.push("---", `Last generated from site data. Canonical: ${baseUrl}/llms.txt`);
  return out.join("\n");
}
