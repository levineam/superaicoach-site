export type Priority = 'High' | 'Medium' | 'Low'
export type ColumnId = 'active' | 'in-review' | 'needs-you' | 'done'
export type LaneId = 'queue' | 'needs-you' | 'done'

export type Card = {
  id: string
  project: string
  status: string
  description: string
  priority: Priority
  column: ColumnId
}

export const ALL_PROJECTS = '__all__'

/** Map the 4-column DB model → 3-lane AI-first view */
export function cardLane(column: ColumnId): LaneId {
  if (column === 'needs-you') return 'needs-you'
  if (column === 'done') return 'done'
  return 'queue' // active + in-review both go to Queue
}

/** Filter cards by selected project (pass ALL_PROJECTS to show all) */
export function filterCards(cards: Card[], project: string): Card[] {
  return project === ALL_PROJECTS ? cards : cards.filter((c) => c.project === project)
}

/** Group cards by their 3-lane ID */
export function groupByLane(cards: Card[]): Record<LaneId, Card[]> {
  return {
    queue: cards.filter((c) => cardLane(c.column) === 'queue'),
    'needs-you': cards.filter((c) => cardLane(c.column) === 'needs-you'),
    done: cards.filter((c) => cardLane(c.column) === 'done'),
  }
}
