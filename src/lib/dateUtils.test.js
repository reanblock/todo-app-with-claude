import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { addDays, startOfDay } from 'date-fns'
import {
  generateCalendarDays,
  formatDateISO,
  formatMonthYear,
  formatDayNumber,
  checkIsToday,
  checkIsSameDay,
  checkIsSameMonth,
  formatAgendaDate,
} from './dateUtils'

// ------------------------------------------------------------------
// generateCalendarDays
// ------------------------------------------------------------------
describe('generateCalendarDays', () => {
  it('always returns exactly 35 days (5 weeks)', () => {
    const result = generateCalendarDays(new Date(2026, 1, 1)) // Feb 2026
    expect(result).toHaveLength(35)
  })

  it('starts on a Sunday (startOfWeek default)', () => {
    const result = generateCalendarDays(new Date(2026, 1, 1)) // Feb 2026
    expect(result[0].getDay()).toBe(0) // 0 = Sunday
  })

  it('covers all days of the target month', () => {
    const result = generateCalendarDays(new Date(2026, 1, 1)) // Feb 2026
    const isos = result.map((d) => d.toISOString().slice(0, 10))
    // Feb 1–28, 2026
    expect(isos).toContain('2026-02-01')
    expect(isos).toContain('2026-02-28')
  })

  it('includes padding days from previous/next months', () => {
    // Feb 2026 starts on Sunday, so the calendar starts on Feb 1 itself.
    // March 2026 starts on Sunday, so Apr padding not needed at start.
    // Just verify the array contains dates outside the month.
    const result = generateCalendarDays(new Date(2026, 2, 1)) // March 2026
    const months = [...new Set(result.map((d) => d.getMonth()))]
    expect(months.length).toBeGreaterThan(1) // spans more than one month
  })

  it('handles a month whose first day is not Sunday', () => {
    // January 2026 starts on a Thursday (day 4).
    const result = generateCalendarDays(new Date(2026, 0, 1))
    expect(result[0].getDay()).toBe(0) // always starts on Sunday
    expect(result).toHaveLength(35)
  })
})

// ------------------------------------------------------------------
// formatDateISO
// ------------------------------------------------------------------
describe('formatDateISO', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDateISO(new Date(2026, 1, 5))).toBe('2026-02-05')
  })

  it('zero-pads month and day', () => {
    expect(formatDateISO(new Date(2026, 0, 9))).toBe('2026-01-09')
  })
})

// ------------------------------------------------------------------
// formatMonthYear
// ------------------------------------------------------------------
describe('formatMonthYear', () => {
  it('returns "Month YYYY" string', () => {
    expect(formatMonthYear(new Date(2026, 1, 1))).toBe('February 2026')
  })

  it('works for December', () => {
    expect(formatMonthYear(new Date(2025, 11, 15))).toBe('December 2025')
  })
})

// ------------------------------------------------------------------
// formatDayNumber
// ------------------------------------------------------------------
describe('formatDayNumber', () => {
  it('returns day as string without leading zero', () => {
    expect(formatDayNumber(new Date(2026, 1, 5))).toBe('5')
  })

  it('returns "1" for the first day of a month', () => {
    expect(formatDayNumber(new Date(2026, 1, 1))).toBe('1')
  })

  it('returns "31" for the last day of January', () => {
    expect(formatDayNumber(new Date(2026, 0, 31))).toBe('31')
  })
})

// ------------------------------------------------------------------
// checkIsToday
// ------------------------------------------------------------------
describe('checkIsToday', () => {
  it('returns true for today', () => {
    expect(checkIsToday(new Date())).toBe(true)
  })

  it('returns false for yesterday', () => {
    const yesterday = addDays(new Date(), -1)
    expect(checkIsToday(yesterday)).toBe(false)
  })

  it('returns false for tomorrow', () => {
    const tomorrow = addDays(new Date(), 1)
    expect(checkIsToday(tomorrow)).toBe(false)
  })
})

// ------------------------------------------------------------------
// checkIsSameDay
// ------------------------------------------------------------------
describe('checkIsSameDay', () => {
  it('returns true when both dates fall on the same calendar day', () => {
    const a = new Date(2026, 1, 20, 9, 0)
    const b = new Date(2026, 1, 20, 22, 59)
    expect(checkIsSameDay(a, b)).toBe(true)
  })

  it('returns false when dates are on different days', () => {
    const a = new Date(2026, 1, 20)
    const b = new Date(2026, 1, 21)
    expect(checkIsSameDay(a, b)).toBe(false)
  })
})

// ------------------------------------------------------------------
// checkIsSameMonth
// ------------------------------------------------------------------
describe('checkIsSameMonth', () => {
  it('returns true when both dates are in the same month and year', () => {
    expect(
      checkIsSameMonth(new Date(2026, 1, 5), new Date(2026, 1, 28))
    ).toBe(true)
  })

  it('returns false when months differ', () => {
    expect(
      checkIsSameMonth(new Date(2026, 1, 5), new Date(2026, 2, 5))
    ).toBe(false)
  })

  it('returns false when same month but different year', () => {
    expect(
      checkIsSameMonth(new Date(2025, 1, 5), new Date(2026, 1, 5))
    ).toBe(false)
  })
})

// ------------------------------------------------------------------
// formatAgendaDate
// ------------------------------------------------------------------
describe('formatAgendaDate', () => {
  let realDate

  beforeEach(() => {
    // Pin "today" to a known Friday: 2026-02-20
    const fakeNow = new Date(2026, 1, 20, 12, 0, 0)
    realDate = Date
    vi.useFakeTimers()
    vi.setSystemTime(fakeNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('prefixes today\'s date with "Today —"', () => {
    const today = new Date(2026, 1, 20)
    expect(formatAgendaDate(today)).toBe('Today — Friday, Feb 20')
  })

  it('prefixes tomorrow\'s date with "Tomorrow —"', () => {
    const tomorrow = new Date(2026, 1, 21)
    expect(formatAgendaDate(tomorrow)).toBe('Tomorrow — Saturday, Feb 21')
  })

  it('formats other dates as "Weekday, Mon D"', () => {
    const future = new Date(2026, 1, 25)
    expect(formatAgendaDate(future)).toBe('Wednesday, Feb 25')
  })

  it('does not include "Today" or "Tomorrow" for past dates', () => {
    const past = new Date(2026, 1, 10)
    const result = formatAgendaDate(past)
    expect(result).not.toMatch(/Today|Tomorrow/)
    expect(result).toBe('Tuesday, Feb 10')
  })
})
