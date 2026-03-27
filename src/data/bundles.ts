export type Platform = 'Claude & OpenClaw' | 'Claude' | 'OpenClaw'

export type Profession = 'wealth-manager' | 'consultant' | 'attorney' | 'other'

export interface BundleComponent {
  id: string
  name: string
  description: string
}

export interface Bundle {
  id: string
  name: string
  tagline: string
  description: string
  bullets: string[]
  platform: Platform
  setupTime: string
  isFlagship?: boolean
  isCrossProfession?: boolean
  components: BundleComponent[]
}

export interface ProfessionBundleSet {
  profession: Profession
  label: string
  selectorDescription: string
  bundles: Bundle[]
}

/* ------------------------------------------------------------------ */
/*  Shared component definitions (skill → user-facing)                */
/* ------------------------------------------------------------------ */

const C = {
  personalMemory: {
    id: 'personal-memory',
    name: 'Personal Memory',
    description: 'Your AI remembers your clients, projects, and preferences',
  } as BundleComponent,
  emailCalendar: {
    id: 'email-calendar',
    name: 'Email & Calendar',
    description: 'Connect Gmail and Google Calendar for meeting prep and follow-ups',
  } as BundleComponent,
  voiceCalibration: {
    id: 'voice-calibration',
    name: 'Voice Calibration',
    description: 'Your AI learns your writing style and tone',
  } as BundleComponent,
  knowledgeLibrary: {
    id: 'knowledge-library',
    name: 'Knowledge Library',
    description: 'Save and search your notes, research, and client files',
  } as BundleComponent,
  taskCapture: {
    id: 'task-capture',
    name: 'Task Capture',
    description: 'Capture action items from conversations',
  } as BundleComponent,
  conversationMemory: {
    id: 'conversation-memory',
    name: 'Conversation Memory',
    description: 'Every conversation preserved and searchable',
  } as BundleComponent,
  meetingTranscription: {
    id: 'meeting-transcription',
    name: 'Meeting Transcription',
    description: 'Transcribe client calls and meetings',
  } as BundleComponent,
  smartSummaries: {
    id: 'smart-summaries',
    name: 'Smart Summaries',
    description: 'Generate structured summaries from any content',
  } as BundleComponent,
  researchSynthesis: {
    id: 'research-synthesis',
    name: 'Research Synthesis',
    description: 'Synthesize recent news and developments',
  } as BundleComponent,
  semanticSearch: {
    id: 'semantic-search',
    name: 'Semantic Search',
    description: 'Find relevant content across your knowledge base',
  } as BundleComponent,
  videoRecordingImport: {
    id: 'video-recording-import',
    name: 'Video & Recording Import',
    description: 'Import transcripts from Zoom, Teams, and recorded calls',
  } as BundleComponent,
  aiTaskManagement: {
    id: 'ai-task-management',
    name: 'AI Task Management',
    description: 'Assign and track work across AI agents',
  } as BundleComponent,
  technicalDelegation: {
    id: 'technical-delegation',
    name: 'Technical Delegation',
    description: 'Delegate technical tasks to specialized AI agents',
  } as BundleComponent,
}

/* ------------------------------------------------------------------ */
/*  Shared flagship bundle                                             */
/* ------------------------------------------------------------------ */

const jarvOS: Bundle = {
  id: 'jarvos',
  name: 'jarvOS',
  tagline: 'Your AI becomes a personal assistant that actually knows you.',
  description:
    'Your calendar, email, and client notes — all connected. jarvOS turns your AI assistant from a generic chatbot into someone who actually understands your work, your clients, and your voice. Set it up once in under 10 minutes.',
  bullets: [
    'Your AI remembers your clients, projects, and preferences — no re-explaining every conversation',
    'Drafts sound like you, not a chatbot — your tone, your sign-off, your style',
    'Calendar and email connected so your AI knows who you\'re meeting and why',
    'Ready to use today — no technical setup, no developer required',
  ],
  platform: 'Claude & OpenClaw',
  setupTime: '10 minutes',
  isFlagship: true,
  components: [
    C.personalMemory,
    C.emailCalendar,
    C.voiceCalibration,
    C.knowledgeLibrary,
    C.taskCapture,
  ],
}

/* ------------------------------------------------------------------ */
/*  Cross-profession bundles (OpenClaw only)                           */
/* ------------------------------------------------------------------ */

const infiniteMemory: Bundle = {
  id: 'infinite-memory',
  name: 'Infinite Memory',
  tagline: 'Your AI never forgets. Every conversation, every decision, every preference — perfectly recalled.',
  description:
    'Most AI assistants start from scratch every conversation. With Infinite Memory, yours doesn\u2019t. Every client discussion, every decision you\u2019ve made, every preference you\u2019ve shared — your AI carries it forward. Months of context, instantly available.',
  bullets: [
    'Your AI remembers conversations from weeks and months ago — no re-explaining context',
    'Client decisions, preferences, and history carried forward automatically across every session',
    'Important details never slip through the cracks — your AI surfaces what\u2019s relevant when it matters',
    'Your memory stays private and on your machine — no cloud storage of your conversation history',
  ],
  platform: 'OpenClaw',
  setupTime: '5 minutes',
  isCrossProfession: true,
  components: [
    C.conversationMemory,
  ],
}

const projectCommandCenter: Bundle = {
  id: 'project-command-center',
  name: 'Project Command Center',
  tagline: 'Stop managing AI with chat. Assign work, track progress, get results.',
  description:
    'What if your AI assistant could manage a whole team of AI workers? Project Command Center turns your AI from a single chatbot into a managed workforce. Assign tasks, track progress, and get results — while you focus on the work that actually requires your judgment.',
  bullets: [
    'Assign tasks to AI agents and track them like you\u2019d manage a junior team member',
    'Multiple tasks running in parallel — your AI doesn\u2019t need to wait for you between steps',
    'Progress visible at a glance — what\u2019s done, what\u2019s in progress, what needs your input',
    'Your AI escalates decisions to you and handles everything else autonomously',
  ],
  platform: 'OpenClaw',
  setupTime: '5 minutes',
  isCrossProfession: true,
  components: [
    C.aiTaskManagement,
    C.technicalDelegation,
  ],
}

/** Cross-profession bundles shown for OpenClaw users after jarvOS, before profession-specific */
const crossProfessionBundles: Bundle[] = [infiniteMemory, projectCommandCenter]

/* ------------------------------------------------------------------ */
/*  Profession bundle sets                                             */
/* ------------------------------------------------------------------ */

export const professionBundles: Record<Profession, ProfessionBundleSet> = {
  'wealth-manager': {
    profession: 'wealth-manager',
    label: 'Wealth Manager',
    selectorDescription: 'Financial advisors and wealth management professionals',
    bundles: [
      jarvOS,
      {
        id: 'wm-meeting-intelligence',
        name: 'Meeting Intelligence',
        tagline:
          'Turn every client meeting into a searchable, compliant record — automatically.',
        description:
          'You finish the meeting. Your AI handles the rest. Meeting Intelligence transcribes, summarizes, and archives your client calls so your records are always complete, organized, and ready for review.',
        bullets: [
          'Client meetings transcribed and summarized in plain English — no note-taking required',
          'Action items and next steps automatically extracted from every call',
          'Every summary archived with a timestamp, ready if regulators ever ask',
          'Your meeting history is searchable — find what you discussed with any client in seconds',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.meetingTranscription,
          C.smartSummaries,
          C.emailCalendar,
          C.knowledgeLibrary,
        ],
      },
      {
        id: 'wm-client-communication',
        name: 'Client Communication Suite',
        tagline:
          'Draft every client email in your voice — in under 60 seconds.',
        description:
          'Stop staring at a blank email. Your AI drafts client-ready communications that sound exactly like you — the right tone, the right level of detail, the right sign-off. You review and send.',
        bullets: [
          'Client emails drafted in your voice before you\'ve typed the first word',
          'Your AI knows your communication style — formal or conversational, brief or thorough',
          'Quarterly updates, meeting follow-ups, and market commentary ready in minutes',
          'Every draft is yours to edit — your judgment, always final',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.voiceCalibration,
          C.emailCalendar,
          C.personalMemory,
        ],
      },
      {
        id: 'wm-market-briefing',
        name: 'Morning Market Briefing',
        tagline:
          'Your clients get a personalized market update — before your first coffee.',
        description:
          'Deliver a daily or weekly market briefing tailored to your clients\u2019 interests. Your AI pulls the most relevant headlines, synthesizes them into plain English, and drafts something worth sending.',
        bullets: [
          'A market briefing drafted and ready every morning — you pick the topics that matter',
          'Headlines filtered for what\u2019s relevant to your clients, not generic financial noise',
          'Ready for email or client portal in under 2 minutes of editing',
          'Weekly versions available for lower-frequency communication preferences',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.researchSynthesis,
          C.voiceCalibration,
          C.emailCalendar,
        ],
      },
      {
        id: 'wm-pre-meeting-prep',
        name: 'Pre-Meeting Prep',
        tagline:
          'Walk into every client meeting already knowing everything you need to know.',
        description:
          'Your AI pulls together everything relevant before a client meeting — recent communications, account notes, upcoming events, and any relevant news. You show up prepared, every time.',
        bullets: [
          'A one-page brief for every client meeting — auto-generated from your calendar',
          'Recent emails, notes, and conversations surfaced before you walk in the room',
          'Relevant news or market events tied to the client\u2019s interests',
          'Conversation starters drafted — so you\u2019re never scrambling for what to say',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.emailCalendar,
          C.knowledgeLibrary,
          C.semanticSearch,
          C.researchSynthesis,
          C.personalMemory,
        ],
      },
      {
        id: 'wm-compliance-trail',
        name: 'Compliance Paper Trail',
        tagline:
          'Every AI-assisted output is logged, timestamped, and ready for audit — automatically.',
        description:
          'When you use AI to help draft communications or meeting notes, there\u2019s a record. Your Compliance Paper Trail bundle captures what was generated, when, and what you approved.',
        bullets: [
          'Every AI-assisted draft logged with a timestamp and your approval status',
          'A simple review checklist before anything goes to a client — one click to confirm',
          'Your archive is organized by client and date, searchable when you need it',
          'Peace of mind that your AI use is documented the way regulators expect',
        ],
        platform: 'OpenClaw',
        setupTime: '2 minutes',
        components: [
          C.knowledgeLibrary,
          C.emailCalendar,
        ],
      },
      {
        id: 'wm-compliance-trail-claude',
        name: 'Compliance Paper Trail',
        tagline:
          'Every AI-assisted output is logged, timestamped, and ready for audit — automatically.',
        description:
          'When you use AI to help draft communications or meeting notes, there\u2019s a record. Your Compliance Paper Trail bundle captures what was generated, when, and what you approved.',
        bullets: [
          'Every AI-assisted draft logged with a timestamp and your approval status',
          'A simple review checklist before anything goes to a client — one click to confirm',
          'Your archive is organized by client and date, searchable when you need it',
          'Peace of mind that your AI use is documented the way regulators expect',
        ],
        platform: 'Claude',
        setupTime: '2 minutes',
        components: [
          C.knowledgeLibrary,
          C.emailCalendar,
        ],
      },
    ],
  },

  consultant: {
    profession: 'consultant',
    label: 'Consultant',
    selectorDescription: 'Management and strategy consultants',
    bundles: [
      jarvOS,
      {
        id: 'con-deliverable-accelerator',
        name: 'Deliverable Accelerator',
        tagline:
          'Turn your messy meeting notes into a polished client-ready document — in minutes.',
        description:
          'You took notes. Now your AI turns them into structured deliverables — SWOT analyses, executive summaries, slide-ready frameworks. What used to take two hours takes twenty minutes.',
        bullets: [
          'Meeting notes transformed into structured frameworks without staring at a blank page',
          'SWOT analyses, Porter\u2019s Five Forces, situation summaries generated from your raw notes',
          'Drafts match your firm\u2019s communication style — not generic consultant-speak',
          'Ready to paste into PowerPoint or your deliverable template in one step',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.knowledgeLibrary,
          C.semanticSearch,
          C.voiceCalibration,
          C.meetingTranscription,
        ],
      },
      {
        id: 'con-client-intel',
        name: 'Weekly Client Intel',
        tagline:
          'Walk into every client engagement already knowing what happened this week in their world.',
        description:
          'Before your weekly check-in, your AI scans news, earnings, and industry developments relevant to that client — and gives you a briefing you can read in 3 minutes.',
        bullets: [
          'A client-specific briefing ready before every engagement — pulled together automatically',
          'Industry news, competitor moves, and relevant headlines filtered for that client',
          'Key talking points suggested so you\u2019re driving the conversation, not reacting',
          'Searchable history — what did you review before your last meeting with them?',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.researchSynthesis,
          C.semanticSearch,
          C.personalMemory,
        ],
      },
      {
        id: 'con-proposal-machine',
        name: 'Proposal Machine',
        tagline:
          'Draft a custom proposal for any client in the time it used to take to find the last one.',
        description:
          'Stop rebuilding proposals from scratch. Your AI pulls from your past work, the client\u2019s context, and your firm\u2019s tone — and generates a first draft worth editing.',
        bullets: [
          'Full proposal drafts generated from a 5-minute brief you give your AI',
          'Your past proposals used as reference — so the new one sounds like your firm\u2019s best work',
          'Scope, approach, timeline, and investment sections all generated together',
          'Editable in any format — Word, Google Docs, or straight into your template',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '7 minutes',
        components: [
          C.knowledgeLibrary,
          C.semanticSearch,
          C.voiceCalibration,
          C.emailCalendar,
        ],
      },
      {
        id: 'con-meeting-to-action',
        name: 'Meeting-to-Action',
        tagline:
          'Your AI listens to your client meetings and turns them into action items, summaries, and follow-up emails — before you\u2019ve left the parking lot.',
        description:
          'Record your client call. Your AI handles transcription, organizes what was said, pulls out every action item, and drafts your follow-up. You review and send — done.',
        bullets: [
          'Every client meeting transcribed and summarized in plain English',
          'Action items extracted and assigned — who\u2019s doing what by when',
          'Follow-up email drafted and ready to send while the meeting is still fresh',
          'A searchable log of every client conversation you\u2019ve had',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.meetingTranscription,
          C.videoRecordingImport,
          C.smartSummaries,
          C.emailCalendar,
          C.knowledgeLibrary,
        ],
      },
      {
        id: 'con-research-synthesizer',
        name: 'Research Synthesizer',
        tagline:
          'Get a cited executive summary from 10+ sources in the time it takes to read one article.',
        description:
          'You need to understand a new industry, a competitor, or a market fast. Your AI digs through sources, synthesizes what matters, and gives you a structured brief with citations.',
        bullets: [
          'Multi-source research synthesized into a single executive summary — with citations',
          'Key themes, risks, and opportunities surfaced from the research automatically',
          'Ready to drop into your deliverable, deck, or client communication',
          'Save any research to your knowledge base — reuse it across engagements',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.researchSynthesis,
          C.semanticSearch,
          C.smartSummaries,
          C.knowledgeLibrary,
        ],
      },
    ],
  },

  attorney: {
    profession: 'attorney',
    label: 'Attorney',
    selectorDescription: 'Legal professionals',
    bundles: [
      jarvOS,
      {
        id: 'atty-document-review',
        name: 'Document Review Assistant',
        tagline:
          'Review a contract in 15 minutes instead of 3 hours — with every key clause flagged.',
        description:
          'Upload a contract or paste in the text. Your AI reads it, extracts key terms, flags unusual clauses, and gives you a structured summary of obligations, deadlines, and risks. Your judgment is still required — and final.',
        bullets: [
          'Contracts summarized by section — obligations, rights, deadlines, and red flags',
          'Unusual or one-sided clauses flagged for your attention',
          'A review checklist generated from the document so nothing gets missed',
          'Every output is a draft for your review — nothing goes to a client without your sign-off',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.knowledgeLibrary,
          C.semanticSearch,
        ],
      },
      {
        id: 'atty-client-correspondence',
        name: 'Client Correspondence',
        tagline:
          'Draft every client letter and email in your voice — with the right professional caveats already included.',
        description:
          'Your AI drafts client-facing communications that match your firm\u2019s tone, include appropriate legal disclaimers, and are ready to review and send. Less time writing, more time practicing law.',
        bullets: [
          'Client emails and letters drafted in your professional voice — not generic legal form-speak',
          'Standard disclaimers and caveats included automatically — you decide what stays',
          'Retainer letters, status updates, and engagement summaries drafted in minutes',
          'Every draft is yours to review and edit — no auto-send, ever',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.voiceCalibration,
          C.emailCalendar,
          C.knowledgeLibrary,
        ],
      },
      {
        id: 'atty-legal-research',
        name: 'Legal Research Assistant',
        tagline:
          'Get a synthesized legal research memo — with citations — in a fraction of the time.',
        description:
          'Describe the legal question. Your AI searches, synthesizes, and organizes what it finds into a structured research memo. You verify the citations and apply your judgment.',
        bullets: [
          'Legal questions researched across multiple sources and synthesized into a structured memo',
          'Key cases, statutes, and secondary sources organized for easy reference',
          'Your AI flags where further verification is needed — it\u2019s a starting point, not the final word',
          'Built-in reminder: verify all citations before use — because accuracy is your responsibility',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.researchSynthesis,
          C.semanticSearch,
          C.smartSummaries,
        ],
      },
      {
        id: 'atty-client-transcripts',
        name: 'Client Meeting Transcripts',
        tagline:
          'Every client call becomes a timestamped record — with action items — automatically.',
        description:
          'Record your client intake or consultation. Your AI transcribes it, summarizes key points, extracts action items, and archives the record.',
        bullets: [
          'Client calls transcribed and summarized — intake forms, consultations, status updates',
          'Action items extracted and organized — what you need to do, what the client agreed to',
          'A timestamped archive of every client conversation, ready if you ever need it',
          'Follow-up email drafted and waiting for your review',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.meetingTranscription,
          C.videoRecordingImport,
          C.smartSummaries,
          C.knowledgeLibrary,
          C.emailCalendar,
        ],
      },
      {
        id: 'atty-time-entries',
        name: 'Time Entry Drafts',
        tagline:
          'Turn rough time notes into clear, client-friendly billing entries — in seconds.',
        description:
          'Your rough time notes become polished billing descriptions that clients understand and don\u2019t push back on. More recoverable hours, less time writing about the time you spent.',
        bullets: [
          'Rough time notes converted into clear, professional billing descriptions automatically',
          'The right level of detail — specific enough to justify the charge, clear enough for the client',
          'Block billing broken into separate entries where appropriate',
          'Ready to paste into your billing software — no reformatting required',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '2 minutes',
        components: [
          C.knowledgeLibrary,
        ],
      },
    ],
  },

  other: {
    profession: 'other',
    label: 'Professional',
    selectorDescription: 'Other professionals',
    bundles: [
      jarvOS,
      {
        id: 'pro-email-drafting',
        name: 'Email Drafting Assistant',
        tagline:
          'Write every professional email in your voice — in under a minute.',
        description:
          'Give your AI a one-sentence summary of what you need to say. It writes the email — your tone, your style, the right level of formality. You review and send.',
        bullets: [
          'Any professional email drafted in your voice before you\u2019ve typed the greeting',
          'Tone adjustment built in — formal for new contacts, warmer for existing relationships',
          'Follow-ups, status updates, and meeting requests written in seconds',
          'Your writing style gets better over time as your AI learns how you communicate',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.voiceCalibration,
          C.emailCalendar,
          C.personalMemory,
        ],
      },
      {
        id: 'pro-meeting-summarizer',
        name: 'Meeting Summarizer',
        tagline:
          'Every meeting ends with a clear summary and action items — automatically.',
        description:
          'Stop spending 20 minutes after every meeting writing up what happened. Record the call, or paste in your notes, and your AI generates the summary and action items.',
        bullets: [
          'Meetings summarized in plain English — decisions, discussion points, next steps',
          'Action items extracted and assigned — no hunting back through your notes',
          'Follow-up email drafted and ready to send while it\u2019s still fresh',
          'A searchable archive of every meeting you\u2019ve summarized',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '5 minutes',
        components: [
          C.meetingTranscription,
          C.smartSummaries,
          C.emailCalendar,
          C.knowledgeLibrary,
        ],
      },
      {
        id: 'pro-research-assistant',
        name: 'Research Assistant',
        tagline:
          'Get a clear, cited summary of any topic — without spending hours reading.',
        description:
          'Describe what you need to understand. Your AI searches, reads, and synthesizes what it finds into a concise brief you can actually use. Hours of research becomes a 10-minute read.',
        bullets: [
          'Any topic researched and summarized — with the key sources cited',
          'Complex information translated into plain language you can act on',
          'Multiple perspectives and counterarguments surfaced — not just the top result',
          'Every research brief saved to your library so you can build on it later',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.researchSynthesis,
          C.smartSummaries,
          C.semanticSearch,
          C.knowledgeLibrary,
        ],
      },
      {
        id: 'pro-weekly-briefing',
        name: 'Weekly Briefing',
        tagline:
          'Stay current on everything that matters to your work — in 5 minutes every Monday.',
        description:
          'Every week, your AI pulls together what happened in your industry, your accounts, or your area of focus — and gives you a briefing you can actually read.',
        bullets: [
          'A weekly briefing on the topics and sources you care about — ready Monday morning',
          'Industry news, competitive moves, and relevant updates synthesized in one place',
          'Plain English summaries — no jargon, no noise, just what matters',
          'Delivered to your inbox or available whenever you want it',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '3 minutes',
        components: [
          C.researchSynthesis,
          C.voiceCalibration,
          C.emailCalendar,
        ],
      },
      {
        id: 'pro-document-review',
        name: 'Document Review',
        tagline:
          'Understand any long document in 10 minutes — without reading every page.',
        description:
          'Upload a report, contract, proposal, or research paper. Your AI reads it, extracts what matters, and gives you a structured summary with the key points, risks, and action items.',
        bullets: [
          'Any document summarized by section — key points, risks, and decisions surfaced',
          'Important deadlines, obligations, and action items extracted automatically',
          'Questions for the other party suggested — so you know what to push back on',
          'Your summary saved for future reference — searchable when you need it again',
        ],
        platform: 'Claude & OpenClaw',
        setupTime: '2 minutes',
        components: [
          C.smartSummaries,
          C.knowledgeLibrary,
          C.semanticSearch,
        ],
      },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

/** Return bundles for a profession filtered by the selected platform.
 *  For OpenClaw users: jarvOS → cross-profession bundles → profession-specific.
 *  For Claude users: jarvOS → profession-specific (cross-profession bundles are OpenClaw-only). */
export function getBundlesForSelection(
  profession: Profession,
  selectedPlatform: 'openclaw' | 'claude',
): Bundle[] {
  const set = professionBundles[profession]
  if (!set) return []

  const platformFilter = (b: Bundle) => {
    if (b.platform === 'Claude & OpenClaw') return true
    if (selectedPlatform === 'openclaw' && b.platform === 'OpenClaw') return true
    if (selectedPlatform === 'claude' && b.platform === 'Claude') return true
    return false
  }

  // Split into flagship (jarvOS) and profession-specific
  const flagship = set.bundles.filter((b) => b.isFlagship && platformFilter(b))
  const professionSpecific = set.bundles.filter((b) => !b.isFlagship && platformFilter(b))

  // Insert cross-profession bundles between flagship and profession-specific for OpenClaw
  const cross =
    selectedPlatform === 'openclaw'
      ? crossProfessionBundles.filter(platformFilter)
      : []

  return [...flagship, ...cross, ...professionSpecific]
}
