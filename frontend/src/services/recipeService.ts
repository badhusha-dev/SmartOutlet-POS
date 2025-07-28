import axios from 'axios';
import {
  RawMaterial,
  Recipe,
  Vendor,
  RawMaterialCreateRequest,
  RecipeCreateRequest,
  RawMaterialFilters,
  RecipeFilters,
  MaterialForecast,
  VendorReorderPlan,
  RecipeCostAnalysis,
  UnitOfMeasureInfo
} from '../types/recipe';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api/recipe',
  timeout: 10000,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  
  return config;
});

export const recipeService = {
  // Raw Materials Management
  async getRawMaterials(filters: RawMaterialFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.vendorId) params.append('vendorId', filters.vendorId.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);
    
    const response = await api.get(`/raw-materials?${params}`);
    return response.data;
  },

  async createRawMaterial(data: RawMaterialCreateRequest): Promise<RawMaterial> {
    const response = await api.post('/raw-materials', data);
    return response.data;
  },

  async getRawMaterial(id: number): Promise<RawMaterial> {
    const response = await api.get(`/raw-materials/${id}`);
    return response.data;
  },

  async updateRawMaterial(id: number, data: RawMaterialCreateRequest): Promise<RawMaterial> {
    const response = await api.put(`/raw-materials/${id}`, data);
    return response.data;
  },

  async deleteRawMaterial(id: number): Promise<void> {
    await api.delete(`/raw-materials/${id}`);
  },

  // Recipes Management
  async getRecipes(filters: RecipeFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.productId) params.append('productId', filters.productId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);
    
    const response = await api.get(`/recipes?${params}`);
    return response.data;
  },

  async createRecipe(data: RecipeCreateRequest): Promise<Recipe> {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  async updateRecipe(id: number, data: RecipeCreateRequest): Promise<Recipe> {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  async deleteRecipe(id: number): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  async approveRecipe(id: number): Promise<Recipe> {
    const response = await api.patch(`/recipes/${id}/approve`);
    return response.data;
  },

  async activateRecipe(id: number): Promise<Recipe> {
    const response = await api.patch(`/recipes/${id}/activate`);
    return response.data;
  },

  // Recipe Analysis
  async getRecipeCostAnalysis(id: number, batchQuantity: number = 1): Promise<RecipeCostAnalysis> {
    const response = await api.get(`/recipes/${id}/cost-analysis?batchQuantity=${batchQuantity}`);
    return response.data;
  },

  async getMaterialForecast(
    productId: number, 
    days: number = 30, 
    expectedSales: number = 100
  ): Promise<MaterialForecast> {
    const response = await api.get(
      `/recipes/product/${productId}/forecast?days=${days}&expectedSales=${expectedSales}`
    );
    return response.data;
  },

  // Vendor Management
  async getVendors(materialId?: number): Promise<Vendor[]> {
    const params = materialId ? `?materialId=${materialId}` : '';
    const response = await api.get(`/vendors${params}`);
    return response.data;
  },

  async getVendorReorderPlanning(vendorId: number, planningDays: number = 30): Promise<VendorReorderPlan> {
    const response = await api.get(`/vendors/${vendorId}/reorder-planning?planningDays=${planningDays}`);
    return response.data;
  },

  // Utility endpoints
  async getUnitsOfMeasure(): Promise<UnitOfMeasureInfo[]> {
    const response = await api.get('/units-of-measure');
    return response.data;
  },

  async getMaterialCategories(): Promise<string[]> {
    const response = await api.get('/material-categories');
    return response.data;
  }
};

// Utility functions for UI formatting
export const recipeUtils = {
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatQuantity: (quantity: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(quantity);
  },

  formatDate: (dateString: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  },

  formatDateTime: (dateString: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  },

  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  },

  getStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
      ACTIVE: '#22c55e',
      INACTIVE: '#f97316',
      DRAFT: '#6b7280',
      PENDING_APPROVAL: '#eab308',
      APPROVED: '#22c55e',
      ARCHIVED: '#64748b',
      REJECTED: '#ef4444',
      DISCONTINUED: '#ef4444',
      OUT_OF_STOCK: '#ef4444',
      RECALLED: '#dc2626',
    };
    return statusColors[status] || '#6b7280';
  },

  getUrgencyColor: (urgency: string): string => {
    const urgencyColors: Record<string, string> = {
      LOW: '#22c55e',
      MEDIUM: '#eab308',
      HIGH: '#f97316',
      CRITICAL: '#ef4444',
    };
    return urgencyColors[urgency] || '#6b7280';
  },

  getDifficultyStars: (level: number): string => {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  },

  getStockStatusIcon: (isLowStock: boolean, needsReorder: boolean, isExpired: boolean): string => {
    if (isExpired) return '🔴';
    if (isLowStock) return '🟡';
    if (needsReorder) return '🟠';
    return '🟢';
  },

  calculateProfitMargin: (sellingPrice: number, cost: number): number => {
    if (sellingPrice === 0) return 0;
    return ((sellingPrice - cost) / sellingPrice) * 100;
  },

  calculateMarkup: (sellingPrice: number, cost: number): number => {
    if (cost === 0) return 0;
    return ((sellingPrice - cost) / cost) * 100;
  },

  generateRecipeCode: (productName: string): string => {
    const cleanName = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `RCP-${cleanName.slice(0, 6)}-${timestamp}`;
  },

  generateMaterialCode: (materialName: string, category: string): string => {
    const cleanName = materialName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanCategory = category.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-3);
    return `${cleanCategory.slice(0, 3)}-${cleanName.slice(0, 6)}-${timestamp}`;
  },
};

export default recipeService;