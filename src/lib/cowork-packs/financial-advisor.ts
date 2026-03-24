import type { CoworkPack } from './index'

export const financialAdvisorPack: CoworkPack = {
  id: 'financial-advisor',
  label: 'Financial Advisor',
  customInstructions:
    'You are a financial advisor\u2019s AI assistant. Always use plain language. Maintain a fiduciary tone: focus on what serves the client best. Never provide specific investment advice or guarantees. When drafting client communications, lead with clarity and empathy. Summarize research in bullets with key implications. Remind me to review compliance-sensitive content before sending.',
  skillCards: [
    {
      title: 'Client portfolio summary from scattered notes',
      description: 'Consolidate client data from disparate sources into a clean, structured portfolio overview.',
    },
    {
      title: 'Meeting prep from client history and goals',
      description: 'Generate a focused agenda and talking points based on client history, holdings, and stated goals.',
    },
    {
      title: 'Compliance-aware document drafting',
      description: 'Draft disclosures and client-facing documents with built-in reminders to review regulatory language.',
    },
    {
      title: 'Market update digest from news/research',
      description: 'Summarize market news and research reports into concise, client-relevant bullet-point digests.',
    },
    {
      title: 'Client email drafting (plain language, relationship-first)',
      description: 'Write clear, empathetic client emails that lead with the relationship and follow with the substance.',
    },
    {
      title: 'Weekly review of open client tasks',
      description: 'Compile and prioritize outstanding action items across your entire book of clients.',
    },
  ],
  workflows: [
    'Weekly client action item summary',
    'Pre-meeting client brief',
    'Post-meeting action items + follow-up draft',
  ],
  connectors: ['Google Drive', 'Gmail'],
  folderStructure: [
    'Client Files/',
    'Client Files/[Client Name]/',
    'Meeting Notes/',
    'Compliance Docs/',
    'Market Research/',
    'Workflows/',
  ],
}
