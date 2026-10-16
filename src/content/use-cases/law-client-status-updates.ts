import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "law-client-status-updates",
  "title": "Draft client status updates from the matter file",
  "industry": "law",
  "summary": "First drafts of “where things stand” emails, written from recent activity on the matter.",
  "problem": "Clients want regular updates, and slow communication is a common source of frustration. Writing a careful status email from scratch takes time nobody bills for.",
  "aiDoes": "The AI reads recent notes, documents, and events on the matter and drafts a plain-English update. The attorney edits it and sends it.",
  "steps": [
    "Pick the matter types where regular updates matter most.",
    "Write two or three example updates in your firm’s voice for the AI to follow.",
    "Use Clio’s drafting assistant or a firm Claude/ChatGPT project with those examples.",
    "Attorney reviews every draft before it goes out."
  ],
  "tools": [
    "clio-manage",
    "claude-team",
    "chatgpt-business"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About an afternoon (estimate)",
  "watchOuts": [
    "A draft can state something as settled that isn’t. Read it like a junior associate wrote it.",
    "Don’t paste matter details into personal AI accounts. Use a business-tier plan that doesn’t train on your data, not personal accounts.",
    "Keep privileged strategy out of client-facing drafts unless you intend to share it."
  ]
}

export default useCase
