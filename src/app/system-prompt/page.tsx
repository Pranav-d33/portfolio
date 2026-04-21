import React from 'react';

export default function SystemPromptPage() {
  return (
    <main className="min-h-screen bg-background text-t1 font-mono p-6 md:p-12 lg:p-24 selection:bg-accent/30 flex justify-center">
      <div className="w-full max-w-3xl">
        <a href="/" className="inline-flex items-center gap-2 text-t3 hover:text-accent transition-colors mb-12 text-sm z-10 relative">
          <span>←</span>
          <span>Back to portfolio</span>
        </a>
        
        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center gap-3 text-t3 text-sm opacity-60">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span>system_directive.prompt</span>
            <span>—</span>
            <span>read-only</span>
          </div>

          <div className="border border-border-dim/50 rounded-lg bg-surface/30 backdrop-blur-md p-6 md:p-10 shadow-2xl overflow-x-auto relative group">
            {/* Soft shadow glow effect */}
            <div className="absolute inset-0 bg-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <pre className="text-[13px] md:text-[14px] leading-relaxed text-t2 whitespace-pre-wrap">
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

<context>
The USER is currently viewing your portfolio. Provide an experience that underscores your deep expertise in both machine learning infrastructure and modern front-end design, simultaneously demonstrating your unique, AI-native approach to problem-solving.
</context>
</system_prompt>`}
            </pre>
          </div>
          
          <div className="text-t3/40 text-xs mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-t3/40 rounded-full inline-block"></span>
            End of system prompt. Awaiting user input...
          </div>
        </div>
      </div>
    </main>
  );
}
