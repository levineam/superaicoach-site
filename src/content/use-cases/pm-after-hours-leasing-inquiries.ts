import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "pm-after-hours-leasing-inquiries",
  "title": "Answer leasing inquiries and book showings after hours",
  "industry": "property",
  "featured": true,
  "summary": "AI replies to prospects by email, text, or phone and schedules showings, with a person watching.",
  "problem": "Prospects inquire at night and on weekends. By morning they’ve booked a showing somewhere else.",
  "aiDoes": "An AI leasing assistant inside your property management software answers questions about available units from your listing data and schedules showings on your calendar. Staff monitor the conversations.",
  "steps": [
    "Make sure listing data (rent, availability, pet policy, fees) is accurate; the AI answers from it.",
    "Turn on the leasing assistant in your platform (AppFolio’s Realm-X Leasing Performer handles email, text, and phone).",
    "Write clear escalation rules for anything unusual.",
    "Review a sample of conversations every week."
  ],
  "tools": [
    "appfolio-realmx"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "About a week to configure and monitor (estimate)",
  "watchOuts": [
    "Fair-housing rules apply to automated replies. Answers must be the same for everyone and avoid steering.",
    "Disclose that prospects are talking to an automated assistant.",
    "Wrong listing data produces wrong answers at scale. Keep it current."
  ]
}

export default useCase
