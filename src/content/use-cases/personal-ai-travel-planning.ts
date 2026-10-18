import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-ai-travel-planning',
  title: 'Plan a whole trip with AI, then keep it in one itinerary',
  industry: 'personal',
  featured: false,
  metaTitle: 'AI Travel Planning Playbook: Research, Compare, and Build an Itinerary',
  metaDescription: 'Use Perplexity, ChatGPT or Claude, and TripIt to research flights and stays, compare trade-offs in a table, and keep confirmations in one itinerary. Prices change, so verify before you book.',
  summary: 'AI does the research and comparison legwork for a trip — options, trade-offs, and a day-by-day plan — while you book on the official sites and keep every confirmation in one place.',
  problem: 'Planning a trip means dozens of tabs: flights, hotels, trains, restaurants, and “what is near what”. The research takes hours, and the final details end up scattered across email confirmations.',
  aiDoes: 'A research assistant with live web access gathers flight and lodging options for your dates, puts the real trade-offs (price, times, stops, cancellation terms) into a comparison table with source links, and drafts a day-by-day itinerary around what you actually like. A trip organiser then collects your booking confirmations into a single itinerary you can check offline.',
  steps: [
    'Start with constraints, not vibes: dates, airports, budget range, must-dos, pace (“one big thing a day”), and anything you want to avoid.',
    'Ask a live-research tool such as Perplexity: “Find flight options for these dates. Show price, times, stops, and baggage/cancellation notes in a table, with links. Flag anything you could not verify.”',
    'Do the same for lodging by neighbourhood: ask what each area is like for your priorities (quiet, walkable, near transit), not just a list of hotels.',
    'Ask ChatGPT or Claude to turn the shortlist into a day-by-day plan, then push back: “Make day 2 lighter, move the museum to the morning, and leave one evening empty.”',
    'Book on the airline/hotel’s own site from the links — never from a price quoted in chat without checking it live on the booking page.',
    'Forward confirmations to TripIt (or add them manually) so flights, stays, and reservations sit in one itinerary; share it with whoever is travelling with you.',
  ],
  tools: ['perplexity', 'chatgpt-business', 'tripit'],
  difficulty: 'Easy',
  setupEstimate: 'About 20 minutes per trip once you reuse the prompts (estimate)',
  watchOuts: [
    'Prices, schedules, and availability change constantly. Treat every AI-quoted price as a lead to verify on the official booking page, never as the price you will pay.',
    'Check visa, passport, and entry requirements on official government sites, not from a chat answer.',
    'Do not paste passport numbers, payment card details, or loyalty-account passwords into any AI tool.',
    'Keep the booking confirmations themselves (email or TripIt), not just the AI itinerary — the confirmation is the document that matters at the airport or hotel.',
  ],
}

export default useCase
