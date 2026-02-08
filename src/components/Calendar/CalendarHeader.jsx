import { formatMonthYear } from '../../lib/dateUtils'
import { useCalendar } from '../../contexts/CalendarContext'
import { exportBackup } from '../../lib/storage'
import Button from '../Common/Button'

function CalendarHeader({ onAddChore }) {
  const { currentMonth, goToPreviousMonth, goToNextMonth, goToToday } = useCalendar()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {formatMonthYear(currentMonth)}
        </h2>

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
