import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

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

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } else if (response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (response?.data?.message) {
      toast.error(response.data.message)
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

export default apiClient

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Outlets
  OUTLETS: '/outlets',
  OUTLET_BY_ID: (id) => `/outlets/${id}`,
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_STOCK: (id) => `/products/${id}/stock`,
  CATEGORIES: '/products/categories',
  
  // POS
  SALES: '/pos/sales',
  SALE_BY_ID: (id) => `/pos/sales/${id}`,
  RECEIPT: (id) => `/pos/sales/${id}/receipt`,
  
  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id) => `/expenses/${id}`,
  EXPENSE_CATEGORIES: '/expenses/categories',
  
  // Reports
  SALES_REPORT: '/pos/sales/report',
  DASHBOARD_STATS: '/dashboard/stats',
}