import Link from 'next/link'
import { Package, Settings, Mail, Users } from 'lucide-react'

import { requireAuth } from '@/lib/member/auth'

const quickLinks = [
  {
    title: 'Skills',
    description: 'Browse 40+ curated AI skills with install guides.',
    href: '/member/skills',
    icon: Package,
  },
  {
    title: 'Configs',
    description: 'Pre-built starter configs for your use case.',
    href: '/member/configs',
    icon: Settings,
  },
  {
    title: 'Newsletter',
    description: 'Daily AI briefings — what shipped, tips, and tools.',
    href: '/member/newsletter',
    icon: Mail,
  },
  {
    title: 'Community',
    description: 'Discord community of people building with AI.',
    href: '/member/community',
    icon: Users,
  },
]

export default async function MemberDashboard() {
  const session = await requireAuth()

  const displayName = session.email.split('@')[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back{displayName ? `, ${displayName}` : ''}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your AI stack, curated and ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <link.icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {link.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
