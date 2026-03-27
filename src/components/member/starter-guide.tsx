'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  getBundlesForSelection,
  professionBundles,
  type Bundle,
  type BundleComponent,
  type Profession,
} from '@/data/bundles'
import {
  DEFAULT_PLATFORM,
  DEFAULT_PROFESSION,
  rememberStarterVisit,
  readPreviousStarterVisit,
  trackStarterPageView,
  trackStarterPlatformSelected,
  trackStarterProfessionSelected,
  trackStarterReturnVisit,
  trackStarterWorkflowStarted,
  type StarterProfessionKey,
} from '@/lib/analytics/starter-page'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProfessionKey = 'wealth-manager' | 'consultant' | 'attorney' | 'other'
type PlatformKey = 'openclaw' | 'claude'

const PROFESSION_LABELS: Record<ProfessionKey, string> = {
  'wealth-manager': 'Wealth Manager',
  consultant: 'Consultant',
  attorney: 'Attorney',
  other: 'Professional',
}

/* ------------------------------------------------------------------ */
/*  Analytics helpers                                                  */
/* ------------------------------------------------------------------ */

/** Map internal profession key to analytics key (analytics has no 'other') */
function toAnalyticsProfession(p: ProfessionKey): StarterProfessionKey {
  return p === 'other' ? 'consultant' : p
}

/* ------------------------------------------------------------------ */
/*  Animation state machine                                            */
/* ------------------------------------------------------------------ */

type WizardStep = 1 | 2 | 3
type AnimState = 'active' | 'exiting' | 'entering'

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StarterGuide({ displayName }: { displayName: string }) {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>(1)
  const [animState, setAnimState] = useState<AnimState>('active')
  const [platform, setPlatform] = useState<PlatformKey | null>(null)
  const [profession, setProfession] = useState<ProfessionKey>('wealth-manager')
  const mountedRef = useRef(false)

  // --- Analytics on mount ---
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    const ctx = {
      profession: DEFAULT_PROFESSION,
      platform: DEFAULT_PLATFORM,
    }

    trackStarterPageView(ctx)
    rememberStarterVisit()

    const prev = readPreviousStarterVisit()
    if (prev) {
      trackStarterReturnVisit({ ...ctx, previousVisitAt: prev })
    }
  }, [])

  // --- Step transitions ---
  function advanceTo(next: WizardStep) {
    setAnimState('exiting')
    setTimeout(() => {
      setStep(next)
      setAnimState('entering')
      // small frame delay so the entering class is applied before transitioning to active
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimState('active')
        })
      })
    }, 320)
  }

  function handlePlatformSelect(p: PlatformKey) {
    setPlatform(p)
    trackStarterPlatformSelected({
      profession: toAnalyticsProfession(profession),
      platform: p,
    })
    advanceTo(2)
  }

  function handleProfessionContinue() {
    trackStarterProfessionSelected({
      profession: toAnalyticsProfession(profession),
      platform: platform ?? DEFAULT_PLATFORM,
    })
    advanceTo(3)
  }

  function handleSetupClick(href: string) {
    trackStarterWorkflowStarted({
      profession: toAnalyticsProfession(profession),
      platform: platform ?? DEFAULT_PLATFORM,
      targetHref: href,
    })
    router.push(href)
  }

  // --- Animation class ---
  const animClass =
    animState === 'exiting'
      ? 'translate-y-[-40px] opacity-0'
      : animState === 'entering'
        ? 'translate-y-[20px] opacity-0'
        : 'translate-y-0 opacity-100'

  // --- Render ---
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div
        className={cn(
          'w-full max-w-xl transition-all duration-300 ease-out',
          step === 3 && 'max-w-3xl',
          animClass,
        )}
      >
        {step === 1 && (
          <StepPlatform displayName={displayName} onSelect={handlePlatformSelect} />
        )}
        {step === 2 && (
          <StepProfession
            profession={profession}
            onProfessionChange={setProfession}
            onContinue={handleProfessionContinue}
          />
        )}
        {step === 3 && platform && (
          <StepBundleCatalog
            platform={platform}
            profession={profession}
            onSetupClick={handleSetupClick}
          />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Platform                                                  */
/* ------------------------------------------------------------------ */

function StepPlatform({
  displayName,
  onSelect,
}: {
  displayName: string
  onSelect: (p: PlatformKey) => void
}) {
  const greeting = displayName ? `Welcome, ${displayName}` : 'Welcome'

  return (
    <div className="flex flex-col items-center gap-10">
      <p className="text-base text-muted-foreground">{greeting}</p>
      <h1 className="-mt-6 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Pick your preferred platform
      </h1>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
        <Button
          variant="outline"
          className="h-24 flex-1 text-lg font-medium"
          onClick={() => onSelect('claude')}
        >
          Claude
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-1 text-lg font-medium"
          onClick={() => onSelect('openclaw')}
        >
          OpenClaw
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Profession                                                */
/* ------------------------------------------------------------------ */

function StepProfession({
  profession,
  onProfessionChange,
  onContinue,
}: {
  profession: ProfessionKey
  onProfessionChange: (p: ProfessionKey) => void
  onContinue: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Pick your profession
      </h1>

      <div className="w-full max-w-xs">
        <select
          value={profession}
          onChange={(e) => onProfessionChange(e.target.value as ProfessionKey)}
          className="h-12 w-full rounded-md border border-input bg-background px-4 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {(Object.keys(PROFESSION_LABELS) as ProfessionKey[]).map((key) => (
            <option key={key} value={key}>
              {PROFESSION_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <Button size="lg" className="min-w-[160px]" onClick={onContinue}>
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Bundle Catalog (component checkboxes)                    */
/* ------------------------------------------------------------------ */

function StepBundleCatalog({
  platform,
  profession,
  onSetupClick,
}: {
  platform: PlatformKey
  profession: ProfessionKey
  onSetupClick: (href: string) => void
}) {
  const bundles = getBundlesForSelection(profession as Profession, platform)

  // componentId → checked state; default all checked
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const bundle of bundles) {
      for (const comp of bundle.components) {
        initial[comp.id] = true
      }
    }
    return initial
  })

  const [installed, setInstalled] = useState(false)

  // Recompute when bundles change (shouldn't happen mid-render, but be safe)
  useEffect(() => {
    const initial: Record<string, boolean> = {}
    for (const bundle of bundles) {
      for (const comp of bundle.components) {
        initial[comp.id] = true
      }
    }
    setChecked(initial)
    setInstalled(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, profession])

  const allComponents = bundles.flatMap((b) => b.components)
  // Deduplicate by id (same component may appear in multiple bundles)
  const uniqueComponentIds = Array.from(new Set(allComponents.map((c) => c.id)))
  const totalCount = uniqueComponentIds.length
  const selectedCount = uniqueComponentIds.filter((id) => checked[id]).length

  function toggleComponent(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const profLabel =
    professionBundles[profession as Profession]?.label ??
    PROFESSION_LABELS[profession]
  const platformLabel = platform === 'claude' ? 'Claude' : 'OpenClaw'
  const setupHref = platform === 'claude' ? '/member/skills' : '/member/configs/productivity'

  const installButton = (
    <Button
      size="lg"
      className="min-w-[220px]"
      onClick={() => setInstalled(true)}
    >
      Install bundle
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Your {profLabel} setup
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Here&apos;s what we recommend
        </h1>
        <span className="mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
          {platformLabel}
        </span>
      </div>

      {/* Component count + top install button */}
      <div className="flex flex-col items-start gap-3 rounded-lg border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium">
          {selectedCount} of {totalCount} components selected
        </span>
        {installButton}
      </div>

      {/* Success banner */}
      {installed && (
        <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-50 px-4 py-3 text-green-800 dark:bg-green-950/20 dark:text-green-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium">
            Coming soon — we&apos;ll notify you when bundle installation is ready.
          </p>
        </div>
      )}

      {/* Bundle cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            checked={checked}
            onToggle={toggleComponent}
          />
        ))}
      </div>

      {/* Bottom install bar */}
      <div className="flex flex-col gap-3 rounded-lg border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {selectedCount} of {totalCount} components selected
          </p>
          <p className="text-sm text-muted-foreground">
            Continue to the {platformLabel} library to finish setup.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {installButton}
          <Button
            size="lg"
            variant="outline"
            className="min-w-[160px]"
            onClick={() => onSetupClick(setupHref)}
          >
            Open library
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bundle Card (with component checkboxes)                           */
/* ------------------------------------------------------------------ */

function BundleCard({
  bundle,
  checked,
  onToggle,
}: {
  bundle: Bundle
  checked: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = `bundle-details-${bundle.id}`
  const isPlatformSpecific = bundle.platform !== 'Claude & OpenClaw'

  return (
    <Card
      className={cn(
        'flex flex-col transition-colors duration-200',
        bundle.isFlagship && 'border-primary/40',
        isPlatformSpecific && !bundle.isFlagship && 'border-violet-500/30',
      )}
    >
      <CardHeader className="space-y-1.5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {bundle.isFlagship && (
              <span className="mb-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Flagship
              </span>
            )}
            {isPlatformSpecific && !bundle.isFlagship && (
              <span className="mb-1 inline-block rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Platform
              </span>
            )}
            <h3 className="text-base font-semibold leading-tight">
              {bundle.name}
            </h3>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {bundle.tagline}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="text-xs text-muted-foreground">
          Ready in {bundle.setupTime}
        </p>

        {/* Component checkboxes */}
        <ComponentCheckboxList
          components={bundle.components}
          checked={checked}
          onToggle={onToggle}
        />

        {/* Learn more expand/collapse */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? 'Show less' : 'Learn more'}
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        </button>

        <div
          id={detailsId}
          aria-hidden={!expanded}
          className={cn(
            'grid transition-[grid-template-rows] duration-200',
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 pb-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {bundle.description}
              </p>
              <ul className="space-y-1.5">
                {bundle.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Component checkbox list                                            */
/* ------------------------------------------------------------------ */

function ComponentCheckboxList({
  components,
  checked,
  onToggle,
}: {
  components: BundleComponent[]
  checked: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  if (components.length === 0) return null

  return (
    <div className="space-y-2">
      {components.map((comp) => (
        <label
          key={comp.id}
          className="flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-0.5 hover:bg-muted/40"
        >
          <input
            type="checkbox"
            checked={!!checked[comp.id]}
            onChange={() => onToggle(comp.id)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
          />
          <div className="min-w-0">
            <span className="text-sm font-medium leading-tight">{comp.name}</span>
            <span className="text-muted-foreground"> — </span>
            <span className="text-sm leading-tight text-muted-foreground">
              {comp.description}
            </span>
          </div>
        </label>
      ))}
    </div>
  )
}
