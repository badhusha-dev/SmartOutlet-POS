# SmartOutlet Frontend

A modern React frontend for the SmartOutlet POS system built with Vite, TailwindCSS, and comprehensive features for managing a retail business.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Login/Register Pages** with JWT authentication
- **Role-based Access Control** (Admin/Staff)
- **Protected Routes** with automatic redirects
- **Session Management** with localStorage persistence

### 📊 Dashboard & Analytics
- **Real-time Analytics** with charts and metrics
- **Sales Trends** with interactive visualizations
- **Key Performance Indicators** (Revenue, Orders, Growth)
- **Recent Activity** tracking
- **Top Products** analysis

### 🏪 Business Management
- **Outlet Management** (Admin only)
  - Create, edit, delete outlets
  - Location and manager assignment
  - Status management (Active/Inactive)
  
- **Product Management**
  - Product catalog with search and filters
  - Stock level tracking with low stock alerts
  - Category-based organization
  - Barcode support

### 💰 Point of Sale (POS)
- **Interactive Sales Interface**
  - Product search and barcode scanning
  - Shopping cart with quantity management
  - Real-time total calculation with tax
  - Multiple payment methods (Cash, Card, Digital)
  - Receipt generation

### 📈 Reporting & Analytics
- **Sales Reports** with date range filters
- **Revenue & Order Trends** with charts
- **Top Products Analysis**
- **Export Functionality** for reports
- **Outlet-specific** filtering

### 💸 Expense Tracking (Admin only)
- **Expense Management** with categories
- **Visual Expense Breakdown** with pie charts
- **Receipt Attachment** support
- **Date Range Filtering**
- **Outlet Assignment**

### 👤 User Management
- **Profile Management** with editable fields
- **Password Updates** with security
- **Account Activity** tracking
- **Role Display** and permissions

### 🎨 Modern UI/UX
- **Dark/Light Theme Toggle** with system preference
- **Responsive Design** for all screen sizes
- **Beautiful Animations** with Framer Motion
- **Modern Card Layouts** with consistent spacing
- **Interactive Elements** with hover effects
- **Modal Dialogs** for forms
- **Toast Notifications** for user feedback

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

### State Management & API
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form state management
- **Context API** - Global state (Auth, Theme)

### UI Components & Styling
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics
- **React Hot Toast** - Notification system
- **Clsx** - Conditional className utility

### Form & Date Handling
- **React DatePicker** - Date selection
- **React Select** - Enhanced select components
- **Date-fns** - Date utility library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend services running (see backend README)

### Installation

1. **Clone and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                 # API client configuration
│   │   └── client.js        # Axios setup with interceptors
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── ui/             # UI components (Modal, Spinner)
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ThemeContext.jsx# Theme management
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── Dashboard.jsx   # Analytics dashboard
│   │   ├── OutletManagement.jsx
│   │   ├── ProductManagement.jsx
│   │   ├── POSSales.jsx    # Point of sale
│   │   ├── SalesReport.jsx # Reporting
│   │   ├── ExpenseTracker.jsx
│   │   └── Profile.jsx     # User profile
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
├── vite.config.js         # Vite configuration
└── README.md
```

## 🔐 Authentication Flow

1. **Login/Register** - User submits credentials
2. **JWT Token** - Backend returns JWT token on success
3. **Token Storage** - Token stored in localStorage
4. **API Requests** - Token attached to all API calls
5. **Auto-refresh** - Token validated on app reload
6. **Protected Routes** - Unauthenticated users redirected to login

## 🎨 Theming

The app supports both light and dark themes:

- **Auto-detection** of system preference
- **Manual toggle** via header button
- **Persistent setting** in localStorage
- **Consistent styling** across all components
- **Proper contrast** for accessibility

## 📱 Responsive Design

- **Mobile-first** approach with TailwindCSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Responsive sidebar** with mobile overlay
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** interactions on mobile

## 🔧 API Integration

### Endpoints
- **Authentication**: `/auth/login`, `/auth/register`
- **Outlets**: `/outlets/*`
- **Products**: `/products/*`
- **Sales**: `/pos/sales/*`
- **Expenses**: `/expenses/*`
- **Reports**: `/dashboard/stats`, `/pos/sales/report`

### Error Handling
- **Global interceptors** for common errors
- **User-friendly messages** via toast notifications
- **Automatic logout** on 401 errors
- **Retry logic** for failed requests

## 🎯 Key Features Detail

### Dashboard Analytics
- **Revenue trends** with area charts
- **Order patterns** with bar charts
- **Category distribution** with pie charts
- **Growth indicators** with percentage changes
- **Real-time updates** every 30 seconds

### POS System
- **Barcode scanning** simulation
- **Inventory checking** with stock validation
- **Tax calculation** (configurable rate)
- **Receipt preview** before printing
- **Payment processing** simulation

### Role-Based Access
- **Admin features**: Outlet management, expense tracking
- **Staff features**: POS, product management, sales reports
- **Automatic hiding** of unauthorized menu items
- **Route protection** with permission checking

## 🧪 Development

### Code Quality
- **ESLint** configuration for code standards
- **Consistent formatting** with component structure
- **Custom hooks** for reusable logic
- **Error boundaries** for graceful error handling

### Performance
- **Code splitting** with React.lazy (ready for implementation)
- **Image optimization** for product photos
- **Memoization** for expensive calculations
- **Virtual scrolling** for large lists (when needed)

## 🎨 UI Components

### Buttons
- **Primary, Secondary, Ghost, Danger** variants
- **Loading states** with spinners
- **Icon support** with proper spacing
- **Disabled states** with visual feedback

### Forms
- **Validation** with React Hook Form
- **Error messages** with proper styling
- **Field states** (focus, error, disabled)
- **Auto-focus** and keyboard navigation

### Modals
- **Backdrop click** to close
- **Escape key** support
- **Focus management** for accessibility
- **Animation** with Framer Motion

## 🚀 Deployment

### Build Optimization
```bash
npm run build
```

### Environment Variables
- **VITE_API_BASE_URL** - Backend API URL
- Add additional config as needed

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security

- **XSS Protection** with proper escaping
- **CSRF Protection** via SameSite cookies
- **JWT Validation** on every request
- **Input Sanitization** for all forms
- **Route Protection** based on roles

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for new features (if migrating)
3. Add proper error handling
4. Include responsive design
5. Test on multiple screen sizes
6. Follow accessibility guidelines

## 📄 License

This project is part of the SmartOutlet POS system. See main README for license information.

---

Built with ❤️ using React, TailwindCSS, and modern web technologies.