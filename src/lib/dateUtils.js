import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isTomorrow,
} from 'date-fns'

/**
 * Generate a 35-cell calendar grid (5 weeks × 7 days)
 * Includes days from previous and next months to fill the grid
 */
export function generateCalendarDays(date) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = []
  let currentDate = calendarStart

  // Generate up to 35 days (5 weeks)
  while (days.length < 35) {
    days.push(currentDate)
    currentDate = addDays(currentDate, 1)
  }

  return days
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date) {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Get month and year display (e.g., "February 2026")
 */
export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy')
}

/**
 * Get day number (e.g., "15")
 */
export function formatDayNumber(date) {
  return format(date, 'd')
}

/**
 * Check if date is today
 */
export function checkIsToday(date) {
  return isToday(date)
}

/**
 * Check if two dates are the same day
 */
export function checkIsSameDay(date1, date2) {
  return isSameDay(date1, date2)
}

/**
 * Check if date belongs to the given month
 */
export function checkIsSameMonth(date, monthDate) {
  return isSameMonth(date, monthDate)
}

/**
 * Format a date for the agenda view header.
 * - "Today — Friday, Feb 20" for today
 * - "Tomorrow — Saturday, Feb 21" for tomorrow
 * - "Wednesday, Feb 25" for all other dates
 */
export function formatAgendaDate(date) {
  if (isToday(date)) {
    return `Today — ${format(date, 'EEEE, MMM d')}`
  }
  if (isTomorrow(date)) {
    return `Tomorrow — ${format(date, 'EEEE, MMM d')}`
  }
  return format(date, 'EEEE, MMM d')
}
