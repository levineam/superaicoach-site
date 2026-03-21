import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardCopy,
  Zap,
  Palette,
  Microscope,
  Wrench,
  Package,
} from 'lucide-react'
import { getConfigBySlug, getConfigSlugs, getConfigSkills } from '@/data/configs'
import { CopyButton } from './copy-button'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Palette,
  Microscope,
  Wrench,
  Package,
}

export function generateStaticParams() {
  return getConfigSlugs().map((slug) => ({ slug }))
}

export default async function ConfigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getConfigBySlug(slug)
  if (!config) notFound()

  const skills = getConfigSkills(config)
  const Icon = iconMap[config.icon] ?? Package

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/member/configs"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All configs
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {config.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{config.tagline}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            For: {config.targetUser}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
        <p className="leading-relaxed text-foreground/90">{config.description}</p>
      </div>

      {/* Skills included */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Skills Included ({skills.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {skills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/member/skills/${skill.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4 transition-all hover:border-accent/30 hover:shadow-sm"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{skill.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {skill.oneLiner}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* What you'll be able to do */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          What You&apos;ll Be Able to Do
        </h2>
        <ul className="space-y-3">
          {config.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-3 w-3" />
              </span>
              <span className="text-foreground/90">{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quickstart */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Quickstart</h2>
        <ol className="space-y-3">
          {config.quickstart.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="text-foreground/90">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sample openclaw.json */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Sample openclaw.json
          </h2>
          <CopyButton text={config.sampleConfig} />
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-zinc-950 p-5">
          <pre className="overflow-x-auto text-sm leading-relaxed text-zinc-300">
            <code>{config.sampleConfig}</code>
          </pre>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Paste this into <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">~/.openclaw/openclaw.json</code>.
          Replace placeholder values with your actual API keys.
        </p>
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Troubleshooting
        </h2>
        <div className="space-y-4">
          {config.troubleshooting.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card/60 p-5"
            >
              <p className="font-medium text-foreground">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
        Need help setting up?{' '}
        <Link
          href="/member/community"
          className="font-medium text-accent hover:underline"
        >
          Ask in the community
        </Link>{' '}
        — we&apos;re happy to walk you through it.
      </div>
    </div>
  )
}
