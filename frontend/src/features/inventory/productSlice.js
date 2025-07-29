import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { productApi, API_ENDPOINTS } from '../../services/client'

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

// Development mode flags
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true'

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return MOCK_PRODUCTS
      }
      const response = await productApi.get(API_ENDPOINTS.PRODUCTS)
      return response.data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch products')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return MOCK_CATEGORIES
      }
      const response = await productApi.get(API_ENDPOINTS.CATEGORIES)
      return response.data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch categories')
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newProduct = {
          id: Date.now(),
          ...productData,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        }
        toast.success('Product created successfully!')
        return newProduct
      }
      const response = await productApi.post(API_ENDPOINTS.PRODUCTS, productData)
      toast.success('Product created successfully!')
      return response.data.data
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
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        toast.success('Product updated successfully!')
        return { id, ...productData }
      }
      const response = await productApi.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData)
      toast.success('Product updated successfully!')
      return response.data.data
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
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        toast.success('Product deleted successfully!')
        return id
      }
      await productApi.delete(API_ENDPOINTS.PRODUCT_BY_ID(id))
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
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const message = type === 'add' ? 'Stock added successfully!' : 'Stock updated successfully!'
        toast.success(message)
        return { id, quantity, type }
      }
      // For real API, you may need to adjust payload structure
      const response = await productApi.post(API_ENDPOINTS.STOCK_UPDATE, {
        productId: id,
        quantity,
        movementType: type === 'add' ? 'IN' : 'ADJUST',
        reason: type === 'add' ? 'Restock' : 'Manual update',
      })
      toast.success('Stock updated successfully!')
      return { id, quantity: response.data.data.quantity, type }
    } catch (error) {
      toast.error('Failed to update stock')
      return rejectWithValue('Failed to update stock')
    }
  }
)

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return MOCK_PRODUCTS.find(p => p.id === id)
      }
      const response = await productApi.get(API_ENDPOINTS.PRODUCT_BY_ID(id))
      return response.data.data
    } catch (error) {
      return rejectWithValue('Failed to fetch product')
    }
  }
)

// Create category
export const createCategory = createAsyncThunk(
  'product/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newCategory = { id: Date.now(), ...categoryData }
        toast.success('Category created successfully!')
        return newCategory
      }
      const response = await productApi.post(API_ENDPOINTS.CATEGORIES, categoryData)
      toast.success('Category created successfully!')
      return response.data.data
    } catch (error) {
      toast.error('Failed to create category')
      return rejectWithValue('Failed to create category')
    }
  }
)

// Update category
export const updateCategory = createAsyncThunk(
  'product/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        toast.success('Category updated successfully!')
        return { id, ...categoryData }
      }
      const response = await productApi.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData)
      toast.success('Category updated successfully!')
      return response.data.data
    } catch (error) {
      toast.error('Failed to update category')
      return rejectWithValue('Failed to update category')
    }
  }
)

// Delete category
export const deleteCategory = createAsyncThunk(
  'product/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      if (DEV_MODE && DISABLE_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500))
        toast.success('Category deleted successfully!')
        return id
      }
      await productApi.delete(API_ENDPOINTS.CATEGORY_BY_ID(id))
      toast.success('Category deleted successfully!')
      return id
    } catch (error) {
      toast.error('Failed to delete category')
      return rejectWithValue('Failed to delete category')
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