import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "ria-meeting-notes-to-crm",
  "title": "Meeting notes and CRM updates after every client meeting",
  "industry": "wealth",
  "featured": true,
  "summary": "An advisor-specific assistant writes the notes, action items, and follow-up email.",
  "problem": "After each meeting, advisors spend time writing notes, updating the CRM, and drafting a follow-up. It piles up on busy days.",
  "aiDoes": "An advisor-focused meeting assistant captures the conversation, writes structured notes, pushes them and the action items into your CRM, and drafts the follow-up email for review.",
  "steps": [
    "Have your CCO review the tool’s recording, retention, and supervision model first.",
    "Pick an advisor-specific tool such as Jump or Zocks and connect your CRM (e.g., Wealthbox).",
    "Add client consent to your meeting process.",
    "Review every note and email before it’s saved or sent."
  ],
  "tools": [
    "jump",
    "zocks",
    "wealthbox"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "About a week including compliance review (estimate)",
  "watchOuts": [
    "Pennsylvania generally requires consent from everyone on a call before it’s recorded. Get it, and say so at the start of the call.",
    "Recordings and notes may be books-and-records under SEC/FINRA rules. Know what the tool keeps and for how long.",
    "Notes can attribute statements to the wrong person. Review before saving."
  ]
}

export default useCase
