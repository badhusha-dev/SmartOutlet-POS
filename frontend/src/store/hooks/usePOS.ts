import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../index';
import {
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
  fetchProducts,
  fetchCustomers,
  fetchOrders,
  fetchKPIMetrics,
  fetchTopProducts,
  createOrder,
  updateOrderStatus,
  processPayment,
} from '../slices/posSlice';
import { Product, Customer, Order } from '../../types/pos';

// POS State Selectors
export const usePOSState = () => {
  return useAppSelector((state) => state.pos);
};

export const useProducts = () => {
  return useAppSelector((state) => ({
    products: state.pos.products,
    topProducts: state.pos.topProducts,
    loading: state.pos.productsLoading,
    error: state.pos.productsError,
  }));
};

export const useCustomers = () => {
  return useAppSelector((state) => ({
    customers: state.pos.customers,
    selectedCustomer: state.pos.selectedCustomer,
    loading: state.pos.customersLoading,
    error: state.pos.customersError,
  }));
};

export const useOrders = () => {
  return useAppSelector((state) => ({
    orders: state.pos.orders,
    currentOrder: state.pos.currentOrder,
    loading: state.pos.ordersLoading,
    error: state.pos.ordersError,
  }));
};

export const useKPIMetrics = () => {
  return useAppSelector((state) => ({
    metrics: state.pos.kpiMetrics,
    loading: state.pos.kpiLoading,
    error: state.pos.kpiError,
  }));
};

export const useCurrentOrder = () => {
  return useAppSelector((state) => state.pos.currentOrder);
};

// POS Actions
export const usePOSActions = () => {
  const dispatch = useAppDispatch();

  return {
    // Data fetching
    fetchProducts: useCallback(() => dispatch(fetchProducts()), [dispatch]),
    fetchCustomers: useCallback(() => dispatch(fetchCustomers()), [dispatch]),
    fetchOrders: useCallback((outletId: string) => dispatch(fetchOrders(outletId)), [dispatch]),
    fetchKPIMetrics: useCallback((outletId: string) => dispatch(fetchKPIMetrics(outletId)), [dispatch]),
    fetchTopProducts: useCallback(() => dispatch(fetchTopProducts()), [dispatch]),

    // Order management
    addItemToOrder: useCallback(
      (product: Product, quantity: number, notes?: string) =>
        dispatch(addItemToOrder({ product, quantity, notes })),
      [dispatch]
    ),

    removeItemFromOrder: useCallback(
      (itemId: string) => dispatch(removeItemFromOrder(itemId)),
      [dispatch]
    ),

    updateItemQuantity: useCallback(
      (itemId: string, quantity: number) =>
        dispatch(updateItemQuantity({ itemId, quantity })),
      [dispatch]
    ),

    clearCurrentOrder: useCallback(() => dispatch(clearCurrentOrder()), [dispatch]),

    setOrderNotes: useCallback(
      (notes: string) => dispatch(setOrderNotes(notes)),
      [dispatch]
    ),

    setOrderCustomer: useCallback(
      (customer: Customer | null) => dispatch(setOrderCustomer(customer)),
      [dispatch]
    ),

    // Order operations
    createOrder: useCallback(
      (orderData: Partial<Order>) => dispatch(createOrder(orderData)),
      [dispatch]
    ),

    updateOrder: useCallback(
      (order: Order) => dispatch(updateOrder(order)),
      [dispatch]
    ),

    removeOrder: useCallback(
      (orderId: string) => dispatch(removeOrder(orderId)),
      [dispatch]
    ),

    updateOrderStatus: useCallback(
      (orderId: string, status: Order['status']) =>
        dispatch(updateOrderStatus({ orderId, status })),
      [dispatch]
    ),

    processPayment: useCallback(
      (orderId: string, paymentMethod: string, amount: number) =>
        dispatch(processPayment({ orderId, paymentMethod, amount })),
      [dispatch]
    ),

    // Product operations
    updateProductStock: useCallback(
      (productId: string, newStock: number) =>
        dispatch(updateProductStock({ productId, newStock })),
      [dispatch]
    ),

    // Customer operations
    updateCustomerLoyaltyPoints: useCallback(
      (customerId: string, points: number) =>
        dispatch(updateCustomerLoyaltyPoints({ customerId, points })),
      [dispatch]
    ),

    // UI operations
    setLoading: useCallback(
      (loading: boolean) => dispatch(setLoading(loading)),
      [dispatch]
    ),

    setError: useCallback(
      (error: string | null) => dispatch(setError(error)),
      [dispatch]
    ),

    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
  };
};

// Combined hook for common POS operations
export const usePOS = () => {
  const state = usePOSState();
  const actions = usePOSActions();

  return {
    ...state,
    ...actions,
  };
};

// Specialized hooks for specific use cases
export const useOrderEntry = () => {
  const { products, loading, error } = useProducts();
  const { currentOrder } = useOrders();
  const { addItemToOrder, removeItemFromOrder, updateItemQuantity, clearCurrentOrder } = usePOSActions();

  return {
    products,
    currentOrder,
    loading,
    error,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    clearCurrentOrder,
  };
};

export const useCheckout = () => {
  const { currentOrder } = useOrders();
  const { createOrder, processPayment, clearCurrentOrder } = usePOSActions();

  return {
    currentOrder,
    createOrder,
    processPayment,
    clearCurrentOrder,
  };
};

export const useOrderHistory = () => {
  const { orders, loading, error } = useOrders();
  const { updateOrderStatus, removeOrder } = usePOSActions();

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    removeOrder,
  };
};

export const useCustomerManagement = () => {
  const { customers, selectedCustomer, loading, error } = useCustomers();
  const { updateCustomerLoyaltyPoints } = usePOSActions();

  return {
    customers,
    selectedCustomer,
    loading,
    error,
    updateCustomerLoyaltyPoints,
  };
};