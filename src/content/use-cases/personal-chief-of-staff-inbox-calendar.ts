import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-chief-of-staff-inbox-calendar',
  title: 'Turn AI into your personal chief of staff for inbox and calendar',
  industry: 'personal',
  featured: false,
  metaTitle: 'Personal Chief of Staff with AI: Inbox and Calendar Playbook',
  metaDescription: 'A step-by-step playbook for busy professionals: use ChatGPT, Claude, Gemini or Copilot to triage your own inbox, prep for meetings, and end the day with a short plan. Real tools, safety notes.',
  summary: 'A morning and evening routine where AI sorts your inbox into what needs you, preps you for each meeting, and drafts replies you approve before anything sends.',
  problem: 'Busy professionals often start the day inside email and react from there. The important messages, the meeting prep, and the small follow-ups are all mixed together, so the day runs you instead of the other way round.',
  aiDoes: 'Connected to your own mailbox and calendar (or fed a pasted schedule and message list), the assistant groups messages into “needs a decision”, “draft ready for you”, and “can wait”, builds a one-paragraph brief before each meeting from the thread and notes you give it, and drafts replies in your voice. You approve every send. It does not send, delete, or commit you to anything on its own.',
  steps: [
    'Pick one assistant you already have access to: Gemini in Google Workspace if you live in Gmail, Microsoft 365 Copilot if you live in Outlook, or ChatGPT or Claude on a paid plan if you prefer to paste material in yourself.',
    'Start disconnected if you are cautious: paste in today’s calendar and 10–20 message subjects/senders (not full sensitive threads) and ask for the three buckets above. Judge the sorting before connecting anything.',
    'Use this morning prompt: “Here is my calendar and inbox list. Group messages into needs-my-decision, draft-a-reply, and can-wait. Flag anything with a deadline today. Do not invent details you do not have.”',
    'Before each meeting, ask: “Give me a one-paragraph brief: who this is with, what we last discussed from the notes I pasted, and the one decision to aim for.” Paste only the material you are comfortable sharing.',
    'For replies, ask for a draft, edit it yourself, and send it yourself. Save the drafts you approve as examples so the next drafts sound more like you.',
    'End the day with: “From today’s list, what is still open, what can move to tomorrow, and what is the first thing in the morning?” Keep the answer to five lines.',
  ],
  tools: ['gemini-workspace', 'm365-copilot', 'chatgpt-business', 'claude-team'],
  difficulty: 'Easy',
  setupEstimate: 'About 30 minutes to try the pasted version; an hour to connect mailbox/calendar (estimate)',
  watchOuts: [
    'Use a paid or work-tier account where the provider says your data is not used to train models; do not do this on a free consumer account with sensitive mail.',
    'Never let an assistant auto-send, auto-delete, or auto-accept meetings while you are learning. Approve everything yourself.',
    'Do not paste passwords, financial account numbers, or other people’s private information. Summaries you write yourself are safer than raw forwards.',
    'Check names, dates, and numbers in every draft. AI can state a wrong meeting time confidently.',
  ],
}

export default useCase
