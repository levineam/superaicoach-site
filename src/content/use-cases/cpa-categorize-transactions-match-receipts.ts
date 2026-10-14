import type { UseCase } from '../types'

const useCase: UseCase = {
  "slug": "cpa-categorize-transactions-match-receipts",
  "title": "Categorize transactions and match receipts",
  "industry": "accounting",
  "summary": "AI suggests categories and matches receipts so bookkeepers review instead of type.",
  "problem": "Monthly bookkeeping means categorizing hundreds of bank transactions and hunting for receipts.",
  "aiDoes": "Bookkeeping software suggests categories from past patterns, and a receipt-capture tool reads receipts and matches them to transactions. The bookkeeper reviews and approves.",
  "steps": [
    "Clean up the chart of accounts and bank rules first; AI learns from your history.",
    "Turn on AI categorization in QuickBooks Online and connect a receipt tool such as Dext.",
    "Have clients snap receipts into the capture app instead of emailing them.",
    "Review suggestions in batches before close."
  ],
  "tools": [
    "quickbooks",
    "dext"
  ],
  "difficulty": "Easy",
  "setupEstimate": "About a day per client file to set up rules (estimate)",
  "watchOuts": [
    "Suggestions repeat past mistakes. Fix the history or the rules, not just the transaction.",
    "Review before close every month; don’t auto-approve.",
    "Check which client data the receipt tool stores and for how long."
  ]
}

export default useCase
