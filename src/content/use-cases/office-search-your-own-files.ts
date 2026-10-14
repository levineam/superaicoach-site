import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "office-search-your-own-files",
  "title": "Ask questions of your own files in plain English",
  "industry": "office",
  "summary": "Find the policy, contract, or old proposal without remembering where it’s saved.",
  "problem": "Answers exist somewhere in SharePoint, Google Drive, or email, but finding them takes longer than asking a coworker.",
  "aiDoes": "AI connected to your files answers questions and links to the source documents, using the permissions each person already has.",
  "steps": [
    "Clean up sharing permissions first; AI can surface anything a user can technically open.",
    "Turn on Microsoft 365 Copilot, Gemini in Workspace, or ChatGPT Business connectors.",
    "Start with a pilot group and a few known questions.",
    "Teach people to click through to the source."
  ],
  "tools": [
    "m365-copilot",
    "gemini-workspace",
    "chatgpt-business"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A week including a permissions review (estimate)",
  "watchOuts": [
    "Over-shared folders become over-shared answers. Fix permissions before turning it on.",
    "AI answers can be outdated if old versions are lying around.",
    "Always check the linked source for anything important."
  ]
}

export default useCase
