export type Bundle = {
  id: string
  name: string
  description: string
  tagline: string
  availableFor: ('claude' | 'openclaw')[]
  profession?: 'consultant' | 'wealth-manager' | 'attorney' | 'other'
  features: string[]
  setupTime: string
  comingSoon?: boolean
  internalTags?: string[]
}

export const bundles: Bundle[] = [
  // jarvOS - The flagship bundle for all professions
  {
    id: 'jarvos',
    name: 'jarvOS',
    description: 'Your AI becomes a personal assistant that actually knows you.',
    tagline: 'Your AI becomes a personal assistant that actually knows you.',
    availableFor: ['claude', 'openclaw'],
    features: [
      'Your AI remembers your clients, projects, and preferences',
      'Drafts sound like you, not a chatbot',
      'Calendar and email connected so your AI knows context',
      'Ready to use today — no technical setup required'
    ],
    setupTime: 'Under 10 minutes',
    internalTags: ['flagship', 'cross-profession']
  },

  // Infinite Memory - Cross-profession bundle
  {
    id: 'infinite-memory',
    name: 'Infinite Memory',
    description: 'Your AI never forgets—anything you\'ve shared, any conversation you\'ve had, stays available forever.',
    tagline: 'Your AI never forgets—everything stays available forever.',
    availableFor: ['claude', 'openclaw'],
    features: [
      'Every conversation is permanently stored and searchable',
      'Your AI can reference past work, client history, and decisions',
      'Search across all your interactions instantly',
      'Works with email, chat, documents, and voice notes'
    ],
    setupTime: '5 minutes',
    internalTags: ['cross-profession', 'memory']
  },

  // Project Command Center - Cross-profession bundle
  {
    id: 'project-command-center',
    name: 'Project Command Center',
    description: 'Turn scattered notes and emails into organized project hubs—automatically.',
    tagline: 'Your projects, organized. Automatically.',
    availableFor: ['claude', 'openclaw'],
    features: [
      'Automatically creates project hubs from your emails and notes',
      'Tracks decisions, action items, and stakeholders',
      'Generates project updates and summaries',
      'Keeps everything connected to your calendar and contacts'
    ],
    setupTime: '3 minutes',
    internalTags: ['cross-profession', 'projects']
  },

  // Profession-specific bundles for Consultant
  {
    id: 'consultant-meeting-intelligence',
    name: 'Meeting Intelligence',
    description: 'Turn every client meeting into a searchable, compliant record—automatically.',
    tagline: 'Your meetings, documented. Automatically.',
    availableFor: ['claude', 'openclaw'],
    profession: 'consultant',
    features: [
      'Meetings transcribed and summarized automatically',
      'Action items and next steps extracted',
      'Every call archived with timestamp for compliance',
      'Searchable meeting history across all engagements'
    ],
    setupTime: '5 minutes'
  },

  {
    id: 'consultant-client-communication',
    name: 'Client Communication Suite',
    description: 'Draft every client email in your voice—in under 60 seconds.',
    tagline: 'Client emails that sound exactly like you.',
    availableFor: ['claude', 'openclaw'],
    profession: 'consultant',
    features: [
      'Emails drafted in your voice before you type',
      'Your AI knows your communication style',
      'Quarterly updates and follow-ups ready in minutes',
      'Every draft is yours to edit—your judgment, always final'
    ],
    setupTime: '3 minutes'
  },

  {
    id: 'consultant-market-briefing',
    name: 'Market Briefing',
    description: 'Your clients get a personalized market update—before your first coffee.',
    tagline: 'Relevant market insights, delivered.',
    availableFor: ['claude', 'openclaw'],
    profession: 'consultant',
    features: [
      'Daily/weekly market briefings drafted and ready',
      'Headlines filtered for client relevance',
      'Ready for email or client portal in minutes',
      'Customizable topics and frequency'
    ],
    setupTime: '2 minutes'
  },

  // Profession-specific bundles for Wealth Manager
  {
    id: 'wealth-manager-meeting-intelligence',
    name: 'Meeting Intelligence',
    description: 'Turn every client meeting into a searchable, SEC-compliant record—automatically.',
    tagline: 'Your meetings, documented. SEC-ready.',
    availableFor: ['claude', 'openclaw'],
    profession: 'wealth-manager',
    features: [
      'Meetings transcribed and summarized automatically',
      'Action items and next steps extracted',
      'SEC Books & Records compliant archiving',
      'Searchable meeting history across all client relationships'
    ],
    setupTime: '5 minutes'
  },

  {
    id: 'wealth-manager-client-communication',
    name: 'Client Communication Suite',
    description: 'Draft every client email in your voice—in under 60 seconds.',
    tagline: 'Client communications that sound exactly like you.',
    availableFor: ['claude', 'openclaw'],
    profession: 'wealth-manager',
    features: [
      'Emails drafted in your voice before you type',
      'Your AI knows your communication style',
      'Quarterly updates and follow-ups ready in minutes',
      'Reg BI compliant communication drafts'
    ],
    setupTime: '3 minutes'
  },

  {
    id: 'wealth-manager-market-briefing',
    name: 'Market Briefing',
    description: 'Your clients get a personalized market update—tailored to their portfolios.',
    tagline: 'Portfolio-specific insights, delivered.',
    availableFor: ['claude', 'openclaw'],
    profession: 'wealth-manager',
    features: [
      'Daily/weekly market briefings drafted and ready',
      'Portfolio-specific headline filtering',
      'Ready for email or client portal in minutes',
      'Performance updates and commentary included'
    ],
    setupTime: '2 minutes'
  },

  // Profession-specific bundles for Attorney
  {
    id: 'attorney-meeting-intelligence',
    name: 'Meeting Intelligence',
    description: 'Turn every client meeting into a searchable, ABA-compliant record—automatically.',
    tagline: 'Your meetings, documented. ABA-ready.',
    availableFor: ['claude', 'openclaw'],
    profession: 'attorney',
    features: [
      'Meetings transcribed and summarized automatically',
      'Action items and next steps extracted',
      'ABA 512 compliant archiving',
      'Attorney-client privilege preserved'
    ],
    setupTime: '5 minutes'
  },

  {
    id: 'attorney-client-communication',
    name: 'Client Communication Suite',
    description: 'Draft every client email in your voice—in under 60 seconds.',
    tagline: 'Client communications that sound exactly like you.',
    availableFor: ['claude', 'openclaw'],
    profession: 'attorney',
    features: [
      'Emails drafted in your voice before you type',
      'Your AI knows your communication style',
      'Case status updates ready in minutes',
      'Privilege review and confidentiality notes'
    ],
    setupTime: '3 minutes'
  },

  {
    id: 'attorney-research-assistant',
    name: 'Research Assistant',
    description: 'Case law and legal research, summarized in plain English—automatically.',
    tagline: 'Legal research, simplified.',
    availableFor: ['claude', 'openclaw'],
    profession: 'attorney',
    features: [
      'Automatically case law summaries from citations',
      'Relevant precedent extraction and analysis',
      'Plain English explanations of complex legal concepts',
      'Citation checking and validation'
    ],
    setupTime: '4 minutes'
  },

  // Profession-specific bundles for Other
  {
    id: 'general-productivity',
    name: 'Productivity Boost',
    description: 'AI-powered tools to help you work smarter, not harder.',
    tagline: 'Work smarter, not harder.',
    availableFor: ['claude', 'openclaw'],
    profession: 'other',
    features: [
      'Email automation and response drafting',
      'Meeting note summarization',
      'Document analysis and extraction',
      'Task management and prioritization'
    ],
    setupTime: '5 minutes'
  },

  // Coming soon bundles (marked as such)
  {
    id: 'voice-ai',
    name: 'Voice AI',
    description: 'Voice-enabled AI interactions—coming soon.',
    tagline: 'Voice AI is coming soon.',
    availableFor: ['claude', 'openclaw'],
    comingSoon: true,
    features: [
      'Voice-to-text dictation',
      'Voice command shortcuts',
      'Meeting transcription via voice',
      'Hands-free workflow automation'
    ],
    setupTime: 'Coming soon'
  }
]

export function getBundlesForPlatform(platform: 'claude' | 'openclaw') {
  return bundles.filter(bundle => bundle.availableFor.includes(platform))
}

export function getBundlesForProfession(profession: string) {
  return bundles.filter(bundle => bundle.profession === profession || !bundle.profession)
}

export function getBundleById(id: string) {
  return bundles.find(bundle => bundle.id === id)
}