import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "pm-owner-report-commentary",
  "title": "Draft monthly owner reports with commentary",
  "industry": "property",
  "summary": "AI writes the “what happened this month” note that goes with the owner statement.",
  "problem": "Owners want to know why the numbers changed. Writing a note per owner, per month, takes hours.",
  "aiDoes": "AI reads the month’s statements, work orders, and leasing activity, and drafts a short note per property. Staff edit before sending.",
  "steps": [
    "Standardize the note: occupancy, notable repairs, upcoming items.",
    "Use your platform’s AI assistant to pull the data, or Claude/Copilot with exported reports.",
    "Review each note for accuracy and tone.",
    "Send with the statement."
  ],
  "tools": [
    "appfolio-realmx",
    "claude-team",
    "m365-copilot"
  ],
  "difficulty": "Easy",
  "setupEstimate": "An afternoon to build the template (estimate)",
  "watchOuts": [
    "Verify every dollar figure against the statement.",
    "Don’t include tenant personal details in owner notes.",
    "Owners may forward these. Write them that way."
  ]
}

export default useCase
