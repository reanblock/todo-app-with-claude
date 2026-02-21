import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadData, saveData, clearData } from '../storage'

// Mock localStorage using Vitest's built-in globals (jsdom provides it,
// but we spy on it so we can assert calls and simulate errors)
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

beforeEach(() => {
  // Replace the global localStorage with our mock before each test
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
  localStorageMock.clear()
  vi.clearAllMocks()
})

describe('loadData', () => {
  it('returns default data structure when nothing is stored', () => {
    const data = loadData()
    expect(data).toMatchObject({
      version: 1,
      templates: [],
      instances: [],
      deletedInstances: [],
      settings: { weekStartsOn: 0 },
    })
  })

  it('returns parsed data when valid JSON is stored', () => {
    const stored = JSON.stringify({
      version: 1,
      templates: [{ id: 'a' }],
      instances: [],
      deletedInstances: [],
      settings: { weekStartsOn: 1 },
    })
    localStorageMock.getItem.mockReturnValueOnce(stored)
    const data = loadData()
    expect(data.templates).toHaveLength(1)
    expect(data.settings.weekStartsOn).toBe(1)
  })

  it('returns default data when stored JSON is invalid', () => {
    localStorageMock.getItem.mockReturnValueOnce('not-valid-json{{{')
    const data = loadData()
    expect(data.templates).toEqual([])
  })
})

describe('saveData', () => {
  it('serialises and stores data to localStorage', () => {
    const data = { version: 1, templates: [], instances: [], deletedInstances: [], settings: { weekStartsOn: 0 } }
    saveData(data)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'chore-app-data',
      JSON.stringify(data)
    )
  })

  it('throws a friendly error on QuotaExceededError', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      const err = new Error('quota')
      err.name = 'QuotaExceededError'
      throw err
    })
    expect(() => saveData({})).toThrow(/quota exceeded/i)
  })
})

describe('clearData', () => {
  it('removes the storage key from localStorage', () => {
    clearData()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('chore-app-data')
  })
})
