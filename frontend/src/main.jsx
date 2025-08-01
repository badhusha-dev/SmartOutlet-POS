
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
<<<<<<< HEAD
import { QueryClient, QueryClientProvider } from 'react-query'
=======
>>>>>>> 48f467dcaee06763c597d129975134e2ee7cdf45
import { AuthProvider } from './contexts/AuthContext'
import { store } from './store'
import App from './App.jsx'
import './index.css'
<<<<<<< HEAD

// Configure React Query client
=======
import { QueryClient, QueryClientProvider } from 'react-query'
import productSlice from './features/inventory/productSlice'

// Configure Redux store
>>>>>>> 48f467dcaee06763c597d129975134e2ee7cdf45
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
<<<<<<< HEAD
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
=======
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
>>>>>>> 48f467dcaee06763c597d129975134e2ee7cdf45
