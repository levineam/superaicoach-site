import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "office-connect-apps-no-retyping",
  "title": "Stop retyping data between apps",
  "industry": "office",
  "summary": "Connect forms, email, CRM, and spreadsheets so information moves on its own.",
  "problem": "The same contact or order gets typed into a form, a spreadsheet, a CRM, and an invoice.",
  "aiDoes": "An automation tool connects your apps, and AI steps inside it can read messy input (an email, a PDF) and pull out the fields to pass along.",
  "steps": [
    "Map one process end to end and count where data is retyped.",
    "Build a single automation in Zapier or Make for the worst step.",
    "Add an AI step only where the input is unstructured.",
    "Log every run and check errors weekly."
  ],
  "tools": [
    "zapier",
    "make",
    "hubspot-breeze"
  ],
  "difficulty": "Moderate",
  "setupEstimate": "A day or two per process (estimate)",
  "watchOuts": [
    "Automations fail silently. Set up error alerts.",
    "An AI step can misread a field and pass the error along to every connected app.",
    "Use a shared business account, not one employee’s login."
  ]
}

export default useCase
