import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in $HOME makes Turbopack infer the wrong root.
  // Pin it to this project so module resolution and file watching stay scoped.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms https://scripts.clarity.ms; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://www.clarity.ms https://scripts.clarity.ms https://q.clarity.ms; img-src 'self' data: https:",
          },
        ],
      },
    ];
  },
};

export default nextConfig;