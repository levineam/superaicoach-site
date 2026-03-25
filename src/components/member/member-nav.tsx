'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FolderKanban,
  LayoutDashboard,
  Library,
  LogOut,
  Mail,
  User,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const memberLinks = [
  { label: 'Start here', href: '/member', icon: LayoutDashboard },
  { label: 'Tool library', href: '/member/skills', icon: Library },
  { label: 'Setup library', href: '/member/configs', icon: FolderKanban },
  { label: 'Newsletter', href: '/member/newsletter', icon: Mail },
  { label: 'Community', href: '/member/community', icon: Users },
  { label: 'Account', href: '/member/account', icon: User },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/member') return pathname === '/member'
  return pathname.startsWith(href)
}

export function MemberNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="mr-4 text-lg font-bold tracking-tight text-foreground"
          >
            SuperAI<span className="text-accent">coach</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {memberLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(pathname, link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <form action="/api/auth/sign-out" method="POST">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </form>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto px-6 pb-2 md:hidden">
        {memberLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              isActive(pathname, link.href)
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <link.icon className="h-3.5 w-3.5" />
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
