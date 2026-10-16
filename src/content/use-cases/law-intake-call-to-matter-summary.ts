import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "law-intake-call-to-matter-summary",
  "title": "Turn intake calls into a clean matter summary",
  "industry": "law",
  "featured": true,
  "summary": "The intake call becomes a structured summary in your practice-management system instead of someone’s notepad.",
  "problem": "Someone takes notes on a new-client call, then retypes them into the practice-management system, an engagement letter, and an email to the attorney. The same facts get typed three times, and details get lost.",
  "aiDoes": "A meeting assistant or your AI workspace turns the call (or the intake form) into a structured summary: parties, key dates, the ask, potential conflicts to check, and open questions. Someone reviews it and saves it to the matter.",
  "steps": [
    "Decide which intake calls get recorded or transcribed, and add a consent line to your call script.",
    "Create a short intake summary template with the fields your firm actually uses.",
    "Set up the AI workspace (or Clio’s built-in AI) to fill that template from the transcript or intake form.",
    "Have a person review each summary and run the conflict check as usual before anything goes to the attorney."
  ],
  "tools": [
    "clio-manage",
    "m365-copilot",
    "claude-team"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About half a day to set up and test (estimate)",
  "watchOuts": [
    "Pennsylvania generally requires consent from everyone on a call before it’s recorded. Get it, and say so at the start of the call.",
    "Intake calls are confidential even before you’re retained. Use a business-tier plan that doesn’t train on your data, not personal accounts.",
    "AI doesn’t replace your conflict check. It can list names to check; a person runs the check."
  ],
  "typicalEffect": "Typically removes the retyping step after each intake call (estimate, varies by firm)."
}

export default useCase
