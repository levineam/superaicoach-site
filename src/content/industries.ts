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
]

export function getIndustry(id: string) {
  return INDUSTRIES.find((i) => i.id === id)
}
