import type { IndustryId } from './types'

export type Industry = {
  id: IndustryId
  name: string
  /** Short label for filters. */
  short: string
  /** H1 / title target, e.g. "AI for law firms in Philadelphia". */
  headline: string
  metaTitle: string
  metaDescription: string
  intro: string[]
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'law',
    name: 'Law firms',
    short: 'Law',
    headline: 'AI for law firms in Philadelphia',
    metaTitle: 'AI for Law Firms in Philadelphia: Practical Use Cases',
    metaDescription:
      'Practical, honest AI use cases for small Philadelphia law firms: intake, deadlines, client updates, research, and contract review, with the confidentiality risks spelled out.',
    intro: [
      'Small firms don’t need an AI strategy deck. They need intake notes that don’t get retyped, deadlines that land on the calendar, and first drafts that start from the file instead of a blank page.',
      'Every use case here keeps a lawyer in the loop. Under ABA Formal Opinion 512 you stay responsible for confidentiality, competence, and checking the output, so each entry lists what to watch out for.',
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting and CPA firms',
    short: 'Accounting',
    headline: 'AI for accounting and CPA firms in Philadelphia',
    metaTitle: 'AI for CPA and Accounting Firms in Philadelphia: Use Cases',
    metaDescription:
      'Realistic AI use cases for small Philadelphia CPA and bookkeeping firms: chasing documents, categorizing transactions, client questions, and advisory summaries.',
    intro: [
      'Most of the pain in a small practice is not the accounting. It’s chasing documents, answering the same questions every February, and turning numbers into something a client will read.',
      'These use cases lean on tools many firms already pay for. Client tax information carries extra obligations, so each entry flags where to slow down.',
    ],
  },
  {
    id: 'wealth',
    name: 'Wealth managers and RIAs',
    short: 'Wealth',
    headline: 'AI for wealth managers and RIAs in Philadelphia',
    metaTitle: 'AI for Financial Advisors and RIAs in Philadelphia: Use Cases',
    metaDescription:
      'AI use cases for independent advisors and small RIAs around Philadelphia: meeting notes, CRM updates, review prep, and tax-return summaries, inside your compliance rules.',
    intro: [
      'Advisors spend a surprising share of the week before and after meetings rather than in them. That’s where AI helps most right now.',
      'Your compliance manual comes first. Every use case here assumes your CCO approves the tool and its recordkeeping before any client data goes in.',
    ],
  },
  {
    id: 'property',
    name: 'Property managers',
    short: 'Property',
    headline: 'AI for property managers in Philadelphia',
    metaTitle: 'AI for Property Management Companies in Philadelphia: Use Cases',
    metaDescription:
      'AI use cases for small Philadelphia property management companies: after-hours leasing inquiries, maintenance triage, and owner reports, with fair-housing risks spelled out.',
    intro: [
      'Property management is a communication business: prospects, tenants, owners, vendors, all day and after hours. AI can take the first pass at a lot of it.',
      'Fair-housing rules apply to automated replies too, and emergencies always need a person. Each entry below says where the line is.',
    ],
  },
  {
    id: 'agencies',
    name: 'Agencies and marketing',
    short: 'Agencies',
    headline: 'AI for marketing agencies in Philadelphia',
    metaTitle: 'AI for Small Marketing Agencies in Philadelphia: Use Cases',
    metaDescription:
      'Practical AI use cases for small Philadelphia agencies and in-house marketing teams: briefs, content repurposing, and proposals, without losing your voice.',
    intro: [
      'Agencies were early to AI and many are already tired of generic output. The useful work is in the unglamorous middle: briefs, versions, and proposals.',
      'The rule that matters most: one client’s material never ends up in another client’s work.',
    ],
  },
  {
    id: 'office',
    name: 'General office and operations',
    short: 'Office',
    headline: 'AI for small business operations in Philadelphia',
    metaTitle: 'AI for Small Business Operations in Philadelphia: Use Cases',
    metaDescription:
      'AI use cases any Philadelphia small business can use: meeting notes, shared inboxes, connecting apps, searching your own files, and writing an AI use policy.',
    intro: [
      'Some of the most useful AI work isn’t industry-specific at all. It’s meetings, email, and the copy-paste between apps that nobody was hired to do.',
      'Start here if you’re not sure where to start.',
    ],
  },
  {
    id: 'health',
    name: 'Dental and medical practices',
    short: 'Dental & medical',
    headline: 'AI for dental and medical practices in Philadelphia',
    metaTitle: 'AI for Dental Offices and Medical Practices in Philadelphia',
    metaDescription:
      'Practical AI for small Philadelphia dental offices and medical practices: answering phones after hours and drafting visit notes, with HIPAA and BAA questions spelled out.',
    intro: [
      'Small practices lose hours to the phone and to charting after the last patient leaves. Those are the two places AI is most useful today.',
      'Patient information is protected health information. Every entry here assumes a vendor that signs a Business Associate Agreement (BAA) and a clinician who reviews the output.',
    ],
  },
  {
    id: 'restaurants',
    name: 'Restaurants and cafes',
    short: 'Restaurants',
    headline: 'AI for restaurants in Philadelphia',
    metaTitle: 'AI for Restaurants in Philadelphia: Practical Use Cases',
    metaDescription:
      'Low-cost AI use cases for independent Philadelphia restaurants and cafes, starting with replying to Google reviews in your own voice.',
    intro: [
      'Independent restaurants run on thin margins and thinner time. The useful AI work is small: replies, posts, and the admin nobody has time for.',
      'Your voice is the brand. Everything here keeps a person approving what goes out.',
    ],
  },
  {
    id: 'homeservices',
    name: 'Contractors and home services',
    short: 'Home services',
    headline: 'AI for contractors and home service businesses in Philadelphia',
    metaTitle: 'AI for Contractors and Home Services in Philadelphia',
    metaDescription:
      'AI use cases for Philadelphia plumbers, HVAC, electricians, cleaners, and contractors: answer every call, capture leads, and book jobs while you’re on site.',
    intro: [
      'When you’re on a ladder, the phone goes to voicemail, and the customer calls the next company on the list. That’s the first problem AI solves for trades.',
      'Emergencies still need a human. Each entry says how to route them.',
    ],
  },
  {
    id: 'realestate',
    name: 'Real estate agents and brokerages',
    short: 'Real estate',
    headline: 'AI for real estate agents in Philadelphia',
    metaTitle: 'AI for Real Estate Agents in Philadelphia: Use Cases',
    metaDescription:
      'Practical AI use cases for Philadelphia real estate agents and small brokerages: listing descriptions and marketing, with fair-housing rules spelled out.',
    intro: [
      'Agents write a lot: listings, emails, social posts, market updates. AI is good at the first draft.',
      'Fair-housing law applies to every word you publish, so each entry says what to check.',
    ],
  },
  {
    id: 'nonprofits',
    name: 'Nonprofits',
    short: 'Nonprofits',
    headline: 'AI for nonprofits in Philadelphia',
    metaTitle: 'AI for Nonprofits in Philadelphia: Grant Writing and More',
    metaDescription:
      'Practical AI use cases for small Philadelphia nonprofits: grant proposal first drafts, finding funders, and reporting, without inventing facts.',
    intro: [
      'Small nonprofits do a lot with a few people, and grant writing eats a big share of that time.',
      'Funders want your real numbers and stories. AI drafts from what you give it; it should never fill in the facts.',
    ],
  },
]

export function getIndustry(id: string) {
  return INDUSTRIES.find((i) => i.id === id)
}
