import type { CoworkPack } from './index'

export const attorneyPack: CoworkPack = {
  id: 'attorney',
  label: 'Attorney',
  customInstructions:
    'You are a lawyer\u2019s AI assistant. All output is attorney work product and preliminary only \u2014 never a substitute for professional legal judgment. Use clear, precise language. Flag jurisdiction-specific analysis needs. Use plain English for client communications. Always note that outputs require attorney review before sending. Do not make legal conclusions.',
  skillCards: [
    {
      title: 'Client intake summaries from raw notes',
      description: 'Transform raw intake notes into a structured client summary ready for file creation.',
    },
    {
      title: 'Matter status reports from case files',
      description: 'Generate concise status updates on open matters from case notes, filings, and correspondence.',
    },
    {
      title: 'Research brief structure from source documents',
      description: 'Outline a research brief with key issues, applicable law, and open questions from uploaded sources.',
    },
    {
      title: 'Contract review checklist generation',
      description: 'Produce a prioritized review checklist for any contract type, flagging risk areas for attorney attention.',
    },
    {
      title: 'Client update email drafting (plain language)',
      description: 'Draft plain-language client updates that explain legal developments without jargon.',
    },
    {
      title: 'Deadline and task extraction from documents',
      description: 'Extract all dates, deadlines, and action items from filings, orders, and correspondence.',
    },
  ],
  workflows: [
    'Weekly open matter tasks and deadlines',
    'Pre-call matter history summary',
    'Post-call action items + client update draft',
  ],
  connectors: ['Google Drive', 'Gmail'],
  folderStructure: [
    'Matters/',
    'Matters/[Client — Matter Name]/',
    'Intake Notes/',
    'Research/',
    'Contracts/',
    'Correspondence/',
    'Workflows/',
  ],
}
