import { useState, useEffect } from 'react'
import { startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import CalendarHeader from './components/Calendar/CalendarHeader'
import MonthView from './components/Calendar/MonthView'
import AgendaView from './components/Agenda/AgendaView'
import ChoreModal from './components/Chores/ChoreModal'
import ConfirmDialog from './components/Common/ConfirmDialog'
import { useChores } from './contexts/ChoreContext'
import { useCalendar } from './contexts/CalendarContext'
import { isRecurringInstance } from './types/chore'

function App() {
  const { currentMonth, viewMode } = useCalendar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedChore, setSelectedChore] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null) // 'edit' or 'delete'

  const {
    addChore,
    updateChore,
    deleteChore,
    deleteRecurringSeries,
    updateTemplate,
    detachInstance,
    toggleComplete,
    generateForDateRange,
    templates,
  } = useChores()

  // Generate instances when month changes (calendar mode)
  useEffect(() => {
    // Generate for current month ± 1 month buffer
    const startDate = startOfMonth(subMonths(currentMonth, 1))
    const endDate = endOfMonth(addMonths(currentMonth, 1))
    generateForDateRange(startDate, endDate)
  }, [currentMonth]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddChore = () => {
    setSelectedChore(null)
    setIsModalOpen(true)
  }

  const handleChoreClick = (chore) => {
    setSelectedChore(chore)

    // Check if it's a recurring instance
    if (isRecurringInstance(chore)) {
      setConfirmAction('edit')
      setIsConfirmOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedChore(null)
  }

  const handleSubmitChore = (formData) => {
    if (selectedChore) {
      // Update existing chore
      updateChore(selectedChore.id, formData)
    } else {
      // Add new chore
      addChore(formData)
    }
  }

  const handleEditSingleOccurrence = () => {
    // Detach instance from template so it can be edited independently
    detachInstance(selectedChore.id)
    setIsModalOpen(true)
  }

  const handleEditSeries = () => {
    // Find and edit the template
    const template = templates.find((t) => t.id === selectedChore.recurrence.parentId)
    if (template) {
      setSelectedChore(template)
      setIsModalOpen(true)
    }
  }

  const handleDeleteSingleOccurrence = () => {
    deleteChore(selectedChore.id)
  }

  const handleDeleteSeries = () => {
    deleteRecurringSeries(selectedChore.recurrence.parentId)
  }

  const getConfirmDialogConfig = () => {
    if (confirmAction === 'edit') {
      return {
        title: 'Edit Recurring Chore',
        message: 'This is a recurring chore. What would you like to edit?',
        actions: [
          {
            label: 'Edit only this occurrence',
            variant: 'primary',
            onClick: handleEditSingleOccurrence,
          },
          {
            label: 'Edit all future occurrences',
            variant: 'secondary',
            onClick: handleEditSeries,
          },
        ],
      }
    } else if (confirmAction === 'delete') {
      return {
        title: 'Delete Recurring Chore',
        message: 'This is a recurring chore. What would you like to delete?',
        actions: [
          {
            label: 'Delete only this occurrence',
            variant: 'danger',
            onClick: handleDeleteSingleOccurrence,
          },
          {
            label: 'Delete all future occurrences',
            variant: 'danger',
            onClick: handleDeleteSeries,
          },
        ],
      }
    }
    return { title: '', message: '', actions: [] }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          DDDOU to do app
        </h1>

        <CalendarHeader onAddChore={handleAddChore} />

        {viewMode === 'agenda' ? (
          <AgendaView
            onChoreClick={handleChoreClick}
            onToggleComplete={toggleComplete}
          />
        ) : (
          <MonthView
            currentMonth={currentMonth}
            onChoreClick={handleChoreClick}
            onToggleComplete={toggleComplete}
          />
        )}

        <ChoreModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          chore={selectedChore}
          onSubmit={handleSubmitChore}
          onDelete={(chore) => {
            if (isRecurringInstance(chore)) {
              setConfirmAction('delete')
              setIsConfirmOpen(true)
              setIsModalOpen(false)
            } else {
              deleteChore(chore.id)
              handleCloseModal()
            }
          }}
        />

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          {...getConfirmDialogConfig()}
        />
      </div>
    </div>
  )
}

export default App
