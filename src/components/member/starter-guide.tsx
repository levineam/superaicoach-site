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
  eyebrow: string
  packageName: string
  description: string
  workflows: string[]
  setupHref: string
  detailHref: string
}

/* ------------------------------------------------------------------ */
/*  Package data                                                       */
/* ------------------------------------------------------------------ */

const PACKAGES: Record<PlatformKey, Record<ProfessionKey, PackageContent>> = {
  claude: {
    'wealth-manager': {
      eyebrow: 'Claude package',
      packageName: 'Wealth Manager Client Prep Pack',
      description:
        'A Claude-centered package for wealth managers who want cleaner client prep, clearer follow-up drafts, and faster research synthesis without heavier workflow automation.',
      workflows: [
        'Turn meeting notes into cleaner prep briefs and talking points',
        'Draft client recap emails and follow-up language faster',
        'Condense market or planning research into usable summaries',
        'Keep planning conversations organized before human review',
      ],
      setupHref: '/member/skills',
      detailHref: '/member/skills',
    },
    consultant: {
      eyebrow: 'Claude package',
      packageName: 'Consultant Drafting & Delivery Pack',
      description:
        'A Claude-first package for consultants who want sharper thinking, faster first drafts, and cleaner client-facing output while keeping execution lightweight.',
      workflows: [
        'Turn rough ideas into proposals, briefs, and client emails',
        'Refine positioning before workshops and discovery calls',
        'Summarize research into cleaner recommendation decks',
        'Translate messy notes into structured next steps',
      ],
      setupHref: '/member/skills',
      detailHref: '/member/skills',
    },
    attorney: {
      eyebrow: 'Claude package',
      packageName: 'Attorney Research & Drafting Pack',
      description:
        'A Claude-based package for legal professionals who need stronger research acceleration, cleaner document prep, and more polished client communication drafts.',
      workflows: [
        'Summarize legal research into faster internal working notes',
        'Draft client status updates and meeting prep documents',
        'Turn review notes into clearer issue lists and next actions',
        'Prepare structured first-pass language for internal refinement',
      ],
      setupHref: '/member/skills',
      detailHref: '/member/skills',
    },
    other: {
      eyebrow: 'Claude package',
      packageName: 'Professional Writing & Planning Pack',
      description:
        'A Claude package for professionals who want faster writing, cleaner meeting prep, and better synthesis without adding a more operational AI stack yet.',
      workflows: [
        'Draft follow-up emails and summaries with less friction',
        'Prepare for meetings with clearer notes and talking points',
        'Condense research into action-oriented summaries',
        'Turn rough thoughts into structured plans and checklists',
      ],
      setupHref: '/member/skills',
      detailHref: '/member/skills',
    },
  },
  openclaw: {
    'wealth-manager': {
      eyebrow: 'OpenClaw package',
      packageName: 'Wealth Manager Productivity Package',
      description:
        'An OpenClaw package for wealth managers who want client prep, compliant follow-through, and research support wired into one reviewable operating workflow.',
      workflows: [
        'Prepare for client reviews with organized context and action items',
        'Draft follow-up emails and recap notes after planning conversations',
        'Keep client tasks, notes, and scheduling aligned in one workflow',
        'Pull supporting context before meetings without losing review control',
      ],
      setupHref: '/member/configs/productivity',
      detailHref: '/member/configs/productivity',
    },
    consultant: {
      eyebrow: 'OpenClaw package',
      packageName: 'Consultant Workflow Package',
      description:
        'An OpenClaw package for consultants who want proposal drafting, meeting prep, and follow-through connected across email, notes, and research workflows.',
      workflows: [
        'Prep for calls with prior notes, context, and follow-up tasks',
        'Turn deliverables into a more repeatable operating workflow',
        'Keep proposals, notes, and next steps from getting scattered',
        'Research account context before client conversations',
      ],
      setupHref: '/member/configs/productivity',
      detailHref: '/member/configs/productivity',
    },
    attorney: {
      eyebrow: 'OpenClaw package',
      packageName: 'Attorney Operations Package',
      description:
        'An OpenClaw package for attorneys who want research support, document prep, and client follow-through handled inside a more structured day-to-day workflow.',
      workflows: [
        'Organize matter notes, tasks, and follow-up items in one place',
        'Draft client updates and internal summaries faster',
        'Prepare review checklists and issue lists before document work',
        'Gather background context before meetings and drafting sessions',
      ],
      setupHref: '/member/configs/productivity',
      detailHref: '/member/configs/productivity',
    },
    other: {
      eyebrow: 'OpenClaw package',
      packageName: 'Professional Productivity Package',
      description:
        'An OpenClaw package for professionals who want their email, meetings, notes, and follow-through tied together in one practical daily operating system.',
      workflows: [
        'Draft and manage follow-up work across the day',
        'Prepare for meetings with notes, context, and open actions',
        'Keep decisions and working notes organized automatically',
        'Research topics quickly without losing the thread of execution',
      ],
      setupHref: '/member/configs/productivity',
      detailHref: '/member/configs/productivity',
    },
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
  const pkg = PACKAGES[platform][profession]
  const ctaLabel = platform === 'claude' ? 'Set up in Claude' : 'Set up in OpenClaw'

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3 pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {pkg.eyebrow}
        </p>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {pkg.packageName}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {pkg.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            What this helps with
          </h3>
          <ul className="space-y-2">
            {pkg.workflows.map((workflow) => (
              <li
                key={workflow}
                className="flex items-start gap-2 text-sm leading-relaxed"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{workflow}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full" onClick={() => onSetupClick(pkg.setupHref)}>
            <Link href={pkg.setupHref}>
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
