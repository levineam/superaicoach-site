'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Resources', href: '/resources' },
  { label: 'Skills', href: '/member/skills' },
  { label: 'FAQ', href: '/#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 shadow-sm backdrop-blur-lg'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          SuperAI<span className="text-accent">coach</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" variant="ghost" className="rounded-full px-5">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-accent px-5 text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/#cta">
              Join waitlist
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 px-6 pb-6 pt-4 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="outline" className="mt-2 w-full rounded-full">
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/#cta" onClick={() => setMobileOpen(false)}>
                Join waitlist
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
