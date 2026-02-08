const STORAGE_KEY = 'chore-app-data'
const CURRENT_VERSION = 1

/**
 * Initial/default storage structure
 */
function getDefaultData() {
  return {
    version: CURRENT_VERSION,
    templates: [],
    instances: [],
    deletedInstances: [],
    settings: {
      weekStartsOn: 0, // 0 = Sunday, 1 = Monday
    },
  }
}

/**
 * Load data from localStorage with migration support
 */
export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return getDefaultData()
    }

    let data = JSON.parse(stored)

    // Run migrations if needed
    if (!data.version || data.version < CURRENT_VERSION) {
      data = runMigrations(data)
    }

    return data
  } catch (error) {
    console.error('Error loading data from localStorage:', error)
    return getDefaultData()
  }
}

/**
 * Save data to localStorage
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving data to localStorage:', error)

    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some old chores.')
    }

    throw error
  }
}

/**
 * Run migration chain
 */
function runMigrations(data) {
  let migratedData = { ...data }

  // Migration v0 -> v1: Initial schema
  if (!migratedData.version || migratedData.version < 1) {
    migratedData = migrateV0toV1(migratedData)
  }

  return migratedData
}

/**
 * Migration v0 -> v1: Set up initial schema structure
 */
function migrateV0toV1(data) {
  return {
    version: 1,
    templates: data.templates || [],
    instances: data.instances || data.chores || [],
    deletedInstances: data.deletedInstances || [],
    settings: data.settings || { weekStartsOn: 0 },
  }
}

/**
 * Export data as JSON file
 */
export function exportBackup() {
  try {
    const data = loadData()
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `chore-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting backup:', error)
    throw error
  }
}

/**
 * Import data from JSON file
 */
export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)

        // Basic validation
        if (!imported || typeof imported !== 'object') {
          throw new Error('Invalid backup file format')
        }

        // Run migrations on imported data if needed
        const migratedData = runMigrations(imported)

        // Save imported data
        saveData(migratedData)
        resolve(migratedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

/**
 * Clear all data (for testing or reset)
 */
export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}
