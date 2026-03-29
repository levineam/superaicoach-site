import type { MetadataRoute } from 'next'

import { getBaseUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl()
  const now = new Date()

  return [
    {
      url: `${base}/`,
      lastModified: now,
      priority: 1.0,
      changeFrequency: 'monthly',
    },
    {
      url: `${base}/member`,
      lastModified: now,
      priority: 0.95,
      changeFrequency: 'weekly',
    },
    {
      url: `${base}/philly`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: 'monthly',
    },
    {
      url: `${base}/philadelphia`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: 'monthly',
    },
    {
      url: `${base}/resources`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: 'weekly',
    },
    {
      url: `${base}/resources/chatgpt-professional-writing`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: 'monthly',
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      priority: 0.3,
      changeFrequency: 'yearly',
    },
  ]
}
