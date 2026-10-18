import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-research-learning-ai',
  title: 'Learn anything faster: research a topic with AI and actually retain it',
  industry: 'personal',
  featured: false,
  metaTitle: 'Learn Faster with AI: A Research and Retention Playbook',
  metaDescription: 'Use Perplexity for sourced answers, NotebookLM on your own documents, and ChatGPT or Claude as a tutor that quizzes you. A step-by-step playbook for busy professionals learning something new.',
  summary: 'A three-part routine: find sourced answers, study your own documents with an assistant grounded in them, then get quizzed like a tutor until it sticks.',
  problem: 'Busy professionals want to understand new topics — an investment idea, a health question, a technology, a hobby — but reading is scattered across search results and saved articles that never get finished, and little of it is retained.',
  aiDoes: 'A live-research tool answers questions with links to sources you can open. A document-grounded tool (NotebookLM) answers only from the reports, articles, or notes you upload, with citations to the page. A chat assistant then acts as a tutor: it explains at your level, gives examples from your work or life, and quizzes you instead of just summarising.',
  steps: [
    'Frame the question properly first: “I am a beginner/intermediate. I need to understand X to decide/do Y. The decision this informs is Z.” Better framing gets a usable answer.',
    'Use Perplexity for the landscape: ask the question, open at least two of the linked sources yourself, and ask a follow-up that challenges it: “What would someone who disagrees say, and what evidence do they cite?”',
    'Put the 3–5 documents that matter into NotebookLM and ask questions there, so answers are grounded in those documents with citations you can check.',
    'Switch to tutor mode in ChatGPT or Claude: “Teach me this in 10 minutes using an example from [your field]. Then quiz me with three questions and wait for my answers before correcting me.”',
    'End with a one-page note in your own words: what you learned, what you still doubt, and what you would do differently. Writing it yourself is the retention step AI cannot do for you.',
    'Save the note where you keep notes (Notion or your notes app) with the source links, so the next question starts from your library, not from zero.',
  ],
  tools: ['perplexity', 'notebooklm', 'claude-team', 'notion-ai'],
  difficulty: 'Easy',
  setupEstimate: 'About 15 minutes to set up per topic (estimate)',
  watchOuts: [
    'AI answers can be fluent and wrong, including invented citations. Open the sources; if a citation does not say what was claimed, discard the claim.',
    'For medical, legal, tax, or investment decisions, this is preparation for a conversation with a qualified professional — not a substitute for one.',
    'Do not upload documents you do not have the right to share (employer-confidential material, someone else’s private records).',
    'If two good sources disagree, that disagreement is the finding. Ask the tutor to explain both sides instead of picking a winner for you.',
  ],
}

export default useCase
