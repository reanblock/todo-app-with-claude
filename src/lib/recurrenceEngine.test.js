import { describe, it, expect } from 'vitest'
import {
  generateInstances,
  getNextOccurrence,
  generateInstancesForRange,
  shouldRegenerateInstance,
} from './recurrenceEngine'
import { RecurrenceType } from '../types/chore'

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function makeTemplate(overrides = {}) {
  return {
    id: 'template-1',
    title: 'Take out bins',
    description: '',
    dueDate: '2026-02-01',
    completed: false,
    isTemplate: true,
    recurrence: {
      type: RecurrenceType.WEEKLY,
      startDate: '2026-02-01',
      endDate: null,
      parentId: null,
    },
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    ...overrides,
  }
}

// ------------------------------------------------------------------
// getNextOccurrence
// ------------------------------------------------------------------
describe('getNextOccurrence', () => {
  it('advances by 1 day for DAILY', () => {
    const next = getNextOccurrence(new Date(2026, 1, 10), RecurrenceType.DAILY)
    expect(next.toISOString().slice(0, 10)).toBe('2026-02-11')
  })

  it('advances by 7 days for WEEKLY', () => {
    const next = getNextOccurrence(new Date(2026, 1, 10), RecurrenceType.WEEKLY)
    expect(next.toISOString().slice(0, 10)).toBe('2026-02-17')
  })

  it('advances by 14 days for BIWEEKLY', () => {
    const next = getNextOccurrence(
      new Date(2026, 1, 10),
      RecurrenceType.BIWEEKLY
    )
    expect(next.toISOString().slice(0, 10)).toBe('2026-02-24')
  })

  it('advances by 1 month for MONTHLY', () => {
    const next = getNextOccurrence(
      new Date(2026, 1, 10),
      RecurrenceType.MONTHLY
    )
    expect(next.toISOString().slice(0, 10)).toBe('2026-03-10')
  })

  it('returns the same date for NONE (no advance)', () => {
    const date = new Date(2026, 1, 10)
    const next = getNextOccurrence(date, RecurrenceType.NONE)
    expect(next.toISOString().slice(0, 10)).toBe('2026-02-10')
  })

  it('accepts ISO string date input', () => {
    const next = getNextOccurrence('2026-02-10', RecurrenceType.WEEKLY)
    expect(next.toISOString().slice(0, 10)).toBe('2026-02-17')
  })
})

// ------------------------------------------------------------------
// generateInstances
// ------------------------------------------------------------------
describe('generateInstances', () => {
  it('generates weekly instances across a 28-day range', () => {
    const template = makeTemplate()
    const instances = generateInstances(template, '2026-02-01', '2026-02-28')
    const dates = instances.map((i) => i.dueDate)
    expect(dates).toContain('2026-02-01')
    expect(dates).toContain('2026-02-08')
    expect(dates).toContain('2026-02-15')
    expect(dates).toContain('2026-02-22')
    expect(dates).not.toContain('2026-03-01') // outside range
  })

  it('returns empty array for non-template chores', () => {
    const nonTemplate = makeTemplate({ isTemplate: false })
    const instances = generateInstances(nonTemplate, '2026-02-01', '2026-02-28')
    expect(instances).toHaveLength(0)
  })

  it('returns empty array for NONE recurrence', () => {
    const template = makeTemplate({
      recurrence: { type: RecurrenceType.NONE, startDate: '2026-02-01', endDate: null, parentId: null },
    })
    const instances = generateInstances(template, '2026-02-01', '2026-02-28')
    expect(instances).toHaveLength(0)
  })

  it('skips dates for which instances already exist', () => {
    const template = makeTemplate()
    const existingInstance = {
      id: 'existing-1',
      dueDate: '2026-02-08',
      recurrence: { parentId: 'template-1' },
    }
    const instances = generateInstances(template, '2026-02-01', '2026-02-28', [
      existingInstance,
    ])
    const dates = instances.map((i) => i.dueDate)
    expect(dates).not.toContain('2026-02-08') // already exists
    expect(dates).toContain('2026-02-15')
  })

  it('sets parentId on generated instances', () => {
    const template = makeTemplate()
    const instances = generateInstances(template, '2026-02-01', '2026-02-07')
    expect(instances[0].recurrence.parentId).toBe('template-1')
  })

  it('marks generated instances as non-templates', () => {
    const template = makeTemplate()
    const instances = generateInstances(template, '2026-02-01', '2026-02-07')
    instances.forEach((inst) => expect(inst.isTemplate).toBe(false))
  })

  it('generates daily instances correctly', () => {
    const template = makeTemplate({
      recurrence: {
        type: RecurrenceType.DAILY,
        startDate: '2026-02-01',
        endDate: null,
        parentId: null,
      },
    })
    const instances = generateInstances(template, '2026-02-01', '2026-02-05')
    const dates = instances.map((i) => i.dueDate)
    expect(dates).toEqual([
      '2026-02-01',
      '2026-02-02',
      '2026-02-03',
      '2026-02-04',
    ])
  })

  it('generates monthly instances correctly', () => {
    const template = makeTemplate({
      recurrence: {
        type: RecurrenceType.MONTHLY,
        startDate: '2026-01-15',
        endDate: null,
        parentId: null,
      },
      dueDate: '2026-01-15',
    })
    const instances = generateInstances(template, '2026-01-15', '2026-04-01')
    const dates = instances.map((i) => i.dueDate)
    expect(dates).toContain('2026-01-15')
    expect(dates).toContain('2026-02-15')
    expect(dates).toContain('2026-03-15')
    expect(dates).not.toContain('2026-04-15')
  })

  it('only generates instances within the given date range', () => {
    const template = makeTemplate({
      recurrence: {
        type: RecurrenceType.WEEKLY,
        startDate: '2026-01-01',
        endDate: null,
        parentId: null,
      },
      dueDate: '2026-01-01',
    })
    const instances = generateInstances(template, '2026-02-01', '2026-02-14')
    instances.forEach((inst) => {
      expect(inst.dueDate >= '2026-02-01').toBe(true)
      expect(inst.dueDate < '2026-02-14').toBe(true)
    })
  })
})

// ------------------------------------------------------------------
// generateInstancesForRange
// ------------------------------------------------------------------
describe('generateInstancesForRange', () => {
  it('generates instances from all qualifying templates', () => {
    const templates = [
      makeTemplate({ id: 'tmpl-1' }),
      makeTemplate({
        id: 'tmpl-2',
        title: 'Water plants',
        recurrence: {
          type: RecurrenceType.DAILY,
          startDate: '2026-02-01',
          endDate: null,
          parentId: null,
        },
      }),
    ]
    const instances = generateInstancesForRange(
      templates,
      '2026-02-01',
      '2026-02-07'
    )
    const parentIds = instances.map((i) => i.recurrence.parentId)
    expect(parentIds).toContain('tmpl-1')
    expect(parentIds).toContain('tmpl-2')
  })

  it('ignores non-template chores', () => {
    const nonTemplate = makeTemplate({ id: 'not-a-tmpl', isTemplate: false })
    const instances = generateInstancesForRange(
      [nonTemplate],
      '2026-02-01',
      '2026-02-28'
    )
    expect(instances).toHaveLength(0)
  })

  it('returns empty array when given an empty list', () => {
    const instances = generateInstancesForRange([], '2026-02-01', '2026-02-28')
    expect(instances).toHaveLength(0)
  })
})

// ------------------------------------------------------------------
// shouldRegenerateInstance
// ------------------------------------------------------------------
describe('shouldRegenerateInstance', () => {
  it('returns true when the template was updated after the instance was created', () => {
    const instance = {
      recurrence: { parentId: 'tmpl-1' },
      createdAt: '2026-02-01T10:00:00.000Z',
    }
    const template = {
      id: 'tmpl-1',
      updatedAt: '2026-02-01T12:00:00.000Z', // updated after instance creation
    }
    expect(shouldRegenerateInstance(instance, template)).toBe(true)
  })

  it('returns false when the template was updated before the instance was created', () => {
    const instance = {
      recurrence: { parentId: 'tmpl-1' },
      createdAt: '2026-02-01T12:00:00.000Z',
    }
    const template = {
      id: 'tmpl-1',
      updatedAt: '2026-02-01T10:00:00.000Z', // updated before instance creation
    }
    expect(shouldRegenerateInstance(instance, template)).toBe(false)
  })

  it('returns false when instance has no parentId', () => {
    const instance = {
      recurrence: { parentId: null },
      createdAt: '2026-02-01T10:00:00.000Z',
    }
    const template = {
      id: 'tmpl-1',
      updatedAt: '2026-02-01T12:00:00.000Z',
    }
    expect(shouldRegenerateInstance(instance, template)).toBe(false)
  })

  it('returns false when template is null', () => {
    const instance = {
      recurrence: { parentId: 'tmpl-1' },
      createdAt: '2026-02-01T10:00:00.000Z',
    }
    expect(shouldRegenerateInstance(instance, null)).toBe(false)
  })
})
