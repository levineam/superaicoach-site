'use client'

import { useState } from 'react'

import type { Industry } from '@/content/industries'
import type { UseCase } from '@/content/types'

import { UseCaseCard } from './use-case-card'

export function UseCaseGrid({ useCases, industries }: { useCases: UseCase[]; industries: Industry[] }) {
  const [active, setActive] = useState<string>('all')
  const shown = active === 'all' ? useCases : useCases.filter((u) => u.industry === active)
  const options = [{ id: 'all', short: 'All' }, ...industries]

  return (
    <>
      <div className="uc-filters" role="group" aria-label="Filter by industry">
        {options.map((o) => {
          const count =
            o.id === 'all' ? useCases.length : useCases.filter((u) => u.industry === o.id).length
          return (
            <button
              key={o.id}
              type="button"
              className="uc-filter mono"
              aria-pressed={active === o.id}
              onClick={() => setActive(o.id)}
            >
              {o.short} <span aria-hidden="true">{count}</span>
            </button>
          )
        })}
      </div>
      <p className="visually-hidden" aria-live="polite">
        Showing {shown.length} use cases
      </p>
      <div className="uc-grid">
        {shown.map((u) => (
          <UseCaseCard key={u.slug} useCase={u} />
        ))}
      </div>
    </>
  )
}
