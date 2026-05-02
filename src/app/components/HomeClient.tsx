"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion';
import { caseStudyPath } from '@/lib/portfolioData';

/* ═══════════════════════════════════════════════════════════════
   Framer Motion — Scroll Animation Variants & Components
   ═══════════════════════════════════════════════════════════════ */

const customEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const sectionVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: customEase, staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: customEase },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20, y: 16 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: customEase },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: customEase },
  },
};

function MotionSection({ children, className = '', id, variants = sectionVariants }: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variants?: typeof sectionVariants;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface TerminalLine {
  type: 'command' | 'output' | 'system';
  text: string;
}

interface ArchNode {
  label: string;
  sub?: string;
}

interface ProjectDeepDive {
  title: string;
  overview: string;
  architecture: ArchNode[][];
  decisions: { title: string; detail: string }[];
  lessons: string[];
  tags: string[];
  links: { label: string; href: string }[];
}

/* ═══════════════════════════════════════════════════════════════
   Deep-Dive Data
   ═══════════════════════════════════════════════════════════════ */

const deepDives: Record<string, ProjectDeepDive> = {
  tinystories: {
    title: 'Small Language Model From Scratch — TinyStories',
    overview:
      'Pre-trained a GPT-style autoregressive transformer on the TinyStories dataset entirely from scratch — no pre-trained weights, no borrowed tokenizers, no shortcuts. The goal was to deeply understand every component of the LLM pipeline by building each piece myself.',
    architecture: [
      [{ label: 'Input Tokens' }],
      [{ label: 'Token Embedding + Positional Encoding' }],
      [{ label: 'Transformer Block ×6', sub: 'Self-Attention (6 heads) → LayerNorm → FFN (384→1536→384) → LayerNorm' }],
      [{ label: 'Final Layer Norm → Linear Head' }],
      [{ label: 'Temperature / Top-k Sampling', sub: 'Autoregressive generation' }],
    ],
    decisions: [
      {
        title: 'Custom BPE tokenizer over SentencePiece',
        detail:
          "Built a byte-pair encoding tokenizer from scratch to understand subword tokenization deeply. Training the tokenizer on the actual dataset ensured optimal vocabulary coverage for children's story language patterns.",
      },
      {
        title: 'Memory-mapped data pipeline',
        detail:
          'Used mmap to handle datasets larger than RAM efficiently. This eliminated I/O bottlenecks and allowed random access to training examples without loading the entire dataset into memory.',
      },
      {
        title: 'AMP mixed precision + gradient accumulation',
        detail:
          'Combined automatic mixed precision (FP16 forward, FP32 gradients) with gradient accumulation to simulate larger batch sizes on limited GPU memory — effective batch size of 64 on a single GPU.',
      },
      {
        title: 'Warmup + cosine annealing LR schedule',
        detail:
          'Linear warmup for 2000 steps to stabilize early training, then cosine decay. This prevented early divergence and maintained smooth convergence throughout training.',
      },
    ],
    lessons: [
      'Data quality matters more than model size at this scale — filtering and deduplication improved generation quality more than adding parameters.',
      'AMP cuts memory usage ~40% with negligible quality impact, making it a no-brainer for any training run.',
      'Building a tokenizer from scratch reveals why subword segmentation choices fundamentally affect model behavior.',
      'The gap between "training a model" and "training a good model" is mostly in the engineering details: learning rate schedules, gradient clipping, proper initialization.',
    ],
    tags: ['PyTorch', 'Hugging Face', 'AMP', 'NLP'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories-',
      },
    ],
  },
  medaura: {
    title: 'Medaura — Agentic Pharmacy System',
    overview:
      'A full-stack multi-agent AI system for autonomous medication ordering. Five specialized agents collaborate through a custom orchestration pipeline, handling everything from order processing and safety checks to demand forecasting and procurement — across four languages.',
    architecture: [
      [{ label: 'User Interface', sub: 'React · EN / HI / MR / ES' }],
      [{ label: 'Orchestrator / Router Agent', sub: 'Intent classification → Agent dispatch' }],
      [
        { label: 'Order Agent', sub: 'CRUD operations' },
        { label: 'Safety Agent', sub: 'Drug interactions' },
        { label: 'Forecast Agent', sub: 'Demand prediction' },
        { label: 'Procurement Agent', sub: 'Supplier matching' },
      ],
      [{ label: 'ChromaDB + Langfuse', sub: 'RAG · Observability · Tracing' }],
    ],
    decisions: [
      {
        title: 'Agent decomposition by domain responsibility',
        detail:
          'Each agent owns one domain (ordering, safety, forecasting, procurement, UI) rather than splitting by function. This mirrors how real pharmacy operations work — each agent makes autonomous decisions within its scope, escalating cross-domain conflicts to the orchestrator.',
      },
      {
        title: 'ChromaDB for drug interaction RAG',
        detail:
          'Embedded a drug interaction database into ChromaDB for semantic retrieval. The Safety Agent queries this before every order confirmation, enabling real-time contraindication detection without hardcoding every drug pair.',
      },
      {
        title: 'Langfuse for observability',
        detail:
          "Instrumented every agent decision with Langfuse tracing. In a multi-agent system, debugging failures requires seeing the full chain of agent reasoning — which agent decided what, when, and why.",
      },
      {
        title: 'Four-language support at the UI layer',
        detail:
          'Multilingual support implemented at the UI Agent level rather than translating at every agent boundary. This keeps the inter-agent communication protocol clean (English-only internally) while serving diverse end users.',
      },
    ],
    lessons: [
      "Multi-agent coordination is 10× harder than single-agent systems. The orchestrator's routing logic became the most critical (and fragile) component.",
      'Observability is non-negotiable in agentic systems — without Langfuse traces, debugging agent miscommunication was nearly impossible.',
      'RAG quality for drug safety is life-critical. Chunk size, overlap, and embedding model choice directly affect whether a dangerous interaction is caught.',
      'Designing agent boundaries is an architecture problem, not an AI problem. Get the decomposition wrong and no amount of prompt engineering fixes it.',
    ],
    tags: ['FastAPI', 'LangChain', 'ChromaDB', 'Langfuse', 'React'],
    links: [
      { label: 'Live Demo', href: 'https://aipharmacyproject-blond.vercel.app' },
    ],
  },
  'gnuradio-mcp': {
    title: 'GNU Radio MCP Server — LLM-to-SDR Bridge',
    overview:
      'An MCP (Model Context Protocol) server that bridges large language models to live GNU Radio software-defined radio flowgraphs. Enables LLMs to control SDR hardware, capture IQ data, analyze spectrum, and tune parameters — all through natural language.',
    architecture: [
      [{ label: 'LLM Client', sub: 'Claude, GPT · stdio / HTTP' }],
      [{ label: 'MCP Server', sub: 'FastMCP · 13 tools · Pydantic v2' }],
      [{ label: 'ZMQ Context', sub: 'Lifespan-managed' }],
      [{ label: 'GNU Radio Flowgraph' }],
      [
        { label: 'XML-RPC', sub: 'Parameter control' },
        { label: 'ZMQ Stream', sub: 'IQ data capture' },
      ],
      [
        { label: 'SDR Source', sub: 'HackRF One' },
        { label: 'DSP Pipeline', sub: 'Filters, demod, FFT' },
      ],
    ],
    decisions: [
      {
        title: 'ZMQ for async IQ data streaming',
        detail:
          "Chose ZeroMQ over REST polling for real-time IQ sample capture. ZMQ's pub/sub pattern allows the MCP server to receive continuous waveform data without blocking the LLM interaction loop.",
      },
      {
        title: 'Pydantic v2 for tool parameter validation',
        detail:
          'Every tool input is validated through Pydantic v2 models before reaching GNU Radio. This prevents an LLM hallucination (e.g., setting center frequency to -1 GHz) from crashing the SDR hardware.',
      },
      {
        title: 'Dual transport: stdio + streamable HTTP',
        detail:
          'Supporting both transport modes lets the server work locally (stdio for Claude Desktop) and remotely (HTTP for web-based agents). Same tool implementations, different transport layer.',
      },
      {
        title: 'Lifespan-managed ZMQ context',
        detail:
          'The ZMQ context is created/destroyed with the server lifecycle, preventing socket leaks. In SDR applications, orphaned sockets can lock the USB device and require a hardware reset.',
      },
    ],
    lessons: [
      '<span className="display-inline">Hardware integration</span> demands defensive programming — every SDR command can fail for physical reasons (antenna disconnected, USB bandwidth saturated, thermal throttling).',
      'Real-time constraints fundamentally change architecture. Buffered processing that works fine for text fails for continuous RF streams.',
      'MCP is a powerful abstraction for hardware control. The protocol naturally separates "what the LLM wants to do" from "how the hardware does it."',
      'Welch PSD with proper windowing produces dramatically better spectral estimates than naive FFT — a lesson from signal processing fundamentals.',
    ],
    tags: ['Python', 'FastMCP', 'ZMQ', 'XML-RPC', 'GNU Radio'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Pranav-d33/gnuradio-mcp-server' },
    ],
  },
  rfwatch: {
    title: 'RF Watch — Open-Source Real-Time RF Spectrum Monitor',
    overview:
      'A real-time RF spectrum analyzer using HackRF One and GNU Radio. Extracts spectral features via FFT and feeds them into a lightweight ML classifier for passive detection of unknown transmitters. Originally built as an anti-drone detection system for ITBP during SIH 2025.',
    architecture: [
      [{ label: 'HackRF One SDR', sub: 'Raw IQ samples · 8 MHz bandwidth' }],
      [{ label: 'GNU Radio DSP', sub: 'Welch PSD · Peak Detect · Band Energy' }],
      [{ label: 'Feature Vector', sub: 'Peak freq, BW, SNR, modulation entropy, duty cycle' }],
      [{ label: 'ML Classifier', sub: 'Lightweight · Edge-ready' }],
      [{ label: 'Alert: Unknown Transmitter Detected', sub: 'Passive detection · No transmission' }],
    ],
    decisions: [
      {
        title: 'Welch PSD over raw FFT',
        detail:
          "Welch's method (overlapping, windowed, averaged periodograms) produces smoother, more reliable spectral estimates than a single FFT. This significantly reduced false positives in the classifier by providing stable frequency-domain features.",
      },
      {
        title: 'Feature engineering over deep learning',
        detail:
          'Chose hand-crafted spectral features (peak frequency, bandwidth, SNR, modulation entropy) over raw IQ → CNN approaches. The feature-engineered pipeline runs on edge hardware and is interpretable — critical for a security application.',
      },
      {
        title: 'Passive detection philosophy',
        detail:
          'RF Watch only listens — it never transmits. This makes it undetectable and legal to operate without a license. The system identifies anomalies in the RF environment by learning what "normal" looks like and flagging deviations.',
      },
      {
        title: 'Automated frequency sweep',
        detail:
          'Rather than monitoring a single band, RF Watch sweeps across a configurable range, dwelling on each band long enough for reliable feature extraction. This trades temporal resolution for spectral coverage.',
      },
    ],
    lessons: [
      "The RF environment is incredibly noisy. Urban areas have dense, overlapping signals that make anomaly detection genuinely hard — this isn't a toy problem.",
      'Feature engineering matters more than model complexity for edge deployment. A well-designed feature vector with a lightweight classifier outperformed a larger model on raw data.',
      '<span className="display-inline">Signal processing fundamentals</span> (windowing, spectral estimation, filter design) are not optional — they\'re the foundation everything else depends on.',
      'Building for a real defense use case (ITBP anti-drone) imposed constraints that made the system better: minimal latency, low power, high reliability.',
    ],
    tags: ['Python', 'GNU Radio', 'HackRF One', 'Signal Processing'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Pranav-d33/RFwatch' },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   Terminal Command Processor
   ═══════════════════════════════════════════════════════════════ */

function processTerminalCommand(input: string): TerminalLine[] {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase() || '';
  const arg = parts.slice(1).join(' ').toLowerCase();

  switch (cmd) {
    case 'help':
      return [
        { type: 'output', text: '' },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '' },
        { type: 'output', text: '  whoami        about me' },
        { type: 'output', text: '  projects      list all projects' },
        { type: 'output', text: '  cat <name>    view project details' },
        { type: 'output', text: '                (tinystories | medaura | mcp | rfwatch)' },
        { type: 'output', text: '  contact       get in touch' },
        { type: 'output', text: '  clear         clear terminal' },
        { type: 'output', text: '  exit          close terminal' },
        { type: 'output', text: '' },
      ];

    case 'whoami':
      return [
        { type: 'output', text: '' },
        { type: 'output', text: 'Pranav Dhiran' },
        { type: 'output', text: '─────────────' },
        { type: 'output', text: 'I started in RF and signals.' },
        { type: 'output', text: 'Turns out the most interesting signal to decode is language.' },
        { type: 'output', text: 'Now I build the systems that do both — from transformers' },
        { type: 'output', text: 'to multi-agent pipelines to LLM-controlled hardware.' },
        { type: 'output', text: '' },
        { type: 'output', text: 'B.Tech — Electronics & Telecom Engineering' },
        { type: 'output', text: 'SGGSIE&T, Nanded | 2023–Present' },
        { type: 'output', text: '' },
      ];

    case 'projects':
    case 'ls':
      return [
        { type: 'output', text: '' },
        { type: 'output', text: '  tinystories   Small Language Model From Scratch' },
        { type: 'output', text: '  medaura       Agentic Pharmacy System' },
        { type: 'output', text: '  mcp           GNU Radio MCP Server' },
        { type: 'output', text: '  rfwatch       RF Spectrum Monitor' },
        { type: 'output', text: '' },
        { type: 'output', text: "  Use 'cat <name>' for details." },
        { type: 'output', text: '' },
      ];

    case 'cat': {
      const projectMap: Record<string, string[]> = {
        tinystories: [
          '',
          '═══ Small Language Model From Scratch — TinyStories ═══',
          '',
          'Pre-trained a GPT-style autoregressive transformer',
          '(6L, 6H, 384-dim) on TinyStories from scratch.',
          'Custom BPE tokenization, mmap pipelines, AMP mixed',
          'precision, gradient accumulation, warmup + cosine',
          'LR scheduling, temperature/top-k sampling.',
          '',
          'Stack: PyTorch · Hugging Face · AMP · NLP',
          'Link:  github.com/Pranav-d33/small_language_model_from_scratch-TinyStories-',
          '',
        ],
        medaura: [
          '',
          '═══ Medaura — Agentic Pharmacy System ═══',
          '',
          'Full-stack multi-agent AI system — five specialized',
          'agents with a custom orchestration pipeline for',
          'autonomous medication ordering across four languages.',
          '',
          'Agents: Ordering · Safety · Forecast · Procurement · UI',
          'Stack:  FastAPI · LangChain · ChromaDB · Langfuse · React',
          'Link:   aipharmacyproject-blond.vercel.app',
          '',
        ],
        mcp: [
          '',
          '═══ GNU Radio MCP Server — LLM-to-SDR Bridge ═══',
          '',
          'MCP server bridging LLMs to live GNU Radio SDR',
          'flowgraphs — 13 tools with Pydantic v2 validation,',
          'lifespan-managed ZMQ context, and stdio/streamable-HTTP',
          'transport. Async IQ capture with Welch PSD.',
          '',
          'Stack: Python · FastMCP · ZMQ · XML-RPC · GNU Radio',
          'Link:  github.com/Pranav-d33/gnuradio-mcp-server',
          '',
        ],
        'gnuradio-mcp': [
          '',
          '═══ GNU Radio MCP Server — LLM-to-SDR Bridge ═══',
          '',
          '(same as: cat mcp)',
          '',
        ],
        rfwatch: [
          '',
          '═══ RF Watch — Real-Time RF Spectrum Monitor ═══',
          '',
          'Real-time RF spectrum analyzer using HackRF One +',
          'GNU Radio. FFT-based spectral feature extraction',
          'with a <span className="display-inline">lightweight ML classifier</span> for passive',
          'detection of unknown transmitters.',
          '',
          'Built for ITBP anti-drone detection (SIH 2025).',
          '',
          'Stack: Python · GNU Radio · HackRF One · Signal Processing',
          'Link:  github.com/Pranav-d33/RFwatch',
          '',
        ],
      };
      const lines = projectMap[arg];
      if (lines) {
        return lines.map((text) => ({ type: 'output' as const, text }));
      }
      return [
        {
          type: 'output',
          text: `cat: ${arg || '?'}: not found. Try: tinystories, medaura, mcp, rfwatch`,
        },
      ];
    }

    case 'contact':
      return [
        { type: 'output', text: '' },
        { type: 'output', text: '  Email:    dhiranpranav72@gmail.com' },
        { type: 'output', text: '  GitHub:   github.com/Pranav-d33' },
        { type: 'output', text: '  LinkedIn: linkedin.com/in/pranav-dhiran' },
        { type: 'output', text: '' },
      ];

    case 'sudo':
      return [{ type: 'output', text: 'nice try.' }];

    case 'rm':
      return [{ type: 'output', text: 'not today.' }];

    case 'vim':
    case 'nano':
    case 'emacs':
      return [{ type: 'output', text: 'this is a read-only terminal.' }];

    case 'neofetch':
      return [
        { type: 'output', text: '' },
        { type: 'output', text: '  ╔══╗    pranav@portfolio' },
        { type: 'output', text: '  ║██║    ────────────────' },
        { type: 'output', text: '  ║██║    OS: Next.js 16 on Vercel' },
        { type: 'output', text: '  ╚══╝    Shell: pranav_terminal v1.0' },
        { type: 'output', text: '           Role: AI Engineer' },
        { type: 'output', text: '           Uptime: since 2023' },
        { type: 'output', text: '' },
      ];

    case '':
      return [];

    default:
      return [
        {
          type: 'output',
          text: `command not found: ${cmd}. Type 'help' for available commands.`,
        },
      ];
  }
}

/* ═══════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════ */

/* ─── Typing effect hook ─── */
function useTypingEffect(phrases: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        // Token simulation: jump by chunks to mimic LLM token streaming
        const step = isDeleting ? (Math.floor(Math.random() * 4) + 2) : (Math.floor(Math.random() * 3) + 2);
        setText(isDeleting 
          ? current.slice(0, Math.max(0, text.length - step)) 
          : current.slice(0, Math.min(current.length, text.length + step))
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return { text, isComplete: text === phrases[phraseIndex] && !isDeleting };
}

/* ─── Streaming Text Component (One-way token streaming) ─── */
function StreamingText({ text, isVisible, speed = 15, showCursor = true, showFlash = true }: { text: string; isVisible?: boolean; speed?: number; showCursor?: boolean, showFlash?: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [localVisible, setLocalVisible] = useState(isVisible ?? true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible !== undefined) {
      setLocalVisible(isVisible);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLocalVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!localVisible) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }
    
    if (displayedText === text) {
      setIsComplete(true);
      return;
    }

    const timeout = setTimeout(() => {
      const step = Math.floor(Math.random() * 4) + 2;
      setDisplayedText(text.slice(0, Math.min(text.length, displayedText.length + step)));
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, localVisible, displayedText, speed]);

  return (
    <span ref={ref}>
      {displayedText}
      {showCursor && !isComplete && <span className="llm-cursor"></span>}
      {showCursor && isComplete && showFlash && <span className="token-flash">&lt;|end|&gt;</span>}
    </span>
  );
}

/* ─── Scroll-triggered reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Bento Card Component ─── */
function BentoCard({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`bento-card ${className} ${onClick ? 'cursor-pointer hover-arrow' : ''}`}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      <div className="bento-card-bg" />
      <div className="bento-card-content">{children}</div>
    </div>
  );
}

/* ─── Contact Email Long Press Component ─── */
function ContactEmail() {
  const [copied, setCopied] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      navigator.clipboard.writeText("dhiranpranav72@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <span 
      className="relative cursor-pointer hover:text-t2 transition-colors touch-none select-none"
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onClick={() => {
        // Fallback for desktop quick click if they don't hold
        window.location.href = "mailto:dhiranpranav72@gmail.com";
      }}
    >
      Email
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-2 border border-border-dim px-2 py-1 rounded text-[10px] text-t1 whitespace-nowrap shadow-sm z-50">
          Copied
        </span>
      )}
    </span>
  );
}

/* ─── Swipeable Project Card (Mobile Drawer) ─── */
function SwipeableProject({ children, proofTitle, proofDesc, onClick, id }: { children: React.ReactNode, proofTitle: string, proofDesc: string, onClick?: () => void, id?: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const x = useMotionValue(0);
  const proofOpacity = useTransform(x, [-168, -36, 0], [1, 0.35, 0]);
  const didDragRef = useRef(false);
  const dragResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    const initialFrame = window.requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) x.set(0);
  }, [isMobile, x]);

  useEffect(() => {
    return () => {
      if (dragResetTimerRef.current) clearTimeout(dragResetTimerRef.current);
    };
  }, []);

  return (
    <div id={id} className="swipeable-project relative rounded-xl overflow-hidden">
      {/* Proof Layer (Behind) */}
      <motion.div
        className="swipeable-project-proof absolute inset-0 bg-surface-2 border border-border-dim rounded-xl z-0 pointer-events-none sm:hidden"
        style={{ opacity: proofOpacity }}
      >
        <div className="swipeable-project-proof-copy">
          <div className="type-t6 text-accent mb-2">{proofTitle}</div>
          <div className="type-t6 font-mono text-t3 leading-snug">{proofDesc}</div>
        </div>
      </motion.div>
      
      {/* Draggable Card */}
      <motion.div
        variants={cardVariants}
        whileHover={{ x: isMobile ? 0 : 4, transition: { duration: 0.2 } }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -176, right: 0 }}
        dragElastic={0.04}
        dragMomentum={false}
        className="project-card cursor-pointer group m-0 relative z-10 touch-pan-y"
        onDragStart={() => {
          didDragRef.current = true;
          if (dragResetTimerRef.current) clearTimeout(dragResetTimerRef.current);
        }}
        onDragEnd={(_, info) => {
          const snapOpen = info.offset.x < -72 || info.velocity.x < -450;
          animate(x, snapOpen ? -168 : 0, {
            type: 'spring',
            stiffness: 520,
            damping: 42,
            mass: 0.8,
          });
          dragResetTimerRef.current = setTimeout(() => {
            didDragRef.current = false;
          }, 160);
        }}
        onClick={(event) => {
          if (didDragRef.current) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.();
        }}
        style={{ x, touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export default function HomeClient() {
  /* ─── Existing state ─── */
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('');
  const [showTopBtn, setShowTopBtn] = useState(false);

  /* ─── New state ─── */
  const [deepDiveProject, setDeepDiveProject] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  /* ─── Refs ─── */
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const konamiIndexRef = useRef(0);

  /* ─── Hooks ─── */
  const { text: typedText, isComplete: isTypingComplete } = useTypingEffect(
    [
      'training transformers from scratch',
      'building multi-agent pipelines',
      'engineering MCP servers',
    ],
    45,
    25,
    1800
  );

  useScrollReveal();

  /* ─── Intersection-based scroll-spy ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  /* ─── Mobile Detection ─── */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ─── Device orientation for Hero Tilt ─── */
  useEffect(() => {
    // Only apply tilt effect on non-mobile devices
    if (isMobile) {
      setTilt({ x: 0, y: 0 });
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      // limit the values and scale down
      const x = Math.max(-15, Math.min(15, gamma)) * 0.3;
      const y = Math.max(-15, Math.min(15, beta - 45)) * 0.3;
      setTilt({ x, y });
    };
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [isMobile]);

  /* ─── Custom cursor follower ─── */
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  /* ─── Theme toggle ─── */
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  /* ─── Back-to-top visibility ─── */
  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Konami code listener ─── */
  useEffect(() => {
    const sequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a',
    ];

    const onKeyDown = (e: KeyboardEvent) => {
      if (terminalOpen || deepDiveProject) {
        konamiIndexRef.current = 0;
        return;
      }

      if (e.key === sequence[konamiIndexRef.current]) {
        konamiIndexRef.current++;
        if (konamiIndexRef.current === sequence.length) {
          setTerminalOpen(true);
          konamiIndexRef.current = 0;
        }
      } else {
        konamiIndexRef.current = e.key === sequence[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [terminalOpen, deepDiveProject]);

  /* ─── Escape key handler ─── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (terminalOpen) setTerminalOpen(false);
        else if (deepDiveProject) setDeepDiveProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [terminalOpen, deepDiveProject]);

  /* ─── Body scroll lock for overlays ─── */
  useEffect(() => {
    if (deepDiveProject || terminalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deepDiveProject, terminalOpen]);

  /* ─── Terminal boot sequence ─── */
  useEffect(() => {
    if (terminalOpen) {
      setTerminalHistory([
        { type: 'system', text: '╔══════════════════════════════════════════╗' },
        { type: 'system', text: '║  pranav_terminal v1.0                    ║' },
        { type: 'system', text: "║  type 'help' for available commands      ║" },
        { type: 'system', text: '╚══════════════════════════════════════════╝' },
        { type: 'system', text: '' },
      ]);
      setTerminalInput('');
      setTimeout(() => terminalInputRef.current?.focus(), 100);
    }
  }, [terminalOpen]);

  /* ─── Terminal auto-scroll ─── */
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  /* ─── Callbacks ─── */
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleTerminalSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmdText = terminalInput.trim();
      setTerminalInput('');

      if (cmdText.toLowerCase() === 'clear') {
        setTerminalHistory([]);
        return;
      }

      if (cmdText.toLowerCase() === 'exit') {
        setTerminalOpen(false);
        return;
      }

      const cmdLine: TerminalLine = { type: 'command', text: `$ ${cmdText}` };
      const result = processTerminalCommand(cmdText);
      setTerminalHistory((prev) => [...prev, cmdLine, ...result]);
    },
    [terminalInput]
  );

  /* ─── Data ─── */
  const navItems = [
    { id: 'projects', label: '01' },
    { id: 'thinking', label: '02' },
    { id: 'reading', label: '03' },
    { id: 'education', label: '04' },
    { id: 'research', label: '05' },
    { id: 'contact', label: '06' },
  ];

  const thinkingSteps = [
    { num: '01', title: 'Problem Framing', desc: "I ask what the actual constraint is. Usually it's not the one in the brief." },
    { num: '02', title: 'First Principles', desc: "If I don't understand what's inside the abstraction, I build it myself. That's why the SLM exists." },
    { num: '03', title: 'Prototype', desc: "A working version that's wrong teaches more than a perfect plan that hasn't run yet." },
    { num: '04', title: 'Feedback Loop', desc: "Loss curves, Langfuse traces, RF spectrum plots — I instrument everything. You can't fix what you can't see." },
    { num: '05', title: 'Ship & Iterate', desc: 'Medaura is live. RF Watch is open-sourced. Shipping is the only honest benchmark.' },
  ];

  const currentDeepDive = deepDiveProject ? deepDives[deepDiveProject] : null;

  return (
    <>
      {/* CUSTOM CURSOR FOLLOWER */}
      <div
        id="custom-cursor"
        className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:flex items-center justify-center w-4 h-4 -ml-2 -mt-2 text-accent font-mono text-lg opacity-70"
      >
        +
      </div>

      {/* REAL-TIME SCROLL SPY */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-end gap-6">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="group flex items-center gap-4"
            aria-label={`Scroll to ${item.id}`}
          >
            <span
              className={`text-[10px] font-mono transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-primary-green opacity-100 translate-x-0'
                  : 'text-t3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {item.label}
            </span>
            <div
              className={`w-2 transition-all duration-300 rounded-full ${
                activeSection === item.id
                  ? 'h-6 bg-primary-green'
                  : 'h-2 bg-border-dim group-hover:bg-t3'
              }`}
            />
          </a>
        ))}
      </div>

      {/* NAVIGATION */}
      <nav className="portfolio-nav sticky top-0 z-50 w-full pointer-events-none">
        <div className="pointer-events-auto flex justify-start sm:justify-between items-center container py-4 bg-background/85 backdrop-blur-sm border-x border-b border-border-dim/10">
          <div className="hidden sm:block type-t2 font-medium group cursor-default text-primary-green">
            <span className="inline-block transition-transform duration-300 group-hover:scale-110">
              P
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:scale-110 delay-75">
              D
            </span>
          </div>
          <div className="flex gap-4 sm:gap-6 items-center type-t6 overflow-x-auto no-scrollbar">
            <a
              href="#projects"
              className={`nav-link link transition-colors ${
                activeSection === 'projects' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              Projects
            </a>
            <a
              href="#thinking"
              className={`nav-link link whitespace-nowrap transition-colors ${
                activeSection === 'thinking' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              How I Work
            </a>
            <a
              href="#reading"
              className={`nav-link link transition-colors ${
                activeSection === 'reading' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              Reading
            </a>
            <a
              href="#education"
              className={`nav-link link transition-colors ${
                activeSection === 'education' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              Education
            </a>
            <a
              href="#research"
              className={`nav-link link transition-colors ${
                activeSection === 'research' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              Research
            </a>
            <a
              href="#contact"
              className={`nav-link link transition-colors ${
                activeSection === 'contact' ? 'text-accent active' : 'text-t2 hover:text-t1'
              }`}
            >
              Contact
            </a>
            <a
              href="/resume_v4.pdf"
              download
              className="nav-resume-button"
              aria-label="Download Resume"
            >
              <span>Resume</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>

            {/* Sun / Moon theme toggle */}
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
              className="theme-toggle ml-2 w-7 h-7 flex items-center justify-center rounded-full border border-border-dim hover:border-t2 transition-all duration-300 hover:rotate-180"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-t3"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-t3"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="portfolio-main container flex flex-col">
        {/* ═══════════ HERO SECTION ═══════════ */}
        <motion.section 
          className="hero-section section snap-section"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <div className="hero-layout flex flex-col-reverse sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
            <div className="flex-1 w-full">
              <h1 className="hero-name type-t1 text-t1 hero-gradient flex flex-col">
                <div className="flex">
                  {"Pranav".split('').map((char, i) => (
                    <motion.span 
                      key={`first-${i}`}
                      className="hero-name-letter"
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } }
                      }}
                      style={{ 
                        display: 'inline-block',
                        x: tilt.x * (i % 2 === 0 ? 1 : -1.2), 
                        y: tilt.y * (i % 2 === 0 ? -1 : 1.2)
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="flex">
                  {"Dhiran".split('').map((char, i) => (
                    <motion.span 
                      key={`last-${i}`}
                      className="hero-name-letter"
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: customEase } }
                      }}
                      style={{ 
                        display: 'inline-block',
                        x: tilt.x * (i % 2 === 0 ? 1 : -1.2), 
                        y: tilt.y * (i % 2 === 0 ? -1 : 1.2)
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </h1>
              <motion.div variants={itemVariants} className="type-t4 text-t2 font-medium mb-4">LLM &amp; Agentic Systems Engineer</motion.div>
              <motion.div variants={itemVariants} className="type-t4 text-t3 mb-6 font-mono h-6 flex items-center">
                <span className="text-primary-green mr-1">›</span>
                <span>{typedText}</span>
                {isTypingComplete ? (
                  <span className="token-flash">&lt;|end|&gt;</span>
                ) : (
                  <span className="llm-cursor"></span>
                )}
              </motion.div>
              <motion.div variants={itemVariants} className="type-t4 font-medium text-t2 mb-6 max-w-[680px]">
                I build AI systems that go from research paper to working prototype fast — language models, multi-agent pipelines, and the infra that holds them together.
              </motion.div>
              <motion.div variants={itemVariants} className="flex gap-2 mb-8 flex-wrap">
                <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary-green/50 bg-transparent type-t6 text-primary-green">
                  SIH National Finalist ×2
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary-green/50 bg-transparent type-t6 text-primary-green">
                  Open to internships &amp; research collaborations
                </span>
              </motion.div>
              <motion.div variants={itemVariants} className="hero-cta-group">
                <a href="/resume_v4.pdf" download className="button button-primary text-sm group">
                  <span className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">Download Resume</span>
                  <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
                </a>
                <div className="hero-social-links type-t6">
                  <a href="mailto:dhiranpranav72@gmail.com" className="button button-secondary">Email</a>
                  <span>·</span>
                  <a href="https://github.com/Pranav-d33" className="link link-muted">GitHub</a>
                  <span>·</span>
                  <a href="https://linkedin.com/in/pranav-dhiran" className="link link-muted">LinkedIn</a>
                  <span>·</span>
                  <a href="https://x.com/Prannav_ai" className="link link-muted">X</a>
                </div>
              </motion.div>
            </div>
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="hero-profile group relative sm:ml-6 lg:ml-12 flex-shrink-0">
              <div className="absolute inset-0 border border-primary-green translate-x-2 translate-y-2 rounded-lg opacity-80 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3"></div>
              <div className="hero-profile-frame relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-lg border border-border-dim overflow-hidden -rotate-2 hover:-rotate-1 transition-all duration-500 shadow-sm z-10 bg-background">
                <img
                  src="/portfolio_image.jpeg"
                  alt="Pranav Dhiran"
                  width={160}
                  height={160}
                  className="hero-profile-image w-full h-full object-cover scale-[1.3] origin-bottom"
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="mt-12 sm:mt-20 flex justify-center opacity-40 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-green">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </motion.section>

        {/* ═══════════ PROJECTS ═══════════ */}
        <MotionSection id="projects" className="section section-divider projects-section snap-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Selected Work</h2>
          <motion.div className="projects-grid" variants={itemVariants}>
            {/* Project 2: Medaura */}
            <SwipeableProject
              id="project-medaura"
              proofTitle="Langfuse Trace"
              proofDesc="Orchestrator → UI routing latency < 120ms"
              onClick={() => {
                window.location.href = caseStudyPath('medaura');
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <div className="type-t3 mb-2">
                    Medaura — Agentic Pharmacy System
                  </div>
                  <div className="project-hook">Medication errors are an information problem. The information exists — it's just not connected at the moment it matters.
                  </div>
                  <div className="type-t4 text-t2 mb-4">
                    Five specialized agents (Ordering, Safety, Forecast, Procurement, UI) orchestrated via LangGraph for stateful, auditable pipelines. ChromaDB RAG for drug interaction retrieval. Langfuse tracing every LLM call and safety check. Live, multilingual, zero human intervention.
                  </div>
                  <div className="tags mb-4">
                    <span className="tag">FastAPI</span>
                    <span className="tag">LangChain</span>
                    <span className="tag">ChromaDB</span>
                    <span className="tag">Langfuse</span>
                    <span className="tag">React</span>
                  </div>
                  <div className="flex gap-4 items-center type-t6">
                    <a
                      href="https://aipharmacyproject-blond.vercel.app"
                      className="link link-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      medaura.vercel.app →
                    </a>
                    <span className="case-study-hint group-hover:text-accent transition-colors">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-2xl transition-transform duration-200 group-hover:translate-x-1 hidden sm:block">→</div>
              </div>
            </SwipeableProject>

            {/* Project 1: TinyStories */}
            <SwipeableProject
              id="project-slm"
              proofTitle="Loss Curve"
              proofDesc="Converged at 2.1 val loss · 2k warmup"
              onClick={() => {
                window.location.href = caseStudyPath('tinystories');
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <div className="type-t3 mb-2">
                    Small Language Model From Scratch — TinyStories
                  </div>
                  <div className="project-hook">Every LLM course teaches you to call an API. I wanted to know what happens before the API.
                  </div>
                  <div className="type-t4 text-t2 mb-4">
                    Pre-trained a GPT-style transformer entirely from scratch — no pretrained weights, no borrowed tokenizers. Built to understand every layer of the pipeline before trusting any abstraction above it.
                  </div>
                  <div className="tags mb-4">
                    <span className="tag">PyTorch</span>
                    <span className="tag">Hugging Face</span>
                    <span className="tag">AMP</span>
                    <span className="tag">NLP</span>
                  </div>
                  <div className="flex gap-4 items-center type-t6">
                    <a
                      href="https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories-"
                      className="link link-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                    <span className="case-study-hint group-hover:text-accent transition-colors">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-2xl transition-transform duration-200 group-hover:translate-x-1 hidden sm:block">→</div>
              </div>
            </SwipeableProject>

            {/* Project 3: GNU Radio MCP */}
            <SwipeableProject
              id="project-gnuradio"
              proofTitle="Arch Diagram"
              proofDesc="ZMQ + XML-RPC split transport"
              onClick={() => {
                window.location.href = caseStudyPath('gnuradio-mcp');
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <div className="type-t3 mb-2">
                    GNU Radio MCP Server — LLM-to-SDR Bridge
                  </div>
                  <div className="project-hook">LLMs can reason about RF signals. They just couldn't touch a radio. This closes that gap.
                  </div>
                  <div className="type-t4 text-t2 mb-4">
                    MCP server bridging language models to live GNU Radio SDR flowgraphs — 13 tools, Pydantic v2 validation, ZMQ + XML-RPC split-protocol architecture, async IQ capture with Welch PSD and peak detection. Ask Claude to sweep frequencies. It does.
                  </div>
                  <div className="tags mb-4">
                    <span className="tag">Python</span>
                    <span className="tag">FastMCP</span>
                    <span className="tag">ZMQ</span>
                    <span className="tag">XML-RPC</span>
                    <span className="tag">GNU Radio</span>
                  </div>
                  <div className="flex gap-4 items-center type-t6">
                    <a
                      href="https://github.com/Pranav-d33/gnuradio-mcp-server"
                      className="link link-accent"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                    <span className="case-study-hint group-hover:text-accent transition-colors">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-2xl transition-transform duration-200 group-hover:translate-x-1 hidden sm:block">→</div>
              </div>
            </SwipeableProject>

            {/* Project 4: RF Watch */}
            <motion.div
              id="project-rfwatch"
              variants={cardVariants}
              className="project-card flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="type-t4 text-t1 font-medium">RF Watch — Open-source RF spectrum monitor · HackRF One + GNU Radio</div>
              <a
                href="https://github.com/Pranav-d33/RFwatch"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-accent mt-2 sm:mt-0 type-t6"
              >
                [GitHub]
              </a>
            </motion.div>
</motion.div>
        </MotionSection>

        {/* ═══════════ HOW I WORK ═══════════ */}
        <MotionSection id="thinking" className="section section-divider">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">How I Work</h2>
          <motion.div className="flex flex-col gap-6 type-t4 text-t2 leading-relaxed" variants={itemVariants}>
            <motion.p variants={itemVariants}>I don&apos;t start with frameworks. I start with the paper, or the problem, and build until I understand it — then I reach for abstractions.</motion.p>
            <motion.p variants={itemVariants}>When I built the SLM from scratch, it wasn&apos;t because HuggingFace doesn&apos;t exist. It was because I needed to know what was actually happening inside the attention block before I could trust anything built on top of it.</motion.p>
            <motion.p variants={itemVariants}>With Medaura, I didn&apos;t architect upfront — I got one agent working, traced it with Langfuse, saw where it broke, and iterated. Every agent call is logged. If something fails in production, I know exactly where and why.</motion.p>
            <motion.p variants={itemVariants} className="text-t1 font-medium">That&apos;s the pattern: build fast, instrument everything, understand before abstracting.</motion.p>
          </motion.div>
        </MotionSection>

        {/* ═══════════ READING ROOM ═══════════ */}
        <MotionSection id="reading" className="section section-divider">
          <div className="section-header border-b border-border-dim pb-2 w-full">
            <h2 className="type-t2">Reading Room</h2>
            <p className="type-t4 text-t2 mt-2 italic">Research that shapes how I build.</p>
          </div>

          {/* Research Interests — Inline Chips */}
          <div className="mb-8">
            <div className="type-t5 text-t3 uppercase tracking-wider mb-4">Research Interests</div>
            <div className="reading-chips">
              {[
                'LLM & SLM Systems',
                'Agent-Native Infrastructure',
                'RL for LLMs',
                'Post-Training & Alignment',
                'Modular Architectures',
              ].map((topic) => (
                <span key={topic} className="reading-chip">{topic}</span>
              ))}
            </div>
          </div>

          {/* Selected Papers */}
          <div>
            <div className="type-t5 text-t3 uppercase tracking-wider mb-2">Selected Papers</div>
            <p className="type-t4 text-t2 text-[12px] italic mb-4">Research that influences my work</p>
            <motion.div className="paper-grid sm:grid-cols-2 horizontal-scroll-strip" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
              {/* ReAct */}
              <motion.div id="paper-react" className="paper-card horizontal-scroll-card" variants={scaleInVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div className="paper-title">ReAct: Synergizing Reasoning and Acting</div>
                <div className="paper-desc">Directly shaped Medaura&apos;s reasoning loop — agents observe before they act.</div>
                <a
                  href="https://arxiv.org/abs/2210.03629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Paper
                </a>
              </motion.div>

              {/* Toolformer */}
              <motion.div id="paper-toolformer" className="paper-card horizontal-scroll-card" variants={scaleInVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div className="paper-title">Toolformer: Models Teach Themselves to Use Tools</div>
                <div className="paper-desc">Built the GNU Radio MCP server with this mental model.</div>
                <a
                  href="https://arxiv.org/abs/2302.04761"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Paper
                </a>
              </motion.div>

              {/* MoE */}
              <motion.div id="paper-switch-transformers" className="paper-card horizontal-scroll-card" variants={scaleInVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div className="paper-title">Switch Transformers: Mixture of Experts</div>
                <div className="paper-desc">Why MoE changes the scaling math — and why modular beats monolithic at scale.</div>
                <a
                  href="https://arxiv.org/abs/2101.03961"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Paper
                </a>
              </motion.div>

              {/* GRPO */}
              <motion.div id="paper-grpo" className="paper-card horizontal-scroll-card" variants={scaleInVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div className="paper-title">Group Relative Policy Optimization</div>
                <div className="paper-desc">The technique behind R1. If you're serious about post-training, this is where to start.</div>
                <a
                  href="https://arxiv.org/abs/2402.03300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Paper
                </a>
              </motion.div>

              {/* DPO */}
              <motion.div id="paper-dpo" className="paper-card horizontal-scroll-card" variants={scaleInVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div className="paper-title">Direct Preference Optimization</div>
                <div className="paper-desc">RLHF without the RL. Understand the math and post-training stops feeling like magic.</div>
                <a
                  href="https://arxiv.org/abs/2305.18290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Paper
                </a>
              </motion.div>
            </motion.div>
          </div>
        </MotionSection>

        {/* ═══════════ EDUCATION ═══════════ */}
        <MotionSection id="education" className="section section-divider">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Education</h2>
          <div className="flex flex-col gap-12">
            <div className="experience-rule pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="type-t6 font-mono text-t3 mb-2">2023 — 2027</div>
                  <div className="type-t4 font-medium">
                    SGGS Institute of Engineering &amp; Technology, Nanded
                  </div>
                </div>
              </div>
              <div className="type-t4 text-t2">B.Tech — Electronics &amp; Telecommunication Engineering</div>
              <div className="type-t5 text-t3 mt-2">Minor in Information Technology</div>
              <div className="mt-6">
                <div className="type-t6 text-t3 uppercase tracking-wider mb-2">Relevant Coursework</div>
                <div className="type-t5 text-t2 leading-relaxed">
                  Digital Signal Processing · MATLAB · Microprocessors &amp; Embedded Systems ·
                  Data Structures &amp; Algorithms · Probability &amp; Random Processes · Linear Algebra
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ═══════════ RESEARCH & ACHIEVEMENTS ═══════════ */}
        <MotionSection id="research" className="section section-divider">
          <div className="section-header border-b border-border-dim pb-2 w-full flex justify-between items-end">
            <h2 className="type-t2">Research &amp; Achievements</h2>
          </div>

          <div className="mb-10">
            <div className="type-t5 text-t3 uppercase tracking-wider mb-6">Certifications</div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="type-t4 text-t1 font-medium">Fine-tuning &amp; RL for LLMs: Intro to Post-training</div>
                <div className="type-t5 text-t3">DeepLearning.AI</div>
              </div>
              <div className="flex flex-col">
                <div className="type-t4 text-t1 font-medium">AI Agents in LangGraph</div>
                <div className="type-t5 text-t3">DeepLearning.AI</div>
              </div>
              <div className="flex flex-col">
                <div className="type-t4 text-t1 font-medium">Quantization Fundamentals</div>
                <div className="type-t5 text-t3">Hugging Face</div>
              </div>
              <div className="flex flex-col">
                <div className="type-t4 text-t1 font-medium">MCP: Build Rich Context AI Apps</div>
                <div className="type-t5 text-t3">Anthropic</div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="type-t5 text-t3 uppercase tracking-wider mb-6">Awards &amp; Recognition</div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col pl-4 border-l-[3px] border-primary-green">
                <div className="type-t4 text-t1 font-medium">Global Finalist (Top 6 Internationally)</div>
                <div className="type-t5 text-t3">UWA Hack For Impact 2026</div>
              </div>
              <div className="flex flex-col pl-4 border-l-[3px] border-primary-green">
                <div className="type-t4 text-t1 font-medium">National Finalist</div>
                <div className="type-t5 text-t3">Smart India Hackathon (SIH) 2024 &amp; 2025</div>
              </div>
              <div className="flex flex-col pl-4 border-l-[3px] border-transparent">
                <div className="type-t4 text-t1 font-medium">Regional Qualifier</div>
                <div className="type-t5 text-t3">Nxt Wave x OpenAI Buildathon</div>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* ═══════════ CONTACT ═══════════ */}
        <MotionSection id="contact" className="section section-divider contact-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Contact</h2>

          <div className="mb-10">
            <p className="type-t4 text-t1 mb-2">
              Open to AI/ML internships and research collaborations —
            </p>
            <p className="type-t4 text-t1">
              particularly in LLM post-training, agentic systems, and inference.
            </p>
          </div>

          {/* Let's Chat CTA */}
          <div className="contact-cta-wrapper mb-12">
            <a href="mailto:dhiranpranav72@gmail.com" className="link link-accent font-display text-[clamp(36px,5vw,56px)] leading-tight">
              dhiranpranav72@gmail.com
            </a>
          </div>

          {/* Resume Download */}
          <div className="mb-8">
            <a
              href="/resume_v4.pdf"
              download
              className="button inline-flex items-center gap-2 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download Resume</span>
            </a>
          </div>

          {/* Social links */}
          <div className="flex gap-4 mt-10 pt-6 border-t border-border-dim/30">
            <a
              href="https://github.com/Pranav-d33"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/pranav-dhiran"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/Prannav_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>X</span>
            </a>
          </div>
        </MotionSection>

        <div className="system-prompt-callout">
          <div className="system-prompt-callout-inner">
            <div className="system-prompt-callout-label">System prompt</div>
            <a href="/system-prompt" className="system-prompt-callout-link">
              View my system prompt
            </a>
          </div>
          <div className="system-prompt-token-count type-t6 text-t3/60">
            Token count of this page — ~1,847 tokens
          </div>
        </div>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-12 border-t border-border-dim/10 mt-10">
          <div className="footer-gradient-line mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="type-t6 text-t3">© {new Date().getFullYear()} Pranav Dhiran</div>
            <div className="footer-token-count flex items-center gap-4 type-t6 text-t3/60">
              <span className="opacity-80">Token count of this page — ~1,847 tokens</span>
            </div>
          </div>
          <div className="footer-epitaph">VENI VIDI VICI</div>
          <div className="footer-note">Built with intent. Iterated with taste.</div>
        </footer>
      </main>

      {/* ═══════════ DEEP DIVE OVERLAY ═══════════ */}
      <AnimatePresence>
        {deepDiveProject && currentDeepDive && (
          <motion.div 
            className="deep-dive-overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button
              className="deep-dive-close relative z-10"
              onClick={() => {
                setDeepDiveProject(null);
              }}
              aria-label="Close deep dive"
            >
              ×
            </button>
            <div className="container py-16 relative z-10">
              {/* Back link */}
              <button
                onClick={() => {
                  setDeepDiveProject(null);
                }}
                className="type-t6 font-mono text-t3 hover:text-accent transition-colors mb-8 flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to portfolio</span>
              </button>

              {/* Title */}
              <h2 className="type-t1 mb-6 text-t1">{currentDeepDive.title}</h2>

              {/* Tags */}
              <div className="tags mb-10">
                {currentDeepDive.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div className="mb-12">
                <div className="type-t5 font-medium text-t3 uppercase tracking-wider mb-4">
                  Overview
                </div>
                <div className="type-t4 text-t2 leading-relaxed">
                  <StreamingText 
                    text={currentDeepDive.overview} 
                    isVisible={!!currentDeepDive} 
                    speed={8} 
                    showFlash={true} 
                  />
                </div>
              </div>

            {/* Architecture */}
            <div className="mb-12">
              <div className="type-t5 font-medium text-t3 uppercase tracking-wider mb-6">
                Architecture
              </div>
              <div className="arch-diagram">
                {currentDeepDive.architecture.map((row, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="arch-connector">
                        <svg width="2" height="28" viewBox="0 0 2 28">
                          <line x1="1" y1="0" x2="1" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                          <polygon points="0,22 2,22 1,28" fill="currentColor" opacity="0.5" />
                        </svg>
                      </div>
                    )}
                    <div className={`arch-row ${row.length > 1 ? 'arch-row-multi' : ''}`}>
                      {row.length > 1 && <div className="arch-fan-line" />}
                      {row.map((node, j) => (
                        <div key={j} className="arch-node">
                          <div className="arch-node-label">{node.label}</div>
                          {node.sub && <div className="arch-node-sub">{node.sub}</div>}
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Key Decisions */}
            <div className="mb-12">
              <div className="type-t5 font-medium text-t3 uppercase tracking-wider mb-6">
                Key Decisions
              </div>
              {currentDeepDive.decisions.map((d, i) => (
                <div key={i} className="deep-dive-decision">
                  <div className="type-t4 font-medium text-t1 mb-2">{d.title}</div>
                  <div className="type-t4 text-t2 leading-relaxed">{d.detail}</div>
                </div>
              ))}
            </div>

            {/* Lessons Learned */}
            <div className="mb-12">
              <div className="type-t5 font-medium text-t3 uppercase tracking-wider mb-4">
                Lessons Learned
              </div>
              {currentDeepDive.lessons.map((l, i) => (
                <div key={i} className="deep-dive-lesson type-t4 text-t2 leading-relaxed">
                  {l}
                </div>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-4 type-t6 pt-4 border-t border-border-dim">
              {currentDeepDive.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="link link-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ TERMINAL MODE (Easter Egg) ═══════════ */}
      <div className={`terminal-overlay ${terminalOpen ? 'active' : ''}`}>
        <button
          className="terminal-close"
          onClick={() => {
            setTerminalOpen(false);
          }}
        >
          ESC to exit
        </button>
        <div className="terminal-output" ref={terminalOutputRef}>
          {terminalHistory.map((line, i) => (
            <div key={i} className={`terminal-line ${line.type}`}>
              {line.type === 'output' && line.text.length > 0 ? (
                <StreamingText text={line.text} speed={2} showFlash={false} showCursor={i === terminalHistory.length - 1} />
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
        <form className="terminal-input-line" onSubmit={handleTerminalSubmit}>
          <span>$&nbsp;</span>
          <input
            ref={terminalInputRef}
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      {/* BACK TO TOP */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full border border-border-dim bg-surface/80 backdrop-blur-sm flex items-center justify-center text-t3 hover:text-accent hover:border-accent transition-all duration-300 ${
          showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
