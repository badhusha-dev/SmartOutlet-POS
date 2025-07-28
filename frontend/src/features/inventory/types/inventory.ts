export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  outletId: number;
  outletName: string;
  batchNumber: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitCost: number;
  totalValue: number;
  expiryDate?: string;
  manufacturedDate?: string;
  receivedDate: string;
  supplierReference?: string;
  locationCode?: string;
  status: InventoryStatus;
  expiryStatus: ExpiryStatus;
  expiryStatusColor: string;
  daysToExpiry?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {
  productId: number;
  productName: string;
  productSku: string;
  category: string;
  outletId: number;
  outletName: string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  averageUnitCost: number;
  totalValue: number;
  batchCount: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  hasExpiringItems: boolean;
  expiringItemsCount: number;
  expiredItemsCount: number;
  stockStatus: StockStatus;
  stockStatusColor: string;
  batches: InventoryItem[];
}

export interface StockTransaction {
  id: number;
  inventoryItemId: number;
  transactionType: TransactionType;
  quantity: number;
  unitCost?: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceId?: string;
  referenceType?: string;
  sourceOutletId?: number;
  destinationOutletId?: number;
  userId: number;
  userName?: string;
  createdAt: string;
}

export interface StockAlert {
  id: number;
  productId: number;
  outletId: number;
  alertType: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  currentStock?: number;
  minStockLevel?: number;
  inventoryItemId?: number;
  status: AlertStatus;
  acknowledgedBy?: number;
  acknowledgedAt?: string;
  resolvedBy?: number;
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface StockReceiveRequest {
  productId: number;
  outletId: number;
  batchNumber: string;
  quantity: number;
  unitCost?: number;
  expiryDate?: string;
  manufacturedDate?: string;
  receivedDate: string;
  supplierReference?: string;
  locationCode?: string;
  reason?: string;
}

export interface StockTransferRequest {
  productId: number;
  sourceOutletId: number;
  destinationOutletId: number;
  quantity: number;
  reason?: string;
  batchNumber?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface StockAdjustmentRequest {
  inventoryItemId: number;
  adjustmentType: TransactionType;
  quantity: number;
  reason: string;
  referenceId?: string;
  referenceType?: string;
}

// Enums
export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
  QUARANTINE = 'QUARANTINE',
  TRANSFERRED = 'TRANSFERRED',
  SOLD = 'SOLD'
}

export enum ExpiryStatus {
  FRESH = 'FRESH',
  WARNING = 'WARNING', 
  CRITICAL = 'CRITICAL',
  EXPIRED = 'EXPIRED'
}

export enum StockStatus {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  EXPIRING_ITEMS = 'EXPIRING_ITEMS',
  ADEQUATE = 'ADEQUATE'
}

export enum TransactionType {
  RECEIVE = 'RECEIVE',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ISSUE = 'ISSUE',
  DAMAGE = 'DAMAGE',
  EXPIRE = 'EXPIRE',
  WASTE = 'WASTE'
}

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  EXPIRY_CRITICAL = 'EXPIRY_CRITICAL',
  REORDER_REQUIRED = 'REORDER_REQUIRED',
  OVERSTOCK = 'OVERSTOCK',
  DAMAGED_STOCK = 'DAMAGED_STOCK'
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

// Filter interfaces
export interface InventoryFilters {
  outletId?: number;
  productId?: number;
  status?: InventoryStatus;
  batchNumber?: string;
  expiryStatus?: ExpiryStatus;
  search?: string;
}

export interface TransactionFilters {
  outletId?: number;
  productId?: number;
  transactionType?: TransactionType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AlertFilters {
  outletId?: number;
  productId?: number;
  alertType?: AlertType;
  status?: AlertStatus;
  priority?: AlertPriority;
  search?: string;
}

// Dashboard data
export interface InventoryDashboardData {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  expiringItemsCount: number;
  expiredItemsCount: number;
  recentTransactions: StockTransaction[];
  activeAlerts: StockAlert[];
  topStockItems: StockLevel[];
}

// Utility types
export interface ExpiryColorConfig {
  FRESH: string;
  WARNING: string;
  CRITICAL: string;
  EXPIRED: string;
}

export interface StockStatusConfig {
  OUT_OF_STOCK: { color: string; icon: string; label: string };
  LOW_STOCK: { color: string; icon: string; label: string };
  EXPIRING_ITEMS: { color: string; icon: string; label: string };
  ADEQUATE: { color: string; icon: string; label: string };
}