import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";
import { baseUrl, caseStudyPath, projectCaseStudies } from "@/lib/portfolioData";

const BASE_URL = baseUrl;

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
    creator: "@Prannav_ai",
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
    "https://x.com/Prannav_ai",
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

const creativeWorks = projectCaseStudies.map((project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.title,
  url: `${BASE_URL}${caseStudyPath(project.slug)}`,
  author: { "@type": "Person", name: "Pranav Dhiran" },
  description: project.thesis,
  keywords: project.stack.join(", "),
  sameAs: project.links.filter((link) => link.external).map((link) => link.href),
}));

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
