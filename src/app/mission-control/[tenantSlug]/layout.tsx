'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { SidebarNav } from './SidebarNav'
import { cn } from '@/lib/utils'

type TenantLayoutProps = {
  children: React.ReactNode
}

export default function TenantMissionControlLayout({ children }: TenantLayoutProps) {
  const params = useParams()
  const tenantSlug = params.tenantSlug as string
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-56 shrink-0 border-r border-border bg-card flex flex-col',
          'fixed inset-y-0 left-0 z-40 transition-transform md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="px-4 py-[26px] border-b border-border flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
            Mission Control
          </p>
          {/* Close button — mobile only */}
          <button
            className="md:hidden -mr-1 p-1 rounded text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <SidebarNav tenantSlug={tenantSlug} />

        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground/60 text-center">
            Super AI Coach
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar with hamburger */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur md:hidden">
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            Mission Control
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}
