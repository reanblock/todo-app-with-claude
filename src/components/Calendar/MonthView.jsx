import { useMemo } from 'react'
import { generateCalendarDays, formatDateISO } from '../../lib/dateUtils'
import { useChores } from '../../contexts/ChoreContext'
import DayCell from './DayCell'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MonthView({ currentMonth, onChoreClick, onToggleComplete }) {
  const calendarDays = generateCalendarDays(currentMonth)
  const { chores } = useChores()

  // Group chores by date for efficient lookup
  const choresByDate = useMemo(() => {
    const grouped = {}

    chores.forEach((chore) => {
      const date = chore.dueDate
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(chore)
    })

    return grouped
  }, [chores])

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="px-1 sm:px-2 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dateKey = formatDateISO(date)
          const dayChores = choresByDate[dateKey] || []

          return (
            <DayCell
              key={index}
              date={date}
              currentMonth={currentMonth}
              chores={dayChores}
              onChoreClick={onChoreClick}
              onToggleComplete={onToggleComplete}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MonthView
