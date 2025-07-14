import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient, { API_ENDPOINTS } from '../../services/client'
import toast from 'react-hot-toast'

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

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
        console.log('🔓 Development mode: Mock login successful')
        toast.success('Development mode: Mock login successful!')
        return MOCK_USER_DATA
      }

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials)
      const { token, user: userData } = response.data.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      toast.success('Login successful!')
      return userData
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
        console.log('🔓 Development mode: Mock registration successful')
        toast.success('Development mode: Mock registration successful!')
        return MOCK_USER_DATA
      }

      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData)
      const { token, user: registeredUser } = response.data.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(registeredUser))
      
      toast.success('Registration successful!')
      return registeredUser
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        console.log('🔓 Development mode: Mock profile update')
        const updatedUser = { ...MOCK_USER_DATA, ...profileData }
        toast.success('Development mode: Mock profile update successful!')
        return updatedUser
      }

      const response = await apiClient.put(API_ENDPOINTS.PROFILE, profileData)
      const updatedUser = response.data.data
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      toast.success('Profile updated successfully!')
      return updatedUser
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
        return MOCK_USER_DATA
      }

      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        return parsedUser
      }
      
      return null
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return rejectWithValue('Invalid stored credentials')
    }
  }
)

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isDevMode: DEV_MODE && DISABLE_AUTH,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      if (DEV_MODE && DISABLE_AUTH) {
        console.log('🔓 Development mode: Mock logout')
        state.user = MOCK_USER_DATA
        state.isAuthenticated = true
        toast.success('Development mode: Mock logout (user reset)')
        return
      }

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.user = null
      state.isAuthenticated = false
      state.error = null
      toast.success('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.error = null
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        state.error = action.payload
      })
  },
})

// Export actions
export const { logout, clearError, setLoading } = authSlice.actions

// Export selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectIsDevMode = (state) => state.auth.isDevMode

// Helper selectors
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN'
export const selectIsStaff = (state) => state.auth.user?.role === 'STAFF'
export const selectHasPermission = (state, requiredRole) => {
  if (DEV_MODE && DISABLE_AUTH) return true
  if (!state.auth.user) return false
  
  const roleHierarchy = {
    'ADMIN': 2,
    'STAFF': 1,
  }
  
  const userLevel = roleHierarchy[state.auth.user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0
  
  return userLevel >= requiredLevel
}

export default authSlice.reducer 