import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "pm-maintenance-request-triage",
  "title": "Triage maintenance requests and route emergencies",
  "industry": "property",
  "summary": "AI sorts incoming requests by urgency and drafts work orders for staff to approve.",
  "problem": "Maintenance requests come in by phone, text, email, and portal, in every level of detail. Sorting urgent from routine is constant work.",
  "aiDoes": "AI reads each request, asks the tenant for missing details, categorizes it, suggests urgency, and drafts a work order for the right vendor. Emergencies go straight to a person.",
  "steps": [
    "Define what counts as an emergency (gas, flooding, no heat, security) and route those to a human immediately.",
    "Turn on AI request handling in your platform, or connect your request form to an AI step in Zapier.",
    "Let AI draft work orders; staff approve them.",
    "Review misclassified requests monthly and adjust the rules."
  ],
  "tools": [
    "appfolio-realmx",
    "zapier"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A few days (estimate)",
  "watchOuts": [
    "Emergencies must never wait in an AI queue.",
    "Tenant messages include personal information. Keep it in approved tools.",
    "Check that vendor dispatch still needs human approval for cost."
  ]
}

export default useCase
