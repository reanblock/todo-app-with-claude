# Architectural Patterns

This document details the architectural patterns and conventions used throughout the codebase.

## State Management Pattern

### Context API with Provider Pattern
Global state is managed using React Context API with provider components.

**Implementation:**
- `ChoreProvider` wraps the app and provides chore-related state/operations (contexts/ChoreContext.jsx:10-225)
- `CalendarProvider` manages calendar navigation state (contexts/CalendarContext.jsx:6-38)
- Providers are nested in main.jsx:8-15 (CalendarProvider → ChoreProvider → App)

**Access Pattern:**
- Custom hooks (`useChores`, `useCalendar`) provide type-safe access to context
- Hooks throw errors if used outside their provider (contexts/ChoreContext.jsx:230-236)

### State Updates
- All state updates use immutable patterns with `.map()`, `.filter()`, `.spread` operators
- Updates triggered via `useCallback` hooks to prevent unnecessary re-renders (contexts/ChoreContext.jsx:43-204)
- State persists to localStorage automatically via `useEffect` (contexts/ChoreContext.jsx:31-38)

## Template-Instance Pattern

Recurring chores use a **template-instance architecture** to handle recurrence efficiently.

**Templates:**
- Stored in `templates` array with `isTemplate: true` flag (types/chore.js:30)
- Define the base properties and recurrence rules
- Each template has a unique ID used as `parentId` for instances

**Instances:**
- Generated on-demand when navigating to a date range (lib/recurrenceEngine.js:17-72)
- Store concrete occurrences with `recurrence.parentId` pointing to template
- Can be "detached" from template to become one-off chores (contexts/ChoreContext.jsx:154-172)

**Generation Strategy:**
- Instances generated for ±1 month buffer around current month (App.jsx:31-36)
- Deduplication: checks if instance already exists before creating (lib/recurrenceEngine.js:40-44)
- Max 500 instances per template to prevent infinite loops (lib/recurrenceEngine.js:32)

## Component Organization

### Domain-Driven Structure
Components organized by feature domain rather than type:
```
/components
  /Calendar   - Calendar-specific components (grid, cells, navigation)
  /Chores     - Chore management (forms, modals, selectors)
  /Common     - Shared/reusable components (buttons, modals, dialogs)
```

### Component Patterns

**Composition over Configuration:**
- Small, focused components with single responsibility
- Higher-order components wrap lower-level ones (e.g., ChoreModal wraps Modal)
- Props drilling avoided via context hooks

**Variant-Based Styling:**
- Components use `variant` and `size` props for styling variations
- Example: Button component (components/Common/Button.jsx:13-26)
- Variants map to Tailwind class strings, selected via object lookup

**Controlled Components:**
- Form components are controlled via parent state
- ChoreForm receives values and onChange callbacks (components/Chores/ChoreForm.jsx)

## Data Layer Patterns

### Factory Functions
Pure functions create and validate data objects:
- `createChore(data)` - Creates chore with defaults and UUID (types/chore.js:15-34)
- `validateChore(chore)` - Validates required fields and formats (types/chore.js:39-55)

### Type Guards
Helper functions for type checking:
- `isRecurringTemplate(chore)` - Checks `isTemplate` flag (types/chore.js:60-62)
- `isRecurringInstance(chore)` - Checks for `parentId` (types/chore.js:67-69)

### Date Handling
- All dates stored as ISO 8601 strings (YYYY-MM-DD format)
- `date-fns` library for all date manipulation
- Centralized date formatting in lib/dateUtils.js
- Timezone-agnostic: all operations use `startOfDay()` to normalize

## Storage Architecture

### Schema Versioning
localStorage uses versioned schema with migration support:
```javascript
{
  version: 1,
  templates: [],
  instances: [],
  deletedInstances: [],
  settings: { weekStartsOn: 0 }
}
```

**Migration Pattern:**
- Version checked on load (lib/storage.js:33-35)
- Migration chain runs if version < CURRENT_VERSION (lib/storage.js:64-73)
- Each migration function handles v(n) → v(n+1) transformation

### Persistence Strategy
- Auto-save: Every state change persists to localStorage (contexts/ChoreContext.jsx:31-38)
- Error handling for quota exceeded (lib/storage.js:53-55)
- Backup/restore functions available (lib/storage.js:91-141)

## Custom Hooks Pattern

### Encapsulation
Custom hooks encapsulate reusable logic:
- `useLocalStorage` - Generic localStorage sync (hooks/useLocalStorage.js:6-35)
- `useChores` - Access chore operations from context (contexts/ChoreContext.jsx:230-236)
- `useCalendar` - Access calendar navigation (contexts/CalendarContext.jsx:43-49)

### Hook Composition
- Hooks can compose other hooks internally
- ChoreContext uses `useCallback` to memoize functions
- CalendarContext uses `useCallback` for navigation handlers

## UI Patterns

### Conditional Styling with clsx
Tailwind classes composed conditionally using `clsx`:
```javascript
clsx(
  baseStyles,
  variants[variant],
  disabled && 'cursor-not-allowed opacity-50'
)
```
See: components/Common/Button.jsx:32-38

### Modal State Management
Modals controlled via boolean state flags:
- Parent component manages `isOpen` state
- Modal component receives `onClose` callback
- Confirmation dialogs use action objects with callbacks (App.jsx:93-130)

### Event Handler Patterns
- Event handlers prefixed with `handle` (e.g., `handleAddChore`)
- Async operations use async/await (not callbacks)
- Event handlers defined in parent, passed as props to children

## Business Logic Separation

### Lib Directory
Pure business logic separated from React components:
- **recurrenceEngine.js** - Recurring chore generation algorithm
- **storage.js** - localStorage abstraction and migrations
- **dateUtils.js** - Date formatting and manipulation helpers

**Benefits:**
- Easier to test (no React dependencies)
- Reusable across components
- Clear separation of concerns

### Validation at Boundaries
- Input validation happens at form submission (types/chore.js:39-55)
- Storage operations wrapped in try/catch (lib/storage.js:22-42)
- Error messages propagated to UI layer

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `ChoreModal.jsx`)
- Utilities: camelCase (e.g., `dateUtils.js`)
- Contexts: PascalCase with Context suffix (e.g., `ChoreContext.jsx`)

**Variables:**
- Boolean flags: `isX` or `hasX` prefix (e.g., `isTemplate`, `isModalOpen`)
- Event handlers: `handleX` prefix (e.g., `handleSubmit`)
- Context hooks: `useX` prefix (e.g., `useChores`)

**Functions:**
- Action verbs for mutations (e.g., `addChore`, `deleteChore`)
- Noun phrases for queries (e.g., `getNextOccurrence`)
- `on` prefix for callback props (e.g., `onSubmit`, `onClick`)
