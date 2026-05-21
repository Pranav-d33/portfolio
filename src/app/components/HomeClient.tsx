"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { caseStudyPath } from '@/lib/portfolioData';
import { SystemPromptModal } from './SystemPromptModal';
import { ChatWidget } from './chatbot/ChatWidget';
import { AuroraBackground } from './AuroraBackground';

/* ═══════════════════════════════════════════════════════════════
   Framer Motion — Scroll Animation Variants & Components
   ═══════════════════════════════════════════════════════════════ */

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: customEase,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: customEase },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: customEase },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: customEase },
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

    const jitter = Math.floor(Math.random() * 12);
    const timeout = setTimeout(() => {
      const step = Math.floor(Math.random() * 4) + 2;
      setDisplayedText(text.slice(0, Math.min(text.length, displayedText.length + step)));
    }, speed + jitter);

    return () => clearTimeout(timeout);
  }, [text, localVisible, displayedText, speed]);

  const isTyping = localVisible && !isComplete && displayedText.length > 0;

  return (
    <span ref={ref}>
      {displayedText}
      {showCursor && !isComplete && <span className={`llm-cursor ${isTyping ? 'typing' : ''}`}></span>}
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
      <AnimatePresence>
        {copied && (
          <motion.span
            className="copy-tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-2 border border-border-dim px-2 py-1 rounded text-[10px] text-t1 whitespace-nowrap shadow-sm z-50"
            initial={{ opacity: 0, y: 4, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -4, x: '-50%' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            Copied
          </motion.span>
        )}
      </AnimatePresence>
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
        whileHover={{ x: isMobile ? 0 : 4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.08, ease: 'easeOut' } }}
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
  const [activeSection, setActiveSection] = useState('intro');
  const [showTopBtn, setShowTopBtn] = useState(false);

  /* ─── New state ─── */
  const [deepDiveProject, setDeepDiveProject] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [navScrolled, setNavScrolled] = useState(false);

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

  /* ─── Scroll progress bar with spring physics ─── */
  const { scrollYProgress } = useScroll();
  const springProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });
  const scaleX = useTransform(springProgress, [0, 1], [0, 1]);
  const progressVisible = useTransform(scrollYProgress, (v) => v > 0.02);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  /* ─── Intersection-based scroll-spy ─── */
  useEffect(() => {
    const getActiveSection = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
      const viewportAnchor = window.innerHeight * 0.32;
      let current = 'intro';
      let closest = Number.POSITIVE_INFINITY;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - viewportAnchor);
        if (rect.top <= viewportAnchor && rect.bottom >= 96 && distance < closest) {
          closest = distance;
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    getActiveSection();
    window.addEventListener('scroll', getActiveSection, { passive: true });
    window.addEventListener('resize', getActiveSection);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            getActiveSection();
          }
        });
      },
      { rootMargin: '-12% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', getActiveSection);
      window.removeEventListener('resize', getActiveSection);
      sections.forEach((section) => observer.unobserve(section));
    };
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

    // Desktop: use cursor position for parallax (spec §4.2)
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = ((e.clientX - centerX) / centerX) * 6; // max ±6px
      const y = ((e.clientY - centerY) / centerY) * 6;
      setTilt({ x, y });
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Fallback: device orientation for tablets
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      const x = Math.max(-15, Math.min(15, gamma)) * 0.3;
      const y = Math.max(-15, Math.min(15, beta - 45)) * 0.3;
      setTilt({ x, y });
    };
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
    const onScroll = () => {
      setShowTopBtn(window.scrollY > 600);
      setNavScrolled(window.scrollY > 40);
    };
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'about', label: 'about' },
    { id: 'experience', label: 'experience' },
    { id: 'projects', label: 'projects' },
    { id: 'contact', label: 'contact' },
  ];

  const currentDeepDive = deepDiveProject ? deepDives[deepDiveProject] : null;

  return (
    <>
      {/* SCROLL PROGRESS BAR */}
      <motion.div
        className={`scroll-progress ${progressVisible ? 'visible' : ''}`}
        style={{ scaleX }}
      />

      {/* CUSTOM CURSOR FOLLOWER */}
      <div
        id="custom-cursor"
        className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:flex items-center justify-center w-4 h-4 -ml-2 -mt-2 text-accent font-mono text-lg opacity-70"
      >
        +
      </div>

      {/* ═══════════ FLOATING DOCK NAV ═══════════ */}
      <motion.nav
        className={`atul-nav fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          navScrolled || mobileMenuOpen
            ? "is-scrolled"
            : "is-top"
        } ${mobileMenuOpen ? 'overflow-visible' : 'overflow-hidden'}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          borderRadius: mobileMenuOpen ? "34px" : "9999px",
          width: mobileMenuOpen ? "300px" : "min(70vw, 840px)",
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Desktop Nav - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_92px_1fr_1fr] items-center h-20 w-full px-9 gap-2">
          {navLinks.slice(0, 2).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`portfolio-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
            >
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
          <motion.button
            onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
            className={`nav-home-button ${activeSection === 'intro' ? 'is-active' : ''}`}
            aria-label="Go to intro"
            whileHover={{ scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
            whileTap={{ scale: 0.92 }}
          >
            <span className="nav-cut-logo" aria-hidden="true">
              <span />
              <span />
            </span>
          </motion.button>
          {navLinks.slice(2).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`portfolio-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
            >
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Mobile Nav Top Bar (Always visible on mobile) */}
        <div className="flex sm:hidden items-center justify-between h-14 px-3 w-full min-w-[200px]">
          <button
            onClick={() => {
              document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className={`nav-home-button ml-1 ${activeSection === 'intro' ? 'is-active' : ''}`}
            aria-label="Go to intro"
          >
            <span className="nav-cut-logo" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-t1 hover:bg-white/10 transition-colors mr-1"
            aria-label="Toggle menu"
          >
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>
                </svg>
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="flex sm:hidden flex-col w-full px-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="flex flex-col gap-1 mt-2">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className={`portfolio-nav-link mobile ${activeSection === item.id ? 'is-active' : ''}`}
                  >
                    <span className="nav-label">{item.label}</span>
                  </button>
                ))}
                <div className="h-[1px] w-full bg-border-dim my-2 opacity-50" />
                <a 
                  href="/resume_v4.pdf" 
                  download 
                  className="px-4 py-3 rounded-xl text-center font-medium text-accent hover:bg-accent/10 transition-all flex items-center justify-center gap-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resume 
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="portfolio-main container flex flex-col">
        {/* ═══════════ INTRO SECTION ═══════════ */}
        <motion.section 
          id="intro"
          className="relative w-full min-h-screen flex flex-col justify-center snap-section pt-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Aurora background — fades out as you scroll, blending into textured black */}
          <motion.div
            className="absolute z-0 pointer-events-none overflow-hidden"
            style={{
              opacity: auroraOpacity,
              left: '-24px',
              right: '-24px',
              top: 0,
              bottom: 0,
            }}
          >
            <AuroraBackground className="absolute inset-0" />
            <img src="/textures/dust-texture.webp" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20" alt="" />
          </motion.div>

          {/* Gradient blend at bottom of intro — smooth edge into textured black */}
          <div className="absolute bottom-0 z-[1] pointer-events-none"
            style={{ left: '-24px', right: '-24px', height: '48px' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent to-background" />
          </div>

          <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 hidden md:block">
            <span className="font-bold text-lg tracking-tight text-t1">Pranav Dhiran</span>
          </div>
          <motion.div variants={itemVariants} className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="hero-statement text-t1">
              I keep digging into rabbit holes. <br/>
              <span className="text-t3">Some become systems.</span>
            </h1>
          </motion.div>
          <motion.div variants={itemVariants} className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-40 animate-bounce hidden md:block z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-t3">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </motion.section>

        {/* ═══════════ ABOUT SECTION ═══════════ */}
        <MotionSection id="about" className="section section-divider section-major snap-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">About</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mt-12">
            {/* Larger Photo */}
            <motion.div variants={itemVariants} className="lg:col-span-5 relative w-full max-w-[440px] mx-auto lg:mx-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface/50 aspect-square group">
                <img
                  src="/portfolio_image.jpeg"
                  alt="Pranav Dhiran"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover scale-[1.05] transition-transform duration-700 group-hover:scale-[1.08] filter grayscale hover:grayscale-0"
                />
              </div>
            </motion.div>

            {/* About Content */}
            <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center max-w-2xl pt-4 lg:pt-12">
              <p className="text-xl sm:text-2xl lg:text-3xl font-light text-t1 leading-snug tracking-tight mb-16">
                I build AI systems that go from research paper to working prototype fast — language models, multi-agent pipelines, and the infrastructure that holds them together. I started in RF and signals. Turns out the most interesting signal to decode is language.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                  <div className="text-[11px] text-t3 uppercase tracking-[0.2em] font-mono mb-4">Education</div>
                  <div className="text-base text-t1 font-medium tracking-tight mb-1">Electronics &amp; Telecommunication</div>
                  <div className="text-sm text-t3 opacity-90">SGGSIE&amp;T, Nanded · 2023–2027</div>
                </div>

                <div>
                  <div className="text-[11px] text-t3 uppercase tracking-[0.2em] font-mono mb-4">Current Focus</div>
                  <div className="text-sm text-t2 leading-relaxed opacity-90">
                    LLM post-training · Multi-agent orchestration · MCP tooling · Open-source cloud-native infrastructure
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap mt-14">
                <span className="inline-flex items-center px-5 py-2 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">
                  SIH National Finalist ×2
                </span>
                <span className="inline-flex items-center px-5 py-2 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">
                  UWA Global Top 6
                </span>
              </div>
            </motion.div>
          </div>
        </MotionSection>

        {/* ═══════════ EXPERIENCE SECTION ═══════════ */}
        <MotionSection id="experience" className="section section-divider section-alt snap-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Experience</h2>
          <div className="flex flex-col gap-16 mt-12">
            
            {/* AISSC */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4 lg:gap-12">
              <div className="lg:w-1/4 pt-1">
                <div className="timeline-date">May 2025 – Present</div>
              </div>
              <div className="lg:w-3/4 max-w-2xl">
                <h3 className="text-xl md:text-2xl font-light tracking-tight text-t1 mb-1">AI Research Intern</h3>
                <div className="text-sm font-medium text-t2 mb-5">AIISC, University of South Carolina</div>
                <p className="text-base text-t2 leading-relaxed font-light mb-6">
                  Researching neurosymbolic SLM architecture and pre-training pipelines. Integrating symbolic reasoning constraints into small language model training. Working on RL-based fine-tuning (GRPO/RLHF) for SLM alignment, reward modeling, and evaluation on neurosymbolic reasoning benchmarks.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Research</span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Neurosymbolic AI</span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">RLHF</span>
                </div>
              </div>
            </motion.div>

            {/* Open Source */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4 lg:gap-12">
              <div className="lg:w-1/4 pt-1">
                <div className="timeline-date">2024 – Present</div>
              </div>
              <div className="lg:w-3/4 max-w-2xl">
                <h3 className="text-xl md:text-2xl font-light tracking-tight text-t1 mb-1">Open Source</h3>
                <div className="text-sm font-medium text-t2 mb-5">Meshery (CNCF) · Hyperledger Cello</div>
                <p className="text-base text-t2 leading-relaxed font-light mb-6">
                  Active contributor to cloud-native infrastructure, building MCP tooling and automation systems. Shipped retry/backoff abstractions, strict OIDC validation, and AI adapter integrations for enterprise-grade open source projects.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Meshery</span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Hyperledger</span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Go</span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Cloud-Native</span>
                </div>
              </div>
            </motion.div>

          </div>
        </MotionSection>

        {/* ═══════════ PROJECTS ═══════════ */}
        <MotionSection id="projects" className="section section-divider section-major projects-section snap-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Selected Work</h2>
          <motion.div className="flex flex-col gap-12 mt-12" variants={itemVariants}>
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
                <div className="flex-1 max-w-3xl">
                  <div className="text-xl md:text-2xl font-light tracking-tight text-t1 mb-3">
                    Medaura — Agentic Pharmacy System
                  </div>
                  <div className="text-lg text-t1 font-light leading-snug italic mb-5">
                    "Medication errors are an information problem. The information exists — it's just not connected at the moment it matters."
                  </div>
                  <div className="text-base text-t2 leading-relaxed font-light mb-8 opacity-90">
                    Five specialized agents (Ordering, Safety, Forecast, Procurement, UI) orchestrated via LangGraph for stateful, auditable pipelines. ChromaDB RAG for drug interaction retrieval. Langfuse tracing every LLM call and safety check. Live, multilingual, zero human intervention.
                  </div>
                  <div className="flex gap-3 flex-wrap mb-8">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">FastAPI</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">LangChain</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">ChromaDB</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">React</span>
                  </div>
                  <div className="flex gap-6 items-center text-[11px] uppercase tracking-[0.2em] font-mono">
                    <a
                      href="https://aipharmacyproject-blond.vercel.app"
                      className="text-t2 hover:text-accent transition-colors underline decoration-transparent hover:decoration-accent decoration-1 underline-offset-4 underline decoration-transparent hover:decoration-accent decoration-1 underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      medaura.vercel.app →
                    </a>
                    <span className="text-t2 group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent decoration-1 underline-offset-4">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-3xl font-light transition-transform duration-300 group-hover:translate-x-2 hidden md:block">→</div>
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
                <div className="flex-1 max-w-3xl">
                  <div className="text-xl md:text-2xl font-light tracking-tight text-t1 mb-3">
                    Small Language Model From Scratch — TinyStories
                  </div>
                  <div className="text-lg text-t1 font-light leading-snug italic mb-5">
                    "Every LLM course teaches you to call an API. I wanted to know what happens before the API."
                  </div>
                  <div className="text-base text-t2 leading-relaxed font-light mb-8 opacity-90">
                    Pre-trained a GPT-style transformer entirely from scratch — no pretrained weights, no borrowed tokenizers. Built to understand every layer of the pipeline before trusting any abstraction above it.
                  </div>
                  <div className="flex gap-3 flex-wrap mb-8">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">PyTorch</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Hugging Face</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">NLP</span>
                  </div>
                  <div className="flex gap-6 items-center text-[11px] uppercase tracking-[0.2em] font-mono">
                    <a
                      href="https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories-"
                      className="text-t2 hover:text-accent transition-colors underline decoration-transparent hover:decoration-accent decoration-1 underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub →
                    </a>
                    <span className="text-t2 group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent decoration-1 underline-offset-4">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-3xl font-light transition-transform duration-300 group-hover:translate-x-2 hidden md:block">→</div>
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
                <div className="flex-1 max-w-3xl">
                  <div className="text-xl md:text-2xl font-light tracking-tight text-t1 mb-3">
                    GNU Radio MCP Server — LLM-to-SDR Bridge
                  </div>
                  <div className="text-lg text-t1 font-light leading-snug italic mb-5">
                    "LLMs can reason about RF signals. They just couldn't touch a radio. This closes that gap."
                  </div>
                  <div className="text-base text-t2 leading-relaxed font-light mb-8 opacity-90">
                    MCP server bridging language models to live GNU Radio SDR flowgraphs — 13 tools, Pydantic v2 validation, ZMQ + XML-RPC split-protocol architecture, async IQ capture with peak detection. Ask Claude to sweep frequencies. It does.
                  </div>
                  <div className="flex gap-3 flex-wrap mb-8">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">FastMCP</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">Python</span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-dim text-[11px] font-medium text-t2 tracking-widest uppercase bg-surface/30 backdrop-blur-sm">GNU Radio</span>
                  </div>
                  <div className="flex gap-6 items-center text-[11px] uppercase tracking-[0.2em] font-mono">
                    <a
                      href="https://github.com/Pranav-d33/gnuradio-mcp-server"
                      className="text-t2 hover:text-accent transition-colors underline decoration-transparent hover:decoration-accent decoration-1 underline-offset-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub →
                    </a>
                    <span className="text-t2 group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent decoration-1 underline-offset-4">view case study <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
                <div className="text-t3 ml-4 text-3xl font-light transition-transform duration-300 group-hover:translate-x-2 hidden md:block">→</div>
              </div>
            </SwipeableProject>

            {/* Project 4: RF Watch */}
            <div
              id="project-rfwatch"
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-border-dim/30"
            >
              <div className="text-lg font-light text-t1 tracking-tight">RF Watch — Open-source RF spectrum monitor · <span className="text-t3">HackRF One + GNU Radio</span></div>
              <a
                href="https://github.com/Pranav-d33/RFwatch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] uppercase tracking-[0.2em] font-mono text-t2 hover:text-accent transition-colors underline decoration-transparent hover:decoration-accent decoration-1 underline-offset-4 mt-4 sm:mt-0"
              >
                GitHub →
              </a>
            </div>
</motion.div>
        </MotionSection>






        {/* ═══════════ CONTACT ═══════════ */}
        <MotionSection id="contact" className="section section-divider section-major contact-section">
          <h2 className="type-t2 section-header border-b border-border-dim py-2">Contact</h2>

          <div className="mt-12 mb-16 max-w-2xl">
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-t1 leading-snug tracking-tight mb-4">
              Open to AI/ML internships and research collaborations.
            </p>
            <p className="text-lg sm:text-xl font-light text-t2 leading-snug tracking-tight">
              Particularly interested in LLM post-training, agentic systems, and inference optimization.
            </p>
          </div>

          {/* Let's Chat CTA */}
          <div className="mb-16">
            <a href="mailto:dhiranpranav72@gmail.com" className="contact-cta-text text-t1 hover:text-accent transition-colors duration-300">
              Get in touch
            </a>
          </div>

          {/* Social links & Resume */}
          {/* Social links & Resume */}
          <div className="contact-link-grid">
            <a
              href="/resume_v4.pdf"
              download
              className="contact-social-tile"
            >
              <span className="contact-social-name">Resume</span>
              <span className="contact-social-desc">Download PDF</span>
            </a>
            
            <a
              href="https://github.com/Pranav-d33"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-tile"
            >
              <span className="contact-social-name">GitHub</span>
              <span className="contact-social-desc">Code and projects</span>
            </a>

            <a
              href="https://linkedin.com/in/pranav-dhiran"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-tile"
            >
              <span className="contact-social-name">LinkedIn</span>
              <span className="contact-social-desc">Work and research</span>
            </a>
            
            <a
              href="https://x.com/Prannav_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-tile"
            >
              <span className="contact-social-name">X / Twitter</span>
              <span className="contact-social-desc">Notes and builds</span>
            </a>
          </div>
        </MotionSection>

        <div className="system-prompt-callout">
          <div className="system-prompt-callout-inner">
            <div className="system-prompt-callout-label">System prompt</div>
            <button 
              onClick={() => setIsSystemPromptOpen(true)}
              className="system-prompt-callout-link cursor-pointer bg-transparent border-none"
            >
              View my system prompt
            </button>
          </div>
          <div className="system-prompt-token-count type-t6 text-t3/60">
            Token count of this page — ~1,847 tokens
          </div>
        </div>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-12 border-t border-border-dim/10 mt-10">
          <div className="footer-gradient-line mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="type-t6 text-t3"> 2023 Pranav Dhiran</div>
            <div className="footer-token-count flex items-center gap-4 type-t6 text-t3/60">
              <span className="opacity-80">Token count of this page — ~1,847 tokens</span>
            </div>
          </div>
          <div className="footer-epitaph">VENI VIDI VICI</div>
          <div className="footer-note">Built with intent. Iterated with taste.</div>
        </footer>
      </main>

      {/* ═══════════ SYSTEM PROMPT MODAL ═══════════ */}
      <SystemPromptModal 
        isOpen={isSystemPromptOpen} 
        onClose={() => setIsSystemPromptOpen(false)} 
      />

      {/* ═══════════ DEEP DIVE OVERLAY ═══════════ */}
      <AnimatePresence>
        {deepDiveProject && currentDeepDive && (
          <motion.div 
            className="deep-dive-overlay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
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
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full border border-border-dim bg-surface/80 backdrop-blur-sm flex items-center justify-center text-t3 hover:text-accent hover:border-accent transition-colors duration-200 ${
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
      </motion.button>

      <ChatWidget />
    </>
  );
}
