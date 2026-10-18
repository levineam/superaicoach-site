import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-health-finance-paperwork-ai',
  title: 'Get on top of health and finance paperwork with AI',
  industry: 'personal',
  featured: false,
  metaTitle: 'AI for Health and Finance Paperwork: Bills, Letters, and Renewals',
  metaDescription: 'Use AI to turn dense bills, insurance letters, and statements into plain-English summaries with dates and amounts checked by you, and keep renewals from surprising you. No account numbers, ever.',
  summary: 'AI translates dense bills, insurance explanations, and household finance letters into a short “what this is, what you owe, by when, what to check” summary, and keeps a renewal tracker so nothing lapses by surprise.',
  problem: 'The paperwork nobody enjoys — medical bills and insurance explanations, utility and subscription renewals, tax letters, statements — arrives dense and infrequent, so each one takes effort to decode and deadlines get missed.',
  aiDoes: 'You provide a redacted copy or photo of the document (account numbers covered); the assistant returns a plain-English summary: what it is, the amount, the due date, what it claims you agreed to, and the specific lines to verify. It also builds a simple renewal tracker (insurance, subscriptions, warranties, licences) with dates you confirm, and drafts polite query letters when a charge looks wrong — for you to send.',
  steps: [
    'Redact first, every time: cover or crop account numbers, full card numbers, Social Security numbers, and barcodes before photographing or uploading anything. Name, dates, and amounts are usually all the assistant needs.',
    'Use this prompt: “Summarise this in plain English: (1) what is this, (2) what amount is due and by when, (3) what should I check line by line, (4) anything that looks unusual compared with a normal bill of this type. Do not invent figures; if a number is unclear, say so.”',
    'Verify every amount and date against the original document yourself before paying or calendarising anything.',
    'Start a renewal tracker in Notion or a spreadsheet: item, provider, renewal/end date, cost, and “decide by” date two weeks earlier. Ask AI to sort it and flag what is coming up each month.',
    'For a charge you dispute, ask for a short, factual draft: the charge, why it looks wrong, and what you are asking the provider to do. Keep it polite, send it yourself, and keep the reply with the bill.',
    'Once a quarter, ask: “From this tracker, what renews in the next 90 days and what should I compare or cancel?” That one review is where the money is saved.',
  ],
  tools: ['chatgpt-business', 'claude-team', 'notion-ai'],
  difficulty: 'Easy',
  setupEstimate: 'About 45 minutes to build the renewal tracker, then minutes per document (estimate)',
  watchOuts: [
    'Never paste or upload Social Security numbers, full bank/card account numbers, passwords, or PINs — redact them even if the tool feels private.',
    'AI summaries are a reading aid, not financial, tax, legal, or medical advice. For a tax notice, a disputed medical bill of consequence, or anything with a legal deadline, talk to a qualified professional.',
    'Do not let AI log in to your bank, insurer, or provider accounts, and do not share one-time codes with any tool or person.',
    'Keep the original documents. The summary helps you read them; it does not replace them if there is a dispute.',
  ],
}

export default useCase
