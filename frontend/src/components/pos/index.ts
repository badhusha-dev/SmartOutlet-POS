// Main POS Application
export { POSApplication } from './POSApplication';

// Core Components
export { POSDashboard } from './POSDashboard';
export { OrderEntryForm } from './OrderEntryForm';
export { CheckoutModal } from './CheckoutModal';
export { OrderHistoryList } from './OrderHistoryList';
export { CustomerProfile } from './CustomerProfile';
export { ReceiptPDF } from './ReceiptPDF';

// Demo Component
export { POSDemo } from '../../pages/POSDemo';

// Types
export type {
  Product,
  Customer,
  Order,
  OrderItem,
  Discount,
  KPIMetrics,
  POSState,
  CheckoutFormData,
  WebSocketEvent,
} from '../../types/pos';

// Utilities
export { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
export { applyDiscount, validateDiscount } from '../../utils/discountCalculator';

// Store
export { usePOSStore } from '../../store/posStore';

// Hooks
export { useLiveOrders } from '../../hooks/useLiveOrders';

// Theme
export { createPOSTheme, usePOSTheme } from '../../theme/posTheme';