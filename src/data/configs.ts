import type { SkillEntry } from './skills'
import { getSkillBySlug } from './skills'

// ─── Types ──────────────────────────────────────────────────

export type ConfigSlug =
  | 'productivity-assistant'
  | 'content-creator'
  | 'researcher'
  | 'builder'

export type ConfigEntry = {
  slug: ConfigSlug
  name: string
  tagline: string
  icon: string // Lucide icon name
  targetUser: string
  description: string
  skillSlugs: string[]
  outcomes: string[]
  sampleConfig: string // JSON string of openclaw.json snippet
  quickstart: string[] // numbered steps
  troubleshooting: { question: string; answer: string }[]
  updatedAt: string
}

// ─── Config Data ────────────────────────────────────────────

export const configs: ConfigEntry[] = [
  {
    slug: 'productivity-assistant',
    name: 'Productivity Assistant',
    tagline: 'Your daily command center for email, calendar, tasks, and notes.',
    icon: 'Zap',
    targetUser: 'Office workers, managers, and anyone who lives in email and calendars.',
    description:
      'The Productivity Assistant connects your AI to the tools you already use every day. Check your inbox, schedule meetings, manage reminders, take notes, and check the weather — all through conversation. Instead of bouncing between Gmail, Calendar, Reminders, and Notes, you talk to one assistant that handles all of it. This is the config most people should start with.',
    skillSlugs: ['gog', 'apple-reminders', 'apple-notes', 'weather', 'obsidian'],
    outcomes: [
      'Check your inbox and draft replies without opening Gmail',
      'Create calendar events from natural language: "Schedule a call with Sarah tomorrow at 3pm"',
      'Add and complete reminders hands-free',
      'Capture meeting notes that sync to all your Apple devices',
      'Get weather factored into your daily planning',
    ],
    sampleConfig: JSON.stringify(
      {
        agents: [
          {
            id: 'default',
            name: 'Assistant',
            model: 'anthropic/claude-sonnet-4-20250514',
            skills: [
              { name: 'gog', source: 'bundled' },
              { name: 'apple-reminders', source: 'bundled' },
              { name: 'apple-notes', source: 'bundled' },
              { name: 'weather', source: 'bundled' },
              { name: 'obsidian', source: 'bundled' },
            ],
          },
        ],
        env: {
          vars: {
            GOG_CLIENT_ID: 'your-google-oauth-client-id',
            GOG_CLIENT_SECRET: 'your-google-oauth-client-secret',
            OBSIDIAN_VAULT_PATH: '/path/to/your/vault',
          },
        },
      },
      null,
      2,
    ),
    quickstart: [
      'Install OpenClaw if you haven\'t already: follow the Getting Started guide at docs.openclaw.ai',
      'Copy the sample config below into your ~/.openclaw/openclaw.json file',
      'Set up Google Workspace access: run `gog auth login` and complete the OAuth flow',
      'Set your Obsidian vault path in the config (or remove the obsidian skill if you don\'t use Obsidian)',
      'Restart OpenClaw: `openclaw gateway restart`',
      'Test it: ask your assistant "What emails do I have today?" or "Add a reminder to call Mom at 5pm"',
    ],
    troubleshooting: [
      {
        question: 'Google auth fails with "invalid_grant"',
        answer:
          'Your OAuth token expired. Run `gog auth login` again to re-authenticate. This happens after extended periods of inactivity or if you revoked access in your Google account settings.',
      },
      {
        question: 'Apple Reminders permission denied',
        answer:
          'Go to System Settings → Privacy & Security → Reminders and make sure OpenClaw (or Terminal) has access. You may need to restart the gateway after granting permission.',
      },
      {
        question: 'Obsidian vault not found',
        answer:
          'Double-check the OBSIDIAN_VAULT_PATH in your config. It should be an absolute path to your vault folder (e.g., /Users/you/Documents/MyVault). The folder must exist and contain .md files.',
      },
      {
        question: 'Weather returns wrong location',
        answer:
          'The weather skill guesses your location from your IP. For better results, specify your city explicitly: "What\'s the weather in Philadelphia?" You can also set a default location in your agent\'s SOUL.md or USER.md.',
      },
    ],
    updatedAt: '2026-03-21',
  },

  {
    slug: 'content-creator',
    name: 'Content Creator',
    tagline: 'Draft posts, generate images, and repurpose video content with AI.',
    icon: 'Palette',
    targetUser: 'Writers, marketers, creators, and anyone who publishes content regularly.',
    description:
      'The Content Creator config turns your AI into a creative collaborator. Draft X/Twitter posts with audience-aware tone, clean up AI-generated text so it sounds human, generate images for social posts and blog headers, and pull transcripts from YouTube videos for repurposing. The workflow: ideate → draft → polish → publish.',
    skillSlugs: ['x-post', 'humanizer', 'video-transcript-downloader', 'nano-banana-pro', 'openai-image-gen'],
    outcomes: [
      'Turn rough ideas into polished X/Twitter posts and threads',
      'Clean up AI-generated drafts so they sound like you, not a chatbot',
      'Generate custom images for social media, blog headers, and presentations',
      'Pull clean transcripts from any YouTube video for summarization or repurposing',
      'Batch-generate visual content for a week of posts in one session',
    ],
    sampleConfig: JSON.stringify(
      {
        agents: [
          {
            id: 'default',
            name: 'Creator',
            model: 'anthropic/claude-sonnet-4-20250514',
            skills: [
              { name: 'x-post', source: 'custom' },
              { name: 'humanizer', source: 'custom' },
              { name: 'video-transcript-downloader', source: 'custom' },
              { name: 'nano-banana-pro', source: 'bundled' },
              { name: 'openai-image-gen', source: 'bundled' },
            ],
          },
        ],
        env: {
          vars: {
            GOOGLE_AI_API_KEY: 'your-google-ai-api-key',
            OPENAI_API_KEY: 'your-openai-api-key',
          },
        },
      },
      null,
      2,
    ),
    quickstart: [
      'Install OpenClaw and complete initial setup',
      'Copy the sample config below into ~/.openclaw/openclaw.json',
      'Get a Google AI API key from ai.google.dev for image generation (Gemini)',
      'Get an OpenAI API key from platform.openai.com for DALL-E image generation',
      'Install yt-dlp and ffmpeg for video transcripts: `brew install yt-dlp ffmpeg`',
      'Restart OpenClaw: `openclaw gateway restart`',
      'Test it: ask "Draft a tweet about why AI tools are changing content creation"',
    ],
    troubleshooting: [
      {
        question: 'Image generation returns an error',
        answer:
          'Check that your API key is valid and has image generation permissions. For Google AI, ensure you\'re using a key from ai.google.dev (not Google Cloud). For OpenAI, verify your account has DALL-E access.',
      },
      {
        question: 'Video transcript download fails',
        answer:
          'Make sure yt-dlp and ffmpeg are installed: `which yt-dlp ffmpeg`. If installed but failing, update yt-dlp: `yt-dlp -U`. YouTube frequently changes their API, and yt-dlp needs regular updates.',
      },
      {
        question: 'Humanizer changes too much of my text',
        answer:
          'The humanizer is aggressive by default. Provide your own writing samples so the AI can match your voice: add examples to your agent\'s SOUL.md file under a "My writing style" section.',
      },
      {
        question: 'X post drafts don\'t match my voice',
        answer:
          'Add a few of your best posts to SOUL.md as style references. The more examples you provide, the better the AI matches your tone and phrasing patterns.',
      },
    ],
    updatedAt: '2026-03-21',
  },

  {
    slug: 'researcher',
    name: 'Researcher',
    tagline: 'Track topics, search your notes, and synthesize information from any source.',
    icon: 'Microscope',
    targetUser: 'Analysts, journalists, students, and anyone who needs to stay on top of fast-moving topics.',
    description:
      'The Researcher config makes your AI a tireless research assistant. Track what happened about any topic in the last N days, search across your notes and documents with semantic understanding, fetch and extract content from any URL, and pull transcripts from video sources. Great for weekly briefings, competitive analysis, and deep dives into any subject.',
    skillSlugs: ['lastxdays', 'qmd', 'video-transcript-downloader'],
    outcomes: [
      'Get a summary of what happened about any topic in the last week, month, or custom range',
      'Search your notes semantically — find content by meaning, not just keywords',
      'Extract readable content from any webpage for analysis',
      'Pull transcripts from conference talks, interviews, and lectures',
      'Build research briefs that combine web sources, your notes, and video content',
    ],
    sampleConfig: JSON.stringify(
      {
        agents: [
          {
            id: 'default',
            name: 'Researcher',
            model: 'anthropic/claude-sonnet-4-20250514',
            skills: [
              { name: 'lastxdays', source: 'custom' },
              { name: 'qmd', source: 'custom' },
              { name: 'video-transcript-downloader', source: 'custom' },
            ],
          },
        ],
      },
      null,
      2,
    ),
    quickstart: [
      'Install OpenClaw and complete initial setup',
      'Copy the sample config below into ~/.openclaw/openclaw.json',
      'Install yt-dlp and ffmpeg for video transcripts: `brew install yt-dlp ffmpeg`',
      'Point qmd to your notes directory by configuring the collection path',
      'Restart OpenClaw: `openclaw gateway restart`',
      'Test it: ask "What happened with AI agents in the last 7 days?"',
    ],
    troubleshooting: [
      {
        question: 'Last X Days returns thin results',
        answer:
          'The quality depends on web search results. Try being more specific with your topic, or expand the time range. Adding Reddit API credentials improves coverage significantly.',
      },
      {
        question: 'qmd search returns no results',
        answer:
          'The index needs to be built first. Make sure you\'ve configured the correct path to your notes directory. Run a test query to trigger initial indexing — the first search may take a minute.',
      },
      {
        question: 'Web fetch returns garbled content',
        answer:
          'Some sites block automated access or use heavy JavaScript rendering. Try the "text" extract mode instead of "markdown". For JS-heavy sites, the content may be limited to what\'s in the initial HTML.',
      },
    ],
    updatedAt: '2026-03-21',
  },

  {
    slug: 'builder',
    name: 'Builder',
    tagline: 'Ship code faster with structured workflows, GitHub integration, and AI-guided development.',
    icon: 'Wrench',
    targetUser: 'Developers, PMs, founders, and anyone building software with AI assistance.',
    description:
      'The Builder config is for people who ship. It combines structured workflow execution (plan → execute → verify) with deep GitHub integration for PRs, issues, and CI. The context engineering skill helps you design better AI systems, and gh-issues automates the create-branch-fix-PR cycle. Whether you\'re fixing bugs, building features, or architecting systems, this config keeps you moving.',
    skillSlugs: ['workflow-execution', 'github', 'context-engineering'],
    outcomes: [
      'Break complex tasks into executable plans with verification at each step',
      'Manage GitHub issues, PRs, and CI runs without leaving your conversation',
      'Get AI-guided architectural advice grounded in context engineering best practices',
      'Automate the issue → branch → fix → PR → review cycle',
      'Debug failing builds by reading CI logs and suggesting fixes',
    ],
    sampleConfig: JSON.stringify(
      {
        agents: [
          {
            id: 'default',
            name: 'Builder',
            model: 'anthropic/claude-sonnet-4-20250514',
            skills: [
              { name: 'workflow-execution', source: 'custom' },
              { name: 'github', source: 'bundled' },
              { name: 'context-engineering', source: 'custom' },
            ],
          },
        ],
      },
      null,
      2,
    ),
    quickstart: [
      'Install OpenClaw and complete initial setup',
      'Copy the sample config below into ~/.openclaw/openclaw.json',
      'Install and authenticate the GitHub CLI: `brew install gh && gh auth login`',
      'Verify GitHub access: `gh repo list` should show your repositories',
      'Restart OpenClaw: `openclaw gateway restart`',
      'Test it: ask "What are my open PRs?" or "Create an issue for the login bug"',
    ],
    troubleshooting: [
      {
        question: 'GitHub CLI not authenticated',
        answer:
          'Run `gh auth login` and follow the prompts. Choose "GitHub.com" and authenticate via browser. After login, `gh auth status` should show you\'re logged in.',
      },
      {
        question: 'Workflow execution creates too many steps',
        answer:
          'Be specific about scope. Instead of "refactor the entire codebase," say "refactor the auth module to use JWT." Smaller scope = better plans.',
      },
      {
        question: 'gh-issues can\'t find my repo',
        answer:
          'Make sure you\'re in a directory with a .git folder, or specify the repo explicitly: "Check PRs in owner/repo." The GitHub CLI needs to know which repo to target.',
      },
      {
        question: 'Context engineering skill doesn\'t seem to activate',
        answer:
          'This skill activates on specific triggers like "optimize context," "design multi-agent system," or "implement memory." Ask directly about context engineering topics to invoke it.',
      },
    ],
    updatedAt: '2026-03-21',
  },
]

// ─── Helper Functions ───────────────────────────────────────

/** Get all starter configs */
export function getConfigs(): ConfigEntry[] {
  return configs
}

/** Get a single config by slug */
export function getConfigBySlug(slug: string): ConfigEntry | undefined {
  return configs.find((c) => c.slug === slug)
}

/** Get the resolved skill entries for a config */
export function getConfigSkills(config: ConfigEntry): SkillEntry[] {
  return config.skillSlugs
    .map((slug) => getSkillBySlug(slug))
    .filter((s): s is SkillEntry => s !== undefined)
}

/** Get all config slugs (for generateStaticParams) */
export function getConfigSlugs(): ConfigSlug[] {
  return configs.map((c) => c.slug)
}
