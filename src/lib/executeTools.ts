import { scrollToSection } from "./scroll";

export type ToolCall = {
  name: string;
  arguments: Record<string, string>;
};

export function executeTool(
  tool: ToolCall,
  onToast: (msg: string) => void
) {
  const { name, arguments: args } = tool;

  // Always delay navigation 800ms after response starts
  const navigate = (fn: () => void) => setTimeout(fn, 800);

  if (name === "scroll_to_section") {
    const id = args.section;
    const el = document.getElementById(id);
    if (!el) return;
    onToast(`↗ Scrolling to ${id}...`);
    // The page scrolls through Lenis — a raw scrollIntoView fights it.
    navigate(() => scrollToSection(id));
  }

  if (name === "open_case_study") {
    const slug = args.project;
    if (!slug) return;
    onToast(`↗ Opening ${slug} case study...`);
    navigate(() => {
      window.location.href = `/case-studies/${slug}`;
    });
  }

  if (name === "highlight_card") {
    const el = document.getElementById(`project-${args.project}`);
    if (!el) return;
    onToast(`↗ Showing ${args.project}...`);
    navigate(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("card-highlight");
      setTimeout(() => el.classList.remove("card-highlight"), 2000);
    });
  }
}
