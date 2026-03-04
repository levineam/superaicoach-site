import type { MetadataRoute } from "next";

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://superaicoach.com";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      priority: 1.0,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${base}/philly`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${base}/resources`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      url: `${base}/resources/chatgpt-professional-writing`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      priority: 0.3,
      changeFrequency: 'yearly' as const,
    },
  ];
}
