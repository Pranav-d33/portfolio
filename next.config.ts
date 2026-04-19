import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*; img-src 'self' data: https:|",
          },
        ],
      },
    ];
  },
};

export default nextConfig;