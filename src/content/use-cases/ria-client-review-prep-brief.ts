import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "ria-client-review-prep-brief",
  "title": "A one-page brief before every client review",
  "industry": "wealth",
  "summary": "Pull CRM notes, recent emails, and open items into one page before the meeting.",
  "problem": "Preparing for a review means opening the CRM, past notes, email, and the plan, then remembering what you promised last time.",
  "aiDoes": "The assistant gathers past notes, open tasks, life events, and recent correspondence into a short pre-meeting brief with suggested talking points.",
  "steps": [
    "Decide what belongs on the brief: open items, life events, last commitments, questions.",
    "Use your meeting assistant’s prep feature, or Copilot with access to email and CRM exports.",
    "Generate briefs the day before review meetings.",
    "Correct anything stale and keep the brief with the meeting record if your policy requires."
  ],
  "tools": [
    "zocks",
    "jump",
    "m365-copilot"
  ],
  "difficulty": "Easy",
  "setupEstimate": "A few hours once notes are in the CRM (estimate)",
  "watchOuts": [
    "A brief is only as good as the notes behind it.",
    "Don’t let AI-suggested talking points become recommendations without your judgment.",
    "Make sure access permissions match who should see each client."
  ]
}

export default useCase
