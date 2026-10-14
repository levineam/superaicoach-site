import { SITE } from '@/config/site'
import { getIndustry } from '@/content/industries'
import { getTool } from '@/content/tools'
import type { UseCase } from '@/content/types'

const PUBLISHED = '2026-10-14'

export function schemasForUseCase(u: UseCase) {
  const url = `${SITE.url}/use-cases/${u.slug}`
  const author = { '@type': 'Person', name: SITE.founder, url: SITE.personalSite }
  const publisher = { '@type': 'Organization', name: SITE.name, url: SITE.url }
  const industry = getIndustry(u.industry)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: u.title,
      description: u.summary,
      url,
      mainEntityOfPage: url,
      datePublished: PUBLISHED,
      dateModified: PUBLISHED,
      author,
      publisher,
      about: industry ? `AI for ${industry.name.toLowerCase()}` : undefined,
      image: `${SITE.url}/opengraph-image`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: u.title,
      description: u.problem,
      url,
      tool: u.tools.map((id) => ({ '@type': 'HowToTool', name: getTool(id).name })),
      step: u.steps.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: `Step ${i + 1}`,
        text,
      })),
    },
  ]
}
