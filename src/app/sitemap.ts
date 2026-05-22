import type { MetadataRoute } from "next";
import { baseUrl, projectCaseStudies } from "@/lib/portfolioData";

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = projectCaseStudies.map((project) => ({
    url: `${baseUrl}/case-studies/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...caseStudies,
    {
      url: `${baseUrl}/system-prompt`,
      lastModified: new Date("2025-04-15"),
      changeFrequency: "never",
      priority: 0.3,
    },
  ];
}
