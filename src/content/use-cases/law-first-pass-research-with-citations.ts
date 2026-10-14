import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "law-first-pass-research-with-citations",
  "title": "First-pass legal research with real citations",
  "industry": "law",
  "summary": "Use legal research AI that cites actual authority, then verify every citation.",
  "problem": "Getting oriented on an unfamiliar issue eats hours, and general chatbots have produced fake cases that led to sanctions.",
  "aiDoes": "A legal research tool built on a real case-law database answers the question with citations you can click through, summarizes the authority, and suggests where to look next.",
  "steps": [
    "Choose one research tool built on a legal database (Clio Work, CoCounsel, or Lexis+ AI with Protégé) rather than a general chatbot.",
    "Run a trial on a few matters you already know the answer to.",
    "Set a firm rule: every cited authority is opened and read before it goes in a filing.",
    "Note AI use in your file where your court or local rules require disclosure."
  ],
  "tools": [
    "clio-work",
    "cocounsel",
    "lexis-protege"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A one- or two-week trial alongside normal research (estimate)",
  "watchOuts": [
    "Verify every citation and quote yourself. Courts have sanctioned lawyers for filing AI-invented cases.",
    "Some courts have standing orders on AI use in filings. Check before you file.",
    "These tools are priced per user and can be expensive for a small firm; trial before committing."
  ]
}

export default useCase
