import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "law-contract-review-in-word",
  "title": "Mark up routine contracts in Word",
  "industry": "law",
  "summary": "An AI add-in flags missing clauses and unusual terms in NDAs, leases, and vendor agreements.",
  "problem": "Routine agreements still need a careful read, and checking them against your playbook clause by clause is slow.",
  "aiDoes": "An add-in inside Microsoft Word compares the draft against your preferred positions, flags risky or missing clauses, and suggests redlines you accept or reject.",
  "steps": [
    "Write down your positions for the agreement types you see most (a one-page playbook is enough to start).",
    "Install a Word add-in such as Spellbook, or use Copilot in Word with your playbook.",
    "Test on agreements you’ve already negotiated and compare results.",
    "Keep a lawyer as the final reviewer on every agreement."
  ],
  "tools": [
    "spellbook",
    "m365-copilot"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A few days including writing the playbook (estimate)",
  "watchOuts": [
    "Suggested redlines can be confidently wrong about jurisdiction-specific law.",
    "Confirm the vendor’s data retention terms before uploading client agreements.",
    "The playbook is the real work. Without it, you get generic suggestions."
  ]
}

export default useCase
