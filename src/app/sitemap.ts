import type { MetadataRoute } from 'next'

import { SITE } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-11')
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1.0, 'monthly'],
    ['/philadelphia', 0.9, 'monthly'],
    ['/contact', 0.8, 'monthly'],
    ['/about', 0.7, 'monthly'],
    ['/faq', 0.7, 'monthly'],
    ['/privacy', 0.2, 'yearly'],
  ]
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${SITE.url}${path === '/' ? '' : path}`,
    lastModified,
    priority,
    changeFrequency,
  }))
}
