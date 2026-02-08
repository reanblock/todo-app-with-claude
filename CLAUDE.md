# Office Chore Manager - Claude Documentation

## What is This?
A React-based chore management app with calendar view and recurring chore support. Users can create, edit, and track chores with various recurrence patterns. All data persists to browser localStorage.

## Tech Stack
- **React 18.3** - Functional components + hooks
- **Vite 6.0** - Build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS (PostCSS v4 config)
- **date-fns 4.1** - Date manipulation library
- **clsx 2.1** - Conditional className utility

## Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (outputs to /dist)
npm run preview      # Preview production build locally
```

## Project Structure
```
/src
  /components       - UI components organized by domain
    /Calendar       - MonthView, DayCell, CalendarHeader, ChoreItem
    /Chores         - ChoreForm, ChoreModal, RecurrenceSelector
    /Common         - Button, Modal, ConfirmDialog (reusable)
  /contexts         - Global state management (React Context API)
    ChoreContext.jsx       - Chore CRUD + template/instance management
    CalendarContext.jsx    - Calendar navigation state
  /hooks            - Custom React hooks
  /lib              - Pure business logic (no React dependencies)
    recurrenceEngine.js    - Generate recurring chore instances
    storage.js             - localStorage abstraction + schema migrations
    dateUtils.js           - Date formatting helpers
  /types            - Data models, validation, factory functions
  App.jsx           - Main app component
  main.jsx          - Entry point (context provider nesting: main.jsx:8-15)
```

## How It Works

### Recurring Chores (Template-Instance Pattern)
- **Templates** - Stored with `isTemplate: true`, define recurrence rules (contexts/ChoreContext.jsx:52-63)
- **Instances** - Generated on-demand for date ranges, linked via `recurrence.parentId` (lib/recurrenceEngine.js:17-72)
- **On-Demand Generation** - Created when navigating months with ±1 month buffer (App.jsx:31-36)
- **Detaching** - Single occurrences can be detached from template for independent editing (contexts/ChoreContext.jsx:154-172)

### State Management
- React Context API with custom hooks: `useChores`, `useCalendar`
- Auto-persists to localStorage on every state change (contexts/ChoreContext.jsx:31-38)
- Access via custom hooks with error checking (contexts/ChoreContext.jsx:230-236)

### Date Handling
- All dates stored as ISO 8601 strings (YYYY-MM-DD)
- `date-fns` for all operations (parsing, adding, formatting)
- Timezone-agnostic via `startOfDay()` normalization

## Data Schema
localStorage key: `chore-app-data`, version: 1 (lib/storage.js:7-16)

```javascript
{
  version: 1,
  templates: [],        // Recurring chore definitions (isTemplate: true)
  instances: [],        // Generated + one-off chores (isTemplate: false)
  deletedInstances: [],
  settings: { weekStartsOn: 0 }  // 0 = Sunday, 1 = Monday
}
```

**Chore Object Structure:** See types/chore.js:15-34 for factory function and defaults

**Modifying Schema:**
1. Update `CURRENT_VERSION` in lib/storage.js:2
2. Add migration function `migrateV{n}toV{n+1}` (see lib/storage.js:78-86)
3. Update migration chain in `runMigrations()` (lib/storage.js:64-73)

## Component Patterns

### Universal Patterns
- Functional components with hooks (no classes)
- Props destructuring with defaults
- Variant-based styling via props (components/Common/Button.jsx:15-25)
- Controlled components (forms receive value + onChange)
- `clsx()` for conditional Tailwind classes (components/Common/Button.jsx:32-38)
- Event handlers: `handle` prefix; callback props: `on` prefix

### Key File References
- Context provider nesting: main.jsx:8-15
- Button variant pattern: components/Common/Button.jsx:1-47
- Chore factory: types/chore.js:15-34
- Validation: types/chore.js:39-55
- Type guards: types/chore.js:60-69

## Common Tasks

### Adding a Component
1. Create in appropriate domain folder (`/Calendar`, `/Chores`, `/Common`)
2. Use functional component + hooks
3. Import in parent
4. Style with Tailwind classes (avoid inline styles)

### Adding Recurrence Type
1. Add to `RecurrenceType` enum (types/chore.js:4-10)
2. Update `getNextOccurrence()` (lib/recurrenceEngine.js:77-92)
3. Add to RecurrenceSelector (components/Chores/RecurrenceSelector.jsx)

### Modifying State Logic
- Chore operations: contexts/ChoreContext.jsx
- Calendar navigation: contexts/CalendarContext.jsx
- Use immutable updates (`.map()`, `.filter()`, spread operator)
- Wrap in `useCallback` to prevent re-renders

### Debugging
- Browser console for errors
- Inspect: `localStorage.getItem('chore-app-data')`
- Clear: `localStorage.removeItem('chore-app-data')` + refresh
- React DevTools for component state

## Additional Documentation

**Architectural Patterns** - `.claude/docs/architectural_patterns.md`
- Context API implementation details
- Template-instance pattern deep dive
- Component composition patterns
- Storage versioning and migrations
- Naming conventions
- Business logic separation
- UI patterns (modals, conditional styling)

## Notes
- Client-side only (no backend)
- No tests configured
- Responsive via Tailwind breakpoints (sm:, md:, lg:)
