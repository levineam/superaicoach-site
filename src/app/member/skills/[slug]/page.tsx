import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Key,
  Lightbulb,
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
  Package,
} from 'lucide-react'
import {
  getMemberSkills,
  getSkillBySlug,
  getRelatedSkills,
} from '@/data/skills'
import { SkillCard } from '@/components/member/skill-card'

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

const tierLabel: Record<string, string> = {
  included: 'Included with membership',
  advanced: 'Advanced — may need API keys',
}

const setupLabel: Record<string, string> = {
  easy: 'Easy — works out of the box',
  moderate: 'Moderate — some configuration needed',
  advanced: 'Advanced — developer setup',
}

export async function generateStaticParams() {
  return getMemberSkills().map((skill) => ({ slug: skill.slug }))
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)

  if (!skill || skill.tier === 'internal') {
    notFound()
  }

  const Icon = iconMap[skill.icon] ?? Package
  const related = getRelatedSkills(skill)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back link */}
      <Link
        href="/member/skills"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Skills
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {skill.name}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {skill.oneLiner}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {skill.category}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {tierLabel[skill.tier]}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {setupLabel[skill.setupLevel]}
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          What it does
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {skill.description}
        </p>
      </section>

      {/* Who it's for / What it helps */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Who it&apos;s for
          </h3>
          <p className="text-sm leading-relaxed text-foreground">
            {skill.whoItsFor}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/60 p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What it helps with
          </h3>
          <p className="text-sm leading-relaxed text-foreground">
            {skill.whatItHelps}
          </p>
        </div>
      </div>

      {/* Use cases */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Lightbulb className="h-5 w-5 text-accent" />
          Use cases
        </h2>
        <ul className="space-y-2">
          {skill.useCases.map((uc, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {uc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Install steps */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Terminal className="h-5 w-5 text-accent" />
          Setup guide
        </h2>
        <ol className="space-y-3">
          {skill.installSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Environment variables */}
      {skill.envVars.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Key className="h-5 w-5 text-accent" />
            Configuration
          </h2>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Variable
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Required
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {skill.envVars.map((env) => (
                  <tr key={env.name} className="border-t border-border/40">
                    <td className="px-4 py-2.5">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                        {env.name}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {env.required ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {env.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related skills */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Related skills
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.slice(0, 4).map((s) => (
              <SkillCard key={s.slug} skill={s} />
            ))}
          </div>
        </section>
      )}

      {/* Updated date */}
      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(skill.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  )
}
