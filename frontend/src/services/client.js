import axios from 'axios'
import toast from 'react-hot-toast'

// API Gateway base URL
const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost:8080'

// Helper to create axios instance
const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
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
  return instance
}

export const api = createApiClient(API_GATEWAY_BASE_URL)
export const authApi = api
export const productApi = api
export const outletApi = api
export const expenseApi = api

// API endpoints (gateway paths)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VALIDATE_TOKEN: '/auth/validate',
  PROFILE: '/auth/me',
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  ERROR_LOGS: '/error-logs',
  ERROR_LOG_BY_ID: (id) => `/error-logs/${id}`,

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_BY_SKU: (sku) => `/products/sku/${sku}`,
  PRODUCT_BY_BARCODE: (barcode) => `/products/barcode/${barcode}`,
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  STOCK_UPDATE: '/products/stock/update',
  STOCK_MOVEMENTS: '/products/stock/movements',
  STOCK_MOVEMENTS_BY_PRODUCT: (id) => `/products/${id}/stock/movements`,

  // Outlets
  OUTLETS: '/outlets',
  OUTLET_BY_ID: (id) => `/outlets/${id}`,
  STAFF_ASSIGNMENTS: '/staff-assignments',
  STAFF_ASSIGNMENT_BY_ID: (id) => `/staff-assignments/${id}`,
  STAFF_ASSIGNMENTS_BY_OUTLET: (id) => `/outlets/${id}/staff-assignments`,

  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id) => `/expenses/${id}`,
  EXPENSES_BY_OUTLET: (id) => `/expenses/outlet/${id}`,
  EXPENSES_BY_CATEGORY: (cat) => `/expenses/category/${cat}`,
}