"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { resumePath } from "@/lib/portfolioData";

/** Client-side affordances for the agents page: copy the brief, grab the raw text. */
export function AgentPageActions() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copyBrief = useCallback(async () => {
    try {
      const text = await fetch("/llms.txt").then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      });
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2400);
  }, []);

  return (
    <div className="agents-actions">
      <button onClick={copyBrief} type="button" className="agents-btn agents-btn--solid">
        {state === "copied" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {state === "copied"
          ? "Copied the whole brief"
          : state === "failed"
            ? "Copy failed — open /llms.txt"
            : "Copy this brief as text"}
      </button>
      <a href="/llms.txt" className="agents-btn">
        <FileText className="w-4 h-4" />
        View /llms.txt
      </a>
      <a href={resumePath} target="_blank" rel="noreferrer" className="agents-btn">
        <Download className="w-4 h-4" />
        Résumé
      </a>
    </div>
  );
}
