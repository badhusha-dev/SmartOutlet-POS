// Customer App Types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferredLanguage: string;
  loyaltyPoints: number;
  totalOrders: number;
  joinedAt: string;
  isVerified: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  instructions?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'upi' | 'cash';
  name: string;
  details: string;
  isDefault: boolean;
  expiryDate?: string;
  lastFourDigits?: string;
}

export interface Outlet {
  id: string;
  name: string;
  description?: string;
  address: Address;
  phone: string;
  email?: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  estimatedDeliveryTime: number; // in minutes
  deliveryFee: number;
  minimumOrderValue: number;
  imageUrl?: string;
  cuisine: string[];
  features: OutletFeature[];
  operatingDays: string[];
  distance?: number; // calculated from user location
}

export interface OutletFeature {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Category;
  subCategory?: string;
  imageUrl: string;
  images: string[];
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergenInfo?: string[];
  nutritionalInfo?: NutritionalInfo;
  preparationTime: number; // in minutes
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  customizations: ProductCustomization[];
  variants: ProductVariant[];
  addOns: ProductAddOn[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductCustomization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  isRequired: boolean;
  minSelections?: number;
  maxSelections?: number;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  customizations: SelectedCustomization[];
  addOns: SelectedAddOn[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export interface SelectedAddOn {
  addOnId: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  outlet: Outlet;
  customer: User;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discounts: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimeline[];
  delivery?: DeliveryInfo;
  feedback?: OrderFeedback;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  customizations: SelectedCustomization[];
  addOns: SelectedAddOn[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryInfo {
  id: string;
  partner: DeliveryPartner;
  vehicleInfo: VehicleInfo;
  estimatedArrival: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  contactNumber: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  profileImage?: string;
  totalDeliveries: number;
}

export interface VehicleInfo {
  type: 'bike' | 'car' | 'bicycle';
  number: string;
  model?: string;
  color?: string;
}

export interface OrderFeedback {
  id: string;
  rating: number;
  comment?: string;
  foodRating: number;
  deliveryRating: number;
  packagingRating: number;
  images?: string[];
  submittedAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  type: 'percentage' | 'fixed' | 'free_delivery' | 'bogo';
  value: number;
  minimumOrderValue?: number;
  maxDiscountValue?: number;
  imageUrl?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableOutlets: string[];
  applicableCategories: string[];
  termsAndConditions: string;
}

export interface Review {
  id: string;
  user: User;
  product?: Product;
  outlet?: Outlet;
  order: Order;
  rating: number;
  comment: string;
  images?: string[];
  response?: ReviewResponse;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isHelpful: boolean;
}

export interface ReviewResponse {
  id: string;
  message: string;
  respondedBy: string;
  respondedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface SearchResult {
  products: Product[];
  outlets: Outlet[];
  categories: Category[];
  suggestions: string[];
}

export interface FavoriteItem {
  id: string;
  type: 'product' | 'outlet';
  itemId: string;
  addedAt: string;
}

// Enums
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  PROMOTION = 'promotion',
  DELIVERY_UPDATE = 'delivery_update',
  GENERAL = 'general',
  PAYMENT = 'payment'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  deviceToken?: string;
}

export interface PlaceOrderRequest {
  outletId: string;
  items: CartItem[];
  deliveryAddressId: string;
  paymentMethodId: string;
  specialInstructions?: string;
  promotionCode?: string;
  deliveryTime?: 'now' | 'scheduled';
  scheduledTime?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  profileImage?: string;
}

export interface AddAddressRequest {
  type: 'home' | 'work' | 'other';
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude: number;
  instructions?: string;
  isDefault?: boolean;
}

export interface AddPaymentMethodRequest {
  type: 'card' | 'wallet' | 'upi';
  name: string;
  details: string;
  isDefault?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  OutletDetails: { outletId: string };
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderTracking: { orderId: string };
  Profile: undefined;
  Addresses: undefined;
  AddAddress: { address?: Address };
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  Search: { query?: string };
  Favorites: undefined;
  Notifications: undefined;
  Reviews: { orderId: string };
  Support: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Orders: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Redux State Types
export interface RootState {
  auth: AuthState;
  user: UserState;
  outlets: OutletState;
  products: ProductState;
  cart: CartState;
  orders: OrderState;
  notifications: NotificationState;
  app: AppState;
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  isLoading: boolean;
  error?: string;
}

export interface UserState {
  user?: User;
  isLoading: boolean;
  error?: string;
}

export interface OutletState {
  outlets: Outlet[];
  currentOutlet?: Outlet;
  nearbyOutlets: Outlet[];
  isLoading: boolean;
  error?: string;
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  searchResults: SearchResult;
  isLoading: boolean;
  error?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  appliedPromotion?: Promotion;
  isLoading: boolean;
  error?: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder?: Order;
  activeOrder?: Order;
  isLoading: boolean;
  error?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error?: string;
}

export interface AppState {
  isFirstLaunch: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  selectedAddress?: Address;
  networkStatus: boolean;
  appVersion: string;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
}