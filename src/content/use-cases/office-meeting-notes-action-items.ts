import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "office-meeting-notes-action-items",
  "title": "Notes and action items from every internal meeting",
  "industry": "office",
  "featured": true,
  "summary": "Turn on the AI notes built into the meeting tool you already use.",
  "problem": "Somebody takes notes, nobody sends them, and the action items from the meeting quietly disappear.",
  "aiDoes": "The AI built into Teams, Google Meet, or Zoom (or a standalone assistant) writes a summary and action items and sends them to attendees.",
  "steps": [
    "Check which AI meeting features your current plan already includes.",
    "Turn them on for internal meetings first.",
    "Agree that the meeting owner reviews and sends the summary.",
    "Decide where summaries live and how long they’re kept."
  ],
  "tools": [
    "m365-copilot",
    "gemini-workspace",
    "zoom-companion",
    "fathom"
  ],
  "difficulty": "Easy",
  "setupEstimate": "Under an hour (estimate)",
  "watchOuts": [
    "Pennsylvania generally requires consent from everyone on a call before it’s recorded. Get it, and say so at the start of the call.",
    "Summaries can misattribute who said or agreed to what. Review before sending.",
    "Sensitive HR or client conversations may not belong in an AI summary."
  ]
}

export default useCase
