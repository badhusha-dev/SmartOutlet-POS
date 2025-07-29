// Delivery Partner App Types

export interface DeliveryPartner {
  id: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address: Address;
  emergencyContact: EmergencyContact;
  documents: PartnerDocument[];
  vehicle: VehicleInfo;
  bankDetails: BankDetails;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  status: PartnerStatus;
  availability: PartnerAvailability;
  workingHours: WorkingHours;
  joinedAt: string;
  lastActiveAt: string;
  isOnline: boolean;
  currentLocation?: Location;
  activeDelivery?: DeliveryOrder;
}

export interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PartnerDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  expiryDate?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface VehicleInfo {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  registrationNumber: string;
  insuranceNumber: string;
  insuranceExpiryDate: string;
  documents: VehicleDocument[];
  verificationStatus: VerificationStatus;
}

export interface VehicleDocument {
  id: string;
  type: VehicleDocumentType;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  expiryDate?: string;
}

export interface BankDetails {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  branchName?: string;
  verificationStatus: VerificationStatus;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  restaurant: RestaurantInfo;
  items: OrderItem[];
  orderValue: number;
  deliveryFee: number;
  serviceFee: number;
  partnerEarnings: number;
  status: DeliveryStatus;
  pickupAddress: Address;
  deliveryAddress: Address;
  pickupInstructions?: string;
  deliveryInstructions?: string;
  estimatedPickupTime: string;
  actualPickupTime?: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  distance: number;
  estimatedDuration: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  otp?: string;
  timeline: DeliveryTimeline[];
  createdAt: string;
  updatedAt: string;
  customerRating?: number;
  customerFeedback?: string;
  issue?: DeliveryIssue;
}

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  profileImage?: string;
  rating: number;
  totalOrders: number;
}

export interface RestaurantInfo {
  id: string;
  name: string;
  phone: string;
  address: Address;
  contactPerson: string;
  preparationTime: number;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  customizations?: string[];
  specialInstructions?: string;
}

export interface DeliveryTimeline {
  id: string;
  status: DeliveryStatus;
  message: string;
  timestamp: string;
  location?: Location;
  notes?: string;
}

export interface DeliveryIssue {
  id: string;
  type: IssueType;
  description: string;
  reportedBy: 'partner' | 'customer' | 'restaurant';
  resolution?: string;
  resolvedAt?: string;
  status: IssueStatus;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
  speed?: number;
  heading?: number;
}

export interface Earnings {
  id: string;
  date: string;
  deliveryId: string;
  orderNumber: string;
  baseFee: number;
  distanceBonus: number;
  timeBonus: number;
  tips: number;
  incentives: number;
  totalEarnings: number;
  payoutStatus: PayoutStatus;
  payoutDate?: string;
}

export interface EarningsSummary {
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
  totalDeliveries: number;
  averageRating: number;
  onlineHours: number;
  completionRate: number;
}

export interface Shift {
  id: string;
  partnerId: string;
  startTime: string;
  endTime?: string;
  totalHours: number;
  totalDeliveries: number;
  totalEarnings: number;
  averageDeliveryTime: number;
  status: ShiftStatus;
  breaks: Break[];
}

export interface Break {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  reason: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  imageUrl?: string;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
  expiresAt?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: Location[];
  isActive: boolean;
  peakHours: PeakHour[];
  baseFee: number;
  peakMultiplier: number;
}

export interface PeakHour {
  id: string;
  startTime: string;
  endTime: string;
  days: string[];
  multiplier: number;
}

// Enums
export enum PartnerStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked'
}

export enum PartnerAvailability {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
  ON_BREAK = 'on_break'
}

export enum DocumentType {
  NATIONAL_ID = 'national_id',
  DRIVING_LICENSE = 'driving_license',
  PASSPORT = 'passport',
  WORK_PERMIT = 'work_permit',
  BACKGROUND_CHECK = 'background_check'
}

export enum VehicleType {
  BICYCLE = 'bicycle',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  SCOOTER = 'scooter',
  WALKING = 'walking'
}

export enum VehicleDocumentType {
  REGISTRATION = 'registration',
  INSURANCE = 'insurance',
  INSPECTION = 'inspection',
  PERMIT = 'permit'
}

export enum VerificationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  ACCEPTED = 'accepted',
  HEADING_TO_RESTAURANT = 'heading_to_restaurant',
  ARRIVED_AT_RESTAURANT = 'arrived_at_restaurant',
  PICKED_UP = 'picked_up',
  HEADING_TO_CUSTOMER = 'heading_to_customer',
  ARRIVED_AT_CUSTOMER = 'arrived_at_customer',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL_WALLET = 'digital_wallet',
  UPI = 'upi'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum IssueType {
  CUSTOMER_NOT_AVAILABLE = 'customer_not_available',
  WRONG_ADDRESS = 'wrong_address',
  ORDER_DAMAGED = 'order_damaged',
  ORDER_INCOMPLETE = 'order_incomplete',
  RESTAURANT_DELAYED = 'restaurant_delayed',
  VEHICLE_BREAKDOWN = 'vehicle_breakdown',
  ACCIDENT = 'accident',
  OTHER = 'other'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PAID = 'paid',
  FAILED = 'failed'
}

export enum ShiftStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused'
}

export enum NotificationType {
  NEW_ORDER = 'new_order',
  ORDER_UPDATE = 'order_update',
  EARNINGS_UPDATE = 'earnings_update',
  SHIFT_REMINDER = 'shift_reminder',
  DOCUMENT_UPDATE = 'document_update',
  PROMOTION = 'promotion',
  SYSTEM_UPDATE = 'system_update',
  SUPPORT_MESSAGE = 'support_message'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
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

export interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface UpdateDeliveryStatusRequest {
  orderId: string;
  status: DeliveryStatus;
  location?: Location;
  notes?: string;
  imageUrl?: string;
  otp?: string;
}

export interface ReportIssueRequest {
  orderId: string;
  type: IssueType;
  description: string;
  imageUrls?: string[];
}

export interface UpdateAvailabilityRequest {
  availability: PartnerAvailability;
  location?: Location;
}

export interface SubmitFeedbackRequest {
  orderId: string;
  rating: number;
  comment?: string;
  categories?: string[];
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  OrderDetails: { orderId: string };
  Navigation: { orderId: string };
  CameraScanner: { type: 'qr' | 'barcode' };
  EarningsDetails: { date?: string };
  DocumentUpload: { documentType: DocumentType };
  Profile: undefined;
  Settings: undefined;
  Help: undefined;
  ReportIssue: { orderId: string };
  VehicleDetails: undefined;
  BankDetails: undefined;
  WorkingHours: undefined;
};

export type TabParamList = {
  Home: undefined;
  Orders: undefined;
  Earnings: undefined;
  Profile: undefined;
};

// Redux State Types
export interface RootState {
  auth: AuthState;
  partner: PartnerState;
  orders: OrderState;
  earnings: EarningsState;
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

export interface PartnerState {
  partner?: DeliveryPartner;
  currentShift?: Shift;
  isLoading: boolean;
  error?: string;
}

export interface OrderState {
  activeOrder?: DeliveryOrder;
  availableOrders: DeliveryOrder[];
  orderHistory: DeliveryOrder[];
  isLoading: boolean;
  error?: string;
}

export interface EarningsState {
  summary: EarningsSummary;
  dailyEarnings: Earnings[];
  totalBalance: number;
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
  currentLocation?: Location;
  isLocationEnabled: boolean;
  networkStatus: boolean;
  appVersion: string;
  isMaintenanceMode: boolean;
  maintenanceMessage?: string;
  deliveryZones: DeliveryZone[];
}