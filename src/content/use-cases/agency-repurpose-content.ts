import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "agency-repurpose-content",
  "title": "Repurpose one piece of content into a week of posts",
  "industry": "agencies",
  "summary": "Turn a blog post, webinar, or case study into drafts for each channel, then design in Canva.",
  "problem": "Every long piece should become posts, emails, and graphics, but rewriting it for each channel is tedious.",
  "aiDoes": "AI drafts channel-specific versions in the client’s voice from the source piece, and Canva’s AI features help produce matching graphics from brand templates.",
  "steps": [
    "Build a voice guide per client with real examples.",
    "Draft versions in a per-client AI project.",
    "Create graphics from brand kits in Canva.",
    "Client approves before anything is scheduled."
  ],
  "tools": [
    "chatgpt-business",
    "claude-team",
    "canva"
  ],
  "difficulty": "Easy",
  "setupEstimate": "A few hours per client to build the voice guide (estimate)",
  "watchOuts": [
    "Check every factual claim and statistic; AI adds confident details that aren’t in the source.",
    "Check image rights and usage terms for AI-generated visuals.",
    "Generic output is the risk. The voice guide is what prevents it."
  ]
}

export default useCase
