import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

type Skill = {
  slug: string
  name: string
  category: string
  oneLiner: string
  icon: string
  description: string
  envVars: { name: string; description: string }[]
}

function getIcon(iconName: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[iconName]
  if (typeof icon === 'function') return icon as LucideIcon
  return LucideIcons.Bot
}

const categoryColors: Record<string, string> = {
  Productivity: 'bg-blue-500/10 text-blue-500',
  Research: 'bg-purple-500/10 text-purple-500',
  Content: 'bg-orange-500/10 text-orange-500',
  'AI/Dev': 'bg-green-500/10 text-green-500',
  Media: 'bg-pink-500/10 text-pink-500',
  Communication: 'bg-cyan-500/10 text-cyan-500',
}

export function SkillCard({ skill }: { skill: Skill }) {
  const Icon = getIcon(skill.icon)
  const badgeColor = categoryColors[skill.category] ?? 'bg-muted text-muted-foreground'

  return (
    <Link href={`/member/skills/${skill.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{skill.name}</h3>
              <span
                className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}
              >
                {skill.category}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{skill.oneLiner}</p>
          {skill.envVars.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground/60">
              Requires: {skill.envVars.map((e) => e.name).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
