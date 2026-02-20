import clsx from 'clsx'
import { isToday } from 'date-fns'
import { formatAgendaDate } from '../../lib/dateUtils'

/**
 * Renders a single date header + its list of chores in the agenda view.
 */
function AgendaDayGroup({ date, chores, onChoreClick, onToggleComplete }) {
  const today = isToday(date)

  return (
    <div className={clsx('border-b border-gray-100 last:border-b-0', today && 'bg-blue-50/30')}>
      {/* Date header */}
      <div
        className={clsx(
          'sticky top-0 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200 flex items-center gap-2',
          today && 'bg-blue-100/60 text-blue-800 border-blue-200'
        )}
      >
        {today && (
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
        )}
        {formatAgendaDate(date)}
      </div>

      {/* Chore items */}
      <div className="divide-y divide-gray-50">
        {chores.map((chore) => (
          <AgendaChoreItem
            key={chore.id}
            chore={chore}
            onClick={onChoreClick}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * A single chore row in the agenda list — wider and more readable than the
 * compact calendar-cell version.
 */
function AgendaChoreItem({ chore, onClick, onToggleComplete }) {
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    onToggleComplete?.(chore.id)
  }

  return (
    <div
      onClick={() => onClick?.(chore)}
      className={clsx(
        'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50',
        chore.completed && 'opacity-70'
      )}
    >
      {/* Completion checkbox */}
      <input
        type="checkbox"
        checked={chore.completed}
        onChange={handleCheckboxClick}
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0"
      />

      {/* Left accent bar for today */}
      <div className="flex-1 min-w-0">
        <div
          className={clsx(
            'font-medium text-sm',
            chore.completed ? 'line-through text-gray-400' : 'text-gray-900'
          )}
        >
          {chore.title}
        </div>
        {chore.description && (
          <div className="text-xs text-gray-500 mt-0.5 truncate">
            {chore.description}
          </div>
        )}
      </div>

      {/* Completion badge */}
      {chore.completed && (
        <span className="text-xs text-green-600 font-medium flex-shrink-0 mt-0.5">
          Done
        </span>
      )}
    </div>
  )
}

export default AgendaDayGroup
