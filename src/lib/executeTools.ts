export type ToolCall = {
  name: string;
  arguments: Record<string, string>;
};

const sectionIdMap: Record<string, string> = {
  projects: "projects",
  "how-i-work": "thinking",
  reading: "reading",
  education: "education",
  achievements: "research",
  contact: "contact",
};

const caseStudySlugMap: Record<string, string> = {
  medaura: "medaura",
  slm: "tinystories",
  gnuradio: "gnuradio-mcp",
  rfwatch: "rf-watch",
};

export function executeTool(
  tool: ToolCall,
  onToast: (msg: string) => void
) {
  const { name, arguments: args } = tool;

  // Always delay navigation 800ms after response starts
  const navigate = (fn: () => void) => setTimeout(fn, 800);

  if (name === "scroll_to_section") {
    const id = sectionIdMap[args.section];
    const el = document.getElementById(id);
    if (!el) return;
    onToast(`↗ Scrolling to ${args.section}...`);
    navigate(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("section-highlight");
      setTimeout(() => el.classList.remove("section-highlight"), 600);
    });
  }

  if (name === "open_case_study") {
    onToast(`↗ Opening ${args.project} case study...`);
    navigate(() => {
      const slug = caseStudySlugMap[args.project];
      if (slug) window.location.href = `/case-studies/${slug}`;
    });
  }

  if (name === "highlight_card") {
    const el = document.getElementById(`project-${args.project}`);
    if (!el) return;
    navigate(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("card-highlight");
      setTimeout(() => el.classList.remove("card-highlight"), 2000);
    });
  }

  if (name === "scroll_to_paper") {
    onToast(`↗ Opening reading room...`);
    navigate(() => {
      const el = document.getElementById(`paper-${args.paper}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("card-highlight");
      setTimeout(() => el.classList.remove("card-highlight"), 2000);
    });
  }
}
