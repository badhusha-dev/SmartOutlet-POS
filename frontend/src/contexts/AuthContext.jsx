import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    // Check if we're in dev mode and should use mock user
    if (isDevMode && import.meta.env.VITE_MOCK_USER === 'true') {
      setUser({
        id: 1,
        name: 'Demo User',
        email: 'demo@smartoutlet.com',
        role: 'ADMIN',
        permissions: ['read', 'write', 'delete']
      })
    }
    setLoading(false)
  }, [isDevMode])

  const login = async (credentials) => {
    try {
      // In a real app, this would make an API call
      if (isDevMode) {
        setUser({
          id: 1,
          name: 'Demo User',
          email: credentials.email,
          role: 'ADMIN',
          permissions: ['read', 'write', 'delete']
        })
        return { success: true }
      }
      // TODO: Implement real authentication
      return { success: false, error: 'Authentication not implemented' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    loading,
    isDevMode,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 