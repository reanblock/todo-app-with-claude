import { formatMonthYear } from '../../lib/dateUtils'
import { useCalendar } from '../../contexts/CalendarContext'
import { exportBackup } from '../../lib/storage'
import Button from '../Common/Button'

function CalendarHeader({ onAddChore }) {
  const {
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    viewMode,
    setViewMode,
  } = useCalendar()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Month title — only shown in calendar mode */}
        {viewMode === 'calendar' && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatMonthYear(currentMonth)}
          </h2>
        )}

        {/* Agenda mode title */}
        {viewMode === 'agenda' && (
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Upcoming Chores
          </h2>
        )}

        {/* Month nav buttons — only shown in calendar mode */}
        {viewMode === 'calendar' && (
          <div className="flex gap-2">
            <Button onClick={goToPreviousMonth} variant="secondary" size="sm">
              <span className="hidden sm:inline">←</span> Prev
            </Button>
            <Button onClick={goToToday} variant="secondary" size="sm">
              Today
            </Button>
            <Button onClick={goToNextMonth} variant="secondary" size="sm">
              Next <span className="hidden sm:inline">→</span>
            </Button>
          </div>
        )}

        {/* View mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 ${
              viewMode === 'agenda'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Agenda
          </button>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Button onClick={exportBackup} variant="secondary" className="w-full sm:w-auto">
          Export JSON
        </Button>
        <Button onClick={onAddChore} variant="primary" className="w-full sm:w-auto">
          + Add Chore
        </Button>
      </div>
    </div>
  )
}

export default CalendarHeader
