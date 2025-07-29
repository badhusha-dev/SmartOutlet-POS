import axios from 'axios';
import { 
  InventoryItem, 
  StockLevel, 
  StockTransaction, 
  StockAlert,
  StockReceiveRequest,
  StockTransferRequest,
  StockAdjustmentRequest,
  InventoryStatus,
  TransactionType,
  AlertType,
  AlertStatus,
  AlertPriority,
  InventoryFilters,
  TransactionFilters,
  AlertFilters
} from '../types/inventory';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086/api/inventory';

// Create axios instance with auth header interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  
  return config;
});

export const inventoryService = {
  // Stock Operations
  async receiveStock(request: StockReceiveRequest): Promise<InventoryItem> {
    const response = await api.post('/receive', request);
    return response.data;
  },

  async transferStock(request: StockTransferRequest): Promise<void> {
    await api.post('/transfer', request);
  },

  async adjustStock(request: StockAdjustmentRequest): Promise<InventoryItem> {
    const response = await api.post('/adjust', request);
    return response.data;
  },

  // Stock Levels
  async getStockLevelsByOutlet(outletId: number): Promise<StockLevel[]> {
    const response = await api.get(`/outlets/${outletId}/stock-levels`);
    return response.data;
  },

  async getStockLevelsByProduct(productId: number): Promise<StockLevel[]> {
    const response = await api.get(`/products/${productId}/stock-levels`);
    return response.data;
  },

  async getStockLevel(productId: number, outletId: number): Promise<StockLevel> {
    const response = await api.get(`/products/${productId}/outlets/${outletId}/stock-level`);
    return response.data;
  },

  // Inventory Items
  async searchInventoryItems(filters: InventoryFilters & {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<{ content: InventoryItem[]; totalElements: number; totalPages: number }> {
    const params = new URLSearchParams();
    
    if (filters.outletId) params.append('outletId', filters.outletId.toString());
    if (filters.productId) params.append('productId', filters.productId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.batchNumber) params.append('batchNumber', filters.batchNumber);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const response = await api.get(`/items?${params.toString()}`);
    return response.data;
  },

  async getInventoryItem(itemId: number): Promise<InventoryItem> {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  },

  async updateInventoryItemStatus(
    itemId: number, 
    status: InventoryStatus, 
    reason: string
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append('status', status);
    params.append('reason', reason);
    
    await api.put(`/items/${itemId}/status?${params.toString()}`);
  },

  // Expiry Management
  async getExpiringItems(outletId: number, days: number = 30): Promise<InventoryItem[]> {
    const response = await api.get(`/outlets/${outletId}/expiring?days=${days}`);
    return response.data;
  },

  async getExpiredItems(outletId: number): Promise<InventoryItem[]> {
    const response = await api.get(`/outlets/${outletId}/expired`);
    return response.data;
  },

  // Stock Alerts
  async getLowStockProducts(outletId: number): Promise<StockLevel[]> {
    const response = await api.get(`/outlets/${outletId}/low-stock`);
    return response.data;
  },

  async getOutOfStockProducts(outletId: number): Promise<StockLevel[]> {
    const response = await api.get(`/outlets/${outletId}/out-of-stock`);
    return response.data;
  },

  // Stock Reservations
  async reserveStock(
    productId: number, 
    outletId: number, 
    quantity: number, 
    referenceId: string
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append('quantity', quantity.toString());
    params.append('referenceId', referenceId);
    
    await api.post(`/products/${productId}/outlets/${outletId}/reserve?${params.toString()}`);
  },

  async releaseReservation(
    productId: number, 
    outletId: number, 
    quantity: number, 
    referenceId: string
  ): Promise<void> {
    const params = new URLSearchParams();
    params.append('quantity', quantity.toString());
    params.append('referenceId', referenceId);
    
    await api.post(`/products/${productId}/outlets/${outletId}/release-reservation?${params.toString()}`);
  },

  // Stock Summary
  async getStockSummary(productId: number, outletId: number): Promise<{
    totalAvailableStock: number;
    totalStockAllOutlets: number;
    productId: number;
    outletId: number;
  }> {
    const response = await api.get(`/products/${productId}/outlets/${outletId}/summary`);
    return response.data;
  },

  // Mock methods for development (replace with actual alert service later)
  async getStockAlerts(filters: AlertFilters): Promise<StockAlert[]> {
    // Mock implementation - replace with actual API call
    return [];
  },

  async acknowledgeAlert(alertId: number): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log('Acknowledging alert:', alertId);
  },

  async resolveAlert(alertId: number, notes: string): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log('Resolving alert:', alertId, notes);
  },

  // Transactions (mock for now)
  async getStockTransactions(filters: TransactionFilters): Promise<StockTransaction[]> {
    // Mock implementation - replace with actual API call
    return [];
  },
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getExpiryStatusIcon = (status: string): string => {
  switch (status) {
    case 'FRESH': return '🟢';
    case 'WARNING': return '🟡';
    case 'CRITICAL': return '🟠';
    case 'EXPIRED': return '🔴';
    default: return '⚪';
  }
};

export const getStockStatusIcon = (status: string): string => {
  switch (status) {
    case 'ADEQUATE': return '✅';
    case 'LOW_STOCK': return '⚠️';
    case 'OUT_OF_STOCK': return '❌';
    case 'EXPIRING_ITEMS': return '⏰';
    default: return '❓';
  }
};

export const getDaysToExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default inventoryService;