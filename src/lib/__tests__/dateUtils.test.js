import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateCalendarDays,
  formatDateISO,
  formatMonthYear,
  formatDayNumber,
  checkIsToday,
  checkIsSameDay,
  checkIsSameMonth,
  formatAgendaDate,
} from '../dateUtils'

describe('formatDateISO', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date(2026, 1, 21) // Feb 21, 2026
    expect(formatDateISO(date)).toBe('2026-02-21')
  })

  it('zero-pads month and day', () => {
    const date = new Date(2026, 0, 5) // Jan 5, 2026
    expect(formatDateISO(date)).toBe('2026-01-05')
  })
})

describe('formatMonthYear', () => {
  it('returns full month name and year', () => {
    const date = new Date(2026, 1, 1) // Feb 2026
    expect(formatMonthYear(date)).toBe('February 2026')
  })

  it('works for December', () => {
    const date = new Date(2025, 11, 15) // Dec 2025
    expect(formatMonthYear(date)).toBe('December 2025')
  })
})

describe('formatDayNumber', () => {
  it('returns day number without zero-padding', () => {
    const date = new Date(2026, 1, 5) // Feb 5
    expect(formatDayNumber(date)).toBe('5')
  })

  it('returns double-digit day correctly', () => {
    const date = new Date(2026, 1, 21) // Feb 21
    expect(formatDayNumber(date)).toBe('21')
  })
})

describe('generateCalendarDays', () => {
  it('always returns exactly 35 days', () => {
    const date = new Date(2026, 1, 1) // February 2026
    const days = generateCalendarDays(date)
    expect(days).toHaveLength(35)
  })

  it('starts the grid on a Sunday (start of week)', () => {
    const date = new Date(2026, 1, 1) // February 2026 — Feb 1 is a Sunday
    const days = generateCalendarDays(date)
    expect(days[0].getDay()).toBe(0) // 0 = Sunday
  })

  it('includes days from adjacent months to fill the grid', () => {
    const date = new Date(2026, 1, 1) // February 2026
    const days = generateCalendarDays(date)
    // The grid spans beyond Feb 28 — last cell should be in March
    const lastDay = days[days.length - 1]
    // Feb 2026 ends on Sat the 28th; with 35 cells from Feb 1, last cell is Mar 7
    expect(lastDay.getMonth()).toBe(2) // March (0-indexed)
  })
})

describe('checkIsSameDay', () => {
  it('returns true for two dates on the same day', () => {
    const a = new Date(2026, 1, 21, 8, 0)
    const b = new Date(2026, 1, 21, 23, 59)
    expect(checkIsSameDay(a, b)).toBe(true)
  })

  it('returns false for dates on different days', () => {
    const a = new Date(2026, 1, 21)
    const b = new Date(2026, 1, 22)
    expect(checkIsSameDay(a, b)).toBe(false)
  })
})

describe('checkIsSameMonth', () => {
  it('returns true for dates in the same month', () => {
    const a = new Date(2026, 1, 5)
    const b = new Date(2026, 1, 28)
    expect(checkIsSameMonth(a, b)).toBe(true)
  })

  it('returns false for dates in different months', () => {
    const a = new Date(2026, 1, 28)
    const b = new Date(2026, 2, 1)
    expect(checkIsSameMonth(a, b)).toBe(false)
  })
})

describe('checkIsToday', () => {
  it('returns true for today', () => {
    expect(checkIsToday(new Date())).toBe(true)
  })

  it('returns false for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(checkIsToday(yesterday)).toBe(false)
  })
})

describe('formatAgendaDate', () => {
  it('prefixes "Today —" for today\'s date', () => {
    const today = new Date()
    const result = formatAgendaDate(today)
    expect(result).toMatch(/^Today —/)
  })

  it('prefixes "Tomorrow —" for tomorrow\'s date', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const result = formatAgendaDate(tomorrow)
    expect(result).toMatch(/^Tomorrow —/)
  })

  it('formats a regular date without prefix', () => {
    const date = new Date(2026, 5, 15) // June 15, 2026 (neither today nor tomorrow)
    const result = formatAgendaDate(date)
    expect(result).not.toMatch(/^Today/)
    expect(result).not.toMatch(/^Tomorrow/)
    expect(result).toContain('Jun 15')
  })
})
