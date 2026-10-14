import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "cpa-plain-english-financial-summary",
  "title": "Turn financials into a plain-English summary",
  "industry": "accounting",
  "summary": "A first draft of the “what these numbers mean” note for advisory clients.",
  "problem": "Clients don’t read financial statements. Writing a clear one-page explanation every month or quarter takes partner time.",
  "aiDoes": "AI reads the statements (in Excel or exported reports) and drafts a short, plain-English summary of what changed and why it might matter. The accountant corrects it and adds judgment.",
  "steps": [
    "Pick a standard format: three changes worth noting, one question to discuss.",
    "Use Copilot in Excel or a Claude project with the exported statements.",
    "Check every number in the draft against the source.",
    "Send under the accountant’s name after review."
  ],
  "tools": [
    "m365-copilot",
    "claude-team"
  ],
  "difficulty": "Easy",
  "setupEstimate": "A couple of hours to build the template (estimate)",
  "watchOuts": [
    "AI can misread signs, periods, or totals. Verify every figure.",
    "Confidential financials belong in business-tier tools only.",
    "The summary informs; the advice still comes from you."
  ]
}

export default useCase
