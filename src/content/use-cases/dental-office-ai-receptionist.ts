import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "dental-office-ai-receptionist",
  "title": "Answer every patient call with an AI receptionist",
  "industry": "health",
  "featured": true,
  "metaTitle": "AI Receptionist for Dental Offices in Philadelphia: How It Works",
  "metaDescription": "How a small dental office can use an AI receptionist to answer after-hours calls and texts, book appointments, and hand off to staff. Tools, setup, and HIPAA watch-outs.",
  "summary": "An AI receptionist picks up after hours and when the front desk is busy, answers routine questions, and books or requests appointments.",
  "problem": "Calls come in while the front desk is checking someone out, at lunch, and after hours. Many go to voicemail, and new patients often just call the next office.",
  "aiDoes": "A voice and text assistant built into your phone system answers with your office’s hours, insurance, and services, books or reschedules into supported practice-management systems, and hands anything it can’t handle to staff with a summary.",
  "steps": [
    "Check which AI receptionist works with your phone system and practice-management software (for example, Weave’s works with Open Dental, Dentrix, and Eaglesoft).",
    "Confirm the vendor signs a BAA and review what call data it stores.",
    "Load your office knowledge: hours, insurance accepted, services, new-patient steps, and what counts as an emergency.",
    "Start with after-hours calls only, with a fallback to a person or voicemail so no call drops.",
    "Review transcripts weekly for the first month and tighten the answers before turning it on during the day."
  ],
  "tools": [
    "weave-ai-receptionist",
    "zapier"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A few hours plus a month of tuning (estimate)",
  "watchOuts": [
    "Patient details are protected health information. Use a vendor that signs a BAA.",
    "Clinical questions and emergencies should always route to a person or your on-call line.",
    "Tell callers they’re speaking with an automated assistant.",
    "Check usage limits; some plans stop answering when monthly credits run out."
  ]
}

export default useCase
