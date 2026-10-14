import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "agency-kickoff-call-to-creative-brief",
  "title": "Turn a kickoff call into a creative brief",
  "industry": "agencies",
  "featured": true,
  "summary": "The transcript of the client call becomes a first-draft brief in your template.",
  "problem": "After a kickoff, someone spends hours turning notes into a brief, and details from the call get lost.",
  "aiDoes": "A meeting recorder captures the call, and an AI project fills your brief template from the transcript: goals, audience, deliverables, constraints, open questions.",
  "steps": [
    "Get consent to record kickoff calls.",
    "Record with a meeting assistant such as Fathom.",
    "Paste the transcript into a Claude or ChatGPT project that holds your brief template and a good past example.",
    "Account lead edits and sends to the client for confirmation."
  ],
  "tools": [
    "fathom",
    "claude-team",
    "chatgpt-business"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About an hour (estimate)",
  "watchOuts": [
    "Pennsylvania generally requires consent from everyone on a call before it’s recorded. Get it, and say so at the start of the call.",
    "Keep each client in its own project so material never crosses between clients.",
    "Have the client confirm the brief; AI may fill gaps with assumptions."
  ]
}

export default useCase
