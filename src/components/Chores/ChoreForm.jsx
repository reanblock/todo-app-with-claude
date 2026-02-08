import { useState, useEffect } from 'react'
import Button from '../Common/Button'
import RecurrenceSelector from './RecurrenceSelector'
import { RecurrenceType } from '../../types/chore'

function ChoreForm({ chore, onSubmit, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: {
      type: RecurrenceType.NONE,
      startDate: null,
      endDate: null,
    },
  })

  const [errors, setErrors] = useState({})

  // Populate form when editing existing chore
  useEffect(() => {
    if (chore) {
      setFormData({
        title: chore.title || '',
        description: chore.description || '',
        dueDate: chore.dueDate || new Date().toISOString().split('T')[0],
        recurrence: chore.recurrence || {
          type: RecurrenceType.NONE,
          startDate: null,
          endDate: null,
        },
      })
    }
  }, [chore])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRecurrenceChange = (recurrence) => {
    setFormData((prev) => ({
      ...prev,
      recurrence,
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit({
      ...formData,
      id: chore?.id, // Include ID if editing
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Clean kitchen"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date *
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional details about this chore"
        />
      </div>

      {/* Recurrence */}
      <RecurrenceSelector
        value={formData.recurrence}
        onChange={handleRecurrenceChange}
        startDate={formData.dueDate}
      />

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <div>
          {onDelete && (
            <Button type="button" variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {chore ? 'Update' : 'Add'} Chore
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ChoreForm
