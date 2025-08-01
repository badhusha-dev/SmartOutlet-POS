import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface POSState {
  products: Product[]
  cart: CartItem[]
  loading: boolean
  error: string | null
  selectedCategory: string
  searchTerm: string
}

const initialState: POSState = {
  products: [],
  cart: [],
  loading: false,
  error: null,
  selectedCategory: 'ALL',
  searchTerm: '',
}

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.cart.push({ ...action.payload, quantity: 1 })
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.cart.find(item => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.cart = []
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setProducts,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setSelectedCategory,
  setSearchTerm,
  setLoading,
  setError,
} = posSlice.actions

export default posSlice.reducer