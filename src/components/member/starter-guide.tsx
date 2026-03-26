'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

type PackageContent = {
  description: string
  workflows: string[]
  setupHref: Record<PlatformKey, string>
  detailHref: string
}

/* ------------------------------------------------------------------ */
/*  Package data                                                       */
/* ------------------------------------------------------------------ */

const PACKAGES: Record<ProfessionKey, PackageContent> = {
  'wealth-manager': {
    description:
      'A focused AI setup for wealth managers who need clean client prep, compliant communication drafts, and organized follow-through — without spending the day on prompts.',
    workflows: [
      'Prepare client meeting briefs with portfolio context',
      'Draft compliant follow-up emails and summaries',
      'Organize action items across client relationships',
      'Research market themes for client conversations',
    ],
    setupHref: {
      openclaw: '/member/configs/productivity',
      claude: '/member/skills',
    },
    detailHref: '/member/skills',
  },
  consultant: {
    description:
      'An AI assistant tuned for consulting workflows — fast client follow-through, polished deliverables, and structured thinking without the prompt overhead.',
    workflows: [
      'Prep for calls with meeting context and prior notes',
      'Turn rough ideas into proposals and follow-up emails',
      'Research industry context before client conversations',
      'Keep actions organized across multiple engagements',
    ],
    setupHref: {
      openclaw: '/member/configs/productivity',
      claude: '/member/skills',
    },
    detailHref: '/member/skills',
  },
  attorney: {
    description:
      'AI assistance designed for legal professionals — structured document review prep, research acceleration, and client communication drafts that respect the need for human judgment.',
    workflows: [
      'Generate contract review checklists by agreement type',
      'Draft client status updates and engagement letters',
      'Accelerate legal research with structured summaries',
      'Organize case notes and track follow-up items',
    ],
    setupHref: {
      openclaw: '/member/configs/productivity',
      claude: '/member/skills',
    },
    detailHref: '/member/skills',
  },
  other: {
    description:
      'A professional AI setup that helps with the work that eats your day — email follow-through, meeting prep, research, and keeping your notes organized.',
    workflows: [
      'Draft and manage email follow-ups',
      'Prepare for meetings with context and action items',
      'Research topics quickly with structured summaries',
      'Keep notes and decisions organized',
    ],
    setupHref: {
      openclaw: '/member/configs/productivity',
      claude: '/member/skills',
    },
    detailHref: '/member/skills',
  },
}

const PROFESSION_LABELS: Record<ProfessionKey, string> = {
  'wealth-manager': 'Wealth Manager',
  consultant: 'Consultant',
  attorney: 'Attorney',
  other: 'Other',
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
          <StepPackage
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
/*  Step 3 — Package                                                   */
/* ------------------------------------------------------------------ */

function StepPackage({
  platform,
  profession,
  onSetupClick,
}: {
  platform: PlatformKey
  profession: ProfessionKey
  onSetupClick: (href: string) => void
}) {
  const pkg = PACKAGES[profession]
  const setupHref = pkg.setupHref[platform]
  const ctaLabel = platform === 'claude' ? 'Set up in Claude' : 'Set up in OpenClaw'

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Your recommended setup
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {pkg.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Workflows */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            What this helps with
          </h3>
          <ul className="space-y-2">
            {pkg.workflows.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full" onClick={() => onSetupClick(setupHref)}>
            <Link href={setupHref}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Link
            href={pkg.detailHref}
            className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            See what is included
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
