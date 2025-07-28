export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  allergens?: string[];
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints: number;
  dietaryPreferences?: string[];
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  allergens?: string[];
}

export interface Order {
  id: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'OPEN' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CARD' | 'EWALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  loyaltyPointsRedeemed?: number;
  loyaltyPointsEarned?: number;
  tip?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface KPIMetrics {
  todayRevenue: number;
  averageOrderValue: number;
  openOrdersCount: number;
  totalOrdersToday: number;
  topProducts: Product[];
}

export interface OrderCreatedEvent {
  type: 'ORDER_CREATED';
  order: Order;
}

export interface OrderUpdatedEvent {
  type: 'ORDER_UPDATED';
  order: Order;
}

export type WebSocketEvent = OrderCreatedEvent | OrderUpdatedEvent;

export interface POSState {
  currentOrder: Order | null;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
}

export interface CheckoutFormData {
  customerId?: string;
  paymentMethod: 'CASH' | 'CARD' | 'EWALLET';
  loyaltyPointsRedeemed: number;
  tip: number;
  discountCode?: string;
  notes?: string;
}