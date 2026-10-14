import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "cpa-chase-missing-client-documents",
  "title": "Chase missing client documents without the nagging",
  "industry": "accounting",
  "featured": true,
  "summary": "Automated, polite reminders that tell each client exactly what’s still missing.",
  "problem": "Every season, staff spend hours emailing clients for the same missing W-2s, 1099s, and K-1s, and tracking who sent what.",
  "aiDoes": "Your practice-management system tracks the checklist per client and sends reminders automatically. AI drafts the reminder text so it names the specific missing items in a friendly tone.",
  "steps": [
    "Set up per-client document checklists in your practice-management tool (TaxDome and Karbon both support automated client requests).",
    "Write a short, friendly reminder sequence and let AI tailor it per client.",
    "Route all uploads through the client portal, not email.",
    "Have someone review exceptions weekly: clients who haven’t responded after the sequence."
  ],
  "tools": [
    "taxdome",
    "karbon",
    "chatgpt-business"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A few days before season starts (estimate)",
  "watchOuts": [
    "Never ask clients to email tax documents. Use the portal.",
    "Tax return information has special disclosure rules (IRC §7216). Check what you share with any new vendor.",
    "Automations that are too frequent annoy good clients. Cap the reminders."
  ]
}

export default useCase
