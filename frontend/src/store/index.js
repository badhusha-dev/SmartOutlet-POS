import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

// Import slices from feature directories
import authSlice from '../store/slices/authSlice'
import themeSlice from '../store/slices/themeSlice'
import outletSlice from '../features/outlet/outletSlice'
import productSlice from '../features/inventory/productSlice'
import salesSlice from '../features/sales/salesSlice'
import expenseSlice from '../features/expense/expenseSlice'
import uiSlice from '../store/slices/uiSlice'
import notificationSlice from '../features/notification/notificationSlice'

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme', 'ui'], // Only persist these slices
}

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  outlet: outletSlice,
  product: productSlice,
  sales: salesSlice,
  expense: expenseSlice,
  ui: uiSlice,
  notification: notificationSlice,
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor
export const persistor = persistStore(store) 