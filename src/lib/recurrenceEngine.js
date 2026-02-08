import {
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { formatDateISO } from './dateUtils'
import { RecurrenceType } from '../types/chore'

/**
 * Generate chore instances from a recurring template within a date range
 */
export function generateInstances(template, startDate, endDate, existingInstances = []) {
  if (!template.isTemplate || template.recurrence.type === RecurrenceType.NONE) {
    return []
  }

  const instances = []
  const recurrenceStartDate = parseISO(template.recurrence.startDate || template.dueDate)
  const rangeStart = parseISO(startDate)
  const rangeEnd = parseISO(endDate)

  // Start generating from recurrence start date
  let currentDate = startOfDay(recurrenceStartDate)

  // Limit to prevent infinite loops (max 500 instances)
  let count = 0
  const MAX_INSTANCES = 500

  while (isBefore(currentDate, rangeEnd) && count < MAX_INSTANCES) {
    // Only include if within range
    if (!isBefore(currentDate, rangeStart)) {
      const dateString = formatDateISO(currentDate)

      // Check if instance already exists for this date
      const existingInstance = existingInstances.find(
        (inst) =>
          inst.recurrence?.parentId === template.id && inst.dueDate === dateString
      )

      if (!existingInstance) {
        // Create new instance
        instances.push({
          id: crypto.randomUUID(),
          title: template.title,
          description: template.description,
          dueDate: dateString,
          completed: false,
          recurrence: {
            type: RecurrenceType.NONE, // Instances don't have recurrence type
            startDate: null,
            endDate: null,
            parentId: template.id,
          },
          isTemplate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }

    // Move to next occurrence
    currentDate = getNextOccurrence(currentDate, template.recurrence.type)
    count++
  }

  return instances
}

/**
 * Calculate the next occurrence date based on recurrence type
 */
export function getNextOccurrence(date, recurrenceType) {
  const current = parseISO(typeof date === 'string' ? date : formatDateISO(date))

  switch (recurrenceType) {
    case RecurrenceType.DAILY:
      return addDays(current, 1)
    case RecurrenceType.WEEKLY:
      return addWeeks(current, 1)
    case RecurrenceType.BIWEEKLY:
      return addWeeks(current, 2)
    case RecurrenceType.MONTHLY:
      return addMonths(current, 1)
    default:
      return current
  }
}

/**
 * Generate instances for all templates within a date range
 */
export function generateInstancesForRange(templates, startDate, endDate, existingInstances = []) {
  const allInstances = []

  templates.forEach((template) => {
    if (template.isTemplate && template.recurrence.type !== RecurrenceType.NONE) {
      const newInstances = generateInstances(template, startDate, endDate, existingInstances)
      allInstances.push(...newInstances)
    }
  })

  return allInstances
}

/**
 * Check if a chore instance should be regenerated from its template
 */
export function shouldRegenerateInstance(instance, template) {
  if (!instance.recurrence?.parentId || !template) {
    return false
  }

  // Check if template has been updated after instance creation
  return new Date(template.updatedAt) > new Date(instance.createdAt)
}
