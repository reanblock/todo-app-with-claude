/**
 * Recurrence types
 */
export const RecurrenceType = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
}

/**
 * Create a new chore with default values
 */
export function createChore(data = {}) {
  const now = new Date().toISOString()

  return {
    id: data.id || crypto.randomUUID(),
    title: data.title || '',
    description: data.description || '',
    dueDate: data.dueDate || new Date().toISOString().split('T')[0], // YYYY-MM-DD
    completed: data.completed || false,
    recurrence: {
      type: data.recurrence?.type || RecurrenceType.NONE,
      startDate: data.recurrence?.startDate || null,
      endDate: data.recurrence?.endDate || null,
      parentId: data.recurrence?.parentId || null,
    },
    isTemplate: data.isTemplate || false,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  }
}

/**
 * Validate chore data
 */
export function validateChore(chore) {
  if (!chore.title || chore.title.trim() === '') {
    return { valid: false, error: 'Title is required' }
  }

  if (!chore.dueDate) {
    return { valid: false, error: 'Due date is required' }
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(chore.dueDate)) {
    return { valid: false, error: 'Invalid date format' }
  }

  return { valid: true }
}

/**
 * Check if a chore is a recurring template
 */
export function isRecurringTemplate(chore) {
  return chore.isTemplate === true
}

/**
 * Check if a chore is a recurring instance.
 * Uses loose null check (== null) to treat both null and undefined as "not set".
 */
export function isRecurringInstance(chore) {
  return chore.recurrence?.parentId != null
}
