import { getIndustry } from '@/content/industries'
import { getTool } from '@/content/tools'
import type { UseCase } from '@/content/types'

export function UseCaseCard({ useCase }: { useCase: UseCase }) {
  const lead = getTool(useCase.tools[0])
  const industry = getIndustry(useCase.industry)
  return (
    <a className="uc-card" href={`/use-cases/${useCase.slug}`} data-industry={useCase.industry}>
      <span className="uc-card-top mono">
        <span className="uc-badge" aria-hidden="true">
          {lead.badge}
        </span>
        <span>{industry?.short}</span>
        <span className="uc-diff">{useCase.difficulty}</span>
      </span>
      <strong>{useCase.title}</strong>
      <span className="uc-card-summary">{useCase.summary}</span>
      <small className="mono">
        {useCase.tools.map((id) => getTool(id).name).join(' · ')}
      </small>
    </a>
  )
}
