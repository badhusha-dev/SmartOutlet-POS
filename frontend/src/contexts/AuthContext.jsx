import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi, API_ENDPOINTS } from '../services/client'
import toast from 'react-hot-toast'

const AuthContext = createContext()

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
  const [isDevMode] = useState(import.meta.env.VITE_DEV_MODE === 'true')
  const [disableAuth] = useState(import.meta.env.VITE_DISABLE_AUTH === 'true')

  useEffect(() => {
    if (disableAuth) {
      setUser({
        id: 1,
        username: 'demo',
        email: 'demo@smartoutlet.com',
        role: 'ADMIN',
        permissions: ['read', 'write', 'delete']
      })
      setLoading(false)
      return
    }
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [isDevMode, disableAuth])

  // Login method
  const login = async (credentials) => {
    if (disableAuth) {
      setUser({
        id: 1,
        username: credentials.username,
        email: credentials.email || 'demo@smartoutlet.com',
        role: 'ADMIN',
        permissions: ['read', 'write', 'delete']
      })
      return { success: true }
    }
    try {
      setLoading(true)
      // Pass all credentials (including env) to the API
      const res = await authApi.post('/auth/login', credentials)
      const { token } = res.data
      if (token) {
        localStorage.setItem('token', token)
        await getCurrentUser()
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: 'No token received' }
      }
    } catch (error) {
      setLoading(false)
      const msg = error.response?.data?.message || error.message || 'Login failed'
      return { success: false, error: msg }
    }
  }

  // Register method
  const register = async (data) => {
    if (disableAuth) {
      setUser({
        id: 1,
        username: data.username,
        email: data.email || 'demo@smartoutlet.com',
        role: data.role || 'ADMIN',
        permissions: ['read', 'write', 'delete']
      })
      return { success: true }
    }
    try {
      setLoading(true)
      await authApi.post('/auth/register', data)
      setLoading(false)
      return { success: true }
    } catch (error) {
      setLoading(false)
      const msg = error.response?.data?.message || error.message || 'Registration failed'
      return { success: false, error: msg }
    }
  }

  // Get current user info
  const getCurrentUser = async () => {
    if (disableAuth) {
      setUser({
        id: 1,
        username: 'demo',
        email: 'demo@smartoutlet.com',
        role: 'ADMIN',
        permissions: ['read', 'write', 'delete']
      })
      return
    }
    try {
      const res = await authApi.get('/auth/me')
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
    } catch (error) {
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  // Logout method
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    loading,
    isDevMode,
    login,
    logout,
    register,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 