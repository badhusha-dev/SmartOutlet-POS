import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'

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
  const { user, loading } = useAuth()
  const { isDarkMode } = useTheme()

  // Apply dark mode class to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
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