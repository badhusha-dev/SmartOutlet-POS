import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

// Auth Components
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Main Layout
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import Dashboard from './pages/Dashboard'
import OutletManagement from './pages/OutletManagement'
import ProductManagement from './pages/ProductManagement'
import POSSales from './pages/POSSales'
import SalesReport from './pages/SalesReport'
import ExpenseTracker from './pages/ExpenseTracker'
import Profile from './pages/Profile'

// Loading Component
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { user, loading, isDevMode } = useAuth()
  const { isDarkMode } = useTheme()

  // Apply dark mode class to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

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

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            DEV_MODE && DISABLE_AUTH ? 
              <Navigate to="/dashboard" replace /> : 
              (user ? <Navigate to="/dashboard" replace /> : <Login />)
          } 
        />
        <Route 
          path="/register" 
          element={
            DEV_MODE && DISABLE_AUTH ? 
              <Navigate to="/dashboard" replace /> : 
              (user ? <Navigate to="/dashboard" replace /> : <Register />)
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="outlets" element={<OutletManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="pos" element={<POSSales />} />
          <Route path="sales" element={<SalesReport />} />
          <Route path="expenses" element={<ExpenseTracker />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App