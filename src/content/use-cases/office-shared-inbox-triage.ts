import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "office-shared-inbox-triage",
  "title": "Sort a shared inbox and draft the routine replies",
  "industry": "office",
  "summary": "AI labels incoming email and drafts answers to the routine ones for a person to send.",
  "problem": "The info@ or front-desk inbox mixes urgent requests, routine questions, and spam. Someone sorts it by hand all day.",
  "aiDoes": "AI in Outlook or Gmail summarizes threads and drafts replies, and an automation can label and route messages by type.",
  "steps": [
    "List the five most common email types and how each should be handled.",
    "Turn on Copilot in Outlook or Gemini in Gmail for the inbox owner.",
    "Optionally add a Zapier or Make step to label and route messages.",
    "A person sends every reply."
  ],
  "tools": [
    "m365-copilot",
    "gemini-workspace",
    "zapier"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About half a day (estimate)",
  "watchOuts": [
    "Don’t auto-send. Draft only.",
    "Watch for phishing; AI summaries can make a malicious email look routine.",
    "Confirm the AI has access only to the inboxes it needs."
  ]
}

export default useCase
