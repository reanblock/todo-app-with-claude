import { useState, useEffect, useMemo } from 'react'
import { addDays, startOfDay, parseISO } from 'date-fns'
import { useChores } from '../../contexts/ChoreContext'
import { formatDateISO } from '../../lib/dateUtils'
import AgendaDayGroup from './AgendaDayGroup'

const INITIAL_DAYS = 30
const LOAD_MORE_DAYS = 30

/**
 * Agenda list view — shows chores grouped by date, starting from today,
 * scrolling forward into the future. Only days with chores are rendered.
 */
function AgendaView({ onChoreClick, onToggleComplete }) {
  const { chores, generateForDateRange } = useChores()

  const today = useMemo(() => startOfDay(new Date()), [])
  const [visibleEndDate, setVisibleEndDate] = useState(() =>
    addDays(today, INITIAL_DAYS)
  )

  // Generate recurring instances whenever the visible range expands
  useEffect(() => {
    generateForDateRange(today, visibleEndDate)
  }, [visibleEndDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const todayISO = formatDateISO(today)
  const visibleEndISO = formatDateISO(visibleEndDate)

  /**
   * Filter chores to the visible forward-only range, sort by dueDate, then
   * group by date into an array of { dateISO, date, chores } objects.
   */
  const dayGroups = useMemo(() => {
    const filtered = chores.filter(
      (c) => c.dueDate >= todayISO && c.dueDate <= visibleEndISO
    )

    // Sort ascending by dueDate then by title for stability
    filtered.sort((a, b) => {
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1
      return a.title.localeCompare(b.title)
    })

    // Group by date
    const grouped = {}
    for (const chore of filtered) {
      if (!grouped[chore.dueDate]) {
        grouped[chore.dueDate] = []
      }
      grouped[chore.dueDate].push(chore)
    }

    // Convert to sorted array — only dates that have chores
    return Object.keys(grouped)
      .sort()
      .map((dateISO) => ({
        dateISO,
        date: parseISO(dateISO),
        chores: grouped[dateISO],
      }))
  }, [chores, todayISO, visibleEndISO])

  const handleLoadMore = () => {
    setVisibleEndDate((prev) => addDays(prev, LOAD_MORE_DAYS))
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Scrollable chore list */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {dayGroups.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {dayGroups.map(({ dateISO, date, chores: dayChores }) => (
              <AgendaDayGroup
                key={dateISO}
                date={date}
                chores={dayChores}
                onChoreClick={onChoreClick}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </>
        )}

        {/* Load more button — always shown at the bottom */}
        <div className="p-4 flex justify-center border-t border-gray-100">
          <button
            onClick={handleLoadMore}
            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Show More
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">📋</div>
      <p className="text-gray-500 text-base font-medium">No upcoming chores</p>
      <p className="text-gray-400 text-sm mt-1">
        Add a chore or click "Show More" to look further ahead.
      </p>
    </div>
  )
}

export default AgendaView
