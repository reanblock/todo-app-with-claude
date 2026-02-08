import { createContext, useContext, useState, useCallback } from 'react'
import { addMonths, subMonths, startOfMonth } from 'date-fns'

const CalendarContext = createContext()

export function CalendarProvider({ children }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }, [])

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }, [])

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date())
  }, [])

  const goToMonth = useCallback((date) => {
    setCurrentMonth(startOfMonth(date))
  }, [])

  const value = {
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToMonth,
  }

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}

/**
 * Hook to use calendar context
 */
export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider')
  }
  return context
}

export default CalendarContext
