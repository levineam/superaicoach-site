import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "real-estate-listing-descriptions",
  "title": "Write listing descriptions and marketing from your notes",
  "industry": "realestate",
  "featured": true,
  "metaTitle": "AI for Real Estate Listing Descriptions (Fair-Housing Safe)",
  "metaDescription": "How Philadelphia real estate agents use ChatGPT or Claude to draft MLS listing descriptions, social posts, and flyers from showing notes, with fair-housing checks.",
  "summary": "AI turns your walkthrough notes and property facts into an MLS description, social posts, and an email blast in your style.",
  "problem": "Every listing needs the same thing written several ways: MLS remarks with a character limit, a flyer, social captions, and an email. It eats an evening per listing.",
  "aiDoes": "An AI project holds your style, a few of your best past listings, your MLS character limits, and a fair-housing checklist. You paste in the property facts and your notes, and it drafts every version at once for you to edit.",
  "steps": [
    "Save three or four of your best listing descriptions as examples.",
    "Create a ChatGPT or Claude project with those examples, your MLS limits, and a rule to describe the property, not the people who should live there.",
    "After the walkthrough, dictate or type notes and paste them in with the property facts.",
    "Edit, then check every claim (square footage, upgrades, school info) against the records.",
    "Use Canva to turn the copy into flyers and social graphics."
  ],
  "tools": [
    "chatgpt-business",
    "claude-team",
    "canva"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About an hour (estimate)",
  "watchOuts": [
    "Fair-housing law covers listing language. Avoid wording about who the home suits, such as families, singles, or a type of neighborhood, and describe features instead.",
    "AI can invent features. Verify every detail before publishing.",
    "Follow your MLS and brokerage rules, including any on AI-edited photos.",
    "Don’t paste sellers’ private information into tools that train on your data."
  ]
}

export default useCase
