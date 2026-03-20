export type SkillCategory =
  | 'Productivity'
  | 'Content & Media'
  | 'Research & Knowledge'
  | 'AI & Development'
  | 'Communication'
  | 'Smart Home'

export type SkillTier = 'included' | 'advanced' | 'internal'

export type SkillEntry = {
  slug: string
  name: string
  category: SkillCategory
  oneLiner: string
  icon: string // Lucide icon name
  tier: SkillTier
  source: 'custom' | 'bundled'
  whoItsFor: string
  whatItHelps: string
  setupLevel: 'easy' | 'moderate' | 'advanced'
  description: string
  useCases: string[]
  installSteps: string[]
  envVars: { name: string; required: boolean; description: string }[]
  relatedSlugs: string[]
  updatedAt: string
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Productivity',
  'Content & Media',
  'Research & Knowledge',
  'AI & Development',
  'Communication',
  'Smart Home',
]

export const skills: SkillEntry[] = [
  // ─── Productivity ─────────────────────────────────────────
  {
    slug: 'gog',
    name: 'Google Workspace (gog)',
    category: 'Productivity',
    oneLiner: 'Manage Gmail, Google Calendar, Drive, Contacts, Sheets, and Docs from your AI.',
    icon: 'Mail',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Anyone who lives in Google Workspace for email, scheduling, and documents.',
    whatItHelps: 'Read and send email, check and create calendar events, search Drive files, manage contacts, and interact with Sheets and Docs — all through natural language.',
    setupLevel: 'moderate',
    description:
      'The gog skill connects your AI assistant to Google Workspace via the gog CLI. Once set up, your assistant can check your inbox, draft replies, look up calendar events, create new meetings, search your Drive, and even read or update spreadsheets. It replaces the constant tab-switching between Gmail, Calendar, and Drive with a single conversational interface.',
    useCases: [
      'Check your inbox for urgent emails without opening Gmail',
      'Create a calendar event from a conversation: "Schedule a call with Sarah tomorrow at 3pm"',
      'Search Drive for a document by name or content',
      'Draft and send email replies with context from your notes',
      'Pull data from a Google Sheet into a conversation',
    ],
    installSteps: [
      'Install the gog CLI: follow the gog setup guide for OAuth credentials',
      'Authenticate with your Google account via `gog auth login`',
      'Verify connection: `gog gmail list --limit 5` should show recent emails',
      'The skill auto-activates once gog is installed and authenticated',
    ],
    envVars: [
      { name: 'GOG_CLIENT_ID', required: true, description: 'Google OAuth client ID' },
      { name: 'GOG_CLIENT_SECRET', required: true, description: 'Google OAuth client secret' },
    ],
    relatedSlugs: ['apple-reminders', 'obsidian', 'apple-notes'],
    updatedAt: '2026-03-15',
  },
  {
    slug: 'apple-reminders',
    name: 'Apple Reminders',
    category: 'Productivity',
    oneLiner: 'Create, manage, and complete Apple Reminders with natural language.',
    icon: 'CheckSquare',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Mac and iPhone users who use Apple Reminders as their task manager.',
    whatItHelps: 'Add tasks, check due items, complete reminders, and manage lists without opening the Reminders app.',
    setupLevel: 'easy',
    description:
      'This skill gives your AI assistant direct access to Apple Reminders via the remindctl CLI. You can add tasks conversationally, ask what\'s due today, mark items complete, and organize across lists. It works with iCloud sync, so reminders added here show up on all your Apple devices.',
    useCases: [
      '"Add a reminder to buy groceries tomorrow at 5pm"',
      '"What reminders do I have due this week?"',
      '"Mark the dentist appointment reminder as done"',
      '"Show me everything in my Work list"',
      '"Move the budget review to my Personal list"',
    ],
    installSteps: [
      'Ensure you\'re on macOS with Apple Reminders configured',
      'The remindctl CLI ships with OpenClaw — no separate install needed',
      'Grant OpenClaw permission to access Reminders when prompted',
      'Test with: ask your assistant "What reminders do I have today?"',
    ],
    envVars: [],
    relatedSlugs: ['apple-notes', 'gog', 'obsidian'],
    updatedAt: '2026-03-10',
  },
  {
    slug: 'apple-notes',
    name: 'Apple Notes',
    category: 'Productivity',
    oneLiner: 'Create, search, edit, and organize Apple Notes via your AI assistant.',
    icon: 'StickyNote',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Apple ecosystem users who capture ideas and notes in the Notes app.',
    whatItHelps: 'Quick-capture notes, search across all notes, edit existing content, and move notes between folders — synced via iCloud.',
    setupLevel: 'easy',
    description:
      'The Apple Notes skill connects your AI to the built-in Notes app via the memo CLI. You can dictate quick notes, search your entire notes library, edit existing notes, and organize them into folders. Everything syncs through iCloud to your phone and iPad.',
    useCases: [
      '"Save a note about the meeting decisions we just discussed"',
      '"Search my notes for anything about the Q2 budget"',
      '"Add a paragraph to my project planning note"',
      '"Create a new note in my Recipes folder"',
      '"List all notes I created this week"',
    ],
    installSteps: [
      'Ensure you\'re on macOS with Apple Notes and iCloud configured',
      'The memo CLI ships with OpenClaw — no separate install needed',
      'Grant access permissions when prompted on first use',
      'Test with: ask your assistant to "Create a test note"',
    ],
    envVars: [],
    relatedSlugs: ['apple-reminders', 'obsidian', 'gog'],
    updatedAt: '2026-03-10',
  },
  {
    slug: 'obsidian',
    name: 'Obsidian Vault',
    category: 'Productivity',
    oneLiner: 'Read, write, and search your Obsidian notes through AI conversations.',
    icon: 'BookOpen',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Knowledge workers and writers who use Obsidian for note-taking and knowledge management.',
    whatItHelps: 'Search notes, create new entries, update existing documents, and navigate your vault structure without switching to the Obsidian app.',
    setupLevel: 'easy',
    description:
      'This skill lets your AI assistant work directly with your Obsidian vault — plain Markdown files on disk. It can read notes, create new ones, search across your vault, and follow wiki-links between notes. Since Obsidian vaults are just folders of Markdown files, this is lightweight and works without any Obsidian plugins.',
    useCases: [
      '"Find my notes about machine learning architectures"',
      '"Create a new daily note with today\'s meeting summary"',
      '"What does my project roadmap note say about the Q2 timeline?"',
      '"Add a section to my research note on transformer models"',
      '"List all notes tagged with #important"',
    ],
    installSteps: [
      'Point OpenClaw to your vault by setting the vault path in your config',
      'The obsidian-cli ships with OpenClaw',
      'Verify with: ask your assistant to list notes in your vault',
      'Works with any Obsidian vault, no plugins required',
    ],
    envVars: [
      { name: 'OBSIDIAN_VAULT_PATH', required: true, description: 'Absolute path to your Obsidian vault directory' },
    ],
    relatedSlugs: ['apple-notes', 'qmd', 'personal-ontology'],
    updatedAt: '2026-03-12',
  },
  {
    slug: 'weather',
    name: 'Weather',
    category: 'Productivity',
    oneLiner: 'Get current weather and forecasts for any location — no API key needed.',
    icon: 'CloudSun',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Anyone who wants weather info woven into their daily briefings.',
    whatItHelps: 'Check current conditions, hourly forecasts, and multi-day outlooks for any city or address.',
    setupLevel: 'easy',
    description:
      'A zero-config weather skill that pulls current conditions and forecasts from free APIs (wttr.in and Open-Meteo). No API key required. Your assistant can answer weather questions, include weather in morning briefings, and factor conditions into planning suggestions.',
    useCases: [
      '"What\'s the weather like right now?"',
      '"Will it rain in Philadelphia this weekend?"',
      '"Give me a 5-day forecast for Tokyo"',
      'Include weather in your daily morning briefing',
      '"Should I bring an umbrella today?"',
    ],
    installSteps: [
      'No setup needed — the weather skill works out of the box',
      'Optionally set a default location in your config for faster responses',
      'Test with: "What\'s the weather in New York?"',
    ],
    envVars: [],
    relatedSlugs: ['gog', 'apple-reminders'],
    updatedAt: '2026-03-08',
  },

  // ─── Content & Media ──────────────────────────────────────
  {
    slug: 'x-post',
    name: 'X Post Drafter',
    category: 'Content & Media',
    oneLiner: 'Draft engaging X (Twitter) posts with audience-aware tone and formatting.',
    icon: 'AtSign',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Content creators, founders, and marketers who post regularly on X/Twitter.',
    whatItHelps: 'Turn ideas into polished posts with the right tone, length, and hooks for your specific audience.',
    setupLevel: 'easy',
    description:
      'The X Post skill helps you draft tweets and threads that match your voice and audience. It understands platform conventions — character limits, hook patterns, thread formatting — and helps you go from rough idea to post-ready draft. Posts are saved to your notes for review before publishing.',
    useCases: [
      '"Turn my notes about AI agents into a tweet thread"',
      '"Draft a post announcing our new feature launch"',
      '"Rewrite this paragraph as a punchy tweet"',
      '"Create a thread breaking down this complex topic"',
      '"Draft 3 variations of this post so I can pick the best one"',
    ],
    installSteps: [
      'The skill is available by default in your OpenClaw setup',
      'Optionally configure your Obsidian vault path to auto-save drafts',
      'Review drafts in your notes before publishing manually on X',
    ],
    envVars: [],
    relatedSlugs: ['humanizer', 'nano-banana-pro'],
    updatedAt: '2026-03-14',
  },
  {
    slug: 'humanizer',
    name: 'Humanizer',
    category: 'Content & Media',
    oneLiner: 'Remove signs of AI-generated writing to make text sound natural.',
    icon: 'Pen',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Writers, marketers, and professionals who use AI drafts but need a human voice.',
    whatItHelps: 'Detects and fixes AI writing patterns: inflated language, em dash overuse, rule of three, vague attributions, and promotional tone.',
    setupLevel: 'easy',
    description:
      'Based on Wikipedia\'s "Signs of AI writing" guide, the Humanizer skill identifies and rewrites patterns that scream "AI wrote this." It catches subtle tells like excessive conjunctive phrases, negative parallelisms ("not just X but Y"), superficial -ing analyses, and the AI vocabulary words that make readers tune out. The result is text that reads like a human wrote it from scratch.',
    useCases: [
      '"Clean up this blog post draft — make it sound like me, not a chatbot"',
      '"Review this email for AI-isms before I send it"',
      '"Rewrite this paragraph to sound more natural"',
      '"Check my LinkedIn post for obvious AI patterns"',
      '"Edit this proposal to remove robotic language"',
    ],
    installSteps: [
      'Available by default — no setup required',
      'Just ask your assistant to "humanize" any text',
      'Works best when you provide your own writing samples for voice matching',
    ],
    envVars: [],
    relatedSlugs: ['x-post', 'nano-banana-pro'],
    updatedAt: '2026-03-11',
  },
  {
    slug: 'nano-banana-pro',
    name: 'AI Image Generation (Gemini)',
    category: 'Content & Media',
    oneLiner: 'Generate and edit images using Google Gemini\'s image model.',
    icon: 'ImagePlus',
    tier: 'advanced',
    source: 'bundled',
    whoItsFor: 'Content creators and marketers who need quick visuals for posts and projects.',
    whatItHelps: 'Create images from text descriptions, edit existing images, and iterate on visual ideas without leaving your conversation.',
    setupLevel: 'moderate',
    description:
      'This skill connects to Google\'s Gemini image generation model to create and edit images from text prompts. Generate blog headers, social media visuals, concept art, and mockups directly from your conversation. You can iterate with follow-up prompts to refine the output.',
    useCases: [
      '"Generate a hero image for my blog post about AI agents"',
      '"Create a minimalist logo concept for my side project"',
      '"Make a social media graphic with the text \'Launch Day\'"',
      '"Edit this image to change the background color"',
      '"Generate 3 variations of a product mockup"',
    ],
    installSteps: [
      'Obtain a Google AI API key from Google AI Studio',
      'Set the GOOGLE_AI_API_KEY environment variable',
      'The skill auto-activates once the key is configured',
      'Test with: "Generate an image of a sunset over mountains"',
    ],
    envVars: [
      { name: 'GOOGLE_AI_API_KEY', required: true, description: 'Google AI Studio API key for Gemini access' },
    ],
    relatedSlugs: ['openai-image-gen', 'x-post'],
    updatedAt: '2026-03-16',
  },
  {
    slug: 'openai-image-gen',
    name: 'AI Image Generation (OpenAI)',
    category: 'Content & Media',
    oneLiner: 'Generate images via OpenAI\'s DALL-E and GPT-Image models.',
    icon: 'Image',
    tier: 'advanced',
    source: 'bundled',
    whoItsFor: 'Creators who prefer OpenAI models or want an alternative image generation option.',
    whatItHelps: 'Create high-quality images from text prompts using OpenAI\'s image generation APIs, with batch generation and gallery output.',
    setupLevel: 'moderate',
    description:
      'Generate images using OpenAI\'s image models (DALL-E 3, GPT-Image). Supports batch generation with customizable prompts and outputs an HTML gallery for easy browsing. Useful for creating visual content, brainstorming designs, and generating illustrations.',
    useCases: [
      '"Generate a professional headshot-style avatar"',
      '"Create an illustration for my newsletter"',
      '"Batch generate 5 background images for my presentation"',
      '"Create a detailed technical diagram of a system architecture"',
    ],
    installSteps: [
      'Set your OpenAI API key in the environment',
      'The skill is available once the key is configured',
      'Test with: "Generate an image of a cozy home office"',
    ],
    envVars: [
      { name: 'OPENAI_API_KEY', required: true, description: 'OpenAI API key with image generation access' },
    ],
    relatedSlugs: ['nano-banana-pro', 'x-post'],
    updatedAt: '2026-03-14',
  },
  {
    slug: 'video-transcript-downloader',
    name: 'Video Transcript Downloader',
    category: 'Content & Media',
    oneLiner: 'Download videos, audio, subtitles, and clean transcripts from YouTube and more.',
    icon: 'FileVideo',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Researchers, content creators, and anyone who learns from video content.',
    whatItHelps: 'Get clean paragraph-style transcripts from any YouTube video, download audio for repurposing, and extract subtitles.',
    setupLevel: 'moderate',
    description:
      'This skill wraps yt-dlp and ffmpeg to download videos, extract audio, pull subtitles, and create clean paragraph-style transcripts from YouTube and hundreds of other sites. Transcripts are formatted for readability — no timestamps cluttering the text — making them perfect for summarization, research, or content repurposing.',
    useCases: [
      '"Get me the transcript of this YouTube video"',
      '"Download the audio from this podcast episode"',
      '"Summarize this 2-hour conference talk from the transcript"',
      '"Extract subtitles from this video for translation"',
      '"Download this tutorial video for offline viewing"',
    ],
    installSteps: [
      'Install yt-dlp: `brew install yt-dlp` (macOS) or `pip install yt-dlp`',
      'Install ffmpeg: `brew install ffmpeg` (macOS)',
      'Both are required — yt-dlp for downloading, ffmpeg for processing',
      'Test with: paste a YouTube URL and ask for the transcript',
    ],
    envVars: [],
    relatedSlugs: ['lastxdays', 'qmd'],
    updatedAt: '2026-03-12',
  },

  // ─── Research & Knowledge ─────────────────────────────────
  {
    slug: 'lastxdays',
    name: 'Last X Days Researcher',
    category: 'Research & Knowledge',
    oneLiner: 'Research what happened about any topic in the last N days.',
    icon: 'CalendarSearch',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Analysts, journalists, curious minds, and anyone tracking fast-moving topics.',
    whatItHelps: 'Summarize recent developments about a topic by searching the web, Reddit, and X with time-bounded queries.',
    setupLevel: 'easy',
    description:
      'Point this skill at any topic and a time range, and it compiles a research summary of what happened. It searches across the web, Reddit, and X/Twitter to find recent discussions, news, and developments. The output is a structured summary with sources — perfect for staying current on fast-moving fields.',
    useCases: [
      '"What happened with OpenAI in the last 7 days?"',
      '"Summarize the AI agent discourse from this past week"',
      '"What did people say about the new Apple product announcement?"',
      '"Research the last 30 days of discussion about local-first software"',
      '"What\'s new in the Rust ecosystem this month?"',
    ],
    installSteps: [
      'Available by default — uses web search and optional API integrations',
      'For richer results, configure Reddit API credentials (optional)',
      'X/Twitter integration available with x-cli setup (optional)',
      'Works well with just web search — no mandatory API keys',
    ],
    envVars: [],
    relatedSlugs: ['qmd', 'video-transcript-downloader'],
    updatedAt: '2026-03-18',
  },
  {
    slug: 'qmd',
    name: 'Local Note Search (qmd)',
    category: 'Research & Knowledge',
    oneLiner: 'Hybrid search across your markdown notes and documentation.',
    icon: 'Search',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Anyone with a large collection of markdown notes, docs, or a knowledge base.',
    whatItHelps: 'Find relevant content across indexed markdown collections using semantic and keyword search combined.',
    setupLevel: 'moderate',
    description:
      'qmd provides local hybrid search (combining keyword and semantic matching) for your markdown notes and documentation. Index your Obsidian vault, docs folder, or any collection of markdown files, then search naturally. It finds relevant content even when you don\'t remember the exact words — the semantic component understands meaning, not just keywords.',
    useCases: [
      '"Search my notes for anything related to API design patterns"',
      '"Find my notes about the conversation with the investor"',
      '"What did I write about deployment strategies?"',
      '"Search the docs for authentication flow"',
      '"Find related notes to my current project"',
    ],
    installSteps: [
      'Index your markdown collection: configure the target directory in qmd settings',
      'Run the initial indexing pass (happens automatically on first query)',
      'The index updates incrementally as files change',
      'Test with: ask a question about content you know exists in your notes',
    ],
    envVars: [],
    relatedSlugs: ['obsidian', 'personal-ontology', 'lastxdays'],
    updatedAt: '2026-03-15',
  },
  {
    slug: 'personal-ontology',
    name: 'Personal Ontology',
    category: 'Research & Knowledge',
    oneLiner: 'Build a personal knowledge graph of your beliefs, goals, and predictions.',
    icon: 'Network',
    tier: 'advanced',
    source: 'custom',
    whoItsFor: 'Deep thinkers, strategists, and anyone who wants a structured map of their worldview.',
    whatItHelps: 'Capture and connect your identity, beliefs, predictions, and goals in a graph structure that enables AI-driven decision support.',
    setupLevel: 'moderate',
    description:
      'Personal Ontology is a Palantir-style knowledge graph for your life. It models Objects (identity fragments, beliefs, predictions, goals) and Links (relationships between them). Over time, it builds a structured representation of your worldview that your AI can reference for better advice, decision-making, and alignment checking.',
    useCases: [
      '"Record my belief that AI will replace 30% of knowledge work by 2028"',
      '"What are my current goals and how do they connect?"',
      '"Add a prediction about the housing market"',
      '"Show me beliefs that contradict each other"',
      '"How do my stated goals align with my time allocation?"',
    ],
    installSteps: [
      'Initialize your ontology with a starter session',
      'The skill creates a structured file in your workspace',
      'Build your graph incrementally through conversations',
      'Review and refine periodically — the AI will prompt you',
    ],
    envVars: [],
    relatedSlugs: ['obsidian', 'qmd'],
    updatedAt: '2026-03-13',
  },

  // ─── AI & Development ─────────────────────────────────────
  {
    slug: 'context-engineering',
    name: 'Context Engineering',
    category: 'AI & Development',
    oneLiner: 'Optimize AI agent context, multi-agent patterns, and memory systems.',
    icon: 'Brain',
    tier: 'advanced',
    source: 'custom',
    whoItsFor: 'Developers and AI builders who want their agents to work better.',
    whatItHelps: 'Reduce token costs, fix context degradation, design multi-agent systems, implement memory, and evaluate agent performance.',
    setupLevel: 'advanced',
    description:
      'A comprehensive skill for building production-quality AI agents. It covers context window optimization, multi-agent coordination patterns (supervisor, swarm), filesystem-based memory systems, tool design, and evaluation frameworks. If you\'re building anything beyond a basic chatbot, this skill provides the patterns and practices that separate working prototypes from reliable systems.',
    useCases: [
      '"Help me optimize context usage in my agent system"',
      '"Design a multi-agent architecture for my application"',
      '"Implement a memory system that persists across sessions"',
      '"Debug why my agent loses track of context in long conversations"',
      '"Build an evaluation framework for my AI assistant"',
    ],
    installSteps: [
      'Available as a guidance skill — no external setup needed',
      'Best used when building or debugging AI agent systems',
      'Works with any LLM provider and agent framework',
      'Activate by asking about context optimization, multi-agent design, or memory systems',
    ],
    envVars: [],
    relatedSlugs: ['workflow-execution', 'github'],
    updatedAt: '2026-03-17',
  },
  {
    slug: 'workflow-execution',
    name: 'Workflow Execution',
    category: 'AI & Development',
    oneLiner: 'Execute complex tasks with a plan-first workflow and verification.',
    icon: 'GitBranch',
    tier: 'included',
    source: 'custom',
    whoItsFor: 'Anyone doing multi-step engineering or project work with AI assistance.',
    whatItHelps: 'Structure complex tasks into plans, execute with sub-agent routing, verify results, and learn from outcomes.',
    setupLevel: 'easy',
    description:
      'When a task involves 3+ steps, architecture decisions, risky edits, or iterative debugging, this skill enforces a plan-first workflow. It breaks work into phases, routes execution to appropriate sub-agents, requires verification evidence, and maintains a lessons loop. The result: complex work gets done reliably instead of through ad-hoc prompting.',
    useCases: [
      '"Refactor the authentication module across 8 files"',
      '"Set up a CI/CD pipeline for this project"',
      '"Debug this intermittent test failure"',
      '"Migrate the database schema with zero downtime"',
      '"Implement this feature end-to-end with tests"',
    ],
    installSteps: [
      'Available by default — activates automatically for complex tasks',
      'Works best when you describe the full scope of what you want to achieve',
      'The skill will propose a plan before executing — review and approve it',
    ],
    envVars: [],
    relatedSlugs: ['github', 'context-engineering'],
    updatedAt: '2026-03-16',
  },
  {
    slug: 'github',
    name: 'GitHub',
    category: 'AI & Development',
    oneLiner: 'Manage issues, PRs, CI runs, and code reviews via the GitHub CLI.',
    icon: 'Github',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Developers who want to manage GitHub without leaving their conversation.',
    whatItHelps: 'Check PR status, create issues, review CI logs, comment on code reviews, and query the GitHub API — all through natural language.',
    setupLevel: 'moderate',
    description:
      'This skill wraps the GitHub CLI (gh) to give your AI assistant full access to your GitHub workflow. Check the status of pull requests, view CI run logs, create and manage issues, review code changes, and interact with the GitHub API. It eliminates the constant context-switching between your editor, terminal, and the GitHub web UI.',
    useCases: [
      '"What\'s the status of my open PRs?"',
      '"Create an issue for the login bug we just discussed"',
      '"Show me the CI logs for the failing build"',
      '"List all issues labeled \'bug\' in this repo"',
      '"Comment on PR #42 with my review feedback"',
    ],
    installSteps: [
      'Install the GitHub CLI: `brew install gh` (macOS)',
      'Authenticate: `gh auth login`',
      'Verify: `gh repo list` should show your repositories',
      'The skill activates automatically once gh is authenticated',
    ],
    envVars: [],
    relatedSlugs: ['workflow-execution', 'context-engineering'],
    updatedAt: '2026-03-14',
  },

  // ─── Communication ────────────────────────────────────────
  {
    slug: 'discord',
    name: 'Discord',
    category: 'Communication',
    oneLiner: 'Send and manage messages across your Discord servers.',
    icon: 'MessageCircle',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Community managers, team leads, and anyone active on Discord.',
    whatItHelps: 'Send messages, monitor channels, and participate in Discord conversations through your AI assistant.',
    setupLevel: 'moderate',
    description:
      'Connect your AI assistant to Discord to send messages, monitor channels, and participate in server conversations. Useful for community management, team communication, and staying engaged in Discord communities without constantly checking the app.',
    useCases: [
      '"Send a message to the #announcements channel"',
      '"What\'s the latest conversation in #general?"',
      '"Post the weekly update to our team Discord"',
      '"Reply to the question in #support"',
    ],
    installSteps: [
      'Configure your Discord bot token or webhook URL in OpenClaw settings',
      'Set up channel mappings for the servers you want to access',
      'Grant the bot appropriate permissions in your Discord server',
      'Test with: "Send a test message to #general"',
    ],
    envVars: [
      { name: 'DISCORD_BOT_TOKEN', required: true, description: 'Discord bot token for authentication' },
    ],
    relatedSlugs: ['imsg', 'gog'],
    updatedAt: '2026-03-10',
  },
  {
    slug: 'imsg',
    name: 'iMessage',
    category: 'Communication',
    oneLiner: 'Send and read iMessages and SMS from your AI assistant.',
    icon: 'Smartphone',
    tier: 'included',
    source: 'bundled',
    whoItsFor: 'Mac users who want to manage text messages without picking up their phone.',
    whatItHelps: 'List recent chats, read message history, and send iMessages or SMS through the Messages app.',
    setupLevel: 'easy',
    description:
      'This skill gives your AI assistant access to Apple Messages on macOS. List your recent chats, read message history with specific contacts, and send new messages — all through conversation. Great for quick replies, checking on conversations, and managing messages hands-free.',
    useCases: [
      '"Send a message to Mom: Running 15 minutes late"',
      '"What did Sarah text me today?"',
      '"Show my recent message conversations"',
      '"Reply to the last message from David"',
    ],
    installSteps: [
      'Ensure you\'re on macOS with Messages configured and iCloud Messages enabled',
      'Grant OpenClaw Full Disk Access in System Settings → Privacy & Security',
      'The iMessage CLI ships with OpenClaw — no separate install needed',
      'Test with: "Show my recent messages"',
    ],
    envVars: [],
    relatedSlugs: ['discord', 'apple-reminders'],
    updatedAt: '2026-03-10',
  },

  // ─── Smart Home ───────────────────────────────────────────
  {
    slug: 'openhue',
    name: 'Philips Hue (OpenHue)',
    category: 'Smart Home',
    oneLiner: 'Control Philips Hue lights and scenes with natural language.',
    icon: 'Lightbulb',
    tier: 'advanced',
    source: 'bundled',
    whoItsFor: 'Smart home enthusiasts with Philips Hue lighting.',
    whatItHelps: 'Turn lights on/off, adjust brightness and color, activate scenes, and create lighting automations.',
    setupLevel: 'moderate',
    description:
      'Control your entire Philips Hue lighting setup through conversation. Turn rooms on and off, set specific colors and brightness levels, activate pre-configured scenes, and even create time-based lighting routines. Works with the Hue Bridge on your local network via the OpenHue CLI.',
    useCases: [
      '"Turn on the living room lights to warm white at 50%"',
      '"Set the office to focus mode"',
      '"Dim the bedroom lights to 20%"',
      '"Turn off all lights"',
      '"Set the kitchen to bright daylight"',
    ],
    installSteps: [
      'Ensure your Philips Hue Bridge is on the same network',
      'Install OpenHue CLI and pair with your bridge',
      'The bridge pairing requires pressing the physical button on the bridge',
      'Test with: "List all Hue rooms"',
    ],
    envVars: [
      { name: 'HUE_BRIDGE_IP', required: true, description: 'IP address of your Philips Hue Bridge' },
      { name: 'HUE_API_KEY', required: true, description: 'Hue Bridge API key from pairing' },
    ],
    relatedSlugs: ['weather', 'apple-reminders'],
    updatedAt: '2026-03-08',
  },
]

// ─── Helper functions ───────────────────────────────────────

/** Get all skills visible to members (excludes internal tier) */
export function getMemberSkills(): SkillEntry[] {
  return skills.filter((s) => s.tier !== 'internal')
}

/** Get a single skill by slug */
export function getSkillBySlug(slug: string): SkillEntry | undefined {
  return skills.find((s) => s.slug === slug)
}

/** Get all unique categories from member-visible skills */
export function getCategories(): SkillCategory[] {
  const cats = new Set(getMemberSkills().map((s) => s.category))
  return SKILL_CATEGORIES.filter((c) => cats.has(c))
}

/** Get related skills for a given skill */
export function getRelatedSkills(skill: SkillEntry): SkillEntry[] {
  return skill.relatedSlugs
    .map((slug) => getSkillBySlug(slug))
    .filter((s): s is SkillEntry => s !== undefined && s.tier !== 'internal')
}
