import { describe, it, expect } from 'vitest'
import {
  RecurrenceType,
  createChore,
  validateChore,
  isRecurringTemplate,
  isRecurringInstance,
} from './chore'

// ------------------------------------------------------------------
// RecurrenceType
// ------------------------------------------------------------------
describe('RecurrenceType', () => {
  it('has the expected constant values', () => {
    expect(RecurrenceType.NONE).toBe('none')
    expect(RecurrenceType.DAILY).toBe('daily')
    expect(RecurrenceType.WEEKLY).toBe('weekly')
    expect(RecurrenceType.BIWEEKLY).toBe('biweekly')
    expect(RecurrenceType.MONTHLY).toBe('monthly')
  })
})

// ------------------------------------------------------------------
// createChore
// ------------------------------------------------------------------
describe('createChore', () => {
  it('creates a chore with sensible defaults when called with no args', () => {
    const chore = createChore()
    expect(chore.id).toBeDefined()
    expect(chore.title).toBe('')
    expect(chore.description).toBe('')
    expect(chore.completed).toBe(false)
    expect(chore.isTemplate).toBe(false)
    expect(chore.recurrence.type).toBe(RecurrenceType.NONE)
    expect(chore.recurrence.startDate).toBeNull()
    expect(chore.recurrence.endDate).toBeNull()
    expect(chore.recurrence.parentId).toBeNull()
    expect(chore.createdAt).toBeDefined()
    expect(chore.updatedAt).toBeDefined()
  })

  it('uses the provided title, description, and dueDate', () => {
    const chore = createChore({
      title: 'Mop floors',
      description: 'Use the big mop',
      dueDate: '2026-03-15',
    })
    expect(chore.title).toBe('Mop floors')
    expect(chore.description).toBe('Use the big mop')
    expect(chore.dueDate).toBe('2026-03-15')
  })

  it('respects the provided id rather than generating a new one', () => {
    const chore = createChore({ id: 'custom-id-123' })
    expect(chore.id).toBe('custom-id-123')
  })

  it('sets completed correctly when provided', () => {
    const chore = createChore({ completed: true })
    expect(chore.completed).toBe(true)
  })

  it('sets isTemplate correctly when provided', () => {
    const chore = createChore({ isTemplate: true })
    expect(chore.isTemplate).toBe(true)
  })

  it('merges recurrence fields from provided data', () => {
    const chore = createChore({
      recurrence: {
        type: RecurrenceType.WEEKLY,
        startDate: '2026-02-01',
        endDate: null,
        parentId: 'parent-id',
      },
    })
    expect(chore.recurrence.type).toBe(RecurrenceType.WEEKLY)
    expect(chore.recurrence.startDate).toBe('2026-02-01')
    expect(chore.recurrence.parentId).toBe('parent-id')
  })

  it('generates unique ids on successive calls', () => {
    const a = createChore()
    const b = createChore()
    expect(a.id).not.toBe(b.id)
  })

  it('defaults dueDate to today in YYYY-MM-DD format', () => {
    const chore = createChore()
    const todayISO = new Date().toISOString().split('T')[0]
    expect(chore.dueDate).toBe(todayISO)
  })
})

// ------------------------------------------------------------------
// validateChore
// ------------------------------------------------------------------
describe('validateChore', () => {
  function makeValidChore(overrides = {}) {
    return {
      title: 'Clean kitchen',
      dueDate: '2026-03-01',
      ...overrides,
    }
  }

  it('returns valid: true for a well-formed chore', () => {
    const result = validateChore(makeValidChore())
    expect(result.valid).toBe(true)
  })

  it('returns invalid when title is missing', () => {
    const result = validateChore(makeValidChore({ title: '' }))
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/title/i)
  })

  it('returns invalid when title is only whitespace', () => {
    const result = validateChore(makeValidChore({ title: '   ' }))
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/title/i)
  })

  it('returns invalid when dueDate is missing', () => {
    const result = validateChore(makeValidChore({ dueDate: '' }))
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/date/i)
  })

  it('returns invalid when dueDate does not match YYYY-MM-DD', () => {
    const result = validateChore(makeValidChore({ dueDate: '03/01/2026' }))
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/invalid date format/i)
  })

  it('returns invalid for ISO datetime strings (not just a date)', () => {
    const result = validateChore(
      makeValidChore({ dueDate: '2026-03-01T00:00:00.000Z' })
    )
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/invalid date format/i)
  })
})

// ------------------------------------------------------------------
// isRecurringTemplate
// ------------------------------------------------------------------
describe('isRecurringTemplate', () => {
  it('returns true when isTemplate is true', () => {
    expect(isRecurringTemplate({ isTemplate: true })).toBe(true)
  })

  it('returns false when isTemplate is false', () => {
    expect(isRecurringTemplate({ isTemplate: false })).toBe(false)
  })

  it('returns false when isTemplate is undefined', () => {
    expect(isRecurringTemplate({})).toBe(false)
  })
})

// ------------------------------------------------------------------
// isRecurringInstance
// ------------------------------------------------------------------
describe('isRecurringInstance', () => {
  it('returns true when recurrence.parentId is set', () => {
    expect(
      isRecurringInstance({ recurrence: { parentId: 'some-parent-id' } })
    ).toBe(true)
  })

  it('returns false when recurrence.parentId is null', () => {
    expect(isRecurringInstance({ recurrence: { parentId: null } })).toBe(false)
  })

  it('returns false when recurrence is not present', () => {
    expect(isRecurringInstance({})).toBe(false)
  })
})
