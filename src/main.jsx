import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import 'katex/dist/katex.min.css'

const APP_VERSION = '1.1.0'
const VERSION_KEY = 'artesioneedu-app-version'

// Clear persisted stores from older app versions to prevent stale/corrupted data.
try {
  const storedVersion = localStorage.getItem(VERSION_KEY)
  if (storedVersion !== APP_VERSION) {
    const keysToRemove = Object.keys(localStorage).filter((key) =>
      key.startsWith('artesioneedu-')
    )
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    localStorage.setItem(VERSION_KEY, APP_VERSION)
  }
} catch (e) {
  console.warn('Version cleanup failed:', e)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service worker disabled temporarily to prevent stale asset caching after data fixes.
// Re-enable once a robust update strategy is in place.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
}
