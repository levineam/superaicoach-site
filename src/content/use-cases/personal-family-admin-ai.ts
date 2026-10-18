import type { UseCase } from '../types'

const useCase: UseCase = {
  slug: 'personal-family-admin-ai',
  title: 'Hand family admin to AI: school, home, and household paperwork',
  industry: 'personal',
  featured: false,
  metaTitle: 'AI for Family Admin: School Emails, Household Lists, and Paperwork',
  metaDescription: 'A practical playbook for busy parents and households: turn school and activity emails into calendar entries and checklists, keep one shared household list, and get drafts for routine messages.',
  summary: 'AI reads the long school/activity emails, pulls out dates and deadlines into a checklist, and keeps household jobs in one shared list — you approve anything that goes to another person.',
  problem: 'Family life runs on long emails, PDFs, group chats, and forms. The dates that matter (forms due, kit needed, payments, pickups) are buried in paragraphs, and the mental load of holding it all usually falls on one person.',
  aiDoes: 'You paste or upload the school newsletter, activity email, or household document; the assistant returns just the dates, deadlines, money, and actions in a short list you can drop onto the family calendar. It also maintains one shared “household list” (repairs, renewals, gifts, appointments) and drafts routine replies — RSVP, absence note, question to a coach — for you to send.',
  steps: [
    'Pick one home base the household will actually open: a shared Notion page, a shared notes app, or a shared calendar. The tool matters less than everyone using the same one.',
    'For each long email or PDF, ask: “List only: dates and deadlines, money owed, things to bring or sign, and actions for a parent. Quote the sentence each item came from. Say if you are unsure.”',
    'Move confirmed dates onto the shared calendar yourself, with an alert the day before anything needs signing, paying, or packing.',
    'Keep a running household list and ask AI to organise it weekly: “Group this list into this week, this month, and later. Flag anything with a date that has passed.”',
    'For routine messages, ask for a short draft in your words, check names/dates, and send it yourself from your own account.',
    'Once a month, ask: “What recurring admin showed up more than once?” Turn the answer into a standing checklist (for example, a start-of-term checklist) you reuse.',
  ],
  tools: ['chatgpt-business', 'claude-team', 'notion-ai'],
  difficulty: 'Easy',
  setupEstimate: 'About 30 minutes to set up the shared list and calendar routine (estimate)',
  watchOuts: [
    'Children’s information deserves extra care: avoid pasting full names with school, medical, or location details into consumer AI accounts; initials and dates usually carry enough context.',
    'Never let AI submit a form, payment, or consent on your behalf. It drafts and organises; you submit.',
    'Medical, school-discipline, and safeguarding matters go to a person and the official channel, not a drafted shortcut.',
    'Double-check every extracted date against the original email before it goes on the calendar — one wrong date is a missed deadline.',
  ],
}

export default useCase
