import type { MetadataRoute } from "next";

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://superaicoach.com";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
