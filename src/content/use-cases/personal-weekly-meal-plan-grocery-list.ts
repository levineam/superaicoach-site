import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-weekly-meal-plan-grocery-list',
  title: 'Plan a week of dinners and the grocery list in ten minutes with AI',
  industry: 'personal',
  featured: false,
  metaTitle: 'AI Meal Planning for Busy Professionals: Weekly Dinners and Grocery List',
  metaDescription: 'A step-by-step playbook: use ChatGPT, Claude, or Gemini to plan a week of weeknight dinners around your schedule, what is already in the fridge, and your family’s preferences, then get one grocery list sorted by store aisle.',
  summary: 'Tell an AI assistant your week, your household, and what is already in the fridge, and get five realistic weeknight dinners plus one grocery list sorted by aisle.',
  problem: 'The “what’s for dinner” decision lands at 6 pm on the busiest days, which means extra grocery runs, takeout by default, and food in the fridge going to waste. Planning ahead works, but it takes a quiet half hour most busy people do not have.',
  aiDoes: 'Given your calendar for the week, who you are feeding, foods to avoid, and a quick list of what is already on hand, the assistant proposes dinners that fit each night (fast meals on late nights, leftovers planned on purpose), then merges every ingredient into one grocery list grouped by store section, minus what you already have. You pick, swap, and do the shopping yourself.',
  steps: [
    'Use the assistant you already have: ChatGPT, Claude, or Gemini all handle this well on their standard plans. Voice mode in the ChatGPT or Gemini app works if you would rather talk it through while unpacking groceries.',
    'Spend two minutes on inputs: which nights are late or rushed, how many people, any allergies or hard dislikes, and a quick list (or a photo) of what is in the fridge and pantry that should get used.',
    'Use this prompt: “Plan five weeknight dinners for [number] people. Monday and Thursday need to be under 20 minutes. Use up [items on hand]. Avoid [allergies/dislikes]. Plan one night as leftovers. Keep ingredients overlapping so the list stays short.”',
    'Swap anything you do not like: “Replace Wednesday with something vegetarian” or “make Tuesday a sheet-pan meal.” Two or three rounds is normal.',
    'Then ask: “Give me one grocery list for these meals, grouped by store section, quantities included, leaving out what I said I already have.” Paste it into your notes app or your grocery delivery cart.',
    'Save the prompt and the dinners your household liked. Next week, start with “Here’s what we liked last time” and the plan gets better every week.',
  ],
  tools: ['chatgpt-business', 'claude-team', 'gemini-workspace'],
  difficulty: 'Easy',
  setupEstimate: 'About 10 minutes a week once you have your prompt saved (estimate)',
  watchOuts: [
    'Double-check anything allergy-related yourself. AI can miss a hidden ingredient, such as nuts in a sauce or gluten in a broth.',
    'Quantities and cooking times are suggestions, not tested recipes. Sanity-check them against a recipe you trust if a dish is new to you.',
    'You do not need to share anything sensitive here. Keep health details general (for example, “low sodium”) rather than pasting medical records.',
    'Let the assistant build the list, but do the ordering and checkout yourself. Do not hand an AI agent your saved payment details while you are still learning how it behaves.',
  ],
  typicalEffect: 'Typically replaces a nightly dinner decision and a mid-week grocery run with one short planning session (estimate, varies by household).',
}

export default useCase
