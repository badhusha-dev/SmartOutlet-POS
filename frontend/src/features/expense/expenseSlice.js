import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// Mock data for development
const MOCK_EXPENSES = [
  {
    id: 1,
    outletId: 1,
    outletName: 'Downtown SmartOutlet',
    category: 'Utilities',
    subcategory: 'Electricity',
    description: 'Monthly electricity bill',
    amount: 450.00,
    date: '2024-01-15T00:00:00Z',
    paymentMethod: 'BANK_TRANSFER',
    status: 'PAID',
    receipt: '/receipts/electricity-jan-2024.pdf',
    notes: 'Higher than usual due to increased AC usage',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'John Smith',
  },
  {
    id: 2,
    outletId: 1,
    outletName: 'Downtown SmartOutlet',
    category: 'Inventory',
    subcategory: 'Stock Purchase',
    description: 'Smart LED bulbs restock',
    amount: 1200.00,
    date: '2024-01-18T00:00:00Z',
    paymentMethod: 'CREDIT_CARD',
    status: 'PAID',
    receipt: '/receipts/led-bulbs-jan-2024.pdf',
    notes: 'Bulk purchase for upcoming promotion',
    createdAt: '2024-01-18T14:30:00Z',
    createdBy: 'Sarah Johnson',
  },
  {
    id: 3,
    outletId: 2,
    outletName: 'Mall SmartOutlet',
    category: 'Rent',
    subcategory: 'Monthly Rent',
    description: 'Monthly store rent',
    amount: 2500.00,
    date: '2024-01-01T00:00:00Z',
    paymentMethod: 'BANK_TRANSFER',
    status: 'PAID',
    receipt: '/receipts/rent-jan-2024.pdf',
    notes: 'Standard monthly rent payment',
    createdAt: '2024-01-01T09:00:00Z',
    createdBy: 'Emily Davis',
  },
]

const MOCK_CATEGORIES = [
  { id: 1, name: 'Utilities', subcategories: ['Electricity', 'Water', 'Internet', 'Phone'] },
  { id: 2, name: 'Rent', subcategories: ['Monthly Rent', 'Security Deposit', 'Maintenance'] },
  { id: 3, name: 'Inventory', subcategories: ['Stock Purchase', 'Shipping', 'Returns'] },
  { id: 4, name: 'Marketing', subcategories: ['Advertising', 'Promotions', 'Events'] },
  { id: 5, name: 'Staff', subcategories: ['Salaries', 'Benefits', 'Training'] },
  { id: 6, name: 'Equipment', subcategories: ['POS System', 'Computers', 'Furniture'] },
  { id: 7, name: 'Insurance', subcategories: ['Business Insurance', 'Liability', 'Property'] },
  { id: 8, name: 'Other', subcategories: ['Miscellaneous', 'Repairs', 'Legal'] },
]

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      return MOCK_EXPENSES
    } catch (error) {
      return rejectWithValue('Failed to fetch expenses')
    }
  }
)

export const fetchExpenseCategories = createAsyncThunk(
  'expense/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      return MOCK_CATEGORIES
    } catch (error) {
      return rejectWithValue('Failed to fetch expense categories')
    }
  }
)

export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newExpense = {
        id: Date.now(),
        ...expenseData,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User', // This would come from auth context
      }
      toast.success('Expense added successfully!')
      return newExpense
    } catch (error) {
      toast.error('Failed to add expense')
      return rejectWithValue('Failed to add expense')
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Expense updated successfully!')
      return { id, ...expenseData }
    } catch (error) {
      toast.error('Failed to update expense')
      return rejectWithValue('Failed to update expense')
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Expense deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete expense')
      return rejectWithValue('Failed to delete expense')
    }
  }
)

export const updateExpenseStatus = createAsyncThunk(
  'expense/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 300))
      toast.success('Expense status updated successfully!')
      return { id, status }
    } catch (error) {
      toast.error('Failed to update expense status')
      return rejectWithValue('Failed to update expense status')
    }
  }
)

// Initial state
const initialState = {
  expenses: [],
  categories: [],
  selectedExpense: null,
  loading: false,
  error: null,
  filters: {
    dateRange: 'THIS_MONTH',
    category: 'ALL',
    status: 'ALL',
    outletId: null,
    search: '',
  },
  stats: {
    totalExpenses: 0,
    monthlyExpenses: 0,
    averageExpense: 0,
    pendingExpenses: 0,
    categoryBreakdown: {},
  },
}

// Expense slice
const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setSelectedExpense: (state, action) => {
      state.selectedExpense = action.payload
    },
    clearSelectedExpense: (state) => {
      state.selectedExpense = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { 
        dateRange: 'THIS_MONTH', 
        category: 'ALL', 
        status: 'ALL', 
        outletId: null, 
        search: '' 
      }
    },
    updateStats: (state) => {
      const totalExpenses = state.expenses.length
      const totalAmount = state.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const pendingExpenses = state.expenses.filter(expense => expense.status === 'PENDING').length
      
      // Calculate monthly expenses (current month)
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const monthlyExpenses = state.expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
        })
        .reduce((sum, expense) => sum + expense.amount, 0)
      
      // Category breakdown
      const categoryBreakdown = {}
      state.expenses.forEach(expense => {
        if (!categoryBreakdown[expense.category]) {
          categoryBreakdown[expense.category] = 0
        }
        categoryBreakdown[expense.category] += expense.amount
      })
      
      state.stats = {
        totalExpenses,
        monthlyExpenses,
        averageExpense: totalExpenses > 0 ? totalAmount / totalExpenses : 0,
        pendingExpenses,
        categoryBreakdown,
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload
        state.error = null
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch categories
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      // Create expense
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload)
      })
      // Update expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.expenses[index] = { ...state.expenses[index], ...action.payload }
        }
        if (state.selectedExpense?.id === action.payload.id) {
          state.selectedExpense = { ...state.selectedExpense, ...action.payload }
        }
      })
      // Delete expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload)
        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null
        }
      })
      // Update expense status
      .addCase(updateExpenseStatus.fulfilled, (state, action) => {
        const expense = state.expenses.find(e => e.id === action.payload.id)
        if (expense) {
          expense.status = action.payload.status
        }
        if (state.selectedExpense?.id === action.payload.id) {
          state.selectedExpense.status = action.payload.status
        }
      })
  },
})

// Export actions
export const { 
  setSelectedExpense, 
  clearSelectedExpense, 
  setFilters, 
  clearFilters, 
  updateStats, 
  clearError 
} = expenseSlice.actions

// Export selectors
export const selectExpenses = (state) => state.expense.expenses
export const selectExpenseCategories = (state) => state.expense.categories
export const selectSelectedExpense = (state) => state.expense.selectedExpense
export const selectExpenseLoading = (state) => state.expense.loading
export const selectExpenseError = (state) => state.expense.error
export const selectExpenseFilters = (state) => state.expense.filters
export const selectExpenseStats = (state) => state.expense.stats

// Helper selectors
export const selectFilteredExpenses = (state) => {
  const { expenses, filters } = state.expense
  let filtered = expenses

  if (filters.category !== 'ALL') {
    filtered = filtered.filter(expense => expense.category === filters.category)
  }

  if (filters.status !== 'ALL') {
    filtered = filtered.filter(expense => expense.status === filters.status)
  }

  if (filters.outletId) {
    filtered = filtered.filter(expense => expense.outletId === filters.outletId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(expense =>
      expense.description.toLowerCase().includes(searchLower) ||
      expense.notes.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower)
    )
  }

  // Date range filtering
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  switch (filters.dateRange) {
    case 'TODAY':
      filtered = filtered.filter(expense => new Date(expense.date) >= today)
      break
    case 'YESTERDAY':
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= yesterday && expenseDate < today
      })
      break
    case 'LAST_WEEK':
      filtered = filtered.filter(expense => new Date(expense.date) >= lastWeek)
      break
    case 'LAST_MONTH':
      filtered = filtered.filter(expense => new Date(expense.date) >= lastMonth)
      break
    case 'THIS_MONTH':
      filtered = filtered.filter(expense => new Date(expense.date) >= thisMonthStart)
      break
    default:
      break
  }

  return filtered
}

export const selectPendingExpenses = (state) => {
  return state.expense.expenses.filter(expense => expense.status === 'PENDING')
}

export const selectExpensesByCategory = (state, category) => {
  return state.expense.expenses.filter(expense => expense.category === category)
}

export default expenseSlice.reducer 