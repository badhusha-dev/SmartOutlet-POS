import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient, { API_ENDPOINTS } from '../api/client'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'
const MOCK_USER = import.meta.env.VITE_MOCK_USER === 'true'

// Mock user for development
const MOCK_USER_DATA = {
  id: 1,
  username: 'dev-admin',
  email: 'admin@smartoutlet.dev',
  role: 'ADMIN',
  firstName: 'Development',
  lastName: 'Admin',
  isActive: true,
  createdAt: new Date().toISOString(),
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
      // Development mode: Use mock user
      console.log('🔓 Development mode: Using mock user (security disabled)')
      setUser(MOCK_USER_DATA)
      setLoading(false)
      return
    }

    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
      // Development mode: Skip actual login
      console.log('🔓 Development mode: Mock login successful')
      setUser(MOCK_USER_DATA)
      toast.success('Development mode: Mock login successful!')
      return { success: true }
    }

    try {
      setLoading(true)
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials)
      
      const { token, user: userData } = response.data.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
      // Development mode: Skip actual registration
      console.log('🔓 Development mode: Mock registration successful')
      setUser(MOCK_USER_DATA)
      toast.success('Development mode: Mock registration successful!')
      return { success: true }
    }

    try {
      setLoading(true)
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData)
      
      const { token, user: registeredUser } = response.data.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(registeredUser))
      setUser(registeredUser)
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (DEV_MODE && DISABLE_AUTH) {
      // Development mode: Reset to mock user
      console.log('🔓 Development mode: Mock logout')
      setUser(MOCK_USER_DATA)
      toast.success('Development mode: Mock logout (user reset)')
      return
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData) => {
    if (DEV_MODE && DISABLE_AUTH) {
      // Development mode: Mock profile update
      console.log('🔓 Development mode: Mock profile update')
      const updatedUser = { ...MOCK_USER_DATA, ...profileData }
      setUser(updatedUser)
      toast.success('Development mode: Mock profile update successful!')
      return { success: true }
    }

    try {
      setLoading(true)
      const response = await apiClient.put(API_ENDPOINTS.PROFILE, profileData)
      
      const updatedUser = response.data.data
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = () => {
    return user?.role === 'ADMIN'
  }

  const isStaff = () => {
    return user?.role === 'STAFF'
  }

  const hasPermission = (requiredRole) => {
    if (DEV_MODE && DISABLE_AUTH) {
      // Development mode: Grant all permissions
      console.log('🔓 Development mode: Granting all permissions')
      return true
    }

    if (!user) return false
    
    const roleHierarchy = {
      'ADMIN': 2,
      'STAFF': 1,
    }
    
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isStaff,
    hasPermission,
    isDevMode: DEV_MODE && DISABLE_AUTH,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}