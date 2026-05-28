import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'System Prompt',
  description: "Pranav Dhiran's system directive — core directives, operating parameters, and constraints for AI-native engineering.",
  alternates: { canonical: '/system-prompt' },
  openGraph: {
    title: 'System Prompt | Pranav Dhiran',
    description: "Pranav Dhiran's system directive — core directives, operating parameters, and constraints.",
    url: '/system-prompt',
  },
  twitter: { card: 'summary', title: 'System Prompt | Pranav Dhiran', description: "Pranav Dhiran's system directive." },
};

export default function SystemPromptPage() {
  return (
    <main className="min-h-screen bg-canvas-porcelain dark:bg-[#111111] text-ebony-text dark:text-white font-degular">
      <div className="max-w-[800px] mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-1 text-body-sm text-stone-text hover:text-ebony-text transition-colors mb-12">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to portfolio
        </Link>

        <div className="space-y-8">
          <div className="flex items-center gap-3 text-body-sm text-black dark:text-white">
            <span className="w-2 h-2 rounded-full bg-ebony-text" />
            <span className="font-mono font-medium">system_directive.prompt</span>
            <span className="text-fog-border">—</span>
            <span className="px-2 py-0.5 border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/10 rounded-sm text-xs font-mono">read-only</span>
          </div>

          <div className="border border-fog-border bg-white/50 dark:bg-[#2a2a2a] p-6 md:p-10 overflow-x-auto">
            <pre className="text-body-sm leading-relaxed text-graphite-text whitespace-pre-wrap font-mono">
{`<system_prompt>
You are Pranav Dhiran, a powerful engineer-agent focused on building AI systems that actually work.
You operate with a high degree of autonomy to transition complex research ideas into rock-solid production code.

<core_directives>
01. Build from first principles. If an abstraction hides too much, rip it out and build it from scratch. (e.g., training a transformer like TinyStories without shortcuts).
02. Default to action. Prioritize working software over perfect plans.
03. Multi-agent and agentic workflows are your immediate specialty. Respect the complexity of inter-agent orchestration.
04. When dealing with hardware (SDR, RF), expect unreliability. Code defensively.
</core_directives>

<operating_parameters>
- Stack Preference: Python, PyTorch, Next.js, React, FastAPI, GNU Radio.
- Communication Style: Concise, direct, technical, without unnecessary fluff. Vibe is "top-tier design engineer".
- Aesthetic: Brutalist but refined. Function dictates form. Use hyper-minimalist typography and soft shadow transitions.
</operating_parameters>

<constraints>
Do not claim papers you haven't read.
Do not pretend the loss converged when it didn't.
Do not describe a project as "production-ready" without Langfuse traces to prove it.
</constraints>

<context>
The USER is currently viewing your portfolio. Provide an experience that underscores your deep expertise in both machine learning infrastructure and modern front-end design, simultaneously demonstrating your unique, AI-native approach to problem-solving.
</context>
</system_prompt>`}
            </pre>
          </div>

          <p className="text-body-sm text-black dark:text-white font-mono font-medium">
            <span className="w-2 h-2 inline-block rounded-full bg-green-600 dark:bg-green-400 mr-2" />
            End of system prompt. <span className="text-green-600 dark:text-green-400">system active</span>
          </p>
        </div>
      </div>
    </main>
  );
}
