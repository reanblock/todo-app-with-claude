import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChoreProvider } from './contexts/ChoreContext'
import { CalendarProvider } from './contexts/CalendarContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CalendarProvider>
      <ChoreProvider>
        <App />
      </ChoreProvider>
    </CalendarProvider>
  </StrictMode>,
)
