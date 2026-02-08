import { RecurrenceType } from '../../types/chore'

const RECURRENCE_OPTIONS = [
  { value: RecurrenceType.NONE, label: 'Does not repeat' },
  { value: RecurrenceType.DAILY, label: 'Daily' },
  { value: RecurrenceType.WEEKLY, label: 'Weekly' },
  { value: RecurrenceType.BIWEEKLY, label: 'Bi-weekly (every 2 weeks)' },
  { value: RecurrenceType.MONTHLY, label: 'Monthly' },
]

function RecurrenceSelector({ value, onChange, startDate }) {
  const handleChange = (e) => {
    const type = e.target.value
    onChange({
      type,
      startDate: type !== RecurrenceType.NONE ? startDate : null,
      endDate: null,
    })
  }

  return (
    <div>
      <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
        Repeats
      </label>
      <select
        id="recurrence"
        value={value.type}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {RECURRENCE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {value.type !== RecurrenceType.NONE && (
        <p className="mt-2 text-sm text-gray-600">
          This chore will repeat {value.type} starting from {startDate}
        </p>
      )}
    </div>
  )
}

export default RecurrenceSelector
