'use client'

import * as React from 'react'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Download,
  Gavel,
  Landmark,
  Package,
  ShieldCheck,
  Sparkles,
  User2,
  X,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Bundle, ProfessionId } from '@/data/bundles'
import PROFESSION_BUNDLES from '@/data/bundles'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlatformId = 'openclaw' | 'claude'

const PROFESSION_ORDER: ProfessionId[] = ['consultant', 'wealth-manager', 'attorney', 'other']

const PROFESSION_META: Record<ProfessionId, { icon: React.ElementType; accent: string }> = {
  consultant: {
    icon: Briefcase,
    accent: 'from-sky-500/15 to-cyan-500/10',
  },
  'wealth-manager': {
    icon: Landmark,
    accent: 'from-emerald-500/15 to-teal-500/10',
  },
  attorney: {
    icon: Gavel,
    accent: 'from-violet-500/15 to-indigo-500/10',
  },
  other: {
    icon: User2,
    accent: 'from-amber-500/15 to-orange-500/10',
  },
}

function isBundleAvailableForPlatform(bundle: Bundle, platform: PlatformId): boolean {
  if (platform === 'openclaw') return true
  // Claude only: exclude OpenClaw-only bundles
  return bundle.platform !== 'OpenClaw'
}

function getPlatformBadgeLabel(bundle: Bundle): string | null {
  if (bundle.platform === 'OpenClaw') return 'OpenClaw only'
  if (bundle.platform === 'Claude') return 'Claude only'
  return null
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressPill({
  step,
  label,
  description,
  state,
}: {
  step: string
  label: string
  description: string
  state: 'complete' | 'active' | 'upcoming'
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 transition-colors',
        state === 'active' && 'border-accent/60 bg-accent/5',
        state !== 'active' && 'border-border/60 bg-background/80',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            state === 'complete' && 'bg-accent text-accent-foreground',
            state === 'active' && 'bg-accent text-accent-foreground',
            state === 'upcoming' && 'bg-muted text-muted-foreground',
          )}
        >
          {state === 'complete' ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            step
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

function BundleCard({
  bundle,
  platform,
  onSelect,
}: {
  bundle: Bundle
  platform: PlatformId
  onSelect: (bundle: Bundle) => void
}) {
  const available = isBundleAvailableForPlatform(bundle, platform)
  const platformBadge = getPlatformBadgeLabel(bundle)

  return (
    <button
      type="button"
      onClick={() => available && onSelect(bundle)}
      disabled={!available}
      className={cn(
        'group w-full rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        available
          ? 'border-border/60 bg-card/40 hover:border-accent/50 hover:bg-card/70 hover:shadow-sm cursor-pointer'
          : 'border-border/30 bg-muted/20 opacity-50 cursor-not-allowed',
        bundle.isFlagship && available && 'border-accent/40 bg-gradient-to-br from-accent/5 to-transparent',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{bundle.name}</span>
            {bundle.isFlagship && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                Flagship
              </span>
            )}
            {platformBadge && platform === 'claude' && bundle.platform === 'OpenClaw' && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {platformBadge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {bundle.tagline}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{bundle.setupTime}</span>
          {available && (
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
          )}
        </div>
      </div>
    </button>
  )
}

function ComponentRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const id = React.useId()
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors',
        checked ? 'border-accent/40 bg-accent/5' : 'border-border/60 bg-background/50 hover:border-accent/30',
      )}
    >
      {/* Custom checkbox */}
      <div className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
            checked ? 'border-accent bg-accent' : 'border-muted-foreground/40 bg-background',
          )}
        >
          {checked && <CheckCircle2 className="h-3 w-3 text-accent-foreground" aria-hidden="true" />}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </label>
  )
}

function BundleDetailModal({
  bundle,
  open,
  onClose,
}: {
  bundle: Bundle | null
  open: boolean
  onClose: () => void
}) {
  const [selected, setSelected] = React.useState<Set<number>>(new Set())
  const [installed, setInstalled] = React.useState(false)

  // Reset state when bundle changes
  React.useEffect(() => {
    if (bundle) {
      setSelected(new Set(bundle.components.map((_, i) => i)))
      setInstalled(false)
    }
  }, [bundle])

  if (!bundle) return null

  const selectedCount = selected.size
  const totalCount = bundle.components.length

  function toggleComponent(index: number, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(index)
      else next.delete(index)
      return next
    })
  }

  function handleInstall() {
    setInstalled(true)
  }

  const installButton = (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={handleInstall}
      disabled={selectedCount === 0 || installed}
    >
      {installed ? (
        <>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Bundle queued — coming soon
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" aria-hidden="true" />
          Install bundle
          {selectedCount < totalCount && ` (${selectedCount} of ${totalCount} components)`}
        </>
      )}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" aria-hidden="true" />
                <DialogTitle className="text-xl">{bundle.name}</DialogTitle>
                {bundle.isFlagship && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Flagship
                  </span>
                )}
              </div>
              <DialogDescription className="mt-1 text-sm leading-relaxed">
                {bundle.tagline}
              </DialogDescription>
            </div>
            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {bundle.setupTime}
            </span>
          </div>
        </DialogHeader>

        {/* Description */}
        <p className="text-sm leading-relaxed text-foreground/90">{bundle.description}</p>

        {/* What you get */}
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">What you get</p>
          <ul className="space-y-2">
            {bundle.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">What&apos;s included</p>
            <span className="text-xs text-muted-foreground">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            All components are selected by default. Uncheck any you don&apos;t want.
          </p>
          <div className="space-y-3">
            {bundle.components.map((component, i) => (
              <ComponentRow
                key={i}
                title={component.name}
                description={component.description}
                checked={selected.has(i)}
                onChange={(checked) => toggleComponent(i, checked)}
              />
            ))}
          </div>
        </div>

        {/* Install button (top of components, repeated below) */}
        <div className="space-y-3">
          {installButton}
          {installed && (
            <p className="text-center text-xs text-muted-foreground">
              One-click install is coming soon. For now, see the setup guide to get started.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MemberStarter({ userName }: { userName?: string | null }) {
  const [activeProfession, setActiveProfession] = React.useState<ProfessionId>('consultant')
  const [activePlatform, setActivePlatform] = React.useState<PlatformId>('openclaw')
  const [selectedBundle, setSelectedBundle] = React.useState<Bundle | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

  const professionSet = PROFESSION_BUNDLES[activeProfession]
  const professionMeta = PROFESSION_META[activeProfession]
  const ActiveIcon = professionMeta.icon

  // Bundles visible for selected platform
  const visibleBundles = professionSet.bundles

  function openBundle(bundle: Bundle) {
    setSelectedBundle(bundle)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            Starter setup
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Pick your profession. We&apos;ll recommend the setup that fits your work.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {userName ? `Welcome back, ${userName}. ` : ''}
            Start with a practical AI setup for client work, writing, research, and follow-through
            — without building from scratch.
          </p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <ProgressPill
            step="1"
            label="Choose your profession"
            description={`${professionSet.label} is selected.`}
            state="complete"
          />
          <ProgressPill
            step="2"
            label="Pick your platform"
            description={`${activePlatform === 'openclaw' ? 'OpenClaw' : 'Claude'} is selected.`}
            state="complete"
          />
          <ProgressPill
            step="3"
            label="Choose your bundles"
            description="Pick what to install."
            state="active"
          />
        </div>
      </section>

      {/* Step 1: Profession selector */}
      <section className="space-y-4" aria-label="Profession selector">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Step 1</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Choose your profession</h2>
        </div>
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Choose your profession">
          {PROFESSION_ORDER.map((professionId) => {
            const item = PROFESSION_BUNDLES[professionId]
            const Icon = PROFESSION_META[professionId].icon
            const isActive = professionId === activeProfession
            return (
              <button
                key={professionId}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveProfession(professionId)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border/60 bg-card/40 text-muted-foreground hover:border-accent/50 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </div>

        <Card className={cn('overflow-hidden border-border/60 bg-gradient-to-br', professionMeta.accent)}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background/80">
                <ActiveIcon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>{professionSet.label}</CardTitle>
                <CardDescription>{professionSet.selectorDescription}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Step 2: Platform chooser */}
      <section className="space-y-4" aria-label="Platform chooser">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Step 2</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Pick your platform</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Both paths work. OpenClaw unlocks deeper integrations; Claude is a simpler starting point.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(['openclaw', 'claude'] as PlatformId[]).map((platformId) => {
            const isActive = platformId === activePlatform
            const label = platformId === 'openclaw' ? 'OpenClaw' : 'Claude'
            const desc =
              platformId === 'openclaw'
                ? 'More connected — scripts, workflows, and deep integrations'
                : 'Simpler starting point — Projects, custom instructions, MCPs'
            const readyIn = platformId === 'openclaw' ? '~10 min setup' : '~5 min setup'
            return (
              <Card
                key={platformId}
                className={cn(
                  'cursor-pointer border-border/60 transition-all hover:shadow-sm',
                  isActive && 'border-accent shadow-[0_0_0_1px_rgba(59,130,246,0.35)]',
                )}
                onClick={() => setActivePlatform(platformId)}
                role="radio"
                aria-checked={isActive}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActivePlatform(platformId)}
              >
                <CardContent className="flex items-center justify-between gap-4 pt-6">
                  <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{readyIn}</p>
                  </div>
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isActive ? 'border-accent bg-accent' : 'border-muted-foreground/40',
                    )}
                  >
                    {isActive && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Step 3: Bundle detail */}
      <section className="space-y-4" aria-label="Bundle selection">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Step 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Choose your bundles</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each bundle is a pre-built AI setup for a specific job. Click any bundle to see what&apos;s
            inside and customize the components before installing.
          </p>
        </div>

        {/* Trust cue for profession */}
        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {activeProfession === 'attorney' &&
              'Attorney review is the rule, not the footnote. These setups help with structure and drafts — legal judgment stays with you.'}
            {activeProfession === 'wealth-manager' &&
              'Human review stays explicit here. Use these bundles for drafts, summaries, and prep — not unsupervised financial judgment.'}
            {activeProfession === 'consultant' &&
              'Built for client-facing work: clear drafts, practical summaries, and easy handoff before you send anything.'}
            {activeProfession === 'other' &&
              'Practical AI setup for knowledge work — helps with writing, research, and follow-through without getting in your way.'}
          </p>
        </div>

        {/* Install all button (top) */}
        <div className="flex items-center gap-3">
          <Button size="lg" className="gap-2" onClick={() => openBundle(visibleBundles[0])}>
            <Zap className="h-4 w-4" aria-hidden="true" />
            Install all bundles
          </Button>
          <span className="text-xs text-muted-foreground">
            Or pick individual bundles below
          </span>
        </div>

        {/* Bundle grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              platform={activePlatform}
              onSelect={openBundle}
            />
          ))}
        </div>

        {/* Install all button (bottom) */}
        <Button size="lg" variant="outline" className="w-full gap-2" onClick={() => openBundle(visibleBundles[0])}>
          <Zap className="h-4 w-4" aria-hidden="true" />
          Install all bundles
        </Button>
      </section>

      {/* Bundle detail modal */}
      <BundleDetailModal
        bundle={selectedBundle}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Step 4: MCP Desktop Extensions (Claude platform only) */}
      {activePlatform === 'claude' && (
        <section className="space-y-4" aria-label="MCP Desktop Extensions">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Step 4 — Power users</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Add MCP tools to Claude</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Desktop Extensions add real tools to Claude — not just instructions. Download a{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">.mcpb</code> file, double-click it,
              and Claude Desktop prompts you to install. Requires Claude Desktop v4+.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Consultant Research Extension */}
            {(activeProfession === 'consultant' || activeProfession === 'other') && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Consultant Research</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        Research companies, prep client briefs, analyze industry trends, and build competitive snapshots — right inside Claude.
                      </CardDescription>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      4 tools
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <ul className="space-y-1">
                    {['research_company', 'prepare_client_brief', 'analyze_industry_trends', 'competitive_snapshot'].map((tool) => (
                      <li key={tool} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
                        <code className="rounded bg-muted px-1">{tool}</code>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/extensions/superai-consultant-research.mcpb"
                    download="superai-consultant-research.mcpb"
                    className="inline-flex"
                  >
                    <Button size="sm" variant="outline" className="gap-2 w-full">
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download .mcpb
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Wealth Manager Tools Extension */}
            {(activeProfession === 'wealth-manager' || activeProfession === 'other') && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Wealth Manager Tools</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        Portfolio analysis, client situation modeling, market intelligence briefs, and estate planning checklists.
                      </CardDescription>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      4 tools
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <ul className="space-y-1">
                    {['analyze_portfolio_allocation', 'model_client_situation', 'market_intelligence_brief', 'estate_planning_checklist'].map((tool) => (
                      <li key={tool} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
                        <code className="rounded bg-muted px-1">{tool}</code>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/extensions/superai-wealth-manager-tools.mcpb"
                    download="superai-wealth-manager-tools.mcpb"
                    className="inline-flex"
                  >
                    <Button size="sm" variant="outline" className="gap-2 w-full">
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Download .mcpb
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Show both for attorney/other since they may want all tools */}
            {activeProfession === 'attorney' && (
              <>
                <Card className="border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Consultant Research</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Research tools useful for due diligence, client intake research, and competitive analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <a href="/extensions/superai-consultant-research.mcpb" download="superai-consultant-research.mcpb" className="inline-flex w-full">
                      <Button size="sm" variant="outline" className="gap-2 w-full">
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Download .mcpb
                      </Button>
                    </a>
                  </CardContent>
                </Card>
                <Card className="border-border/60 opacity-60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Attorney Tools</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Contract analysis, case research, and document drafting tools — coming soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button size="sm" variant="outline" className="gap-2 w-full" disabled>
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Coming soon
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            <strong>Install:</strong> Download → double-click → Claude Desktop shows the install prompt → click Install.{' '}
            <strong>Requires:</strong> Claude Desktop v4+.{' '}
            The copy-paste setup in Steps 2–3 works without this step.
          </p>
        </section>
      )}
    </div>
  )
}
