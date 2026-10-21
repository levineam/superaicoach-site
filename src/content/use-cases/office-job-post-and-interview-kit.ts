import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'office-job-post-and-interview-kit',
  title: 'Write the job post and a structured interview kit for your next hire',
  industry: 'office',
  featured: false,
  metaTitle: 'AI for Small Business Hiring: Job Post and Interview Questions',
  metaDescription: 'How a small business owner can use ChatGPT, Claude, Copilot, or Gemini to turn rough notes into a clear job post, a consistent interview question set, and a simple scoring sheet, while keeping hiring decisions human.',
  summary: 'Turn your rough notes about the role into a clear job post, a consistent set of interview questions, and a simple scorecard, so every candidate gets the same fair interview.',
  problem: 'In a small business, hiring usually lands on the owner on top of everything else. Job posts get copied from an old listing, interviews turn into friendly chats that vary from candidate to candidate, and it is hard to compare people fairly afterwards.',
  aiDoes: 'From your notes on what the person will actually do in their first 90 days, the assistant drafts a plain-English job post, a short list of must-have versus nice-to-have skills, eight to ten interview questions tied to those skills, and a one-page scorecard every interviewer fills in the same way. It writes the materials; you and your team make every decision about people.',
  steps: [
    'Use a paid or work-tier assistant you already have: ChatGPT Business, Claude, Microsoft 365 Copilot, or Gemini in Google Workspace.',
    'Write five rough lines yourself: what the person will do day to day, what “good” looks like after 90 days, the pay range, the schedule, and where the job is located (or whether it is remote).',
    'Prompt: “Turn these notes into a job post for a small business. Plain English, no buzzwords, include the pay range and schedule, and separate must-have skills from nice-to-have. Do not add requirements I did not give you.”',
    'Then: “Write eight interview questions that test the must-have skills, using real situations from this job, plus a 1-to-4 scoring guide for each question.” Cut any question that is not about the work.',
    'Turn the questions into a one-page scorecard and use it for every candidate, so each person is asked the same things and scored the same way.',
    'Read the final job post out loud before posting it on your usual job board. If a sentence would not sound right coming from you, rewrite it.',
  ],
  tools: ['chatgpt-business', 'claude-team', 'm365-copilot', 'gemini-workspace'],
  difficulty: 'Easy',
  setupEstimate: 'About an hour for the first role; reuse the kit for later hires (estimate)',
  watchOuts: [
    'Use AI to write the materials, not to screen or rank applicants. Anti-discrimination law applies to hiring decisions no matter what tool helped, and automated screening raises the risk.',
    'Do not paste resumes, applicant names, or other candidates’ personal information into a free consumer account.',
    'Remove questions about age, family plans, health, religion, or anything else unrelated to doing the job, even if a draft includes one.',
    'Check that the job post matches the real pay, hours, and benefits. AI will happily fill in perks you do not offer.',
    'If you are unsure about a legal requirement for your state or industry, ask an employment attorney or your payroll provider rather than the AI.',
  ],
}

export default useCase
