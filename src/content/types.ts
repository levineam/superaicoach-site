export type IndustryId = 'law' | 'accounting' | 'wealth' | 'property' | 'agencies' | 'office'

export type Difficulty = 'Easy' | 'Moderate' | 'Involved'

export type Tool = {
  id: string
  name: string
  /** Official product page. */
  url: string
  /** Optional affiliate or referral link. Leave empty until a program is approved. */
  affiliateUrl?: string
  /** Two-letter badge shown on cards. */
  badge: string
}

export type UseCase = {
  slug: string
  title: string
  industry: IndustryId
  /** One line for cards and meta descriptions. */
  summary: string
  /** The time sink, in plain words. */
  problem: string
  /** What the AI actually does. */
  aiDoes: string
  /** How it's set up, in order. Used for HowTo structured data. */
  steps: string[]
  /** Tool ids from src/content/tools.ts. The first one is the badge on cards. */
  tools: string[]
  difficulty: Difficulty
  /** Rough setup effort. Always an estimate, labeled as such on the page. */
  setupEstimate: string
  watchOuts: string[]
  /** Optional, always phrased as a typical/estimated effect, never a measured result. */
  typicalEffect?: string
  featured?: boolean
}
