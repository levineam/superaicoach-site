'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

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
  trackStarterLibraryBrowseClicked,
  trackStarterPageView,
  trackStarterPlatformSelected,
  trackStarterProfessionSelected,
  trackStarterReturnVisit,
  trackStarterWorkflowStarted,
  type StarterPlatformKey as PlatformKey,
  type StarterProfessionKey as ProfessionKey,
} from '@/lib/analytics/starter-page'
import { cn } from '@/lib/utils'

type ToolRecommendation = {
  slug: string
  label: string
  description: string
}

type TrackRecommendation = {
  eyebrow: string
  title: string
  summary: string
  setupLabel: string
  setupDescription: string
  setupHref: string
  setupCta: string
  workflowTitle: string
  workflowSteps: string[]
  toolRecommendations: ToolRecommendation[]
  reviewTitle: string
  reviewPoints: string[]
}

type ProfessionRecommendation = {
  label: string
  shortLabel: string
  icon: typeof BriefcaseBusiness
  intro: string
  openclaw: TrackRecommendation
  claude: TrackRecommendation
}

type TrustCueConfig = {
  eyebrow: string
  title: string
  badges: string[]
}

const professionRecommendations: Record<ProfessionKey, ProfessionRecommendation> = {
  consultant: {
    label: 'Consultant',
    shortLabel: 'Consultant',
    icon: BriefcaseBusiness,
    intro:
      'You need fast client follow-through, clean meeting prep, and deliverables that sound polished without turning your week into prompt experiments.',
    openclaw: {
      eyebrow: 'Best if you want the system to help run the workflow',
      title: 'OpenClaw: client follow-through that keeps moving',
      summary:
        'Start with an ops-friendly setup that can help with email, calendar, notes, and research so your admin work stops eating the day.',
      setupLabel: 'Recommended setup: Productivity backbone',
      setupDescription:
        'Use the Productivity setup as your default engine, then layer in research and writing tools only when a client workflow needs them.',
      setupHref: '/member/configs/productivity',
      setupCta: 'Open recommended setup',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Prep for calls with meeting context, prior notes, and a next-step checklist.',
        'Turn rough ideas into proposals, summaries, and follow-up emails faster.',
        'Keep actions from getting lost across inbox, calendar, and notes.',
      ],
      toolRecommendations: [
        {
          slug: 'gog',
          label: 'Email + calendar follow-through',
          description:
            'Draft replies, prep meetings, and turn decisions into scheduled next steps.',
        },
        {
          slug: 'obsidian',
          label: 'Client memory',
          description:
            'Keep clean notes, meeting takeaways, and reusable thinking in one place.',
        },
        {
          slug: 'web-search',
          label: 'Fast background research',
          description:
            'Fill in missing context before calls, proposals, or industry conversations.',
        },
      ],
      reviewTitle: 'Keep a human in the loop',
      reviewPoints: [
        'Review any pricing, scope, or strategic promises before sending them to a client.',
        'Treat the draft as acceleration, not final judgment on a client situation.',
        'If the output will shape a relationship, read it once in your own voice first.',
      ],
    },
    claude: {
      eyebrow: 'Best if you want a strong drafting and thinking partner first',
      title: 'Claude: strong first drafts with lighter workflow wiring',
      summary:
        'Use Claude when the main goal is better writing, clearer planning, and faster synthesis while you keep the execution steps manual.',
      setupLabel: 'Recommended setup: Claude front-end + shared notes',
      setupDescription:
        'Start with Claude for drafting and planning, then keep a simple notes system behind it so decisions and client context stay organized.',
      setupHref: '/member/skills',
      setupCta: 'Browse the supporting tools',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Pressure-test positioning, proposals, and client messaging before you send them.',
        'Summarize calls and turn them into clean next steps and deliverable outlines.',
        'Use a lightweight stack when you want speed without much setup overhead.',
      ],
      toolRecommendations: [
        {
          slug: 'obsidian',
          label: 'Shared working notes',
          description:
            'Store client context and decisions somewhere Claude-supported workflows can stay grounded.',
        },
        {
          slug: 'web-search',
          label: 'Quick research support',
          description:
            'Bring fresh context into proposals, workshops, and discovery work.',
        },
        {
          slug: 'apple-notes',
          label: 'Low-friction capture',
          description:
            'Grab ideas and meeting notes fast when you do not need a heavier system.',
        },
      ],
      reviewTitle: 'Keep a human in the loop',
      reviewPoints: [
        'Claude can improve clarity fast, but you still own the judgment and promises.',
        'Double-check any client-specific facts, pricing logic, or recommendations.',
        'Read important client-facing copy once as yourself before it leaves the building.',
      ],
    },
  },
  'wealth-manager': {
    label: 'Wealth Manager',
    shortLabel: 'Wealth Manager',
    icon: ShieldCheck,
    intro:
      'You need preparation, client follow-up, and research support — but the workflow has to stay trust-first, reviewable, and grounded in human judgment.',
    openclaw: {
      eyebrow: 'Best if you want operational help without losing review control',
      title: 'OpenClaw: prep, follow-up, and research with clear checkpoints',
      summary:
        'Use OpenClaw when you want the system to help gather context, organize client work, and prepare drafts while keeping every recommendation under human review.',
      setupLabel: 'Recommended setup: Productivity backbone with research support',
      setupDescription:
        'Start with the Productivity setup for follow-through, then use research-style tools when you need market context or prep materials.',
      setupHref: '/member/configs/productivity',
      setupCta: 'Open recommended setup',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Prepare for client reviews with notes, meeting agendas, and open questions in one place.',
        'Draft follow-up emails and recap documents faster after each conversation.',
        'Pull supporting context for planning conversations without turning research into a time sink.',
      ],
      toolRecommendations: [
        {
          slug: 'gog',
          label: 'Client communication support',
          description:
            'Help with inbox triage, meeting prep, and follow-up drafts after conversations.',
        },
        {
          slug: 'obsidian',
          label: 'Reviewable client notes',
          description:
            'Keep planning notes, meeting prep, and recurring client context organized.',
        },
        {
          slug: 'web-search',
          label: 'Context gathering',
          description:
            'Pull background information for meetings and planning discussions before you speak with a client.',
        },
      ],
      reviewTitle: 'Human review is not optional here',
      reviewPoints: [
        'Do not send investment advice, product recommendations, or suitability language without human sign-off.',
        'Verify numbers, compliance language, and client-specific details before anything goes out.',
        'Use the system for prep and drafting, not autonomous financial judgment.',
      ],
    },
    claude: {
      eyebrow: 'Best if you want a research and drafting partner with lighter automation',
      title: 'Claude: cleaner planning conversations, lighter ops integration',
      summary:
        'Use Claude when your main need is turning raw notes and research into clearer client prep, recap drafts, and talking points.',
      setupLabel: 'Recommended setup: Claude planning partner + reviewable notes',
      setupDescription:
        'Keep Claude in the drafting lane and pair it with a notes system so every recommendation stays inspectable before it reaches a client.',
      setupHref: '/member/skills',
      setupCta: 'Browse the supporting tools',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Refine talking points, client review agendas, and follow-up drafts quickly.',
        'Condense messy research or meeting notes into cleaner next-step documents.',
        'Stay lightweight when you want insight and writing help more than full workflow wiring.',
      ],
      toolRecommendations: [
        {
          slug: 'obsidian',
          label: 'Structured client notes',
          description:
            'Keep planning history and meeting prep easy to review before every conversation.',
        },
        {
          slug: 'web-search',
          label: 'Research support',
          description:
            'Gather supporting context for client discussions and market-facing communication.',
        },
        {
          slug: 'apple-notes',
          label: 'Quick capture for meetings',
          description:
            'Capture rough notes fast, then move the important pieces into a reviewable workflow.',
        },
      ],
      reviewTitle: 'Human review is not optional here',
      reviewPoints: [
        'Claude can help shape language, but your judgment controls the recommendation.',
        'Check compliance-sensitive phrasing, figures, and client-specific claims every time.',
        'Never treat a draft as an approved recommendation just because it sounds polished.',
      ],
    },
  },
  attorney: {
    label: 'Attorney',
    shortLabel: 'Attorney',
    icon: Scale,
    intro:
      'You need help with prep, drafting, and synthesis — but nothing about the experience should blur authorship, legal judgment, or the need for explicit human review.',
    openclaw: {
      eyebrow: 'Best if you want matter prep and follow-through support',
      title: 'OpenClaw: organized prep, drafting support, and matter follow-through',
      summary:
        'Use OpenClaw when you want a system that helps with intake notes, research support, and administrative follow-through while keeping legal judgment firmly human.',
      setupLabel: 'Recommended setup: Research-first workflow with admin support',
      setupDescription:
        'Start with the Researcher setup for synthesis-heavy work, then keep admin and follow-up support available for the parts of practice that create drag.',
      setupHref: '/member/configs/researcher',
      setupCta: 'Open recommended setup',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Condense research and notes into cleaner issue outlines before you draft.',
        'Prepare meeting recaps, internal summaries, and document-first next steps faster.',
        'Reduce admin drag around intake, follow-up, and internal knowledge capture.',
      ],
      toolRecommendations: [
        {
          slug: 'web-search',
          label: 'Background research support',
          description:
            'Gather context and source material faster before you do the actual legal analysis.',
        },
        {
          slug: 'obsidian',
          label: 'Matter memory',
          description:
            'Keep structured notes, outlines, and reusable thinking for active matters.',
        },
        {
          slug: 'gog',
          label: 'Admin follow-through',
          description:
            'Help with scheduling, recap drafts, and getting internal next steps out of your head.',
        },
      ],
      reviewTitle: 'Keep legal judgment explicitly human',
      reviewPoints: [
        'Verify every legal conclusion, citation, and client-specific recommendation yourself.',
        'Do not send client-facing legal advice without human sign-off and matter-specific review.',
        'Use the system to accelerate prep and drafting, not to replace professional judgment.',
      ],
    },
    claude: {
      eyebrow: 'Best if you want drafting and synthesis help without heavy wiring',
      title: 'Claude: strong drafting partner for issue spotting and first-pass synthesis',
      summary:
        'Use Claude when the main need is clearer summaries, better first drafts, and faster synthesis while you keep the workflow deliberately manual and reviewable.',
      setupLabel: 'Recommended setup: Claude drafting lane + matter notes',
      setupDescription:
        'Keep Claude focused on summarizing, organizing, and pressure-testing drafts. Pair it with reliable matter notes so context stays grounded.',
      setupHref: '/member/skills',
      setupCta: 'Browse the supporting tools',
      workflowTitle: 'What this helps with this week',
      workflowSteps: [
        'Turn rough research and notes into cleaner outlines before drafting begins.',
        'Refine internal summaries, argument structures, and client communication drafts.',
        'Stay lightweight when you want help thinking and writing more than automation.',
      ],
      toolRecommendations: [
        {
          slug: 'obsidian',
          label: 'Matter notes you can trust',
          description:
            'Keep filings, research notes, and evolving arguments organized outside the chat window.',
        },
        {
          slug: 'web-search',
          label: 'Fast context gathering',
          description:
            'Collect source material and background context before you perform legal analysis.',
        },
        {
          slug: 'apple-notes',
          label: 'Quick intake capture',
          description:
            'Capture details immediately, then move anything important into a matter-specific workflow.',
        },
      ],
      reviewTitle: 'Keep legal judgment explicitly human',
      reviewPoints: [
        'Never rely on model output alone for legal interpretation, citation accuracy, or client advice.',
        'Review every draft with matter-specific facts, authorities, and professional judgment in mind.',
        'Use Claude to accelerate thinking and drafting, not to replace legal review.',
      ],
    },
  },
}

const platformOptions: { key: PlatformKey; label: string; description: string }[] = [
  {
    key: 'openclaw',
    label: 'OpenClaw',
    description: 'Best when you want the system to help run repeatable workflows.',
  },
  {
    key: 'claude',
    label: 'Claude',
    description: 'Best when you want a strong drafting and planning partner first.',
  },
]

const timeToValueLabels: Record<ProfessionKey, Record<PlatformKey, string>> = {
  consultant: {
    openclaw: 'Ready in about 10 minutes',
    claude: 'Ready in about 5 minutes',
  },
  'wealth-manager': {
    openclaw: 'Ready in about 12 minutes',
    claude: 'Ready in about 6 minutes',
  },
  attorney: {
    openclaw: 'Ready in about 12 minutes',
    claude: 'Ready in about 6 minutes',
  },
}

const trustCueByProfession: Partial<Record<ProfessionKey, TrustCueConfig>> = {
  'wealth-manager': {
    eyebrow: 'Trust-first workflow',
    title: 'Use AI to prep and draft, then make the recommendation yourself.',
    badges: [
      'Human review required',
      'Compliance-sensitive language',
      'Verify client-specific details',
    ],
  },
  attorney: {
    eyebrow: 'Professional review required',
    title: 'Use AI to accelerate prep and drafting, never to replace legal judgment.',
    badges: [
      'Attorney review required',
      'Matter-specific facts first',
      'No client-facing draft without review',
    ],
  },
}

export function StarterGuide({ displayName }: { displayName?: string }) {
  const [profession, setProfession] = useState<ProfessionKey>(DEFAULT_PROFESSION)
  const [platform, setPlatform] = useState<PlatformKey>(DEFAULT_PLATFORM)

  useEffect(() => {
    trackStarterPageView({
      profession: DEFAULT_PROFESSION,
      platform: DEFAULT_PLATFORM,
    })

    const previousVisitAt = readPreviousStarterVisit()
    if (previousVisitAt) {
      trackStarterReturnVisit({
        profession: DEFAULT_PROFESSION,
        platform: DEFAULT_PLATFORM,
        previousVisitAt,
      })
    }

    rememberStarterVisit()
  }, [])

  const professionConfig = professionRecommendations[profession]
  const activeTrack = useMemo(
    () => professionConfig[platform],
    [platform, professionConfig],
  )
  const timeToValueLabel = timeToValueLabels[profession][platform]
  const trustCue = trustCueByProfession[profession]
  const activePlatformLabel =
    platformOptions.find((option) => option.key === platform)?.label ?? platform
  const stepThreeDescription =
    activeTrack.setupHref === '/member/skills'
      ? 'Browse the supporting tools below when you want the fastest useful start.'
      : 'Open the suggested setup below when you want the fastest useful start.'

  function handleProfessionChange(nextProfession: ProfessionKey) {
    if (nextProfession === profession) return

    setProfession(nextProfession)
    trackStarterProfessionSelected({
      profession: nextProfession,
      platform,
    })
  }

  function handlePlatformChange(nextPlatform: PlatformKey) {
    if (nextPlatform === platform) return

    setPlatform(nextPlatform)
    trackStarterPlatformSelected({
      profession,
      platform: nextPlatform,
    })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-accent/5 p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Start here
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Welcome back{displayName ? `, ${displayName}` : ''}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Pick your profession and your platform. We&apos;ll point you to the simplest setup
                that feels useful fast.
              </p>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              The full tool and setup libraries still exist, but they&apos;re secondary now. Start
              with the workflow that matches your job, then go deeper only if you need to.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground sm:grid-cols-2 lg:max-w-xl">
            {platformOptions.map((option) => (
              <div key={option.key} className="rounded-xl border border-border/60 bg-card/80 p-3">
                <div className="font-medium text-foreground">{option.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_2fr]">
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle>Choose your profession</CardTitle>
            <CardDescription>
              Start with the work you actually do, not the internal tool taxonomy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(professionRecommendations) as [ProfessionKey, ProfessionRecommendation][]).map(
              ([key, value]) => {
                const Icon = value.icon
                const isActive = profession === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleProfessionChange(key)}
                    aria-pressed={isActive}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-all',
                      isActive
                        ? 'border-accent/50 bg-accent/10 shadow-sm'
                        : 'border-border/60 bg-background hover:border-accent/20 hover:bg-accent/5',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-accent/10 p-2 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{value.label}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{value.intro}</p>
                      </div>
                    </div>
                  </button>
                )
              },
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle>{professionConfig.shortLabel} starter recommendation</CardTitle>
                  <CardDescription className="mt-2">{professionConfig.intro}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((option) => {
                    const isActive = platform === option.key
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handlePlatformChange(option.key)}
                        aria-pressed={isActive}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'border-accent bg-accent text-accent-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-accent/30 hover:text-foreground',
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {activeTrack.eyebrow}
                  </p>
                  <span className="rounded-full border border-accent/20 bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                    {timeToValueLabel}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{activeTrack.title}</h2>
                <p className="mt-3 max-w-3xl text-muted-foreground">{activeTrack.summary}</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Step 1
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Pick your profession</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {professionConfig.shortLabel} is selected right now.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Step 2
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Pick your platform</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activePlatformLabel} is selected for this path.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Step 3
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Start the recommended workflow</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stepThreeDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>{activeTrack.setupLabel}</CardTitle>
                <CardDescription>{activeTrack.setupDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full justify-between rounded-full">
                  <Link
                    href={activeTrack.setupHref}
                    onClick={() =>
                      trackStarterWorkflowStarted({
                        profession,
                        platform,
                        targetHref: activeTrack.setupHref,
                      })
                    }
                  >
                    {activeTrack.setupCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>{activeTrack.workflowTitle}</CardTitle>
                <CardDescription>
                  The recommendation is workflow-first on purpose.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {activeTrack.workflowSteps.map((step) => (
                    <li key={step} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>Tools in your setup</CardTitle>
                <CardDescription>
                  Plain-English starting points, with the detailed library one click away.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeTrack.toolRecommendations.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/member/skills/${tool.slug}`}
                    className="block rounded-2xl border border-border/60 bg-background/70 p-4 transition-colors hover:border-accent/20 hover:bg-accent/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-foreground">{tool.label}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle>{activeTrack.reviewTitle}</CardTitle>
                <CardDescription>
                  Especially important in trust-sensitive work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustCue ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-200">
                      {trustCue.eyebrow}
                    </p>
                    <p className="mt-2 font-medium text-foreground">{trustCue.title}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trustCue.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-amber-500/20 bg-background/80 px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {activeTrack.reviewPoints.map((point) => (
                    <li key={point} className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Card className="border-dashed border-border/80 bg-muted/30">
        <CardHeader>
          <CardTitle>Need the full library?</CardTitle>
          <CardDescription>
            These pages are still here when you want to browse every tool or every setup — they
            just are not the first stop anymore.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="rounded-full">
            <Link
              href="/member/skills"
              onClick={() =>
                trackStarterLibraryBrowseClicked({
                  profession,
                  platform,
                  library: 'tool_library',
                  targetHref: '/member/skills',
                })
              }
            >
              Tool library
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link
              href="/member/configs"
              onClick={() =>
                trackStarterLibraryBrowseClicked({
                  profession,
                  platform,
                  library: 'setup_library',
                  targetHref: '/member/configs',
                })
              }
            >
              Setup library
              <FolderKanban className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
