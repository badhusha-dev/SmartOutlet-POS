import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

// Auth Components
import Login from '../features/auth/Login'
import Register from '../features/auth/Register'
import Profile from '../features/auth/Profile'

// Main Layout
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../features/auth/ProtectedRoute'

// Pages
import Dashboard from '../features/report/views/Dashboard'
import OutletManagement from '../features/outlet/views/OutletManagement'
import ProductManagement from '../features/inventory/views/ProductManagement'
import POSSales from '../features/sales/views/POSSales'
import SalesReport from '../features/sales/views/SalesReport'
import ExpenseTracker from '../features/expense/views/ExpenseTracker'

// Loading Component
import LoadingSpinner from '../components/common/LoadingSpinner'

const AppRoutes = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          DEV_MODE && DISABLE_AUTH ? 
            <Navigate to="/dashboard" replace /> : 
            (isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />)
        } 
      />
      <Route 
        path="/register" 
        element={
          DEV_MODE && DISABLE_AUTH ? 
            <Navigate to="/dashboard" replace /> : 
            (isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />)
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
  )
}

export default AppRoutes 