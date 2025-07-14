import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// Mock data for development
const MOCK_SALES = [
  {
    id: 1,
    transactionId: 'TXN-2024-001',
    outletId: 1,
    outletName: 'Downtown SmartOutlet',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1-555-0123',
    items: [
      { productId: 1, name: 'Smart LED Bulb', quantity: 2, price: 29.99, total: 59.98 },
      { productId: 2, name: 'Wireless Charger', quantity: 1, price: 49.99, total: 49.99 },
    ],
    subtotal: 109.97,
    tax: 8.80,
    discount: 10.00,
    total: 108.77,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'COMPLETED',
    status: 'COMPLETED',
    createdAt: '2024-01-20T14:30:00Z',
    completedAt: '2024-01-20T14:35:00Z',
  },
  {
    id: 2,
    transactionId: 'TXN-2024-002',
    outletId: 2,
    outletName: 'Mall SmartOutlet',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    customerPhone: '+1-555-0456',
    items: [
      { productId: 3, name: 'Smart Thermostat', quantity: 1, price: 199.99, total: 199.99 },
    ],
    subtotal: 199.99,
    tax: 16.00,
    discount: 0,
    total: 215.99,
    paymentMethod: 'CASH',
    paymentStatus: 'COMPLETED',
    status: 'COMPLETED',
    createdAt: '2024-01-20T16:15:00Z',
    completedAt: '2024-01-20T16:20:00Z',
  },
]

const MOCK_ORDERS = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    outletId: 1,
    customerName: 'Alice Johnson',
    customerEmail: 'alice@email.com',
    customerPhone: '+1-555-0789',
    items: [
      { productId: 1, name: 'Smart LED Bulb', quantity: 5, price: 29.99, total: 149.95 },
    ],
    total: 149.95,
    status: 'PENDING',
    createdAt: '2024-01-21T10:00:00Z',
    expectedDelivery: '2024-01-25T17:00:00Z',
  },
]

// Async thunks
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      return MOCK_SALES
    } catch (error) {
      return rejectWithValue('Failed to fetch sales')
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'sales/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 800))
      return MOCK_ORDERS
    } catch (error) {
      return rejectWithValue('Failed to fetch orders')
    }
  }
)

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newSale = {
        id: Date.now(),
        transactionId: `TXN-2024-${String(Date.now()).slice(-3)}`,
        ...saleData,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
      }
      toast.success('Sale completed successfully!')
      return newSale
    } catch (error) {
      toast.error('Failed to complete sale')
      return rejectWithValue('Failed to complete sale')
    }
  }
)

export const createOrder = createAsyncThunk(
  'sales/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newOrder = {
        id: Date.now(),
        orderNumber: `ORD-2024-${String(Date.now()).slice(-3)}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
      }
      toast.success('Order created successfully!')
      return newOrder
    } catch (error) {
      toast.error('Failed to create order')
      return rejectWithValue('Failed to create order')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'sales/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 300))
      toast.success('Order status updated successfully!')
      return { id, status }
    } catch (error) {
      toast.error('Failed to update order status')
      return rejectWithValue('Failed to update order status')
    }
  }
)

export const refundSale = createAsyncThunk(
  'sales/refundSale',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Refund processed successfully!')
      return { id, reason, refundedAt: new Date().toISOString() }
    } catch (error) {
      toast.error('Failed to process refund')
      return rejectWithValue('Failed to process refund')
    }
  }
)

// Initial state
const initialState = {
  sales: [],
  orders: [],
  selectedSale: null,
  selectedOrder: null,
  loading: false,
  error: null,
  filters: {
    dateRange: 'TODAY',
    status: 'ALL',
    paymentMethod: 'ALL',
    outletId: null,
    search: '',
  },
  stats: {
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    pendingOrders: 0,
  },
}

// Sales slice
const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload
    },
    clearSelectedSale: (state) => {
      state.selectedSale = null
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { 
        dateRange: 'TODAY', 
        status: 'ALL', 
        paymentMethod: 'ALL', 
        outletId: null, 
        search: '' 
      }
    },
    updateStats: (state) => {
      const totalSales = state.sales.length
      const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0)
      const totalOrders = state.orders.length
      const pendingOrders = state.orders.filter(order => order.status === 'PENDING').length
      
      state.stats = {
        totalSales,
        totalRevenue,
        averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
        totalOrders,
        pendingOrders,
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.sales = action.payload
        state.error = null
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch orders
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      // Create sale
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.unshift(action.payload)
      })
      // Create order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload)
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload.id)
        if (order) {
          order.status = action.payload.status
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder.status = action.payload.status
        }
      })
      // Refund sale
      .addCase(refundSale.fulfilled, (state, action) => {
        const sale = state.sales.find(s => s.id === action.payload.id)
        if (sale) {
          sale.status = 'REFUNDED'
          sale.refundedAt = action.payload.refundedAt
          sale.refundReason = action.payload.reason
        }
        if (state.selectedSale?.id === action.payload.id) {
          state.selectedSale.status = 'REFUNDED'
          state.selectedSale.refundedAt = action.payload.refundedAt
          state.selectedSale.refundReason = action.payload.reason
        }
      })
  },
})

// Export actions
export const { 
  setSelectedSale, 
  clearSelectedSale, 
  setSelectedOrder, 
  clearSelectedOrder, 
  setFilters, 
  clearFilters, 
  updateStats, 
  clearError 
} = salesSlice.actions

// Export selectors
export const selectSales = (state) => state.sales.sales
export const selectOrders = (state) => state.sales.orders
export const selectSelectedSale = (state) => state.sales.selectedSale
export const selectSelectedOrder = (state) => state.sales.selectedOrder
export const selectSalesLoading = (state) => state.sales.loading
export const selectSalesError = (state) => state.sales.error
export const selectSalesFilters = (state) => state.sales.filters
export const selectSalesStats = (state) => state.sales.stats

// Helper selectors
export const selectFilteredSales = (state) => {
  const { sales, filters } = state.sales
  let filtered = sales

  if (filters.status !== 'ALL') {
    filtered = filtered.filter(sale => sale.status === filters.status)
  }

  if (filters.paymentMethod !== 'ALL') {
    filtered = filtered.filter(sale => sale.paymentMethod === filters.paymentMethod)
  }

  if (filters.outletId) {
    filtered = filtered.filter(sale => sale.outletId === filters.outletId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(sale =>
      sale.transactionId.toLowerCase().includes(searchLower) ||
      sale.customerName.toLowerCase().includes(searchLower) ||
      sale.customerEmail.toLowerCase().includes(searchLower)
    )
  }

  // Date range filtering
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  switch (filters.dateRange) {
    case 'TODAY':
      filtered = filtered.filter(sale => new Date(sale.createdAt) >= today)
      break
    case 'YESTERDAY':
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.createdAt)
        return saleDate >= yesterday && saleDate < today
      })
      break
    case 'LAST_WEEK':
      filtered = filtered.filter(sale => new Date(sale.createdAt) >= lastWeek)
      break
    case 'LAST_MONTH':
      filtered = filtered.filter(sale => new Date(sale.createdAt) >= lastMonth)
      break
    default:
      break
  }

  return filtered
}

export const selectFilteredOrders = (state) => {
  const { orders, filters } = state.sales
  let filtered = orders

  if (filters.status !== 'ALL') {
    filtered = filtered.filter(order => order.status === filters.status)
  }

  if (filters.outletId) {
    filtered = filtered.filter(order => order.outletId === filters.outletId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerEmail.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

export default salesSlice.reducer 