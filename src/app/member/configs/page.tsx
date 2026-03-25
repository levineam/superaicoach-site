import Link from 'next/link'
import { ArrowRight, Briefcase, Code, FolderKanban, PenTool, Search } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import configs from '@/data/configs.json'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  PenTool,
  Search,
  Code,
}

export const metadata = {
  title: 'Setup Library | SuperAIcoach',
  description: 'Browse the full library of starter setups and building blocks',
}

export default function ConfigsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-accent">Secondary library</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Setup library
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            These are the underlying starter setups and building blocks behind the recommended
            paths. If you want the quickest answer, start on the profession-first page first.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-medium text-foreground">Start with the shortest path</h2>
              <p className="text-sm text-muted-foreground">
                Pick your profession and platform first, then use this library only if you want to
                customize the recommendation.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/member">
                Go to Start here
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {configs.map((config) => {
          const Icon = iconMap[config.icon] || FolderKanban
          return (
            <Link key={config.slug} href={`/member/configs/${config.slug}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle>{config.name}</CardTitle>
                      <CardDescription>
                        {config.skills.length} tools included
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {config.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {config.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View setup details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
