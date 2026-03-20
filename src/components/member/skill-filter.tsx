'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { SkillCategory } from '@/data/skills'

export function SkillFilter({ categories }: { categories: SkillCategory[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? 'all'

  const setCategory = useCallback(
    (cat: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (cat === 'all') {
        params.delete('category')
      } else {
        params.set('category', cat)
      }
      router.replace(`/member/skills?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const pills = ['all', ...categories] as const

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((cat) => {
        const isActive = cat === 'all' ? active === 'all' : active === cat
        return (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {cat === 'all' ? 'All Skills' : cat}
          </button>
        )
      })}
    </div>
  )
}
