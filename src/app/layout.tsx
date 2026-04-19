import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pranav Dhiran — AI Engineer & Researcher",
  description: "I build AI systems that actually work — from training transformers from scratch to shipping multi-agent systems. Explore my projects, research, and skills.",
  keywords: ["AI Engineer", "Machine Learning", "LLM", "Transformer", "Multi-Agent Systems", "Portfolio"],
  authors: [{ name: "Pranav Dhiran" }],
  openGraph: {
    title: "Pranav Dhiran — AI Engineer & Researcher",
    description: "Training transformers from scratch. Shipping multi-agent AI systems. Building MCP servers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-background text-t1 relative">
        <div className="fixed inset-0 pointer-events-none flex justify-center z-0">
          <div className="w-full max-w-[720px] h-full border-x border-border-dim bg-background/95 backdrop-blur-md" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
