import axios from 'axios'
import toast from 'react-hot-toast'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.')
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  
  // Outlets
  OUTLETS: '/outlets',
  OUTLET_DETAILS: (id) => `/outlets/${id}`,
  OUTLET_STAFF: (id) => `/outlets/${id}/staff`,
  OUTLET_NOTICES: (id) => `/outlets/${id}/notices`,
  OUTLET_TASKS: (id) => `/outlets/${id}/tasks`,
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  PRODUCT_CATEGORIES: '/products/categories',
  
  // Sales
  SALES: '/sales',
  SALES_DETAILS: (id) => `/sales/${id}`,
  ORDERS: '/orders',
  
  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_DETAILS: (id) => `/expenses/${id}`,
  EXPENSE_CATEGORIES: '/expenses/categories',
  
  // Reports
  REPORTS: '/reports',
  DASHBOARD_STATS: '/dashboard/stats',
}

export default apiClient