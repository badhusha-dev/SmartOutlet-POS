# Frontend Screens Overview

## 📱 Available Screens (9 Total)

### 🔐 Authentication Screens
1. **Login** (`/login`)
   - Email/Password authentication
   - Form validation
   - Error handling
   - Redirect to dashboard on success

2. **Register** (`/register`)
   - User registration form
   - Password confirmation
   - Role selection (Admin/Staff)
   - Auto-login after registration

### 🏠 Main Application Screens
3. **Dashboard** (`/dashboard`)
   - Sales statistics overview
   - Revenue charts and graphs
   - Key performance indicators
   - Recent activity feed
   - Quick action buttons

4. **Outlet Management** (`/outlets`)
   - List all retail outlets
   - Add new outlets
   - Edit outlet details
   - Staff assignment
   - Outlet status management

5. **Product Management** (`/products`)
   - Product catalog
   - Category management
   - Stock tracking
   - Barcode management
   - Product search and filtering

6. **POS Sales** (`/pos`)
   - Point of sale interface
   - Product scanning
   - Cart management
   - Payment processing
   - Receipt generation

7. **Sales Report** (`/sales`)
   - Sales analytics
   - Date range filtering
   - Revenue reports
   - Product performance
   - Export functionality

8. **Expense Tracker** (`/expenses`)
   - Expense logging
   - Category management
   - Budget tracking
   - Expense reports
   - Receipt upload

9. **Profile** (`/profile`)
   - User profile management
   - Password change
   - Personal information
   - Account settings
   - Activity history

## 🧭 Navigation Structure

```
/ (root)
├── /login (public)
├── /register (public)
└── / (protected)
    ├── /dashboard (default)
    ├── /outlets
    ├── /products
    ├── /pos
    ├── /sales
    ├── /expenses
    └── /profile
```

## 🔓 Development Mode Access

With security disabled, you can access any screen directly:

- **Dashboard**: http://localhost:3000/dashboard
- **Outlets**: http://localhost:3000/outlets
- **Products**: http://localhost:3000/products
- **POS**: http://localhost:3000/pos
- **Sales**: http://localhost:3000/sales
- **Expenses**: http://localhost:3000/expenses
- **Profile**: http://localhost:3000/profile

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

### Dark Mode Support
- Toggle between light/dark themes
- Persistent theme preference
- Consistent styling across all screens

### Loading States
- Skeleton loaders
- Progress indicators
- Smooth transitions

### Error Handling
- User-friendly error messages
- Retry mechanisms
- Fallback content

## 🔧 Technical Features

### State Management
- React Context for authentication
- React Query for data fetching
- Local storage for persistence

### Form Handling
- React Hook Form integration
- Real-time validation
- Error display

### Data Visualization
- Recharts for charts and graphs
- Responsive charts
- Interactive tooltips

### API Integration
- Axios for HTTP requests
- Automatic token management
- Error interceptors

## 🚀 Getting Started

1. **Start development server**:
   ```bash
   npm run dev:no-auth
   ```

2. **Access any screen**:
   - Navigate directly to any URL
   - No authentication required
   - Mock data provided

3. **Test features**:
   - All forms work with mock data
   - Charts display sample data
   - Navigation is fully functional

## 📊 Screen Dependencies

- **Dashboard**: Requires sales and outlet data
- **POS**: Requires products and categories
- **Sales Report**: Requires sales transaction data
- **Expense Tracker**: Requires expense categories
- **Profile**: Requires user data

All screens work independently in development mode with mock data. 