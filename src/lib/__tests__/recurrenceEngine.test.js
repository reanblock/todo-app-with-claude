import { describe, it, expect } from 'vitest'
import {
  getNextOccurrence,
  generateInstances,
  generateInstancesForRange,
  shouldRegenerateInstance,
} from '../recurrenceEngine'
import { RecurrenceType } from '../../types/chore'

// Helper: build a minimal recurring template
function makeTemplate(overrides = {}) {
  return {
    id: 'template-1',
    title: 'Clean Kitchen',
    description: '',
    dueDate: '2026-02-01',
    completed: false,
    recurrence: {
      type: RecurrenceType.DAILY,
      startDate: '2026-02-01',
      endDate: null,
      parentId: null,
    },
    isTemplate: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('getNextOccurrence', () => {
  const baseDate = new Date(2026, 1, 1) // Feb 1, 2026

  it('advances by 1 day for DAILY recurrence', () => {
    const next = getNextOccurrence(baseDate, RecurrenceType.DAILY)
    expect(next.getDate()).toBe(2)
    expect(next.getMonth()).toBe(1) // February
  })

  it('advances by 7 days for WEEKLY recurrence', () => {
    const next = getNextOccurrence(baseDate, RecurrenceType.WEEKLY)
    expect(next.getDate()).toBe(8)
    expect(next.getMonth()).toBe(1)
  })

  it('advances by 14 days for BIWEEKLY recurrence', () => {
    const next = getNextOccurrence(baseDate, RecurrenceType.BIWEEKLY)
    expect(next.getDate()).toBe(15)
    expect(next.getMonth()).toBe(1)
  })

  it('advances by 1 month for MONTHLY recurrence', () => {
    const next = getNextOccurrence(baseDate, RecurrenceType.MONTHLY)
    expect(next.getMonth()).toBe(2) // March
    expect(next.getDate()).toBe(1)
  })

  it('returns same date for unknown recurrence type', () => {
    const next = getNextOccurrence(baseDate, RecurrenceType.NONE)
    expect(next.getDate()).toBe(baseDate.getDate())
    expect(next.getMonth()).toBe(baseDate.getMonth())
  })
})

describe('generateInstances', () => {
  it('returns empty array for a non-template chore', () => {
    const nonTemplate = makeTemplate({ isTemplate: false })
    const result = generateInstances(nonTemplate, '2026-02-01', '2026-02-07')
    expect(result).toHaveLength(0)
  })

  it('returns empty array for a NONE recurrence template', () => {
    const template = makeTemplate({
      recurrence: { type: RecurrenceType.NONE, startDate: '2026-02-01', endDate: null, parentId: null },
    })
    const result = generateInstances(template, '2026-02-01', '2026-02-07')
    expect(result).toHaveLength(0)
  })

  it('generates daily instances for a one-week range', () => {
    const template = makeTemplate() // DAILY starting Feb 1
    const instances = generateInstances(template, '2026-02-01', '2026-02-08')
    // Feb 1 through Feb 7 = 7 days
    expect(instances).toHaveLength(7)
    expect(instances[0].dueDate).toBe('2026-02-01')
    expect(instances[6].dueDate).toBe('2026-02-07')
  })

  it('skips dates where an existing instance already exists', () => {
    const template = makeTemplate() // DAILY starting Feb 1
    const existingInstance = {
      dueDate: '2026-02-03',
      recurrence: { parentId: 'template-1' },
    }
    const instances = generateInstances(template, '2026-02-01', '2026-02-08', [existingInstance])
    // Should be 6 instead of 7 (Feb 3 skipped)
    expect(instances).toHaveLength(6)
    const dueDates = instances.map((i) => i.dueDate)
    expect(dueDates).not.toContain('2026-02-03')
  })

  it('sets correct fields on generated instances', () => {
    const template = makeTemplate()
    const [instance] = generateInstances(template, '2026-02-01', '2026-02-02')
    expect(instance.title).toBe('Clean Kitchen')
    expect(instance.isTemplate).toBe(false)
    expect(instance.recurrence.parentId).toBe('template-1')
    expect(instance.recurrence.type).toBe(RecurrenceType.NONE)
    expect(instance.completed).toBe(false)
  })
})

describe('generateInstancesForRange', () => {
  it('processes multiple templates and combines results', () => {
    const daily = makeTemplate({ id: 'tmpl-1', recurrence: { type: RecurrenceType.DAILY, startDate: '2026-02-01', endDate: null, parentId: null } })
    const weekly = makeTemplate({ id: 'tmpl-2', recurrence: { type: RecurrenceType.WEEKLY, startDate: '2026-02-01', endDate: null, parentId: null } })
    const result = generateInstancesForRange([daily, weekly], '2026-02-01', '2026-02-08')
    // daily → 7, weekly → 1
    expect(result).toHaveLength(8)
  })

  it('ignores non-template items in the list', () => {
    const nonTemplate = makeTemplate({ isTemplate: false })
    const result = generateInstancesForRange([nonTemplate], '2026-02-01', '2026-02-08')
    expect(result).toHaveLength(0)
  })
})

describe('shouldRegenerateInstance', () => {
  it('returns false when instance has no parentId', () => {
    const instance = { recurrence: { parentId: null }, createdAt: '2026-01-01T00:00:00.000Z' }
    const template = makeTemplate()
    expect(shouldRegenerateInstance(instance, template)).toBe(false)
  })

  it('returns false when template is null', () => {
    const instance = { recurrence: { parentId: 'template-1' }, createdAt: '2026-01-01T00:00:00.000Z' }
    expect(shouldRegenerateInstance(instance, null)).toBe(false)
  })

  it('returns true when template was updated after instance creation', () => {
    const instance = { recurrence: { parentId: 'template-1' }, createdAt: '2026-01-01T00:00:00.000Z' }
    const template = makeTemplate({ updatedAt: '2026-01-02T00:00:00.000Z' }) // updated after instance
    expect(shouldRegenerateInstance(instance, template)).toBe(true)
  })

  it('returns false when instance was created after the last template update', () => {
    const instance = { recurrence: { parentId: 'template-1' }, createdAt: '2026-01-10T00:00:00.000Z' }
    const template = makeTemplate({ updatedAt: '2026-01-01T00:00:00.000Z' }) // older than instance
    expect(shouldRegenerateInstance(instance, template)).toBe(false)
  })
})
