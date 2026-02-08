import clsx from 'clsx'
import { formatDayNumber, checkIsToday, checkIsSameMonth } from '../../lib/dateUtils'
import ChoreItem from './ChoreItem'

function DayCell({ date, currentMonth, chores = [], onChoreClick, onToggleComplete }) {
  const isToday = checkIsToday(date)
  const isSameMonth = checkIsSameMonth(date, currentMonth)
  const dayNumber = formatDayNumber(date)

  // Show max 3 chores, with overflow indicator
  const visibleChores = chores.slice(0, 3)
  const remainingCount = chores.length - visibleChores.length

  return (
    <div
      className={clsx(
        'min-h-20 sm:min-h-24 border border-gray-200 p-1 sm:p-2 bg-white',
        !isSameMonth && 'bg-gray-50 text-gray-400',
        isToday && 'bg-blue-50 border-blue-300'
      )}
    >
      <div
        className={clsx(
          'text-xs sm:text-sm font-medium mb-1',
          isToday && 'text-blue-600 font-bold',
          !isSameMonth && 'text-gray-400'
        )}
      >
        {dayNumber}
      </div>

      {/* Render chores */}
      <div className="space-y-1">
        {visibleChores.map((chore) => (
          <ChoreItem
            key={chore.id}
            chore={chore}
            onClick={onChoreClick}
            onToggleComplete={onToggleComplete}
          />
        ))}

        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 px-2">
            +{remainingCount} more
          </div>
        )}
      </div>
    </div>
  )
}

export default DayCell
