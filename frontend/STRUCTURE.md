# 🏗️ SmartOutlet POS - File Structure Documentation

## 📁 Project Structure

```
src/
│
├── assets/                 # Static files (images, logos, fonts)
│   └── logo.svg
│
├── components/             # Reusable UI components
│   ├── common/             # Buttons, Cards, Inputs, Modals, Providers
│   │   ├── LoadingSpinner.jsx
│   │   ├── ReduxProvider.jsx
│   │   └── ...
│   └── layout/             # Header, Sidebar, Footer
│       ├── Layout.jsx
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── ...
│
├── features/               # Feature folders (modular structure)
│   ├── auth/               # Authentication & User Management
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── authSlice.js
│   │
│   ├── outlet/             # Outlet Management
│   │   ├── views/
│   │   │   ├── OutletManagement.jsx
│   │   │   ├── OutletList.jsx
│   │   │   ├── OutletManagerView.jsx
│   │   │   └── OutletStaffView.jsx
│   │   ├── components/
│   │   │   ├── AddOutletModal.jsx
│   │   │   └── ...
│   │   ├── outletSlice.js
│   │   └── outletService.js
│   │
│   ├── inventory/          # Product & Stock Management
│   │   ├── views/
│   │   │   └── ProductManagement.jsx
│   │   ├── components/
│   │   │   └── ...
│   │   └── productSlice.js
│   │
│   ├── sales/              # POS & Sales Management
│   │   ├── views/
│   │   │   ├── POSSales.jsx
│   │   │   └── SalesReport.jsx
│   │   ├── components/
│   │   │   └── ...
│   │   └── salesSlice.js
│   │
│   ├── expense/            # Expense Tracking
│   │   ├── views/
│   │   │   └── ExpenseTracker.jsx
│   │   ├── components/
│   │   │   └── ...
│   │   └── expenseSlice.js
│   │
│   ├── report/             # Dashboard & Reports
│   │   ├── views/
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── OutletReport.jsx
│   │   │   └── ReportGeneratorModal.jsx
│   │   └── reportService.js
│   │
│   ├── zakat/              # Zakat Management (Future)
│   │   └── ...
│   │
│   └── notification/       # System Notifications
│       └── notificationSlice.js
│
├── hooks/                  # Reusable custom hooks
│   └── useUserRole.js
│
├── routes/                 # Route configuration
│   └── AppRoutes.jsx       # With Protected Routes setup
│
├── services/               # API calls and integration logic
│   ├── client.js           # Axios base config
│   └── ...
│
├── context/                # React Context (Legacy - being migrated to Redux)
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── store/                  # Redux State Management
│   ├── index.js            # Store configuration
│   ├── hooks.js            # Typed hooks
│   └── slices/
│       ├── authSlice.js
│       ├── themeSlice.js
│       └── uiSlice.js
│
├── utils/                  # Helper functions, constants
│   ├── formatDate.js
│   ├── validateEmail.js
│   ├── constants.js
│   └── ...
│
├── App.jsx                 # Main app entry (uses AppRoutes)
├── main.jsx                # ReactDOM root
└── index.css               # Global styles
```

## 🎯 Structure Benefits

### **Feature-Based Organization**
- Each feature is self-contained with its own views, components, and logic
- Easy to find and modify feature-specific code
- Clear separation of concerns

### **Scalable Architecture**
- New features can be added without affecting existing code
- Redux slices are co-located with their features
- Services are organized by feature domain

### **Reusable Components**
- Common components are shared across features
- Layout components provide consistent structure
- Custom hooks encapsulate business logic

### **Clean Routing**
- Centralized route configuration
- Protected routes with role-based access
- Easy to add new routes and pages

## 🔄 Migration from Old Structure

### **What Changed:**
1. **Components** → Split into `common/` and feature-specific folders
2. **Pages** → Moved to `features/*/views/`
3. **Services** → Distributed to feature directories
4. **Redux Slices** → Co-located with features
5. **Routes** → Centralized in `routes/AppRoutes.jsx`

### **Import Updates Needed:**
```javascript
// Old imports
import Login from './pages/auth/Login'
import OutletList from './components/outlets/OutletList'

// New imports
import Login from './features/auth/Login'
import OutletList from './features/outlet/views/OutletList'
```

## 🚀 Best Practices

### **Feature Development:**
1. Create feature folder with `views/` and `components/` subfolders
2. Co-locate Redux slice with the feature
3. Keep feature-specific services in the feature directory
4. Use common components for shared UI elements

### **Component Organization:**
- `views/` - Page-level components for routing
- `components/` - Reusable components within the feature
- `common/` - Shared components across features

### **State Management:**
- Use Redux for global state (auth, theme, UI)
- Feature-specific state in feature slices
- Custom hooks for complex logic

### **File Naming:**
- Use PascalCase for components: `OutletList.jsx`
- Use camelCase for utilities: `formatDate.js`
- Use kebab-case for CSS: `outlet-list.css`

## 📝 Next Steps

1. **Update Imports**: Fix all import paths in existing components
2. **Remove Legacy Context**: Migrate remaining context usage to Redux
3. **Add Feature Documentation**: Create README files for each feature
4. **Implement Zakat Feature**: Add zakat calculation and management
5. **Add Tests**: Create test files for each feature

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/) 