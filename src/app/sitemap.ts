import type { MetadataRoute } from 'next'

import { SITE } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-22')
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1.0, 'monthly'],
    ['/skills', 0.8, 'monthly'],
    ['/privacy', 0.2, 'yearly'],
  ]
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${SITE.url}${path === '/' ? '' : path}`,
    lastModified,
    priority,
    changeFrequency,
  }))
}
