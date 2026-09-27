import { briefToMarkdown } from "@/lib/agentBrief";

// the brief is build-time data — prerender it instead of running per request
export const dynamic = "force-static";

/** Plain-text brief for LLMs and crawlers — generated from the same data the site renders. */
export function GET() {
  return new Response(briefToMarkdown(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
