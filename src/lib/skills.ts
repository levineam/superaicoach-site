import { readFileSync } from 'node:fs'
import path from 'node:path'

const SKILLS_DIR = path.join(process.cwd(), 'skills')

export type SkillFiles = {
  /** SKILL.md without frontmatter or the Example section, ready to paste into any chat. */
  prompt: string
  /** example.md split into its note, the input, and the output. */
  example: { note: string; inputTitle: string; input: string; outputTitle: string; output: string }
}

const PROMPT_PREFIX = 'Follow these instructions for the rest of this chat.\n\n'

/** Reads a skill folder at build time. Throws if the folder doesn't match the expected shape. */
export function readSkillFiles(slug: string): SkillFiles {
  const skill = readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf8')
  const body = skill.replace(/^---\n[\s\S]*?\n---\n/, '').split(/\n## Example\b/)[0].trim()

  const raw = readFileSync(path.join(SKILLS_DIR, slug, 'example.md'), 'utf8')
  const sections = raw.split(/^## /m)
  if (sections.length < 3) throw new Error(`${slug}/example.md needs an input and an output section`)
  const note = sections[0].replace(/^# .*\n/, '').trim()
  const [inputTitle, ...inputLines] = sections[1].split('\n')
  const [outputTitle, ...outputLines] = sections[2].split('\n')

  return {
    prompt: PROMPT_PREFIX + body + '\n',
    example: {
      note,
      inputTitle: inputTitle.trim(),
      input: inputLines.join('\n').trim(),
      outputTitle: outputTitle.trim(),
      output: outputLines.join('\n').trim(),
    },
  }
}
