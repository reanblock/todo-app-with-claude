# Plan: Agenda List View

## Task Description
Build an "Agenda" list view for the chore manager that displays all chores in a chronological, scrollable list grouped by date. Similar to Google Calendar's agenda view, the list starts at today's date and only allows scrolling forward (into the future). Past dates are not accessible. This provides a compact, focused alternative to the month-grid calendar view.

## Objective
When complete, users will be able to toggle between the existing month calendar view and a new agenda list view. The agenda view will show chores grouped by date, starting from today, scrolling forward into the future with infinite-scroll-style loading. Past dates will not be visible.

## Problem Statement
The current month-grid view is great for seeing a whole month at a glance, but it can be hard to scan upcoming chores linearly. Users need a focused, forward-looking view that answers: "What chores are coming up?" without navigating month by month.

## Solution Approach
1. Add a **view toggle** (Calendar / Agenda) to the CalendarHeader
2. Create a new **AgendaView** component that renders chores grouped by date, starting from today
3. Use the existing `useChores` context to source chore data — no new data layer needed
4. Implement forward-only scrolling with a "Load More" button (or intersection observer) to generate and display additional future dates
5. Leverage existing `generateForDateRange` to ensure recurring chore instances are generated for the visible range
6. Add view state to **CalendarContext** so the toggle persists during the session

## Relevant Files
Use these files to complete the task:

- `src/App.jsx` — Main app component; will conditionally render MonthView or AgendaView based on active view state
- `src/contexts/CalendarContext.jsx` — Add `viewMode` state (`'calendar' | 'agenda'`) and a `setViewMode` function
- `src/contexts/ChoreContext.jsx` — Source for `chores` array and `generateForDateRange`; no modifications needed
- `src/components/Calendar/CalendarHeader.jsx` — Add view toggle buttons (Calendar / Agenda)
- `src/components/Calendar/MonthView.jsx` — Existing month view; no changes needed, just conditionally shown
- `src/components/Calendar/ChoreItem.jsx` — Reuse in agenda view for consistent chore rendering
- `src/lib/dateUtils.js` — Add helper for formatting day labels (e.g., "Today", "Tomorrow", "Friday, Feb 27")
- `src/types/chore.js` — Reference for chore shape; no changes needed

### New Files
- `src/components/Agenda/AgendaView.jsx` — Main agenda container: groups chores by date, manages visible date range, handles "load more"
- `src/components/Agenda/AgendaDayGroup.jsx` — Renders a single date header + its list of chores
- `ai_review/user_stories/agenda-view.yaml` — User stories for QA validation of the agenda view feature

## Implementation Phases

### Phase 1: Foundation
- Add `viewMode` state to CalendarContext
- Add view toggle UI to CalendarHeader
- Wire App.jsx to conditionally render MonthView or AgendaView
- Add date formatting helpers for agenda-style labels

### Phase 2: Core Implementation
- Build AgendaView with date grouping logic
- Build AgendaDayGroup for per-day rendering
- Implement forward-only scrolling with "Load More" button
- Ensure recurring instances are generated for the agenda's visible range

### Phase 3: Integration & Polish
- Style the agenda view to match the app's Tailwind aesthetic
- Handle empty states (no chores for a date range)
- Ensure chore click, toggle complete, and edit/delete flows work identically to calendar view
- Test responsiveness on mobile breakpoints
- Create user stories YAML for automated QA validation

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add `viewMode` State to CalendarContext
- In `src/contexts/CalendarContext.jsx`, add state: `const [viewMode, setViewMode] = useState('calendar')`
- Expose `viewMode` and `setViewMode` in the context value object
- Update the `useCalendar` hook return type accordingly

### 2. Add Date Formatting Helper for Agenda Labels
- In `src/lib/dateUtils.js`, add a `formatAgendaDate(date)` function that returns:
  - `"Today — Friday, Feb 20"` if date is today
  - `"Tomorrow — Saturday, Feb 21"` if date is tomorrow
  - `"Wednesday, Feb 25"` for other dates (weekday + short month + day)
- Use `date-fns` `format`, `isToday`, `isTomorrow` (import `isTomorrow` from date-fns)

### 3. Add View Toggle to CalendarHeader
- In `src/components/Calendar/CalendarHeader.jsx`, import `viewMode` and `setViewMode` from `useCalendar()`
- Add a toggle button group next to the navigation buttons with two options: "Calendar" and "Agenda"
- Style the active button with a distinct visual (e.g., `bg-blue-600 text-white` for active, `bg-gray-200` for inactive)
- When in agenda mode, hide the Prev/Next/Today navigation buttons (they don't apply)

### 4. Create AgendaDayGroup Component
- Create `src/components/Agenda/AgendaDayGroup.jsx`
- Props: `date` (Date object), `chores` (array), `onChoreClick`, `onToggleComplete`
- Render:
  - Date header using `formatAgendaDate(date)` — styled as a sticky header with a subtle background
  - A `<ChoreItem>` for each chore, but rendered in a wider list-item style (full width, more padding than the calendar cell version)
  - If the day is today, add a subtle highlight or left border accent

### 5. Create AgendaView Component
- Create `src/components/Agenda/AgendaView.jsx`
- Props: `onChoreClick`, `onToggleComplete`
- Internal state:
  - `visibleEndDate` — initially set to 30 days from today
- On mount and when `visibleEndDate` changes, call `generateForDateRange(today, visibleEndDate)` to ensure recurring instances exist
- Filter `chores` from `useChores()` to only include chores where `dueDate >= today` AND `dueDate <= visibleEndDate`
- Sort filtered chores by `dueDate` ascending
- Group chores by `dueDate` into an ordered map/array of `{ date, chores }` entries
- **Only render date groups that have chores** (skip empty days — this is the Google Calendar agenda behavior)
- At the bottom, render a "Show More" button that extends `visibleEndDate` by another 30 days
- If no chores exist in the visible range, show an empty state: "No upcoming chores"

### 6. Wire AgendaView into App.jsx
- Import `AgendaView` in `src/App.jsx`
- Import `useCalendar` to access `viewMode`
- Conditionally render: if `viewMode === 'agenda'`, render `<AgendaView>` instead of `<MonthView>`
- Pass the same `onChoreClick` and `onToggleComplete` handlers to AgendaView
- Ensure the instance generation `useEffect` still runs in agenda mode (it generates based on `currentMonth`, but agenda may need wider range — handled inside AgendaView)

### 7. Style and Polish
- Use Tailwind classes consistent with existing components (white cards, gray borders, blue accents)
- AgendaView container: `bg-white rounded-lg shadow overflow-hidden` (matches MonthView wrapper)
- Date group headers: `bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 sticky top-0`
- Chore items in agenda: give them a wider layout than calendar cells — show title, description snippet, and completion checkbox in a row
- Add `max-h-[calc(100vh-200px)] overflow-y-auto` to the agenda container for scrollable behavior
- Ensure the "Show More" button is always visible at the bottom

### 8. Create User Stories YAML
- Create `ai_review/user_stories/agenda-view.yaml` following the same format as `chore-manager.yaml`
- Include user stories covering:
  - **Toggle to agenda view**: Navigate to home, click the "Agenda" toggle, verify the view switches from calendar grid to a chronological list
  - **Agenda shows only today and future dates**: Switch to agenda view, verify no past dates are visible, verify today's date (if it has chores) appears first
  - **Chores grouped by date**: Add chores on different future dates, switch to agenda view, verify chores are grouped under date headers in chronological order
  - **Toggle chore completion in agenda**: In agenda view, check a chore's checkbox, verify the chore shows as completed with strikethrough styling
  - **Click chore to edit in agenda**: In agenda view, click a chore, verify the edit modal opens with the chore's details
  - **Load more future dates**: In agenda view, scroll to the bottom, click "Show More", verify additional future dates with chores appear
  - **Empty state when no upcoming chores**: Clear all chores, switch to agenda view, verify the "No upcoming chores" empty state message is displayed
  - **Switch back to calendar view**: From agenda view, click the "Calendar" toggle, verify the month grid calendar view is restored
- Each story should have `name`, `url` (`http://localhost:5173/`), and `workflow` fields

### 9. Validate All Interactions Work
- Verify clicking a chore opens the ChoreModal (same as calendar view)
- Verify toggling completion works
- Verify recurring chore edit/delete dialogs appear correctly
- Verify the "Add Chore" button in the header still works in agenda mode
- Test switching between Calendar and Agenda views preserves state
- Run `npm run build` to ensure no build errors

## Testing Strategy
- Manual testing:
  1. Toggle between Calendar and Agenda views — verify state preservation
  2. Add a one-off chore with a future date — verify it appears in agenda
  3. Add a recurring chore — verify instances appear in agenda for the visible range
  4. Click "Show More" — verify additional dates load and recurring instances generate
  5. Toggle chore completion — verify checkbox and style update
  6. Click a chore — verify edit modal opens
  7. Click a recurring chore — verify edit/delete dialog works
  8. Verify no past dates appear in the agenda view
  9. Test on mobile viewport widths
- Edge cases:
  - No chores at all (empty state)
  - All chores in past (empty agenda)
  - Very dense day with many chores
  - Switching views after adding/editing a chore

## Acceptance Criteria
- [ ] A view toggle (Calendar / Agenda) is visible in the header
- [ ] Agenda view displays chores grouped by date, sorted chronologically
- [ ] Only future dates (today and beyond) are shown — no past dates
- [ ] Only days with chores are displayed (empty days are skipped)
- [ ] "Show More" button loads additional future dates
- [ ] Today's date group has a visual distinction
- [ ] Chore click, toggle complete, and edit/delete work identically to calendar view
- [ ] Recurring chore instances are generated for the visible agenda range
- [ ] Empty state message when no upcoming chores exist
- [ ] Responsive layout works on mobile
- [ ] `npm run build` succeeds with no errors
- [ ] User stories YAML file exists at `ai_review/user_stories/agenda-view.yaml` with stories covering all key workflows

## Validation Commands
Execute these commands to validate the task is complete:

- `npm run build` — Ensure the production build succeeds with no errors
- `npm run dev` — Start dev server and manually test all acceptance criteria in the browser

## Notes
- No new dependencies needed — `date-fns` already has `isTomorrow`, and all styling uses Tailwind
- The agenda view intentionally skips empty days (unlike a day-by-day timeline) to keep the view compact and useful
- The "Load More" approach is simpler than infinite scroll with IntersectionObserver and avoids complexity for this initial implementation; infinite scroll can be added as a future enhancement
- The CalendarHeader nav buttons (Prev/Next/Today) are hidden in agenda mode since they control month navigation which doesn't apply to the forward-scrolling agenda
