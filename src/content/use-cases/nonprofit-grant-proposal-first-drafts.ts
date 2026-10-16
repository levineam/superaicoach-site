import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "nonprofit-grant-proposal-first-drafts",
  "title": "Draft grant proposals from your own past applications",
  "industry": "nonprofits",
  "featured": true,
  "metaTitle": "AI for Grant Writing: How Small Nonprofits Draft Proposals Faster",
  "metaDescription": "How small Philadelphia nonprofits use Claude or ChatGPT to draft grant proposals from past applications and real program data, and Instrumentl to find funders.",
  "summary": "AI writes a first draft of each proposal from your past applications, program data, and the funder’s questions. Staff then fill in and check the facts.",
  "problem": "Every funder asks the same questions in slightly different words, and the development director rewrites the same need statement and program description from scratch each time.",
  "aiDoes": "An AI project holds your boilerplate: mission, programs, outcomes, budgets, and past winning proposals. You give it the funder’s guidelines and questions, and it drafts answers in the right length and order, flagging where it needs a current number.",
  "steps": [
    "Collect your last few funded proposals, current program descriptions, outcome data, and board list in one folder.",
    "Create a Claude or ChatGPT project with those files and an instruction never to invent figures or stories.",
    "For each opportunity, paste in the funder’s guidelines and questions and ask for a draft that follows the word limits.",
    "Check every number, name, and outcome against your records.",
    "Optionally use a grant database such as Instrumentl to find and track matching funders."
  ],
  "tools": [
    "claude-team",
    "chatgpt-business",
    "instrumentl"
  ],
  "difficulty": "Easy",
  "setupEstimate": "Half a day to gather materials (estimate)",
  "watchOuts": [
    "AI will make up plausible statistics and client stories if you let it. Every fact must come from your records.",
    "Some funders ask whether AI was used. Read the guidelines and answer honestly.",
    "Don’t paste client names or case details into consumer AI tools. Use a business plan that doesn’t train on your data.",
    "Tailor every draft. Funders can tell when a proposal is generic."
  ]
}

export default useCase
