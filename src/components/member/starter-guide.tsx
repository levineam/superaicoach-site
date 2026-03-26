'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, CheckCircle2, ChevronDown } from 'lucide-react'

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
/*  Step 3 — Bundle Catalog                                            */
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
  const [activated, setActivated] = useState<Set<string>>(new Set())
  const allActivated = bundles.length > 0 && bundles.every((b) => activated.has(b.id))
  const selectedCount = activated.size

  const profLabel =
    professionBundles[profession as Profession]?.label ??
    PROFESSION_LABELS[profession]
  const platformLabel = platform === 'claude' ? 'Claude' : 'OpenClaw'
  const setupHref = platform === 'claude' ? '/member/skills' : '/member/configs/productivity'

  function handleActivate(bundle: Bundle) {
    setActivated((prev) => {
      if (prev.has(bundle.id)) return prev
      return new Set(prev).add(bundle.id)
    })
  }

  function handleSelectAll() {
    if (allActivated) return

    setActivated(new Set(bundles.map((bundle) => bundle.id)))
  }

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

      {/* Select All bar */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
        <span className="text-sm font-medium">
          Select all {bundles.length} bundles for my setup
        </span>
        <Button
          size="sm"
          variant={allActivated ? 'secondary' : 'default'}
          onClick={handleSelectAll}
          disabled={allActivated}
          className="min-w-[110px] transition-all duration-200"
        >
          {allActivated ? (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              All selected
            </>
          ) : (
            'Select All'
          )}
        </Button>
      </div>

      {/* Bundle grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            isActivated={activated.has(bundle.id)}
            onActivate={() => handleActivate(bundle)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {selectedCount > 0
              ? `${selectedCount} bundle${selectedCount === 1 ? '' : 's'} selected`
              : 'Select the bundles you want to explore first'}
          </p>
          <p className="text-sm text-muted-foreground">
            Continue to the {platformLabel} library to finish setup.
          </p>
        </div>
        <Button
          size="lg"
          className="min-w-[220px]"
          disabled={selectedCount === 0}
          onClick={() => onSetupClick(setupHref)}
        >
          Continue to {platformLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bundle Card                                                        */
/* ------------------------------------------------------------------ */

function BundleCard({
  bundle,
  isActivated,
  onActivate,
}: {
  bundle: Bundle
  isActivated: boolean
  onActivate: () => void
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
        isActivated && 'border-green-500/40 bg-green-50/30 dark:bg-green-950/10',
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

        {/* Selection button — pinned to bottom */}
        <div className="mt-auto pt-1">
          <Button
            size="sm"
            variant={isActivated ? 'secondary' : 'default'}
            className={cn(
              'w-full transition-all duration-200',
              isActivated &&
                'border-green-500/30 bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-950/20 dark:text-green-400',
            )}
            disabled={isActivated}
            onClick={onActivate}
          >
            {isActivated ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Selected
              </>
            ) : (
              'Select'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
