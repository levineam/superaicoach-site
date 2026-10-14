import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "agency-proposal-first-drafts",
  "title": "First-draft proposals from your past wins",
  "industry": "agencies",
  "summary": "Start proposals from your best previous ones instead of a blank page.",
  "problem": "Proposals get rebuilt from scratch, or copied from an old one with the wrong client name still in it.",
  "aiDoes": "An AI workspace holds your best past proposals, pricing, and case studies, and drafts a new proposal from the discovery notes in your structure.",
  "steps": [
    "Collect three to five strong proposals and strip confidential client details.",
    "Load them, your services list, and pricing rules into a workspace (Claude Team, ChatGPT Business, or Notion AI).",
    "Draft from discovery notes; a person sets scope and price.",
    "Proofread for names and numbers before sending."
  ],
  "tools": [
    "claude-team",
    "chatgpt-business",
    "notion-ai"
  ],
  "difficulty": "Easy",
  "setupEstimate": "An afternoon (estimate)",
  "watchOuts": [
    "Never let pricing come from the AI unchecked.",
    "Scrub past client details you don’t have permission to reuse.",
    "Proofread for leftover names from old proposals."
  ]
}

export default useCase
