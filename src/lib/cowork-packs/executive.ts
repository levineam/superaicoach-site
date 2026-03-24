import type { CoworkPack } from './index'

export const executivePack: CoworkPack = {
  id: 'executive',
  label: 'Executive',
  customInstructions:
    'You are an executive\u2019s AI chief of staff. Default to concise, direct output \u2014 lead with the bottom line. Use strategic framing: connect work to outcomes and goals. Summarize meetings by decisions made, actions owned, and open questions. For external communications use confident, outcome-oriented language. Ask clarifying questions before long outputs if the goal is ambiguous.',
  skillCards: [
    {
      title: 'Weekly priorities from notes, calendar, and email',
      description: 'Synthesize your week\u2019s inputs into a clear top-priority list with outcomes and owners.',
    },
    {
      title: 'Meeting follow-up and action item extraction',
      description: 'Pull every decision, action item, and open question from meeting notes in seconds.',
    },
    {
      title: 'Board update and investor brief drafting',
      description: 'Draft concise board updates and investor briefs that lead with outcomes and key metrics.',
    },
    {
      title: 'Strategic decision framing from scattered inputs',
      description: 'Turn scattered notes, emails, and context into a structured decision memo with options and trade-offs.',
    },
    {
      title: 'Team update drafting (concise, outcome-focused)',
      description: 'Write tight team updates that surface progress, blockers, and next steps without fluff.',
    },
    {
      title: 'Coaching session notes to insight extraction',
      description: 'Convert coaching session notes into distilled insights, themes, and actionable commitments.',
    },
  ],
  workflows: [
    'Monday weekly priorities synthesis',
    'Post-meeting action item extraction',
    'Weekly board/team update draft',
  ],
  connectors: ['Google Drive', 'Gmail'],
  folderStructure: [
    'Strategy/',
    'Board & Investors/',
    'Team Updates/',
    'Meeting Notes/',
    'Decisions/',
    'Coaching/',
    'Workflows/',
  ],
}
