import { NextResponse } from 'next/server'
import { getMissionControlDbClient } from '@/lib/mission-control/db'

type Priority = 'High' | 'Medium' | 'Low'
type ColumnId = 'active' | 'in-review' | 'needs-you' | 'done'

type Card = {
  id: string
  project: string
  status: string
  description: string
  priority: Priority
  column: ColumnId
}

export async function GET() {
  try {
    const db = getMissionControlDbClient()
    if (!db) {
      return NextResponse.json(
        { error: 'Database client not configured' },
        { status: 503 }
      )
    }

    const { data, error } = await db
      .from('project_cards')
      .select('id, project, status, description, priority, column_id')
      .order('column_id', { ascending: true })

    if (error) {
      console.error('Error querying project_cards:', error)
      return NextResponse.json(
        { error: 'Failed to fetch project cards from database' },
        { status: 500 }
      )
    }

    // Map DB rows to Card shape (column_id → column)
    const columnOrder: ColumnId[] = ['needs-you', 'active', 'in-review', 'done']
    const priorityOrder: Priority[] = ['High', 'Medium', 'Low']

    const allCards: Card[] = (data ?? []).map((row) => ({
      id: row.id,
      project: row.project,
      status: row.status,
      description: row.description ?? '',
      priority: (row.priority as Priority) ?? 'Medium',
      column: (row.column_id as ColumnId) ?? 'active',
    }))

    // Sort: column order first, then priority within each column
    allCards.sort((a, b) => {
      const colDiff = columnOrder.indexOf(a.column) - columnOrder.indexOf(b.column)
      if (colDiff !== 0) return colDiff
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    })

    return NextResponse.json({
      cards: allCards,
      projects: [...new Set(allCards.map((c) => c.project))],
      counts: {
        total: allCards.length,
        active: allCards.filter((c) => c.column === 'active').length,
        inReview: allCards.filter((c) => c.column === 'in-review').length,
        needsYou: allCards.filter((c) => c.column === 'needs-you').length,
        done: allCards.filter((c) => c.column === 'done').length,
      },
    })
  } catch (error) {
    console.error('Error in projects route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project cards' },
      { status: 500 }
    )
  }
}
