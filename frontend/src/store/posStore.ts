import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { POSState, Order, Product, Customer } from '../types/pos';

interface POSActions {
  // Order actions
  setCurrentOrder: (order: Order | null) => void;
  addItemToOrder: (product: Product, quantity: number, notes?: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCurrentOrder: () => void;

  // Orders list actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;

  // Products actions
  setProducts: (products: Product[]) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Customers actions
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  updateCustomerLoyaltyPoints: (customerId: string, points: number) => void;

  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility actions
  calculateOrderTotals: () => void;
}

const initialState: POSState = {
  currentOrder: null,
  orders: [],
  products: [],
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
};

export const usePOSStore = create<POSState & POSActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentOrder: (order) => set({ currentOrder: order }),

      addItemToOrder: (product, quantity, notes) => {
        const { currentOrder } = get();
        if (!currentOrder) {
          const newOrder: Order = {
            id: `temp-${Date.now()}`,
            items: [{
              id: `item-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              quantity,
              unitPrice: product.price,
              totalPrice: product.price * quantity,
              notes,
              allergens: product.allergens,
            }],
            subtotal: product.price * quantity,
            tax: 0,
            discount: 0,
            total: product.price * quantity,
            status: 'OPEN',
            paymentMethod: 'CASH',
            paymentStatus: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ currentOrder: newOrder });
        } else {
          const existingItemIndex = currentOrder.items.findIndex(
            item => item.productId === product.id
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...currentOrder.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].totalPrice = 
              updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;

            const updatedOrder = {
              ...currentOrder,
              items: updatedItems,
            };
            set({ currentOrder: updatedOrder });
          } else {
            const newItem = {
              id: `item-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              quantity,
              unitPrice: product.price,
              totalPrice: product.price * quantity,
              notes,
              allergens: product.allergens,
            };

            const updatedOrder = {
              ...currentOrder,
              items: [...currentOrder.items, newItem],
            };
            set({ currentOrder: updatedOrder });
          }
        }
        get().calculateOrderTotals();
      },

      removeItemFromOrder: (itemId) => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        const updatedOrder = {
          ...currentOrder,
          items: currentOrder.items.filter(item => item.id !== itemId),
        };
        set({ currentOrder: updatedOrder });
        get().calculateOrderTotals();
      },

      updateItemQuantity: (itemId, quantity) => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        const updatedItems = currentOrder.items.map(item =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
            : item
        );

        const updatedOrder = {
          ...currentOrder,
          items: updatedItems,
        };
        set({ currentOrder: updatedOrder });
        get().calculateOrderTotals();
      },

      clearCurrentOrder: () => set({ currentOrder: null }),

      setOrders: (orders) => set({ orders }),

      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [order, ...orders] });
      },

      updateOrder: (orderId, updates) => {
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
        );
        set({ orders: updatedOrders });
      },

      removeOrder: (orderId) => {
        const { orders } = get();
        set({ orders: orders.filter(order => order.id !== orderId) });
      },

      setProducts: (products) => set({ products }),

      updateProductStock: (productId, newStock) => {
        const { products } = get();
        const updatedProducts = products.map(product =>
          product.id === productId ? { ...product, stock: newStock } : product
        );
        set({ products: updatedProducts });
      },

      setCustomers: (customers) => set({ customers }),

      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

      updateCustomerLoyaltyPoints: (customerId, points) => {
        const { customers } = get();
        const updatedCustomers = customers.map(customer =>
          customer.id === customerId ? { ...customer, loyaltyPoints: points } : customer
        );
        set({ customers: updatedCustomers });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      calculateOrderTotals: () => {
        const { currentOrder } = get();
        if (!currentOrder) return;

        const subtotal = currentOrder.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + tax - currentOrder.discount;

        const updatedOrder = {
          ...currentOrder,
          subtotal,
          tax,
          total,
        };
        set({ currentOrder: updatedOrder });
      },
    }),
    {
      name: 'pos-store',
    }
  )
);

export const usePOSStore = () => {
  const store = useStore();

  // Mock functions for development
  const addItemToOrder = (product: any, quantity: number) => {
    console.log('🔓 Development mode: Adding item to order', { product, quantity });
    store.addItemToOrder({ product, quantity });
  };

  const clearCurrentOrder = () => {
    console.log('🔓 Development mode: Clearing current order');
    store.clearCurrentOrder();
  };

  const setError = (error: string) => {
    console.log('🔓 Development mode: Setting error', error);
    store.setError(error);
  };

  return {
    ...store,
    addItemToOrder,
    clearCurrentOrder,
    setError,
    // Add any additional computed values or derived state here
  };
};