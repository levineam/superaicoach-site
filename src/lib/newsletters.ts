import fs from 'fs'
import path from 'path'

export type NewsletterBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export interface NewsletterRecord {
  slug: string
  title: string
  date: string
  status: string
  summary: string
  body: string
  blocks: NewsletterBlock[]
}

const DEFAULT_NEWSLETTER_DIR =
  process.env.NEWSLETTER_ARCHIVE_DIR?.trim() || '/Users/andrew/clawd/newsletters/approved'

function safeReadDir(dirPath: string): string[] {
  try {
    return fs.readdirSync(dirPath)
  } catch {
    return []
  }
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---\n')) {
    return { meta: {}, body: raw.trim() }
  }

  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) {
    return { meta: {}, body: raw.trim() }
  }

  const meta: Record<string, string> = {}
  const frontmatter = raw.slice(4, end)
  const body = raw.slice(end + 5).trim()

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    meta[match[1]] = match[2].trim()
  }

  return { meta, body }
}

function stripMarkdown(value: string): string {
  return value
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(body: string, maxLength = 220): string {
  const plain = stripMarkdown(body)
  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength - 1).trimEnd()}…`
}

function parseBlocks(body: string): NewsletterBlock[] {
  const lines = body.split(/\r?\n/)
  const blocks: NewsletterBlock[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() })
    paragraph = []
  }

  const flushList = () => {
    if (!list.length) return
    blocks.push({ type: 'list', items: [...list] })
    list = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph()
      flushList()
      const level = Math.min(headingMatch[1].length, 3) as 1 | 2 | 3
      blocks.push({ type: 'heading', level, text: headingMatch[2].trim() })
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph()
      list.push(line.replace(/^[-*]\s+/, '').trim())
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  return blocks
}

function resolveRecord(fileName: string, dirPath: string): NewsletterRecord | null {
  const fullPath = path.join(dirPath, fileName)
  let raw = ''

  try {
    raw = fs.readFileSync(fullPath, 'utf8')
  } catch {
    return null
  }

  const { meta, body } = parseFrontmatter(raw)
  const slug = (meta.slug || fileName.replace(/\.md$/, '')).trim()
  if (!slug) return null

  return {
    slug,
    title: (meta.title || slug).trim(),
    date: (meta.date || slug).trim(),
    status: (meta.status || 'approved').trim(),
    summary: (meta.summary || excerpt(body)).trim(),
    body,
    blocks: parseBlocks(body),
  }
}

export function listNewsletters(dirPath = DEFAULT_NEWSLETTER_DIR): NewsletterRecord[] {
  return safeReadDir(dirPath)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => resolveRecord(fileName, dirPath))
    .filter((record): record is NewsletterRecord => Boolean(record))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getNewsletter(slug: string, dirPath = DEFAULT_NEWSLETTER_DIR): NewsletterRecord | null {
  const safeSlug = slug.replace(/[^0-9A-Za-z_-]/g, '')
  if (!safeSlug) return null

  const candidates = [`${safeSlug}.md`, `${safeSlug.toLowerCase()}.md`]
  for (const candidate of candidates) {
    const record = resolveRecord(candidate, dirPath)
    if (record) return record
  }

  return listNewsletters(dirPath).find((record) => record.slug === slug) || null
}
