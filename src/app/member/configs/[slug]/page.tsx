import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Bot,
  Briefcase,
  CheckCircle,
  Code,
  PenTool,
  Search,
  Terminal,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import configs from '@/data/configs.json'
import skills from '@/data/skills.json'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  PenTool,
  Search,
  Code,
}

type ConfigDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return configs.map((config) => ({ slug: config.slug }))
}

export async function generateMetadata({ params }: ConfigDetailPageProps) {
  const { slug } = await params
  const config = configs.find((c) => c.slug === slug)
  if (!config) return { title: 'Config Not Found' }
  return {
    title: `${config.name} Config | SuperAIcoach`,
    description: config.description,
  }
}

export default async function ConfigDetailPage({
  params,
}: ConfigDetailPageProps) {
  const { slug } = await params
  const config = configs.find((c) => c.slug === slug)

  if (!config) {
    notFound()
  }

  const Icon = iconMap[config.icon] || Briefcase
  const includedSkills = config.skills
    .map((s) => skills.find((sk) => sk.slug === s))
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/member/configs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Configs
      </Link>

      {/* Header */}
      <div>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
            <Icon className="h-7 w-7 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {config.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              {config.skills.length} skills included
            </span>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{config.description}</p>
      </div>

      {/* What's included */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            What&apos;s Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {includedSkills.map((skill) =>
              skill ? (
                <Link
                  key={skill.slug}
                  href={`/member/skills/${skill.slug}`}
                  className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent/5"
                >
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-accent" />
                    <div>
                      <h3 className="font-medium text-foreground">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {skill.category}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </Link>
              ) : null,
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quickstart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" />
            Quickstart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {config.quickstart.split('```').map((block, i) => {
            if (i % 2 === 0) {
              return block
                .split('\n')
                .filter((line) => line.trim())
                .map((line, j) => (
                  <p
                    key={`t-${i}-${j}`}
                    className="mb-2 whitespace-pre-wrap text-foreground"
                  >
                    {line}
                  </p>
                ))
            }
            const lines = block.split('\n')
            const code = lines.slice(1).join('\n').trim()
            return (
              <pre
                key={`c-${i}`}
                className="mb-4 mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm"
              >
                <code className="text-zinc-100">{code}</code>
              </pre>
            )
          })}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/member/skills">Browse All Skills</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/member/community">Get Help</Link>
        </Button>
      </div>
    </div>
  )
}
