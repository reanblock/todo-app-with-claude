# Office Chore Manager — Improvement Plan

Generated from a two-agent UX + code quality review on 2026-02-17.

---

## Tier 1 — Bug Fixes (do these first)

1. **Fix calendar 6-week month truncation** — change `35` to `42` in `src/lib/dateUtils.js:27`; months starting on Friday/Saturday lose their final days entirely
2. **Add delete confirmation for non-recurring chores** — `App.jsx:151-159` shows ConfirmDialog only for recurring chores; one-off deletes are instant with no safety net
3. **Fix `handleSubmitChore` missing try/catch** — `App.jsx:60-68` calls `addChore()` which throws on validation failure; wrap in try/catch or change `addChore` to return an error instead
4. **Fix `isRecurringInstance` type guard** — `types/chore.js:68` checks `parentId !== null` but `undefined !== null` is `true`, causing non-recurring chores to be misclassified as recurring
5. **Fix recurrence engine unknown-type infinite loop** — `recurrenceEngine.js:90` default case returns same date; replace with `return null` and guard the loop
6. **Catch `QuotaExceededError` in save effect** — `ChoreContext.jsx:31-38` has no try/catch around `saveData`; a full localStorage will crash the component silently

---

## Tier 2 — High-Value UX Wins (quick, meaningful improvements)

7. **Add close (X) button to Modal** — `Modal.jsx` has no visible close button; Escape/backdrop-click is not discoverable, especially on mobile
8. **autoFocus the title input on modal open** — `ChoreForm.jsx:95`; one attribute, eliminates the need to click before typing
9. **Fix raw ISO date in recurrence helper text** — `RecurrenceSelector.jsx:41` shows `2026-02-17`; use `date-fns` `format()` to render `February 17, 2026`
10. **Fix ambiguous single-letter weekday headers on mobile** — `MonthView.jsx:37`; "S" is Saturday and Sunday, "T" is Tuesday and Thursday — use two-letter abbreviations (Su, Mo, Tu…)
11. **Add overdue indicator** — chores past their due date that are incomplete look identical to current ones; add a red text/border style in `ChoreItem.jsx`
12. **Make "+N more" clickable** — `DayCell.jsx:43-46`; currently a dead-end; clicking it should expand the day or open a popover listing all chores
13. **Relabel "Edit all future occurrences" → "Edit entire series"** — `App.jsx:106-107`; the action edits the template (all past and future), so the label is misleading
14. **Add empty state for new users** — empty calendar with zero guidance is confusing; add a simple prompt when there are no chores

---

## Tier 3 — Code Health (lower urgency, good practice)

15. **Add a React Error Boundary** — wrap `<App />` in `main.jsx`; prevents corrupted localStorage or unexpected nulls from showing a blank white screen
16. **Validate localStorage data on load** — `storage.js:22-41` does no structural validation; if `templates` is not an array the app crashes immediately on open
17. **Fix date formatting DRY violation** — `ChoreForm.jsx:10,26` uses raw `new Date().toISOString().split('T')[0]` instead of the existing `formatDateISO()` utility
18. **Remove dead code** — delete `src/hooks/useLocalStorage.js` (never imported) and clean up the unused `deletedInstances` field from the schema
19. **Fix `createChore` boolean coercion** — `types/chore.js:22,30` uses `||` instead of `??`; use nullish coalescing for boolean defaults
20. **Add ARIA attributes + focus trap to Modal** — add `role="dialog"`, `aria-modal="true"`, move focus in on open, restore on close
21. **Fix `ChoreItem` non-semantic div** — `ChoreItem.jsx:10-11`; add `role="button"` and `tabIndex="0"` so keyboard users can interact with chores

---

## Not Recommended (out of scope or too complex for current stage)

- Assignee field, search/filter, categories/priority — meaningful features but a separate roadmap
- TypeScript or PropTypes migration — too large a refactor for incremental gains
- Week/day view, dark mode — scope expansions
- Context `useMemo` optimization — premature at this data scale
- Recurrence endDate UI, monthly drift fix — complex edge cases
- Toast/notification system — new infrastructure; not blocking anything critical
