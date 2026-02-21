import { describe, it, expect } from 'vitest'
import {
  RecurrenceType,
  createChore,
  validateChore,
  isRecurringTemplate,
  isRecurringInstance,
} from '../chore'

describe('createChore', () => {
  it('creates a chore with default values when no data provided', () => {
    const chore = createChore()
    expect(chore.title).toBe('')
    expect(chore.completed).toBe(false)
    expect(chore.isTemplate).toBe(false)
    expect(chore.recurrence.type).toBe(RecurrenceType.NONE)
    expect(chore.recurrence.parentId).toBeNull()
    expect(chore.id).toBeTruthy()
    expect(chore.createdAt).toBeTruthy()
  })

  it('applies provided data over defaults', () => {
    const chore = createChore({ title: 'Vacuum', completed: true, isTemplate: true })
    expect(chore.title).toBe('Vacuum')
    expect(chore.completed).toBe(true)
    expect(chore.isTemplate).toBe(true)
  })

  it('preserves recurrence fields from provided data', () => {
    const chore = createChore({
      recurrence: {
        type: RecurrenceType.WEEKLY,
        startDate: '2026-02-01',
        endDate: null,
        parentId: 'parent-123',
      },
    })
    expect(chore.recurrence.type).toBe(RecurrenceType.WEEKLY)
    expect(chore.recurrence.parentId).toBe('parent-123')
  })
})

describe('validateChore', () => {
  it('returns valid for a correctly formed chore', () => {
    const chore = createChore({ title: 'Clean sink', dueDate: '2026-03-01' })
    expect(validateChore(chore)).toEqual({ valid: true })
  })

  it('returns invalid when title is empty', () => {
    const chore = createChore({ title: '', dueDate: '2026-03-01' })
    const result = validateChore(chore)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/title/i)
  })

  it('returns invalid when title is only whitespace', () => {
    const chore = createChore({ title: '   ', dueDate: '2026-03-01' })
    const result = validateChore(chore)
    expect(result.valid).toBe(false)
  })

  it('returns invalid when dueDate is missing', () => {
    const chore = { title: 'Mop floor', dueDate: '' }
    const result = validateChore(chore)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/date/i)
  })

  it('returns invalid for a malformed date string', () => {
    const chore = createChore({ title: 'Dust shelves', dueDate: '21-02-2026' })
    const result = validateChore(chore)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/invalid date/i)
  })
})

describe('isRecurringTemplate', () => {
  it('returns true when isTemplate is true', () => {
    const chore = createChore({ isTemplate: true })
    expect(isRecurringTemplate(chore)).toBe(true)
  })

  it('returns false when isTemplate is false', () => {
    const chore = createChore({ isTemplate: false })
    expect(isRecurringTemplate(chore)).toBe(false)
  })
})

describe('isRecurringInstance', () => {
  it('returns true when recurrence.parentId is set', () => {
    const chore = createChore({ recurrence: { type: RecurrenceType.NONE, startDate: null, endDate: null, parentId: 'tmpl-1' } })
    expect(isRecurringInstance(chore)).toBe(true)
  })

  it('returns false when recurrence.parentId is null', () => {
    const chore = createChore()
    expect(isRecurringInstance(chore)).toBe(false)
  })
})
