import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "office-write-ai-use-policy",
  "title": "Write a one-page AI use policy for your team",
  "industry": "office",
  "summary": "Clear rules on which tools are approved and what never goes into them.",
  "problem": "People are already using AI on personal accounts, and nobody has said what’s allowed.",
  "aiDoes": "AI helps draft a short policy from your answers to a few questions: approved tools, what data is off limits, when output must be checked, and who to ask.",
  "steps": [
    "Answer five questions: which tools, which data, which uses, who reviews, who owns the policy.",
    "Have AI draft a one-page policy from your answers.",
    "Have your counsel or compliance lead review it.",
    "Walk the team through it and revisit it every quarter."
  ],
  "tools": [
    "claude-team",
    "chatgpt-business"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About two hours plus review (estimate)",
  "watchOuts": [
    "A template isn’t legal advice. Have it reviewed for your industry’s rules.",
    "A policy nobody reads doesn’t help. Keep it to one page.",
    "Update it when you add tools."
  ]
}

export default useCase
