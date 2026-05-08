import { describe, it, expect } from 'vitest'
import { cardLane, filterCards, groupByLane, ALL_PROJECTS, type Card } from '../project-board'

const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: 'card-1',
  project: 'Proj A',
  status: 'In progress',
  description: '',
  priority: 'High',
  column: 'active',
  ...overrides,
})

describe('cardLane', () => {
  it('maps active → queue', () => {
    expect(cardLane('active')).toBe('queue')
  })

  it('maps in-review → queue', () => {
    expect(cardLane('in-review')).toBe('queue')
  })

  it('maps needs-you → needs-you', () => {
    expect(cardLane('needs-you')).toBe('needs-you')
  })

  it('maps done → done', () => {
    expect(cardLane('done')).toBe('done')
  })
})

describe('filterCards', () => {
  const cards: Card[] = [
    makeCard({ id: '1', project: 'Alpha' }),
    makeCard({ id: '2', project: 'Beta' }),
    makeCard({ id: '3', project: 'Alpha' }),
  ]

  it('returns all cards when ALL_PROJECTS selected', () => {
    expect(filterCards(cards, ALL_PROJECTS)).toHaveLength(3)
  })

  it('filters to matching project', () => {
    const result = filterCards(cards, 'Alpha')
    expect(result).toHaveLength(2)
    expect(result.every((c) => c.project === 'Alpha')).toBe(true)
  })

  it('returns empty array for unknown project', () => {
    expect(filterCards(cards, 'Unknown')).toHaveLength(0)
  })

  it('returns empty array when cards is empty', () => {
    expect(filterCards([], 'Alpha')).toHaveLength(0)
  })
})

describe('groupByLane', () => {
  const cards: Card[] = [
    makeCard({ id: '1', column: 'active' }),
    makeCard({ id: '2', column: 'in-review' }),
    makeCard({ id: '3', column: 'needs-you' }),
    makeCard({ id: '4', column: 'done' }),
    makeCard({ id: '5', column: 'active' }),
  ]

  it('groups active and in-review into queue', () => {
    const lanes = groupByLane(cards)
    expect(lanes.queue).toHaveLength(3)
    expect(lanes.queue.map((c) => c.id)).toEqual(['1', '2', '5'])
  })

  it('groups needs-you cards into needs-you lane', () => {
    const lanes = groupByLane(cards)
    expect(lanes['needs-you']).toHaveLength(1)
    expect(lanes['needs-you'][0].id).toBe('3')
  })

  it('groups done cards into done lane', () => {
    const lanes = groupByLane(cards)
    expect(lanes.done).toHaveLength(1)
    expect(lanes.done[0].id).toBe('4')
  })

  it('returns empty lanes when no cards', () => {
    const lanes = groupByLane([])
    expect(lanes.queue).toHaveLength(0)
    expect(lanes['needs-you']).toHaveLength(0)
    expect(lanes.done).toHaveLength(0)
  })

  it('all cards appear in exactly one lane', () => {
    const lanes = groupByLane(cards)
    const total = lanes.queue.length + lanes['needs-you'].length + lanes.done.length
    expect(total).toBe(cards.length)
  })
})
