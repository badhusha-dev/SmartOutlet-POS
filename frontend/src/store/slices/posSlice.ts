import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Customer, Order, OrderItem, KPIMetrics } from '../../types/pos';

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'pos/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
);

export const fetchCustomers = createAsyncThunk(
  'pos/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customers');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'pos/fetchOrders',
  async (outletId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pos/outlets/${outletId}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
    }
  }
);

export const fetchKPIMetrics = createAsyncThunk(
  'pos/fetchKPIMetrics',
  async (outletId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/pos/outlets/${outletId}/metrics`);
      if (!response.ok) throw new Error('Failed to fetch KPI metrics');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch KPI metrics');
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  'pos/fetchTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products/top');
      if (!response.ok) throw new Error('Failed to fetch top products');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch top products');
    }
  }
);

export const createOrder = createAsyncThunk(
  'pos/createOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'pos/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update order status');
    }
  }
);

export const processPayment = createAsyncThunk(
  'pos/processPayment',
  async (paymentData: { orderId: string; paymentMethod: string; amount: number }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) throw new Error('Payment failed');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Payment failed');
    }
  }
);

// Initial state
interface POSState {
  // Products
  products: Product[];
  topProducts: Product[];
  productsLoading: boolean;
  productsError: string | null;

  // Customers
  customers: Customer[];
  selectedCustomer: Customer | null;
  customersLoading: boolean;
  customersError: string | null;

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  ordersLoading: boolean;
  ordersError: string | null;

  // KPI Metrics
  kpiMetrics: KPIMetrics | null;
  kpiLoading: boolean;
  kpiError: string | null;

  // UI State
  loading: boolean;
  error: string | null;
}

const initialState: POSState = {
  // Products
  products: [],
  topProducts: [],
  productsLoading: false,
  productsError: null,

  // Customers
  customers: [],
  selectedCustomer: null,
  customersLoading: false,
  customersError: null,

  // Orders
  orders: [],
  currentOrder: null,
  ordersLoading: false,
  ordersError: null,

  // KPI Metrics
  kpiMetrics: null,
  kpiLoading: false,
  kpiError: null,

  // UI State
  loading: false,
  error: null,
};

// Helper function to calculate order totals
const calculateOrderTotals = (items: OrderItem[]): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

// Helper function to create a new order
const createNewOrder = (): Order => ({
  id: `order-${Date.now()}`,
  items: [],
  customerId: null,
  customerName: null,
  status: 'OPEN',
  paymentStatus: 'PENDING',
  paymentMethod: 'CASH',
  subtotal: 0,
  tax: 0,
  taxRate: 8,
  total: 0,
  tip: 0,
  discount: 0,
  loyaltyPointsEarned: 0,
  loyaltyPointsRedeemed: 0,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    // Current Order Management
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },

    addItemToOrder: (state, action: PayloadAction<{ product: Product; quantity: number; notes?: string }>) => {
      const { product, quantity, notes } = action.payload;
      
      if (!state.currentOrder) {
        state.currentOrder = createNewOrder();
      }

      const existingItemIndex = state.currentOrder.items.findIndex(
        item => item.product.id === product.id && item.notes === notes
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        state.currentOrder.items[existingItemIndex].quantity += quantity;
        state.currentOrder.items[existingItemIndex].totalPrice = 
          state.currentOrder.items[existingItemIndex].product.price * 
          state.currentOrder.items[existingItemIndex].quantity;
      } else {
        // Add new item
        const newItem: OrderItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          product,
          quantity,
          notes: notes || '',
          totalPrice: product.price * quantity,
        };
        state.currentOrder.items.push(newItem);
      }

      // Recalculate totals
      const totals = calculateOrderTotals(state.currentOrder.items);
      state.currentOrder.subtotal = totals.subtotal;
      state.currentOrder.tax = totals.tax;
      state.currentOrder.total = totals.total;
      state.currentOrder.updatedAt = new Date().toISOString();
    },

    removeItemFromOrder: (state, action: PayloadAction<string>) => {
      if (!state.currentOrder) return;

      const itemId = action.payload;
      state.currentOrder.items = state.currentOrder.items.filter(item => item.id !== itemId);

      // Recalculate totals
      const totals = calculateOrderTotals(state.currentOrder.items);
      state.currentOrder.subtotal = totals.subtotal;
      state.currentOrder.tax = totals.tax;
      state.currentOrder.total = totals.total;
      state.currentOrder.updatedAt = new Date().toISOString();
    },

    updateItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      if (!state.currentOrder) return;

      const { itemId, quantity } = action.payload;
      const item = state.currentOrder.items.find(item => item.id === itemId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        item.totalPrice = item.product.price * quantity;

        // Recalculate totals
        const totals = calculateOrderTotals(state.currentOrder.items);
        state.currentOrder.subtotal = totals.subtotal;
        state.currentOrder.tax = totals.tax;
        state.currentOrder.total = totals.total;
        state.currentOrder.updatedAt = new Date().toISOString();
      }
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    setOrderNotes: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.notes = action.payload;
        state.currentOrder.updatedAt = new Date().toISOString();
      }
    },

    setOrderCustomer: (state, action: PayloadAction<Customer | null>) => {
      if (state.currentOrder) {
        state.currentOrder.customerId = action.payload?.id || null;
        state.currentOrder.customerName = action.payload?.name || null;
        state.currentOrder.updatedAt = new Date().toISOString();
      }
      state.selectedCustomer = action.payload;
    },

    // Orders Management
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },

    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },

    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },

    // Products Management
    updateProductStock: (state, action: PayloadAction<{ productId: string; newStock: number }>) => {
      const { productId, newStock } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock = newStock;
      }
    },

    // Customers Management
    updateCustomerLoyaltyPoints: (state, action: PayloadAction<{ customerId: string; points: number }>) => {
      const { customerId, points } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      if (customer) {
        customer.loyaltyPoints = points;
      }
    },

    // UI State
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });

    // Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.productsLoading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });

    // Customers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customersLoading = true;
        state.customersError = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.customersError = action.payload as string;
      });

    // Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload as string;
      });

    // KPI Metrics
    builder
      .addCase(fetchKPIMetrics.pending, (state) => {
        state.kpiLoading = true;
        state.kpiError = null;
      })
      .addCase(fetchKPIMetrics.fulfilled, (state, action) => {
        state.kpiLoading = false;
        state.kpiMetrics = action.payload;
      })
      .addCase(fetchKPIMetrics.rejected, (state, action) => {
        state.kpiLoading = false;
        state.kpiError = action.payload as string;
      });

    // Create Order
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.currentOrder = null;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });

    // Process Payment
    builder
      .addCase(processPayment.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.orderId);
        if (index !== -1) {
          state.orders[index].paymentStatus = 'PAID';
          state.orders[index].status = 'COMPLETED';
          state.orders[index].completedAt = new Date().toISOString();
        }
      });
  },
});

export const {
  setCurrentOrder,
  addItemToOrder,
  removeItemFromOrder,
  updateItemQuantity,
  clearCurrentOrder,
  setOrderNotes,
  setOrderCustomer,
  addOrder,
  updateOrder,
  removeOrder,
  updateProductStock,
  updateCustomerLoyaltyPoints,
  setLoading,
  setError,
  clearError,
} = posSlice.actions;

export default posSlice.reducer;