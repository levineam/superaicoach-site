import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "cpa-tax-season-client-questions",
  "title": "Answer the same tax-season questions faster",
  "industry": "accounting",
  "summary": "Draft replies to common client questions from your own approved answers.",
  "problem": "From January to April, the inbox fills with the same questions: where’s my return, what do you need, when is my extension filed.",
  "aiDoes": "An AI project loaded with your firm’s approved answers drafts replies to routine questions. Staff review and send, and anything that needs judgment goes to a preparer.",
  "steps": [
    "Collect the 20 questions you answer most and write approved answers.",
    "Load them into a ChatGPT Business or Claude Team project as the reference.",
    "Draft replies there, or in your practice-management inbox, with a person sending every reply.",
    "Flag anything that sounds like tax advice for a preparer."
  ],
  "tools": [
    "chatgpt-business",
    "claude-team",
    "karbon"
  ],
  "difficulty": "Easy",
  "setupEstimate": "An afternoon, mostly writing the answers (estimate)",
  "watchOuts": [
    "Routine status replies only. Advice needs a credentialed person.",
    "Keep client tax details out of the AI unless the tool is approved for it.",
    "Update the answers when deadlines or rules change."
  ]
}

export default useCase
