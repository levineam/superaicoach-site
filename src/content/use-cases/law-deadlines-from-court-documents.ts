import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "law-deadlines-from-court-documents",
  "title": "Pull deadlines from court orders onto the calendar",
  "industry": "law",
  "featured": true,
  "summary": "AI reads scheduling orders and notices and proposes calendar events for a person to confirm.",
  "problem": "Scheduling orders, notices, and correspondence arrive with dates buried in the text. Someone reads each one and builds calendar entries by hand, and a missed date is a malpractice problem.",
  "aiDoes": "The practice-management system’s AI reads the document, extracts the dates and what they’re for, and proposes calendar events and tasks. A person confirms each one against the document side by side.",
  "steps": [
    "Turn on document-based scheduling in your practice-management system (Clio Manage’s AI can schedule events from documents).",
    "Agree on a rule: AI proposes, a named person confirms every date.",
    "Keep your existing rules-based docketing for court-rule deadlines; use AI to catch dates in the document itself.",
    "Spot-check a sample of entries each month."
  ],
  "tools": [
    "clio-manage"
  ],
  "difficulty": "Easy",
  "setupEstimate": "An hour or two if you’re already on Clio Manage (estimate)",
  "watchOuts": [
    "Never let AI be the only calendaring step. Confirm every extracted date against the source.",
    "AI reads what’s on the page. It won’t compute deadlines that come from court rules unless your docketing tool does that.",
    "Check your malpractice carrier’s guidance on calendaring procedures."
  ]
}

export default useCase
