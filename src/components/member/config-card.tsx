import Link from 'next/link'
import {
  Zap,
  Palette,
  Microscope,
  Wrench,
  Package,
} from 'lucide-react'
import type { ConfigEntry } from '@/data/configs'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Palette,
  Microscope,
  Wrench,
  Package,
}

export function ConfigCard({ config }: { config: ConfigEntry }) {
  const Icon = iconMap[config.icon] ?? Package

  return (
    <Link
      href={`/member/configs/${config.slug}`}
      className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">{config.name}</h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {config.tagline}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {config.skillSlugs.length} skills
        </span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {config.targetUser.split(',')[0].trim()}
        </span>
      </div>
    </Link>
  )
}
