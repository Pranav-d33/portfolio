export type ArchNode = {
  label: string;
  sub?: string;
};

export type PortfolioLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type RelatedPaper = {
  id: string;
  title: string;
  href: string;
  note: string;
};

export type ProjectCaseStudy = {
  slug: string;
  toolSlug: string;
  cardId: string;
  title: string;
  shortTitle: string;
  thesis: string;
  hook: string;
  summary: string;
  proofTitle: string;
  proofDesc: string;
  role: string;
  status: string;
  stack: string[];
  tags: string[];
  problem: string;
  architecture: ArchNode[][];
  decisions: { title: string; detail: string }[];
  lessons: string[];
  relatedPapers: RelatedPaper[];
  links: PortfolioLink[];
};

export const baseUrl = "https://pranavdhiran.me";

export const paperLibrary: Record<string, RelatedPaper> = {
  react: {
    id: "react",
    title: "ReAct: Synergizing Reasoning and Acting",
    href: "https://arxiv.org/abs/2210.03629",
    note: "Agents observe before they act.",
  },
  toolformer: {
    id: "toolformer",
    title: "Toolformer: Models Teach Themselves to Use Tools",
    href: "https://arxiv.org/abs/2302.04761",
    note: "The mental model for LLMs using external tools.",
  },
  switchTransformers: {
    id: "switch-transformers",
    title: "Switch Transformers: Mixture of Experts",
    href: "https://arxiv.org/abs/2101.03961",
    note: "Modular capacity beats monolithic scaling.",
  },
  grpo: {
    id: "grpo",
    title: "Group Relative Policy Optimization",
    href: "https://arxiv.org/abs/2402.03300",
    note: "A foundation for post-training interest.",
  },
  dpo: {
    id: "dpo",
    title: "Direct Preference Optimization",
    href: "https://arxiv.org/abs/2305.18290",
    note: "Preference optimization without treating RL as magic.",
  },
};

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "medaura",
    toolSlug: "medaura",
    cardId: "project-medaura",
    title: "Medaura - Agentic Pharmacy System",
    shortTitle: "Medaura",
    thesis: "Medication errors are an information problem: the data exists, but it is not connected at the moment it matters.",
    hook: "Medication errors are an information problem. The information exists - it is just not connected at the moment it matters.",
    summary:
      "Five specialized agents orchestrated with LangGraph handle ordering, safety checks, forecasting, procurement, and UI flow across a multilingual pharmacy workflow.",
    proofTitle: "Langfuse Trace",
    proofDesc: "Routing latency under 120ms",
    role: "Lead engineer",
    status: "Live system",
    stack: ["FastAPI", "LangChain", "LangGraph", "ChromaDB", "Langfuse", "Groq", "React"],
    tags: ["FastAPI", "LangGraph", "ChromaDB", "Langfuse", "React"],
    problem:
      "Pharmacy workflows fail when prescription, inventory, safety, and procurement data are separated. The goal was to make a system that can reason across those boundaries while keeping every agent decision auditable.",
    architecture: [
      [{ label: "User Interface", sub: "React, multilingual UI" }],
      [{ label: "Router Agent", sub: "Intent classification and dispatch" }],
      [
        { label: "Ordering Agent", sub: "Prescription and order flow" },
        { label: "Safety Agent", sub: "Drug interaction checks" },
        { label: "Forecast Agent", sub: "Demand prediction" },
        { label: "Procurement Agent", sub: "Supplier matching" },
      ],
      [{ label: "ChromaDB + Langfuse", sub: "RAG, traces, observability" }],
    ],
    decisions: [
      {
        title: "Agent boundaries map to pharmacy responsibilities",
        detail:
          "Each agent owns a domain responsibility instead of a generic helper function. That made routing easier to reason about and made failure traces more useful.",
      },
      {
        title: "Safety checks use retrieval, not only prompts",
        detail:
          "The Safety Agent queries a drug-interaction knowledge base before order confirmation so important contraindications are represented as retrievable evidence.",
      },
      {
        title: "Observability is treated as product infrastructure",
        detail:
          "Every agent call is traced with Langfuse because multi-agent failures are impossible to debug from the final answer alone.",
      },
    ],
    lessons: [
      "Agent decomposition is an architecture problem before it is a prompting problem.",
      "Without traces, multi-agent systems become impossible to trust in production.",
      "The most important UX is often the operational visibility behind the interface.",
    ],
    relatedPapers: [paperLibrary.react, paperLibrary.toolformer],
    links: [
      { label: "Live system", href: "https://aipharmacyproject-blond.vercel.app", external: true },
    ],
  },
  {
    slug: "tinystories",
    toolSlug: "slm",
    cardId: "project-slm",
    title: "Small Language Model From Scratch - TinyStories",
    shortTitle: "TinyStories SLM",
    thesis: "A small transformer built from scratch to understand every layer before trusting higher-level abstractions.",
    hook: "Every LLM course teaches you to call an API. I wanted to know what happens before the API.",
    summary:
      "A GPT-style autoregressive transformer trained on TinyStories with a custom tokenizer, memory-mapped pipeline, mixed precision, and scheduler experiments.",
    proofTitle: "Loss Curve",
    proofDesc: "Converged at 2.1 validation loss",
    role: "Research engineer",
    status: "Open source",
    stack: ["PyTorch", "Python", "Custom BPE", "AMP", "mmap"],
    tags: ["PyTorch", "Custom BPE", "AMP", "NLP"],
    problem:
      "Most learning paths hide the model behind libraries. This project forced the complete training pipeline into the open: tokenization, batching, transformer blocks, optimization, sampling, and failure modes.",
    architecture: [
      [{ label: "Text Corpus", sub: "TinyStories" }],
      [{ label: "Custom BPE Tokenizer", sub: "No borrowed tokenizer" }],
      [{ label: "Transformer x6", sub: "Attention, MLP, LayerNorm" }],
      [{ label: "AMP Training Loop", sub: "Warmup and cosine schedule" }],
      [{ label: "Sampling", sub: "Temperature and top-k generation" }],
    ],
    decisions: [
      {
        title: "No pre-trained weights",
        detail:
          "The point was not leaderboard performance. The point was to understand how a transformer learns when every part of the pipeline is visible.",
      },
      {
        title: "Custom tokenizer before model training",
        detail:
          "Building the tokenizer made subword segmentation concrete and exposed how vocabulary choices affect the model's behavior.",
      },
      {
        title: "Mixed precision as practical systems work",
        detail:
          "AMP reduced memory pressure enough to make useful experiments possible on limited hardware without changing the core learning objective.",
      },
    ],
    lessons: [
      "Training quality is often decided by data handling and optimization details, not only model size.",
      "The attention block becomes less mystical when you have made it fail yourself.",
      "A small model is a better teacher than a black-box frontier API.",
    ],
    relatedPapers: [paperLibrary.switchTransformers],
    links: [
      {
        label: "Source code",
        href: "https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories-",
        external: true,
      },
    ],
  },
  {
    slug: "gnuradio-mcp",
    toolSlug: "gnuradio",
    cardId: "project-gnuradio",
    title: "GNU Radio MCP Server - LLM-to-SDR Bridge",
    shortTitle: "GNU Radio MCP",
    thesis: "An MCP server that lets language models control live GNU Radio software-defined radio flowgraphs through validated tools.",
    hook: "LLMs can reason about RF signals. They just could not touch a radio. This closes that gap.",
    summary:
      "A Model Context Protocol server exposes SDR controls, IQ capture, spectrum analysis, and flowgraph parameters through 13 validated tools.",
    proofTitle: "Architecture",
    proofDesc: "13 tools over ZMQ + XML-RPC",
    role: "Systems engineer",
    status: "Open source",
    stack: ["Python", "FastMCP", "ZMQ", "XML-RPC", "GNU Radio", "Pydantic v2"],
    tags: ["Python", "FastMCP", "ZMQ", "XML-RPC", "GNU Radio"],
    problem:
      "LLMs can choose tool calls, but RF hardware needs strict validation, lifecycle management, and streaming data paths. The project bridges those worlds without letting hallucinated parameters reach hardware unchecked.",
    architecture: [
      [{ label: "LLM Client", sub: "Claude Desktop or compatible client" }],
      [{ label: "MCP Server", sub: "FastMCP, 13 validated tools" }],
      [
        { label: "XML-RPC", sub: "Parameter control" },
        { label: "ZMQ", sub: "IQ streaming" },
      ],
      [{ label: "GNU Radio Flowgraph", sub: "SDR pipeline and DSP blocks" }],
      [{ label: "Spectrum Analysis", sub: "Welch PSD and peak detection" }],
    ],
    decisions: [
      {
        title: "Split command and data transport",
        detail:
          "XML-RPC is used for control while ZMQ handles streaming IQ data, keeping slow control changes separate from continuous signal samples.",
      },
      {
        title: "Pydantic validates every hardware-facing tool",
        detail:
          "Tool arguments are checked before they touch GNU Radio so invalid model outputs cannot directly crash or misconfigure the flowgraph.",
      },
      {
        title: "Server lifecycle owns radio resources",
        detail:
          "The ZMQ context and hardware-facing resources are managed with the MCP server lifecycle to avoid socket leaks and locked SDR devices.",
      },
    ],
    lessons: [
      "Hardware control requires defensive programming at every boundary.",
      "Real-time signal streams need different architecture than ordinary request/response web APIs.",
      "MCP is a useful abstraction when the tool boundary is treated as a safety boundary too.",
    ],
    relatedPapers: [paperLibrary.toolformer],
    links: [
      { label: "Source code", href: "https://github.com/Pranav-d33/gnuradio-mcp-server", external: true },
    ],
  },
  {
    slug: "rf-watch",
    toolSlug: "rfwatch",
    cardId: "project-rfwatch",
    title: "RF Watch - Open-Source Real-Time RF Spectrum Monitor",
    shortTitle: "RF Watch",
    thesis: "A passive RF spectrum monitor that favors deterministic physical-layer evidence over black-box classification.",
    hook: "Physical-layer first: no protocol decoding, no black-box certainty, just traceable RF evidence.",
    summary:
      "A HackRF One and GNU Radio based monitor extracts spectral features with FFT/Welch PSD pipelines for passive detection of unusual transmitters.",
    proofTitle: "RF Monitor",
    proofDesc: "Passive spectrum analysis",
    role: "Signal-processing engineer",
    status: "Open source",
    stack: ["Python", "GNU Radio", "HackRF One", "Signal Processing"],
    tags: ["Python", "GNU Radio", "HackRF One", "Signal Processing"],
    problem:
      "Anti-drone and RF-monitoring workflows need explainable evidence, not only labels. RF Watch listens passively, extracts spectral features, and surfaces anomalies without transmitting.",
    architecture: [
      [{ label: "HackRF One", sub: "Raw IQ samples" }],
      [{ label: "GNU Radio DSP", sub: "Welch PSD, peak detect, band energy" }],
      [{ label: "Feature Vector", sub: "Frequency, bandwidth, SNR, duty cycle" }],
      [{ label: "Classifier", sub: "Lightweight passive detection" }],
      [{ label: "Operator View", sub: "Traceable alerts" }],
    ],
    decisions: [
      {
        title: "Passive-only monitoring",
        detail:
          "The system listens without transmitting, which keeps the design simpler, safer, and focused on environmental evidence.",
      },
      {
        title: "Welch PSD over naive FFT snapshots",
        detail:
          "Averaged spectral estimates reduce noise and create steadier features for downstream detection.",
      },
      {
        title: "Traceable features over opaque certainty",
        detail:
          "The interface should help an operator inspect why something looks unusual instead of only showing a label.",
      },
    ],
    lessons: [
      "RF systems need deterministic observability because the environment changes constantly.",
      "A simple model with good features is often more useful than a complex model with weak signal processing.",
      "Physical-layer systems make software abstraction mistakes visible very quickly.",
    ],
    relatedPapers: [paperLibrary.toolformer],
    links: [
      { label: "Source code", href: "https://github.com/Pranav-d33/RFwatch", external: true },
    ],
  },
];

export const projectBySlug = Object.fromEntries(
  projectCaseStudies.map((project) => [project.slug, project])
) as Record<string, ProjectCaseStudy>;

export const projectByToolSlug = Object.fromEntries(
  projectCaseStudies.map((project) => [project.toolSlug, project])
) as Record<string, ProjectCaseStudy>;

export function caseStudyPath(slug: string) {
  return `/case-studies/${slug}`;
}
