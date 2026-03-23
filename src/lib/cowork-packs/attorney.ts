import type { CoworkPack } from './index'

export const attorneyPack: CoworkPack = {
  profession: 'attorney',
  label: 'Attorney',
  tagline: 'An AI assistant built around attorney work product.',
  skillCards: [
    {
      icon: 'ClipboardList',
      title: 'Client Intake Summaries',
      description: 'Turn raw intake notes into structured summaries with key facts, dates, and parties.',
    },
    {
      icon: 'Briefcase',
      title: 'Matter Status Reports',
      description: 'Generate concise status updates across your active matters from case files.',
    },
    {
      icon: 'BookOpen',
      title: 'Research Brief Structure',
      description: 'Organize source documents into a structured research brief with citations.',
    },
    {
      icon: 'CheckSquare',
      title: 'Contract Review Checklist',
      description: 'Generate a review checklist from any contract, flagging key terms and missing clauses.',
    },
    {
      icon: 'Mail',
      title: 'Client Update Emails',
      description: 'Draft plain-language client updates that translate legal status into clear next steps.',
    },
    {
      icon: 'Clock',
      title: 'Deadline Extraction',
      description: 'Pull deadlines, filing dates, and task requirements from documents automatically.',
    },
  ],
  customInstructions:
    'You are a lawyer\'s AI assistant. All output is attorney work product and preliminary only — never a substitute for professional legal judgment. Use clear, precise language. Flag jurisdiction-specific analysis needs. Use plain English for client communications. Always note that outputs require attorney review before sending. Do not make legal conclusions.',
  folderStructure: [
    '📁 Client Intake',
    '📁 Active Matters',
    '📁 Research & Briefs',
    '📁 Contract Reviews',
    '📁 Client Communications',
  ],
  workflows: [
    {
      name: 'Weekly Open Matter Tasks & Deadlines',
      description: 'Every Monday, scan your active matters folder and produce a prioritized list of upcoming deadlines, filing dates, and open tasks.',
    },
    {
      name: 'Pre-Call Matter History Summary',
      description: 'Before a client call, generate a one-page summary covering: matter status, recent filings, key dates, and open questions.',
    },
    {
      name: 'Post-Call Action Items + Client Update Draft',
      description: 'After a call, extract decisions and next steps, then draft a plain-language client update email.',
    },
  ],
  connectors: ['Google Drive', 'Gmail'],
}
