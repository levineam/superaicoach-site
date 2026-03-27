'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CheckCircle2, ChevronDown, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

export function StarterGuide() {
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

  function handleInstallClick() {
    trackStarterWorkflowStarted({
      profession: toAnalyticsProfession(profession),
      platform: platform ?? DEFAULT_PLATFORM,
      targetHref: '#coming-soon',
    })
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
          <StepPlatform onSelect={handlePlatformSelect} />
        )}
        {step === 2 && (
          <StepProfession
            profession={profession}
            onProfessionChange={setProfession}
            onContinue={handleProfessionContinue}
          />
        )}
        {step === 3 && platform && (
          <StepBundleDetail
            platform={platform}
            profession={profession}
            onInstallClick={handleInstallClick}
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
  onSelect,
}: {
  onSelect: (p: PlatformKey) => void
}) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
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
/*  Step 3 — Bundle Detail                                             */
/* ------------------------------------------------------------------ */

function StepBundleDetail({
  platform,
  profession,
  onInstallClick,
}: {
  platform: PlatformKey
  profession: ProfessionKey
  onInstallClick: () => void
}) {
  const bundles = getBundlesForSelection(profession as Profession, platform)
  // All components default-selected
  const [checked, setChecked] = useState<Set<string>>(() => new Set(bundles.map((b) => b.id)))
  const [showComingSoon, setShowComingSoon] = useState(false)

  const profLabel =
    professionBundles[profession as Profession]?.label ??
    PROFESSION_LABELS[profession]
  const platformLabel = platform === 'claude' ? 'Claude' : 'OpenClaw'

  const selectedCount = checked.size

  function toggleBundle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleInstall() {
    onInstallClick()
    setShowComingSoon(true)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Bundle summary header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Your {profLabel} bundle
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Here&apos;s what&apos;s included
          </h1>
          <p className="mt-1 max-w-md text-base text-muted-foreground">
            Your {platformLabel} setup — customized for {profLabel}s. Everything below is
            pre-selected. Uncheck anything you don&apos;t want.
          </p>
          <span className="mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
            {platformLabel}
          </span>
        </div>

        {/* Install button — top */}
        <InstallButton
          selectedCount={selectedCount}
          total={bundles.length}
          platformLabel={platformLabel}
          onClick={handleInstall}
        />

        {/* Component list */}
        <div className="flex flex-col gap-3">
          {bundles.map((bundle) => (
            <BundleComponentRow
              key={bundle.id}
              bundle={bundle}
              isChecked={checked.has(bundle.id)}
              onToggle={() => toggleBundle(bundle.id)}
            />
          ))}
        </div>

        {/* Install button — bottom */}
        <InstallButton
          selectedCount={selectedCount}
          total={bundles.length}
          platformLabel={platformLabel}
          onClick={handleInstall}
        />
      </div>

      {/* Coming soon modal */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-xl">Installation coming soon</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed">
              We&apos;re putting the finishing touches on one-click bundle installation for{' '}
              {platformLabel}. You&apos;ll be the first to know when it&apos;s ready.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => setShowComingSoon(false)} className="sm:min-w-[140px]">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Install Bundle Button                                              */
/* ------------------------------------------------------------------ */

function InstallButton({
  selectedCount,
  total,
  platformLabel,
  onClick,
}: {
  selectedCount: number
  total: number
  platformLabel: string
  onClick: () => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">
          {selectedCount === total
            ? `All ${total} components selected`
            : selectedCount > 0
              ? `${selectedCount} of ${total} components selected`
              : 'No components selected'}
        </p>
        <p className="text-sm text-muted-foreground">
          Installs your {platformLabel} setup in minutes.
        </p>
      </div>
      <Button
        size="lg"
        className="min-w-[180px] gap-2"
        disabled={selectedCount === 0}
        onClick={onClick}
      >
        <Package className="h-4 w-4" />
        Install bundle
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bundle Component Row                                               */
/* ------------------------------------------------------------------ */

function BundleComponentRow({
  bundle,
  isChecked,
  onToggle,
}: {
  bundle: Bundle
  isChecked: boolean
  onToggle: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const detailsId = `bundle-details-${bundle.id}`

  return (
    <Card
      className={cn(
        'flex flex-col transition-colors duration-200',
        bundle.isFlagship && 'border-primary/40',
        isChecked && 'border-green-500/30 bg-green-50/20 dark:bg-green-950/10',
        !isChecked && 'opacity-60',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            onClick={onToggle}
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isChecked
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40 bg-background',
            )}
          >
            {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
          </button>

          {/* Title + badges */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {bundle.isFlagship && (
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Flagship
                </span>
              )}
              <h3 className="text-base font-semibold leading-tight">{bundle.name}</h3>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {bundle.tagline}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-0 pl-11">
        <p className="text-xs text-muted-foreground">Ready in {bundle.setupTime}</p>

        {/* Expand/collapse */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {expanded ? 'Show less' : 'What\'s included'}
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
