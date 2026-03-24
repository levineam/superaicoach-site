import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, CheckCircle, Terminal, LinkIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/member/copy-button'
import skills from '@/data/skills.json'

type SkillDetailPageProps = {
  params: Promise<{ slug: string }>
}

function getIcon(iconName: string): LucideIcon {
  const icon = (LucideIcons as Record<string, unknown>)[iconName]
  if (typeof icon === 'function') return icon as LucideIcon
  return LucideIcons.Bot
}

export function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }))
}

export async function generateMetadata({ params }: SkillDetailPageProps) {
  const { slug } = await params
  const skill = skills.find((s) => s.slug === slug)
  if (!skill) return { title: 'Skill Not Found' }
  return {
    title: `${skill.name} | Skills | SuperAIcoach`,
    description: skill.oneLiner,
  }
}

function parseInstallStep(step: string) {
  const parts: { type: 'text' | 'code'; content: string; lang?: string }[] = []
  const segments = step.split('```')

  segments.forEach((segment, i) => {
    if (i % 2 === 0) {
      // Text segment
      const trimmed = segment.trim()
      if (trimmed) parts.push({ type: 'text', content: trimmed })
    } else {
      // Code segment
      const lines = segment.split('\n')
      const lang = lines[0]?.trim() || 'bash'
      const code = lines.slice(1).join('\n').trim()
      if (code) parts.push({ type: 'code', content: code, lang })
    }
  })

  return parts
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { slug } = await params
  const skill = skills.find((s) => s.slug === slug)

  if (!skill) {
    notFound()
  }

  const Icon = getIcon(skill.icon)
  const relatedSkills = skill.relatedSlugs
    .map((rs) => skills.find((s) => s.slug === rs))
    .filter(Boolean)

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Back link */}
      <Link
        href="/member/skills"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Skills
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
            <Icon className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{skill.name}</h1>
            <span className="text-sm text-muted-foreground">{skill.category}</span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{skill.description}</p>
      </div>

      {/* Use cases */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {skill.useCases.map((useCase, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                  {i + 1}
                </span>
                <span className="text-foreground">{useCase}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Install steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" />
            Installation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-6">
            {skill.installSteps.map((step, i) => {
              const parts = parseInstallStep(step)
              return (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-3">
                    {parts.map((part, j) =>
                      part.type === 'text' ? (
                        <p key={j} className="text-foreground">
                          {part.content}
                        </p>
                      ) : (
                        <div key={j} className="relative">
                          <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 pr-12 text-sm">
                            <code className="text-zinc-100">{part.content}</code>
                          </pre>
                          <CopyButton text={part.content} />
                        </div>
                      ),
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Environment variables */}
      {skill.envVars.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-500" />
              Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 pr-4 text-left font-medium text-muted-foreground">
                      Variable
                    </th>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {skill.envVars.map((envVar) => (
                    <tr key={envVar.name} className="border-b border-border/50">
                      <td className="py-3 pr-4">
                        <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-mono text-zinc-200">
                          {envVar.name}
                        </code>
                      </td>
                      <td className="py-3 text-muted-foreground">{envVar.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related skills */}
      {relatedSkills.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              Related Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedSkills.map((related) => {
                if (!related) return null
                const RelatedIcon = getIcon(related.icon)
                return (
                  <Link
                    key={related.slug}
                    href={`/member/skills/${related.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10">
                      <RelatedIcon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {related.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{related.oneLiner}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">Need help setting up this skill?</p>
        <Button asChild>
          <Link href="/member/community">Ask the Community</Link>
        </Button>
      </div>
    </div>
  )
}
