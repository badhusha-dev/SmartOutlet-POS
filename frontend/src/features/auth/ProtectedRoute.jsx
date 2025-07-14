import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { 
  selectUser, 
  selectAuthLoading, 
  selectIsDevMode,
  selectHasPermission 
} from '../../store/slices/authSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_PROTECTED_ROUTES = import.meta.env.VITE_DISABLE_PROTECTED_ROUTES === 'true'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = useAppSelector(selectUser)
  const loading = useAppSelector(selectAuthLoading)
  const isDevMode = useAppSelector(selectIsDevMode)
  const hasPermission = useAppSelector(state => 
    requiredRole ? selectHasPermission(state, requiredRole) : true
  )
  const location = useLocation()

  // Development mode: Bypass all protection
  if (DEV_MODE && DISABLE_PROTECTED_ROUTES) {
    console.log('🔓 Development mode: Bypassing route protection')
    return children
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && !hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary px-6 py-3"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute