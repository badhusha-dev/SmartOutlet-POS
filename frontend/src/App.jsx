import React from 'react'
import { useAppSelector } from './store/hooks'
import { selectIsDevMode } from './store/slices/authSlice'

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

// Routes
import AppRoutes from './routes/AppRoutes'

function App() {
  const isDevMode = useAppSelector(selectIsDevMode)

  // Development mode: Show dev mode indicator
  React.useEffect(() => {
    if (DEV_MODE && DISABLE_AUTH) {
      console.log('🔓 Development mode: Security disabled')
      // Add visual indicator
      const indicator = document.createElement('div')
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ef4444;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `
      indicator.textContent = '🔓 DEV MODE'
      document.body.appendChild(indicator)
      
      return () => {
        if (document.body.contains(indicator)) {
          document.body.removeChild(indicator)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppRoutes />
    </div>
  )
}

export default App