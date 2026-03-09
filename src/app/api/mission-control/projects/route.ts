import { NextResponse } from 'next/server'
import { getMissionControlDbClient, isMissionControlDbEnabled } from '@/lib/mission-control/db'

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

export async function GET(request: Request) {
  const dbEnabled = isMissionControlDbEnabled()

  if (!dbEnabled) {
    return NextResponse.json(
      {
        error: 'Database client not configured',
        diagnostics: {
          dbEnabled: false,
          totalInDb: 0,
          filtered: 0,
          hint: 'Set MISSION_CONTROL_SUPABASE_URL and MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY',
        },
      },
      { status: 503 }
    )
  }

  try {
    const db = getMissionControlDbClient()!
    const { searchParams } = new URL(request.url)
    const projectFilter = searchParams.get('project')

    // Fetch all cards for diagnostics total count
    const { data: allData, error: allError } = await db
      .from('project_cards')
      .select('id', { count: 'exact' })

    if (allError) {
      return NextResponse.json(
        {
          error: 'Failed to count project cards',
          diagnostics: { dbEnabled: true, totalInDb: 0, filtered: 0, error: allError.message },
        },
        { status: 500 }
      )
    }

    const totalInDb = allData?.length ?? 0

    // Fetch cards (optionally filtered by project)
    let query = db
      .from('project_cards')
      .select('id, project, status, description, priority, column_id')
      .order('column_id', { ascending: true })

    if (projectFilter) {
      query = query.eq('project', projectFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error querying project_cards:', error)
      return NextResponse.json(
        {
          error: 'Failed to fetch project cards from database',
          diagnostics: { dbEnabled: true, totalInDb, filtered: 0, error: error.message },
        },
        { status: 500 }
      )
    }

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
      diagnostics: {
        dbEnabled: true,
        totalInDb,
        filtered: allCards.length,
      },
    })
  } catch (error) {
    console.error('Error in projects route:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch project cards',
        diagnostics: {
          dbEnabled: true,
          totalInDb: 0,
          filtered: 0,
          error: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    )
  }
}
