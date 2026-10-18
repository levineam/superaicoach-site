import type { MetadataRoute } from 'next'

import { SITE } from '@/config/site'
import { INDUSTRIES } from '@/content/industries'
import { USE_CASES } from '@/content/use-cases'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-18')
  const pages: Array<[string, number, MetadataRoute.Sitemap[number]['changeFrequency']]> = [
    ['/', 1.0, 'monthly'],
    ['/philadelphia', 0.9, 'monthly'],
    ['/contact', 0.8, 'monthly'],
    ['/about', 0.7, 'monthly'],
    ['/faq', 0.7, 'monthly'],
    ['/membership', 0.9, 'weekly'],
    ['/use-cases', 0.8, 'weekly'],
    ...INDUSTRIES.map((i) => [`/use-cases/industry/${i.id}`, 0.7, 'monthly'] as [string, number, 'monthly']),
    ...USE_CASES.map((u) => [`/use-cases/${u.slug}`, 0.6, 'monthly'] as [string, number, 'monthly']),
    ['/privacy', 0.2, 'yearly'],
  ]
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${SITE.url}${path === '/' ? '' : path}`,
    lastModified,
    priority,
    changeFrequency,
  }))
}
