/**
 * The free skills. Each slug matches a folder in /skills at the repo root
 * (SKILL.md plus example.md), which scripts/build-skills.mjs zips into
 * public/skills/<slug>.zip at build time.
 */
export type Skill = {
  slug: string
  name: string
  /** One sentence for the card. */
  summary: string
  /** What to paste in. */
  giveIt: string
  /** What to keep out, specific to this skill. */
  dontPaste: string
}

export const SKILLS: Skill[] = [
  {
    slug: 'meeting-prep-brief',
    name: 'Meeting prep brief',
    summary: 'Paste who’s coming and the last few emails. Get a one-page brief before you walk in.',
    giveIt: 'The invite, the names of the people coming, recent emails or notes, and what you want out of the meeting.',
    dontPaste: 'Passwords, account numbers, or anyone’s health or personal details.',
  },
  {
    slug: 'monday-plan',
    name: 'Monday plan',
    summary: 'Paste your to-do list and calendar. Get a realistic plan for the week, with what to delegate or drop.',
    giveIt: 'Your to-do list, this week’s calendar, anything you’re worried about, and how many hours a day you have for your own work.',
    dontPaste: 'Passwords, account numbers, or private details about employees or family, such as health or pay.',
  },
  {
    slug: 'decision-memo',
    name: 'Decision memo',
    summary: 'Talk through a decision you’re stuck on. Get a one-page memo with options, risks, and a cheap way to test it.',
    giveIt: 'What you’re deciding, the numbers you know (prices, costs, cash), and what happens if you wait.',
    dontPaste: 'Bank or card numbers, passwords, or private personal or health details about employees or clients.',
  },
  {
    slug: 'call-follow-ups',
    name: 'Call follow-ups',
    summary: 'Paste a call transcript or rough notes. Get a summary, a task list, and a follow-up email to review.',
    giveIt: 'The transcript or your notes, who was on the call, the date, and who the follow-up should go to.',
    dontPaste: 'Passwords, account or card numbers, someone’s health or personal details, or a recording you don’t have consent to use.',
  },
]
