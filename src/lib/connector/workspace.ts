/**
 * SAC Connector — Workspace Reader
 *
 * Reads live workspace state (project_cards) from the DB and returns a
 * structured WorkspaceContext that Jarvis uses as grounded knowledge.
 */

import { getMissionControlDbClient, isMissionControlDbEnabled } from '@/lib/mission-control/db'
import type { WorkspaceContext, WorkspaceTask, TaskPriority, TaskColumn } from './types'

const COLUMN_ORDER: TaskColumn[] = ['needs-you', 'active', 'in-review', 'done']
const PRIORITY_ORDER: TaskPriority[] = ['High', 'Medium', 'Low']

export async function readWorkspaceContext(tenantSlug: string): Promise<WorkspaceContext> {
  const fetchedAt = new Date().toISOString()

  const empty: WorkspaceContext = {
    tenantSlug,
    fetchedAt,
    projects: [],
    tasks: [],
    counts: { total: 0, needsYou: 0, active: 0, done: 0 },
  }

  if (!isMissionControlDbEnabled()) {
    return empty
  }

  try {
    const db = getMissionControlDbClient()!
    const { data, error } = await db
      .from('project_cards')
      .select('id, project, status, description, priority, column_id')
      .order('column_id', { ascending: true })

    if (error || !data) {
      console.error('[connector/workspace] DB error:', error)
      return empty
    }

    const tasks: WorkspaceTask[] = data.map((row) => ({
      id: row.id as string,
      project: row.project as string,
      status: row.status as string,
      description: (row.description as string) ?? '',
      priority: ((row.priority as string) ?? 'Medium') as TaskPriority,
      column: ((row.column_id as string) ?? 'active') as TaskColumn,
    }))

    tasks.sort((a, b) => {
      const colDiff = COLUMN_ORDER.indexOf(a.column) - COLUMN_ORDER.indexOf(b.column)
      if (colDiff !== 0) return colDiff
      return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
    })

    const projects = [...new Set(tasks.map((t) => t.project))]

    return {
      tenantSlug,
      fetchedAt,
      projects,
      tasks,
      counts: {
        total: tasks.length,
        needsYou: tasks.filter((t) => t.column === 'needs-you').length,
        active: tasks.filter((t) => t.column === 'active' || t.column === 'in-review').length,
        done: tasks.filter((t) => t.column === 'done').length,
      },
    }
  } catch (err) {
    console.error('[connector/workspace] Unexpected error:', err)
    return empty
  }
}

/**
 * Formats a WorkspaceContext into a compact string for system prompt injection.
 * Keeps it token-efficient: structured but readable.
 */
export function formatWorkspaceForPrompt(ctx: WorkspaceContext): string {
  if (ctx.tasks.length === 0) {
    return `[Workspace: No tasks found in the database. The board is empty or DB is not configured.]`
  }

  const needsYou = ctx.tasks.filter((t) => t.column === 'needs-you')
  const active = ctx.tasks.filter((t) => t.column === 'active' || t.column === 'in-review')
  const done = ctx.tasks.filter((t) => t.column === 'done')

  const formatTask = (t: WorkspaceTask) =>
    `  - [${t.priority}] ${t.project} / ${t.status}${t.description ? `: ${t.description.slice(0, 120)}` : ''}`

  const sections: string[] = [
    `[Workspace state as of ${ctx.fetchedAt}]`,
    `Projects: ${ctx.projects.join(', ') || 'none'}`,
    `Total tasks: ${ctx.counts.total} | Needs You: ${ctx.counts.needsYou} | Active: ${ctx.counts.active} | Done: ${ctx.counts.done}`,
  ]

  if (needsYou.length > 0) {
    sections.push(`\nNeeds You (blocked, requires your attention):\n${needsYou.map(formatTask).join('\n')}`)
  }

  if (active.length > 0) {
    sections.push(`\nQueue (in progress):\n${active.map(formatTask).join('\n')}`)
  }

  if (done.length > 0 && done.length <= 5) {
    sections.push(`\nRecently Done:\n${done.map(formatTask).join('\n')}`)
  } else if (done.length > 5) {
    sections.push(`\nDone: ${done.length} tasks completed (showing most recent 3)`)
    sections.push(done.slice(-3).map(formatTask).join('\n'))
  }

  return sections.join('\n')
}
