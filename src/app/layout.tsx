import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope, Lora } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "./components/AuroraBackground";


const manrope = Manrope({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranavdhiran.me"),
  title: {
    default: "Pranav Dhiran — AI Engineer & Researcher",
    template: "%s | Pranav Dhiran",
  },
  description:
    "I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware.",
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
  generator: "Next.js",
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
  openGraph: {
    title: "Pranav Dhiran — AI Engineer & Researcher",
    description:
      "I build AI systems that work — from transformer pre-training and RL fine-tuning to shipping multi-agent pipelines and LLM-controlled hardware.",
    url: "/",
    siteName: "Pranav Dhiran",
    type: "website",
    locale: "en_US",
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
  verification: {
    google: "QSa6WMghgjY4JfhcOMcr61kYyNr0OjIklRckSjuTY40",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import { ChatWidget } from "./components/chatbot/ChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${geistMono.variable} ${lora.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wint66rw2x");`
          }}
        />
      </head>

      <body className={`${manrope.className} min-h-screen bg-background text-t1 relative`}>
        <AuroraBackground />
        <div className="fixed inset-0 pointer-events-none flex justify-center z-0">
          <div className="w-full max-w-[720px] h-full border-x border-border-dim bg-background/95 backdrop-blur-md" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}
