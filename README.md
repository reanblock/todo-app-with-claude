# Office Chore Manager

A modern, responsive chore management application with an Outlook-style calendar
view. Built with React, Vite, and Tailwind CSS.

![Office Chore Manager](https://img.shields.io/badge/React-18.3-blue) 
![Vite](https://img.shields.io/badge/Vite-6.0-purple) 
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-cyan)
![Tests](https://img.shields.io/badge/tests-52%20passing-brightgreen)

## Features

### Core Functionality
- 📅 **Monthly Calendar View** - Outlook-style grid showing all your chores at a
glance
- ➕ **CRUD Operations** - Add, edit, and delete chores with an intuitive modal 
interface
- 🔄 **Recurring Chores** - Set chores to repeat daily, weekly, bi-weekly, or 
monthly
- 💾 **Automatic Persistence** - All data saved to browser's localStorage
- 📆 **Calendar Navigation** - Easy navigation between months with 
Previous/Next/Today buttons

### Advanced Features
- ✅ **Completion Toggle** - Mark chores complete/incomplete with checkboxes
- 🎯 **Smart Recurring Management** - Edit or delete single occurrences or 
entire series
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Visual Feedback** - Completed chores shown with strikethrough and green 
styling
- 🗓️ **Auto-Generation** - Recurring chore instances automatically appear when 
navigating months

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Installation

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd todo-app-with-claude
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build
Build the application for production:

```bash
npm run build
```

### Preview Production Build
Preview the production build locally:

```bash
npm run preview
```

## Testing

The project uses [Vitest](https://vitest.dev/) as the test runner, configured
via `vite.config.js` with the `happy-dom` environment.

### Run all tests (single pass)

```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)

```bash
npm run test:watch
```

### What's tested

| Module | Test file | Tests |
|--------|-----------|-------|
| `src/lib/dateUtils.js` | `src/lib/__tests__/dateUtils.test.js` | Calendar grid generation, date formatting, today/tomorrow detection |
| `src/lib/recurrenceEngine.js` | `src/lib/__tests__/recurrenceEngine.test.js` | Next-occurrence calculation, instance generation, deduplication |
| `src/lib/storage.js` | `src/lib/__tests__/storage.test.js` | localStorage load/save/clear with mocked storage |
| `src/types/chore.js` | `src/types/__tests__/chore.test.js` | Chore creation, validation, template/instance helpers |

All tests are **unit tests only** — external dependencies (localStorage) are
mocked, and no browser or network interaction is required.

## Usage Guide

### Adding a Chore
1. Click the **"+ Add Chore"** button in the header
2. Fill in the chore details:
   - **Title** (required)
   - **Due Date** (required)
   - **Description** (optional)
   - **Repeats** - Choose a recurrence pattern if needed
3. Click **"Add Chore"** to save

### Making a Chore Recurring
When adding or editing a chore, select a repeat pattern:
- **Does not repeat** - One-time chore
- **Daily** - Repeats every day
- **Weekly** - Repeats every 7 days
- **Bi-weekly** - Repeats every 2 weeks
- **Monthly** - Repeats on the same day each month

### Editing or Deleting Chores
1. Click on any chore in the calendar
2. For recurring chores, choose:
   - **Edit/Delete only this occurrence** - Affects only the selected instance
   - **Edit/Delete all future occurrences** - Updates the entire series

### Marking Chores Complete
Click the checkbox next to any chore to toggle its completion status. Completed 
chores appear with a green background and strikethrough text.

### Navigating the Calendar
- **Prev** - Go to previous month
- **Next** - Go to next month
- **Today** - Jump back to current month

## Project Structure

```
/src
  /components
    /Calendar
      MonthView.jsx          # Main calendar grid component
      CalendarHeader.jsx     # Month navigation and controls
      DayCell.jsx           # Individual day cell in the grid
      ChoreItem.jsx         # Chore display within a day
    /Chores
      ChoreForm.jsx         # Form for adding/editing chores
      ChoreModal.jsx        # Modal wrapper for the form
      RecurrenceSelector.jsx # Recurrence pattern selector
    /Common
      Button.jsx            # Reusable button component
      Modal.jsx             # Base modal component
      ConfirmDialog.jsx     # Confirmation dialog for actions
  /contexts
    ChoreContext.jsx        # Global chore state management
    CalendarContext.jsx     # Calendar navigation state
  /hooks
    useLocalStorage.js      # Custom hook for localStorage
    useChores.js           # Hook to access chore operations
    useCalendar.js         # Hook for calendar navigation
  /lib
    recurrenceEngine.js    # Logic for generating recurring instances
    storage.js             # localStorage wrapper with migrations
    dateUtils.js           # Date manipulation helpers
    __tests__/             # Unit tests for lib modules
  /types
    chore.js               # Data models and validation
    __tests__/             # Unit tests for type helpers
  App.jsx                  # Main application component
  main.jsx                 # Application entry point
  index.css               # Global styles and Tailwind imports
```

## Tech Stack

- **[React 18](https://react.dev/)** - UI framework
- **[Vite 6](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **(https://date-fns.org/)** - Modern date utility library
- **(https://github.com/lukeed/clsx)** - Conditional className utility
- **[Vitest](https://vitest.dev/)** - Unit test framework (dev dependency)

## Data Storage

All chore data is stored in the browser's `localStorage` under the key 
`chore-app-data`. The storage schema includes:

```javascript
{
  version: 1,
  templates: [],        // Recurring chore definitions
  instances: [],        // Generated and one-off chores
  deletedInstances: [], // Soft-deleted recurring instances
  settings: {
    weekStartsOn: 0     // 0 = Sunday, 1 = Monday
  }
}
```

### Clearing Data
To reset all data, open the browser console and run:
```javascript
localStorage.removeItem('chore-app-data')
```

## Contributing

We welcome contributions! Here's how you can help:

### Setting Up for Development

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Run the tests to make sure nothing is broken
   ```bash
   npm test
   ```
5. Commit with a descriptive message
   ```bash
   git commit -m "Add feature: description of your changes"
   ```
6. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

### Code Style Guidelines

- Use **functional components** with hooks
- Follow the existing **folder structure** for organization
- Use **Tailwind CSS classes** for styling (avoid inline styles)
- Write **clear, descriptive variable and function names**
- Add **comments** for complex logic
- Keep components **small and focused** on a single responsibility

### Testing Your Changes

Before submitting a PR, please verify:
- [ ] All unit tests pass (`npm test`)
- [ ] App runs without errors (`npm run dev`)
- [ ] All existing features still work
- [ ] New features work as expected
- [ ] Responsive design is maintained (test on mobile view)
- [ ] No console errors or warnings
- [ ] Code follows the existing style

## Future Enhancements

Ideas for future development:

- [ ] **Team member management** - Add/remove team members and assign chores
- [ ] **Notifications** - Email or browser notifications for upcoming chores
- [ ] **Dark mode** - Theme toggle for dark/light modes
- [ ] **Export/Import** - Backup and restore data as JSON files
- [ ] **Categories** - Organize chores by category with color coding
- [ ] **Search & Filter** - Find chores quickly by title, date, or assignee
- [ ] **Statistics** - Dashboard showing completion rates and trends
- [ ] **Custom recurrence** - More flexible scheduling (e.g., "every 3rd 
Tuesday")
- [ ] **Multi-user sync** - Cloud backend for team collaboration
- [ ] **Drag & drop** - Reschedule chores by dragging to different dates

## Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Open a new issue with a detailed description
3. Include steps to reproduce any bugs

---

Built with ❤️ using React, Vite, and Tailwind CSS
