// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
}

// Outlet Status
export const OUTLET_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
}

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
}

// Sales Status
export const SALES_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
}

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  DIGITAL_WALLET: 'DIGITAL_WALLET',
}

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'Utilities',
  'Rent',
  'Inventory',
  'Marketing',
  'Staff',
  'Equipment',
  'Insurance',
  'Other',
]

// Task Status
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

// Notice Priority
export const NOTICE_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
}

// Date Range Options
export const DATE_RANGES = {
  TODAY: 'TODAY',
  YESTERDAY: 'YESTERDAY',
  LAST_WEEK: 'LAST_WEEK',
  LAST_MONTH: 'LAST_MONTH',
  THIS_MONTH: 'THIS_MONTH',
  CUSTOM: 'CUSTOM',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
}

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  PRICE_REGEX: /^\d+(\.\d{1,2})?$/,
}

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
} 