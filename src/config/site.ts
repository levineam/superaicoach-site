/**
 * Single source of truth for the site's offer, prices, and booking link.
 *
 * Every "Book" button on the site reads BOOKING. To change the call
 * link or its length, edit BOOKING.url and CALL_MINUTES here only.
 *
 * Public copy, metadata, and structured data name SITE.founder and keep
 * his background to FOUNDER_CREDENTIAL.
 */

export const SITE = {
  name: 'SuperAICoach',
  legalName: 'SuperAICoach LLC',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com').replace(/\/$/, ''),
  tagline: 'One-on-one AI coaching in Philadelphia',
  email: 'andrew@superaicoach.com',
  founder: 'Andrew Levine',
  personalSite: 'https://andrarchy.com',
  city: 'Philadelphia',
  region: 'PA',
} as const

/** Reads after his name: "Andrew Levine, a founder of Koinos Group and its CEO for 4 years". */
export const FOUNDER_CREDENTIAL = 'a founder of Koinos Group and its CEO for 4 years'

/** Length of the free call in minutes. Keep in sync with the Calendly event. */
export const CALL_MINUTES = 30

export const BOOKING = {
  /** The free call on Calendly. */
  url: 'https://calendly.com/levineam/30min',
  /** "30-minute", used in copy such as "a free 30-minute call". */
  duration: `${CALL_MINUTES}-minute`,
  label: `Book a free ${CALL_MINUTES}-minute call`,
} as const

/** The paid first session. Shown on the site; ongoing pricing is agreed on the call. */
export const FIRST_SESSION = {
  price: '$500',
  hours: 2,
  creditDays: 30,
} as const

export type FAQ = { q: string; a: string }

export const FAQS: FAQ[] = [
  {
    q: 'What happens on the free call?',
    a: `You tell me about your work and what’s eating your week. I’ll tell you what I’d set up first and whether working together makes sense. It’s free, and booking doesn’t ask for a card.`,
  },
  {
    q: 'What does it cost?',
    a: `The call is free. The first session is ${FIRST_SESSION.price} for ${FIRST_SESSION.hours} hours, invoiced afterward, and it counts toward your first month if you keep going within ${FIRST_SESSION.creditDays} days. After that we agree on a monthly price based on how often we meet. It’s month to month.`,
  },
  {
    q: 'Is my data safe?',
    a: 'We use business accounts, or personal accounts with model training switched off, and we agree up front on what never goes in. If you have a lawyer or a compliance person, they get the final say. I don’t give legal, tax, or investment advice.',
  },
  {
    q: 'Where do we meet?',
    a: 'At your office, or somewhere nearby in Philadelphia and the surrounding area. Video works too, from anywhere.',
  },
]

/** Structured data only. Visible copy says "Philadelphia and nearby". */
export const AREA_SERVED = [
  'Philadelphia, PA',
  'Montgomery County, PA',
  'Delaware County, PA',
  'Bucks County, PA',
  'Chester County, PA',
  'Camden County, NJ',
  'Burlington County, NJ',
]
