import type { CoworkPack } from './index'

export const executivePack: CoworkPack = {
  profession: 'executive',
  label: 'Executive',
  tagline: 'An AI chief of staff that leads with the bottom line.',
  skillCards: [
    {
      icon: 'Target',
      title: 'Weekly Priorities Synthesis',
      description: 'Pull together your top priorities from notes, calendar, and email into one clear list.',
    },
    {
      icon: 'ListChecks',
      title: 'Meeting Follow-Up Extraction',
      description: 'After any meeting, get decisions made, actions owned, and open questions.',
    },
    {
      icon: 'Presentation',
      title: 'Board & Investor Briefs',
      description: 'Draft concise board updates and investor communications from your latest data.',
    },
    {
      icon: 'Lightbulb',
      title: 'Strategic Decision Framing',
      description: 'Turn scattered inputs into structured decision frameworks with tradeoffs.',
    },
    {
      icon: 'Users',
      title: 'Team Update Drafting',
      description: 'Write outcome-focused team updates that are concise and action-oriented.',
    },
    {
      icon: 'Brain',
      title: 'Coaching Notes to Insights',
      description: 'Extract key themes and actionable insights from coaching session notes.',
    },
  ],
  customInstructions:
    'You are an executive\'s AI chief of staff. Default to concise, direct output — lead with the bottom line. Use strategic framing: connect work to outcomes and goals. Summarize meetings by decisions made, actions owned, and open questions. For external communications use confident, outcome-oriented language. Ask clarifying questions before long outputs if the goal is ambiguous.',
  folderStructure: [
    '📁 Weekly Priorities',
    '📁 Meeting Notes',
    '📁 Board & Investor Updates',
    '📁 Strategic Decisions',
    '📁 Team Communications',
  ],
  workflows: [
    {
      name: 'Monday Weekly Priorities Synthesis',
      description: 'Every Monday morning, review your calendar, notes, and inbox to produce a prioritized list of the week\'s most important items.',
    },
    {
      name: 'Post-Meeting Action Item Extraction',
      description: 'After each meeting, extract decisions, assigned actions, owners, and deadlines into a structured summary.',
    },
    {
      name: 'Weekly Board / Team Update Draft',
      description: 'At end of week, draft a concise update covering: key wins, decisions made, blockers, and next week\'s focus.',
    },
  ],
  connectors: ['Google Drive', 'Gmail'],
}
