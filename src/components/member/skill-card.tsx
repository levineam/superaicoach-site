import Link from 'next/link'
import {
  Mail,
  CheckSquare,
  StickyNote,
  BookOpen,
  CloudSun,
  AtSign,
  Pen,
  ImagePlus,
  Image,
  FileVideo,
  CalendarSearch,
  Search,
  Network,
  Brain,
  GitBranch,
  Github,
  MessageCircle,
  Smartphone,
  Lightbulb,
  Package,
} from 'lucide-react'
import type { SkillEntry } from '@/data/skills'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  CheckSquare,
  StickyNote,
  BookOpen,
  CloudSun,
  AtSign,
  Pen,
  ImagePlus,
  Image,
  FileVideo,
  CalendarSearch,
  Search,
  Network,
  Brain,
  GitBranch,
  Github,
  MessageCircle,
  Smartphone,
  Lightbulb,
  Package,
}

const tierBadge: Record<string, { label: string; className: string }> = {
  included: {
    label: 'Included',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
}

export function SkillCard({ skill }: { skill: SkillEntry }) {
  const Icon = iconMap[skill.icon] ?? Package
  const badge = tierBadge[skill.tier] ?? tierBadge.included

  return (
    <Link
      href={`/member/skills/${skill.slug}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <h3 className="text-base font-semibold text-foreground">{skill.name}</h3>

      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
        {skill.oneLiner}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {skill.category}
        </span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {skill.setupLevel} setup
        </span>
      </div>
    </Link>
  )
}
