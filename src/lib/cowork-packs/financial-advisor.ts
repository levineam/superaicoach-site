import type { CoworkPack } from './index'

export const financialAdvisorPack: CoworkPack = {
  profession: 'financial-advisor',
  label: 'Financial Advisor',
  tagline: 'An AI assistant that understands fiduciary responsibility.',
  skillCards: [
    {
      icon: 'FileText',
      title: 'Client Portfolio Summary',
      description: 'Pull together a clear client overview from scattered notes, accounts, and past meetings.',
    },
    {
      icon: 'Calendar',
      title: 'Meeting Prep',
      description: 'Generate a client brief with goals, recent changes, and talking points before every meeting.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Compliance-Aware Drafting',
      description: 'Draft documents with built-in reminders to review for compliance before sending.',
    },
    {
      icon: 'TrendingUp',
      title: 'Market Update Digest',
      description: 'Summarize market news and research into bullets with key implications for your clients.',
    },
    {
      icon: 'Mail',
      title: 'Client Email Drafting',
      description: 'Write relationship-first emails in plain language your clients actually want to read.',
    },
    {
      icon: 'ListChecks',
      title: 'Weekly Client Task Review',
      description: 'Get a summary of open action items across all your clients every week.',
    },
  ],
  customInstructions:
    'You are a financial advisor\'s AI assistant. Always use plain language. Maintain a fiduciary tone: focus on what serves the client best. Never provide specific investment advice or guarantees. When drafting client communications, lead with clarity and empathy. Summarize research in bullets with key implications. Remind me to review compliance-sensitive content before sending.',
  folderStructure: [
    '📁 Client Notes',
    '📁 Meeting Prep',
    '📁 Compliance Reviews',
    '📁 Market Research',
    '📁 Email Drafts',
  ],
  workflows: [
    {
      name: 'Weekly Client Action Item Summary',
      description: 'Every Monday, review your client notes folder and produce a prioritized list of open tasks, follow-ups, and deadlines across all active clients.',
    },
    {
      name: 'Pre-Meeting Client Brief',
      description: 'Before each client meeting, generate a one-page brief covering: recent portfolio changes, stated goals, open questions, and suggested talking points.',
    },
    {
      name: 'Post-Meeting Action Items + Follow-Up Draft',
      description: 'After a meeting, extract key decisions and action items, then draft a follow-up email to the client summarizing next steps.',
    },
  ],
  connectors: ['Google Drive', 'Gmail'],
}
