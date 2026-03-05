'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, LayoutDashboard, Users, KanbanSquare, Monitor } from 'lucide-react'

type SidebarNavProps = {
  tenantSlug: string
}

type NavItem = {
  label: string
  href: string
  icon: typeof MessageSquare
  exact?: boolean
}

export function SidebarNav({ tenantSlug }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: 'Jarvis',
      href: `/mission-control/${tenantSlug}/jarvis`,
      icon: MessageSquare,
    },
    {
      label: 'Dashboard',
      href: `/mission-control/${tenantSlug}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: 'AI Team',
      href: `/mission-control/${tenantSlug}/ai-team`,
      icon: Users,
    },
    {
      label: 'Project Board',
      href: `/mission-control/${tenantSlug}/project-board`,
      icon: KanbanSquare,
    },
    {
      label: 'Builderz MC',
      href: `/mission-control/${tenantSlug}/builderz-mc`,
      icon: Monitor,
    },
  ]

  return (
    <nav className="flex-1 p-2 space-y-0.5" aria-label="Mission Control navigation">
      {navItems.map(({ label, href, icon: Icon, exact = false }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
            ].join(' ')}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
