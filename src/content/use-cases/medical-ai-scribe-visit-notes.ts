import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "medical-ai-scribe-visit-notes",
  "title": "Draft visit notes with an AI scribe",
  "industry": "health",
  "featured": true,
  "metaTitle": "AI Scribe for Small Medical Practices: Draft Notes Without After-Hours Charting",
  "metaDescription": "How small medical, dental, and therapy practices use AI scribes like Freed and Heidi to draft visit notes from the conversation, with BAA and consent watch-outs.",
  "summary": "An AI scribe listens to the visit (with consent) and drafts the note in your template for the clinician to review.",
  "problem": "Clinicians finish the day with an hour or more of charting, or rush notes between patients and miss details.",
  "aiDoes": "An ambient scribe app records the visit on a phone or computer, transcribes it, and drafts a structured note (such as SOAP) in your template. The clinician edits and signs, then pastes or pushes the note into the EHR.",
  "steps": [
    "Pick a scribe whose plan includes a BAA at the tier you’ll actually use (Freed includes it on paid plans; Heidi gates a signed BAA to higher tiers, so check current terms).",
    "Write a short patient consent script and add it to intake paperwork.",
    "Set up your note templates and a couple of example notes.",
    "Pilot with one clinician for two weeks, reviewing every note line by line.",
    "Decide how notes get into the EHR: copy-paste, browser extension, or a supported integration."
  ],
  "tools": [
    "freed",
    "heidi"
  ],
  "difficulty": "Easy",
  "setupEstimate": "An afternoon to start (estimate)",
  "watchOuts": [
    "Pennsylvania generally requires consent from everyone being recorded. Get it from the patient every time.",
    "The clinician is responsible for every word in the signed note. AI scribes can mishear and invent details.",
    "Free and lower tiers may not include a BAA. Confirm before using real patient data.",
    "Ask how long audio and transcripts are kept and whether they’re used to train models."
  ]
}

export default useCase
