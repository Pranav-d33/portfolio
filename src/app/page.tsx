import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

const BASE_URL = "https://pranavdhiran.me";

export const metadata: Metadata = {
  title: "Pranav Dhiran — AI Engineer & Researcher",
  description:
    "I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware. ECE + AI.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "LLM",
    "Transformer",
    "Multi-Agent Systems",
    "Reinforcement Learning",
    "MCP Server",
    "Software Defined Radio",
    "RAG",
    "Portfolio",
    "Pranav Dhiran",
  ],
  authors: [{ name: "Pranav Dhiran" }],
  creator: "Pranav Dhiran",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pranav Dhiran — AI Engineer & Researcher",
    description:
      "I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/portfolio_image.jpeg",
        width: 1200,
        height: 630,
        alt: "Pranav Dhiran — AI Engineer & Researcher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Dhiran — AI Engineer & Researcher",
    description:
      "I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware.",
    images: ["/portfolio_image.jpeg"],
    creator: "@Pranav_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranav Dhiran",
  url: BASE_URL,
  image: `${BASE_URL}/portfolio_image.jpeg`,
  jobTitle: "AI Engineer & Researcher",
  description:
    "I build AI systems — from transformer pre-training to multi-agent pipelines to LLM-controlled hardware.",
  email: "dhiranpranav72@gmail.com",
  sameAs: [
    "https://github.com/Pranav-d33",
    "https://linkedin.com/in/prannav-dhiran",
    "https://x.com/Pranav_ai",
  ],
  knowsAbout: [
    "Large Language Models",
    "Transformer Pre-training",
    "LoRA Fine-tuning",
    "Multi-Agent Systems",
    "MCP Server Engineering",
    "Reinforcement Learning from Human Feedback",
    "Software Defined Radio",
    "RAG Pipelines",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Shri Guru Gobind Singhji Institute of Engineering and Technology",
    address: "Nanded, Maharashtra, India",
  },
  award: [
    "National Finalist — Smart India Hackathon 2024",
    "National Finalist — Smart India Hackathon 2025",
    "Global Finalist Top 6 — UWA Hack For Impact 2026",
  ],
};

const creativeWorks = [
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Medaura — Agentic Pharmacy System",
    url: "https://aipharmacyproject-blond.vercel.app",
    author: { "@type": "Person", name: "Pranav Dhiran" },
    description:
      "Full-stack multi-agent AI system — five specialized agents with LangGraph orchestration for autonomous medication ordering across four languages.",
    keywords: "LangGraph, Multi-Agent, FastAPI, ChromaDB, RAG",
  },
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "SLM from Scratch — TinyStories",
    url: "https://github.com/Pranav-d33/small_language_model_from_scratch-TinyStories",
    author: { "@type": "Person", name: "Pranav Dhiran" },
    description:
      "GPT-style transformer trained from scratch on TinyStories with custom BPE tokenizer, mmap pipelines, AMP mixed precision, and cosine annealing.",
    keywords: "PyTorch, Transformer, BPE Tokenizer, AMP, NLP",
  },
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "GNU Radio MCP Server — LLM-to-SDR Bridge",
    url: "https://github.com/Pranav-d33/gnuradio-mcp-server",
    author: { "@type": "Person", name: "Pranav Dhiran" },
    description:
      "MCP server bridging LLMs to live GNU Radio SDR flowgraphs — 13 tools with Pydantic v2 validation, lifespan-managed ZMQ context, and dual transport.",
    keywords: "Python, FastMCP, ZMQ, XML-RPC, GNU Radio",
  },
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "RF Watch — Open-Source RF Spectrum Monitor",
    url: "https://github.com/Pranav-d33/RFwatch",
    author: { "@type": "Person", name: "Pranav Dhiran" },
    description:
      "Real-time RF spectrum analyzer using HackRF One and GNU Radio with Welch PSD feature extraction and lightweight ML classifier for passive transmitter detection.",
    keywords: "Python, GNU Radio, HackRF One, Signal Processing",
  },
];

const structuredData = [personSchema, ...creativeWorks];

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" href="/portfolio_image.jpeg" type="image/jpeg" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <HomeClient />
    </>
  );
}
