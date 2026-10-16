import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "restaurant-reply-to-google-reviews",
  "title": "Reply to every Google review in your own voice",
  "industry": "restaurants",
  "featured": true,
  "metaTitle": "AI for Restaurant Google Review Replies: A Simple Setup",
  "metaDescription": "How an independent Philadelphia restaurant can use ChatGPT or Claude to draft replies to Google reviews in its own voice, then post them from Google Business Profile.",
  "summary": "AI drafts a reply to each new review in your voice; you approve and post it from Google Business Profile.",
  "problem": "Owners know they should answer reviews, especially the bad ones, but it falls to the bottom of the list. Unanswered reviews sit there for every new customer to read.",
  "aiDoes": "A saved AI project holds your voice guide, a few replies you liked, and your rules (never argue, invite them back, take problems offline). You paste in new reviews and get drafts you can edit in seconds.",
  "steps": [
    "Write a short voice guide: how you talk, what you never say, who to contact for complaints.",
    "Create a ChatGPT or Claude project with the guide and five replies you’re proud of.",
    "Once or twice a week, copy new reviews from Google Business Profile into the project.",
    "Edit each draft so it mentions something specific from the review.",
    "Post the reply from Google Business Profile or the Google Maps app."
  ],
  "tools": [
    "chatgpt-business",
    "claude-team",
    "google-business-profile"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About an hour (estimate)",
  "watchOuts": [
    "Never offer discounts or freebies in exchange for reviews; it breaks Google’s rules.",
    "Don’t share private details about a customer’s visit in a public reply.",
    "Read every draft. Generic AI replies are easy to spot and can do more harm than none.",
    "For a food-safety or injury complaint, call your insurer or lawyer before replying."
  ]
}

export default useCase
