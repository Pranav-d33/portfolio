import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-degular",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-blanco",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranavdhiran.me"),
  title: {
    default: "Pranav Dhiran — AI Engineer & Researcher",
    template: "%s | Pranav Dhiran",
  },
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
    creator: "@Prannav_ai",
  },
  verification: {
    google: "QSa6WMghgjY4JfhcOMcr61kYyNr0OjIklRckSjuTY40",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=localStorage.getItem("theme");if(e==="dark")document.documentElement.classList.add("dark")}catch(t){}})()`
          }}
        />
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
