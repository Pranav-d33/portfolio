import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://www.clarity.ms; img-src 'self' data: https:",
          },
        ],
      },
    ];
  },
};

export default nextConfig;