# CoralServe POS System

A comprehensive, responsive React admin UI for POS transactions with real-time updates, checkout flows, and customer loyalty integration.

## 🚀 Features

### Core Functionality
- **Real-time Order Management** - Live order updates via WebSocket
- **Product Search & Barcode Scanning** - Quick product lookup with allergen warnings
- **Smart Checkout Flow** - Multiple payment methods, tipping, loyalty points
- **Customer Management** - Profiles, loyalty tiers, dietary preferences
- **Order History** - Filterable grid with refund capabilities
- **Receipt Generation** - PDF receipts with outlet branding

### Technical Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic theme switching
- **Keyboard Shortcuts** - Power user navigation
- **Accessibility** - ARIA labels and screen reader support
- **Performance Optimized** - Virtualized lists, memoized components

## 📋 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Material-UI (MUI) v5 + React-Admin
- **State Management**: Zustand
- **Charts**: Recharts
- **Real-Time**: WebSocket connections
- **PDF**: React-to-PDF for receipts
- **Styling**: Emotion + MUI Theme

## 🏗️ Architecture

### Component Structure
```
src/components/pos/
├── POSApplication.tsx      # Main application wrapper
├── POSDashboard.tsx        # Real-time dashboard with KPIs
├── OrderEntryForm.tsx      # Product search and order building
├── CheckoutModal.tsx       # Payment processing and receipt
├── OrderHistoryList.tsx    # React-Admin data grid
├── CustomerProfile.tsx     # Customer details and history
├── ReceiptPDF.tsx         # PDF receipt template
└── README.md              # This documentation
```

### State Management
- **Zustand Store** (`posStore.ts`) - Centralized state management
- **Real-time Updates** (`useLiveOrders.ts`) - WebSocket integration
- **Type Safety** (`types/pos.ts`) - Comprehensive TypeScript interfaces

## 🎨 UI/UX Features

### CoralServe Branding
- **Primary Color**: #FF6B6B (Coral)
- **Secondary Color**: #4ECDC4 (Teal)
- **Custom Theme** - Consistent design system
- **Responsive Breakpoints** - Mobile-first approach

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and semantic HTML
- **High Contrast** - Low-light environment support
- **Focus Management** - Logical tab order

## 🛠️ Setup & Installation

### Prerequisites
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/x-data-grid @mui/x-date-pickers react-admin react-to-pdf zustand
```

### Basic Usage
```tsx
import { POSApplication } from './components/pos/POSApplication';
import { ThemeProvider } from '@mui/material';
import { createPOSTheme } from './theme/posTheme';

function App() {
  return (
    <ThemeProvider theme={createPOSTheme()}>
      <POSApplication outletId="your-outlet-id" />
    </ThemeProvider>
  );
}
```

### Demo Mode
```tsx
import { POSDemo } from './pages/POSDemo';

function App() {
  return <POSDemo />;
}
```

## 📱 Key Components

### 1. POS Dashboard
- **Real-time Order Tiles** - Color-coded by status
- **KPI Cards** - Revenue, average order value, open orders
- **Quick Add Buttons** - Top 5 bestselling items
- **WebSocket Integration** - Live order updates

### 2. Order Entry Form
- **Product Search** - Autocomplete with categories
- **Barcode Scanner** - Manual input simulation
- **Allergen Warnings** - Visual alerts for common allergens
- **Quantity Stepper** - Stock-aware quantity selection
- **Notes Field** - Special instructions

### 3. Checkout Modal
- **Order Summary** - Expandable tax breakdown
- **Payment Methods** - Cash, Card, E-Wallet
- **Loyalty Points** - Redemption and earning
- **Tip Calculator** - Percentage or custom amount
- **Discount Codes** - Validation and application
- **Receipt Printing** - PDF generation

### 4. Order History
- **React-Admin Grid** - Sortable, filterable data
- **Custom Filters** - Date range, status, customer
- **Refund Processing** - 30-day limit enforcement
- **Receipt Reprint** - PDF download

### 5. Customer Profile
- **Loyalty Tiers** - Bronze, Silver, Gold
- **Order History** - Complete transaction list
- **Dietary Preferences** - Allergen tracking
- **Statistics** - Spending patterns and metrics

## 🔌 API Integration

### WebSocket Endpoints
```typescript
// Real-time order updates
const ws = new WebSocket(`wss://api.coralserve.com/pos/ws?outlet=${outletId}`);

// Event types
interface OrderCreatedEvent {
  type: 'ORDER_CREATED';
  order: Order;
}

interface OrderUpdatedEvent {
  type: 'ORDER_UPDATED';
  order: Order;
}
```

### REST API Endpoints
```typescript
// Products
GET /api/products
GET /api/products/top

// Customers
GET /api/customers
PUT /api/customers/:id

// Orders
GET /api/pos/outlets/:outletId/orders
POST /api/orders/:id/refund

// Metrics
GET /api/pos/outlets/:outletId/metrics

// Discounts
GET /api/discounts/validate?code=:code
```

## 🎯 Usage Examples

### Adding Items to Order
```tsx
const { addItemToOrder } = usePOSStore();

// Add product with quantity and notes
addItemToOrder(product, 2, 'Extra cheese please');
```

### Processing Payment
```tsx
const handlePayment = async (order, paymentData) => {
  const updatedOrder = {
    ...order,
    paymentMethod: paymentData.method,
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    tip: paymentData.tip,
    loyaltyPointsRedeemed: paymentData.loyaltyPoints,
  };
  
  updateOrder(order.id, updatedOrder);
};
```

### Real-time Updates
```tsx
const { isConnected, connectionError } = useLiveOrders(outletId);

// Monitor connection status
if (!isConnected) {
  console.log('Offline mode - orders will sync when connected');
}
```

## 🔧 Customization

### Theme Customization
```typescript
// Custom theme colors
const customTheme = createPOSTheme({
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  // ... other colors
});
```

### Component Styling
```tsx
// Custom component styles
<Card sx={{
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}}>
```

## 🚨 Error Handling

### Toast Notifications
- **Insufficient Stock** - Product availability warnings
- **Payment Failed** - Transaction error handling
- **Customer Not Found** - Search result feedback
- **Network Errors** - Connection status alerts

### Validation
- **Discount Codes** - Expiration and usage limits
- **Loyalty Points** - Available balance checks
- **Order Limits** - Minimum order amounts
- **Payment Methods** - Supported options validation

## 📊 Performance Optimizations

### React Optimizations
- **React.memo** - Component memoization
- **useCallback** - Function memoization
- **useMemo** - Expensive calculation caching
- **Lazy Loading** - Modal and dialog components

### Data Management
- **Virtualized Lists** - Large order histories
- **Pagination** - React-Admin built-in pagination
- **Debounced Search** - Product search optimization
- **WebSocket Throttling** - Real-time update management

## 🔐 Security Considerations

### Data Protection
- **Input Validation** - All user inputs sanitized
- **API Authentication** - Bearer token validation
- **XSS Prevention** - Content security policies
- **CSRF Protection** - Cross-site request forgery prevention

### Payment Security
- **PCI Compliance** - Payment card industry standards
- **Tokenization** - Sensitive data encryption
- **Audit Logging** - Transaction trail maintenance

## 🧪 Testing

### Unit Tests
```bash
npm test -- --coverage
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Monitoring & Analytics

### Performance Metrics
- **Page Load Times** - Core Web Vitals
- **API Response Times** - Backend performance
- **Error Rates** - Application stability
- **User Interactions** - Feature usage tracking

### Business Metrics
- **Order Volume** - Daily/weekly/monthly trends
- **Average Order Value** - Revenue optimization
- **Customer Retention** - Loyalty program effectiveness
- **Payment Method Usage** - Transaction preferences

## 🔄 Deployment

### Build Process
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://api.coralserve.com
REACT_APP_WS_URL=wss://api.coralserve.com/pos/ws
REACT_APP_OUTLET_ID=your-outlet-id
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Reference](./api-reference.md)
- [Component Library](./component-library.md)
- [Troubleshooting](./troubleshooting.md)

### Contact
- **Email**: support@coralserve.com
- **Slack**: #pos-support
- **GitHub Issues**: [Create Issue](https://github.com/coralserve/pos/issues)

---

**Built with ❤️ by the CoralServe Team**