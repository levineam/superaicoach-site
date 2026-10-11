/**
 * Single source of truth for the site's offer, prices, and booking link.
 *
 * To go live with paid booking, change BOOKING.url only. Every
 * "Book" button on the site reads from it.
 */

export const SITE = {
  name: 'SuperAICoach',
  legalName: 'SuperAICoach LLC',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com').replace(/\/$/, ''),
  tagline: 'AI consulting for Philadelphia firms',
  email: 'andrew@superaicoach.com',
  founder: 'Andrew Levine',
  personalSite: 'https://andrarchy.com',
  city: 'Philadelphia',
  region: 'PA',
} as const

export const BOOKING = {
  /**
   * PLACEHOLDER. This is Andrew's free 30-minute Calendly event.
   * Replace with the paid Intro Session booking link (Calendly event with
   * Stripe payment turned on, or a Stripe Payment Link) before launch.
   */
  url: 'https://calendly.com/levineam/30min',
  label: 'Book an Intro Session',
  price: '$500',
  summary: 'Two hours at your office. Paid when you book, credited to your first month.',
} as const

export type Plan = {
  id: string
  name: string
  price: string
  unit: string
  cadence: string
  summary: string
  includes: string[]
  recommended?: boolean
}

export const INTRO: Plan = {
  id: 'intro',
  name: 'Intro Session',
  price: '$500',
  unit: 'one time',
  cadence: 'Two hours at your office',
  summary:
    'Live demos on your own work, time spent listening to your team, and one useful thing set up before I leave.',
  includes: [
    'About 45 minutes of demos on your real material',
    'About 45 minutes of listening: where the week goes, what is frustrating, any data concerns',
    'About 30 minutes setting up one thing your team can use the next day',
    'A written “what I’d do with you in month one” note within two business days',
    'Fully credited to your first month if you start within 30 days',
  ],
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$1,500',
    unit: '/mo',
    cadence: 'One 2-hour session a month',
    summary: 'A steady check-in for smaller teams.',
    includes: [
      'On site or video',
      'About 2 hours of setup between sessions',
      'Email questions, answered within 2 business days',
    ],
  },
  {
    id: 'biweekly',
    name: 'Biweekly',
    price: '$3,000',
    unit: '/mo',
    cadence: 'Two 2-hour sessions a month',
    summary: 'Enough rhythm for real change. My recommendation for most firms.',
    includes: [
      'At least one session a month on site',
      'About 6 hours of setup between sessions',
      'Email or chat questions, answered next business day',
      'AI onboarding for new hires',
    ],
    recommended: true,
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: '$5,500',
    unit: '/mo',
    cadence: 'A half day on site every week',
    summary: 'For firms that want to move quickly.',
    includes: [
      'About 8 hours of setup between sessions',
      'Same-business-day answers',
      'AI onboarding for new hires',
    ],
  },
]

export const EVERY_PLAN = [
  'Demos of what changed this month and what is worth your attention',
  'Time spent listening to your team',
  'Hands-on setup in the tools you already use',
  'A one-page AI-use policy for the firm, kept current',
  'A monthly one-page note: what is live, what changed, what is next',
]

export const TERMS = [
  'Month to month. Cancel the first month at any time; after that, 30 days’ notice.',
  'Firms with 26 to 50 people add 25%.',
  'Bigger custom builds are quoted separately before any work starts.',
  'Software licenses are billed to you by the vendor. I don’t mark them up.',
]

export type FAQ = { q: string; a: string }

export const FAQS: FAQ[] = [
  {
    q: 'We don’t know what we’d use AI for. Is that a problem?',
    a: 'No. That’s where most firms start, and it’s the reason this service exists. The first session is me showing you what’s possible on your own work, then listening. You decide what’s worth pursuing after you’ve seen it.',
  },
  {
    q: 'What happens in the Intro Session?',
    a: 'Two hours at your office. About 45 minutes of live demos on your team’s real material, 45 minutes of listening, and 30 minutes setting up one thing you can use the next day. You get a short written plan within two business days. The $500 is credited to your first month if you start within 30 days.',
  },
  {
    q: 'Is our client data safe?',
    a: 'We start with a one-page policy: business-tier tools that don’t train on your data, and clear rules on what goes in and what doesn’t. For law firms it maps to ABA Formal Opinion 512; for advisors, to your compliance manual. Your counsel or compliance lead approves it. I don’t give legal, tax, or investment advice.',
  },
  {
    q: 'Do we need to buy new software?',
    a: 'Usually not. We start with what you already pay for: Microsoft 365 or Google Workspace, ChatGPT, Claude, Copilot, and your practice-management or CRM software. Most firms have seats nobody is really using.',
  },
  {
    q: 'Is this going to replace my staff?',
    a: 'No, and I won’t sell it that way. AI replaces meaningless work, not people. The goal is to take the reformatting, first drafts, and copy-paste out of your team’s week so they can spend it on the work clients pay for.',
  },
  {
    q: 'Can we stop?',
    a: 'Yes. Every plan is month to month. The first month can be cancelled at any time, then it’s 30 days’ notice. Everything I set up lives in your accounts, so you keep it.',
  },
  {
    q: 'Do you replace our IT company?',
    a: 'No. Keep them. They run your network and devices. I work alongside them on how your people actually use AI day to day.',
  },
  {
    q: 'Where do you work?',
    a: 'On site across Philadelphia (Center City, University City, Fairmount, Fishtown, Northern Liberties, and the rest of the city), the Main Line, Montgomery, Delaware, and Bucks Counties, and South Jersey. Video sessions work anywhere.',
  },
  {
    q: 'How do I pay?',
    a: 'The Intro Session is paid by card when you book it online. Monthly plans are invoiced at the start of each month.',
  },
]

export const AREA_SERVED = [
  'Philadelphia, PA',
  'Montgomery County, PA',
  'Delaware County, PA',
  'Bucks County, PA',
  'Chester County, PA',
  'Camden County, NJ',
  'Burlington County, NJ',
]
