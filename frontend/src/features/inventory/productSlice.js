import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// Mock data for development
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Smart LED Bulb',
    category: 'Electronics',
    sku: 'LED-001',
    price: 29.99,
    cost: 15.00,
    stock: 150,
    minStock: 20,
    maxStock: 200,
    description: 'Energy-efficient LED bulb with smart controls',
    image: '/images/led-bulb.jpg',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
    outletId: 1,
  },
  {
    id: 2,
    name: 'Wireless Charger',
    category: 'Electronics',
    sku: 'WC-002',
    price: 49.99,
    cost: 25.00,
    stock: 75,
    minStock: 10,
    maxStock: 100,
    description: 'Fast wireless charging pad for smartphones',
    image: '/images/wireless-charger.jpg',
    status: 'ACTIVE',
    createdAt: '2024-01-16T11:00:00Z',
    outletId: 1,
  },
  {
    id: 3,
    name: 'Smart Thermostat',
    category: 'Home Automation',
    sku: 'ST-003',
    price: 199.99,
    cost: 120.00,
    stock: 25,
    minStock: 5,
    maxStock: 50,
    description: 'WiFi-enabled smart thermostat with energy savings',
    image: '/images/thermostat.jpg',
    status: 'ACTIVE',
    createdAt: '2024-01-17T12:00:00Z',
    outletId: 2,
  },
]

const MOCK_CATEGORIES = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 2, name: 'Home Automation', description: 'Smart home devices and systems' },
  { id: 3, name: 'Lighting', description: 'Smart lighting solutions' },
  { id: 4, name: 'Security', description: 'Home security devices' },
]

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      return MOCK_PRODUCTS
    } catch (error) {
      return rejectWithValue('Failed to fetch products')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      return MOCK_CATEGORIES
    } catch (error) {
      return rejectWithValue('Failed to fetch categories')
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      const newProduct = {
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
      }
      toast.success('Product created successfully!')
      return newProduct
    } catch (error) {
      toast.error('Failed to create product')
      return rejectWithValue('Failed to create product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Product updated successfully!')
      return { id, ...productData }
    } catch (error) {
      toast.error('Failed to update product')
      return rejectWithValue('Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Product deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete product')
      return rejectWithValue('Failed to delete product')
    }
  }
)

export const updateStock = createAsyncThunk(
  'product/updateStock',
  async ({ id, quantity, type }, { rejectWithValue }) => {
    try {
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 300))
      const message = type === 'add' ? 'Stock added successfully!' : 'Stock updated successfully!'
      toast.success(message)
      return { id, quantity, type }
    } catch (error) {
      toast.error('Failed to update stock')
      return rejectWithValue('Failed to update stock')
    }
  }
)

// Initial state
const initialState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: 'ALL',
    status: 'ALL',
    search: '',
    outletId: null,
  },
}

// Product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { category: 'ALL', status: 'ALL', search: '', outletId: null }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload)
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...action.payload }
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = { ...state.selectedProduct, ...action.payload }
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload)
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null
        }
      })
      // Update stock
      .addCase(updateStock.fulfilled, (state, action) => {
        const product = state.products.find(p => p.id === action.payload.id)
        if (product) {
          if (action.payload.type === 'add') {
            product.stock += action.payload.quantity
          } else {
            product.stock = action.payload.quantity
          }
        }
        if (state.selectedProduct?.id === action.payload.id) {
          if (action.payload.type === 'add') {
            state.selectedProduct.stock += action.payload.quantity
          } else {
            state.selectedProduct.stock = action.payload.quantity
          }
        }
      })
  },
})

// Export actions
export const { 
  setSelectedProduct, 
  clearSelectedProduct, 
  setFilters, 
  clearFilters, 
  clearError 
} = productSlice.actions

// Export selectors
export const selectProducts = (state) => state.product.products
export const selectCategories = (state) => state.product.categories
export const selectSelectedProduct = (state) => state.product.selectedProduct
export const selectProductLoading = (state) => state.product.loading
export const selectProductError = (state) => state.product.error
export const selectProductFilters = (state) => state.product.filters

// Helper selectors
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.product
  let filtered = products

  if (filters.category !== 'ALL') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  if (filters.status !== 'ALL') {
    filtered = filtered.filter(product => product.status === filters.status)
  }

  if (filters.outletId) {
    filtered = filtered.filter(product => product.outletId === filters.outletId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

export const selectLowStockProducts = (state) => {
  return state.product.products.filter(product => product.stock <= product.minStock)
}

export const selectOutOfStockProducts = (state) => {
  return state.product.products.filter(product => product.stock === 0)
}

export default productSlice.reducer 