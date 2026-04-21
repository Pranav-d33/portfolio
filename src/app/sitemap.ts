import type { MetadataRoute } from "next";

const BASE_URL = "https://pranavdhiran.me";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/system-prompt`,
      lastModified: new Date("2025-04-15"),
      changeFrequency: "never",
      priority: 0.3,
    },
  ];
}
