import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "ria-tax-return-summary",
  "title": "Summarize tax returns for planning conversations",
  "industry": "wealth",
  "summary": "Extract the planning-relevant parts of a client’s return into a readable summary.",
  "problem": "Reading a full return to spot planning opportunities takes time, so it often doesn’t happen for every client.",
  "aiDoes": "A tax-planning tool reads the uploaded return and produces a summary and a list of observations (bracket, deductions, opportunities to discuss) for the advisor to review.",
  "steps": [
    "Collect returns through a secure portal with client permission.",
    "Upload to a purpose-built tool such as Holistiplan.",
    "Review the observations and pick what to discuss.",
    "Coordinate with the client’s CPA on anything tax-specific."
  ],
  "tools": [
    "holistiplan"
  ],
  "difficulty": "Easy",
  "setupEstimate": "Under an hour to start (estimate)",
  "watchOuts": [
    "Returns are among the most sensitive documents clients have. Confirm vendor security and retention.",
    "Observations are prompts for a conversation, not tax advice.",
    "Check figures against the return before citing them to a client."
  ]
}

export default useCase
