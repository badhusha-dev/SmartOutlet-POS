# Role-Based Outlet Management System

## Overview

The SmartOutlet POS system implements a comprehensive role-based access control (RBAC) system for outlet management. Different user roles have access to different features and data based on their permissions.

## User Roles

### 1. Admin
- **Access Level**: Full system access
- **Features**:
  - View all outlets in the system
  - Add, edit, and delete outlets
  - Manage outlet assignments
  - Access to all outlet data and analytics
  - User management capabilities
- **Components**: `OutletList.jsx` (original admin interface)

### 2. Outlet Manager
- **Access Level**: Manage assigned outlet
- **Features**:
  - View assigned outlet details
  - KPI Dashboard (Sales, Waste %, Profit)
  - Staff management for assigned outlet
  - Performance analytics and charts
  - Internal notices and alerts
  - Daily summary reports
- **Components**: `OutletManagerView.jsx`

### 3. Outlet Staff
- **Access Level**: Staff access to assigned outlet
- **Features**:
  - View assigned outlet information
  - Today's sales data (read-only)
  - View assigned tasks with status
  - Basic outlet information
  - No access to profit data or staff management
- **Components**: `OutletStaffView.jsx`

### 4. Viewer
- **Access Level**: Read-only access
- **Features**:
  - View assigned outlet information (read-only)
  - Basic sales count and waste percentage
  - No interactive actions
  - Limited data access
- **Components**: `OutletViewerView.jsx`

## Component Structure

```
/src/components/outlet/
├── OutletBaseScreen.jsx           ← Entry point with role logic
├── OutletManagerView.jsx          ← Manager dashboard
├── OutletStaffView.jsx            ← Staff interface
├── OutletViewerView.jsx           ← Read-only view
├── OutletList.jsx                 ← Original admin screen
└── AddOutletModal.jsx             ← Modal for admin
```

## Key Components

### OutletBaseScreen.jsx
- **Purpose**: Main entry point that determines which view to render based on user role
- **Features**:
  - Role detection and routing
  - Development mode role switcher
  - Header with user info and role indicator
  - Responsive layout

### useUserRole Hook
- **Location**: `/src/hooks/useUserRole.js`
- **Purpose**: Decode JWT and provide role-based utilities
- **Features**:
  - JWT token decoding
  - Role and permission checking
  - Development mode mock data
  - Permission helper functions

## Development Mode Features

### Role Switcher
In development mode, users can switch between roles using the dropdown in the header:
- **dev-admin**: Full admin access
- **dev-manager**: Outlet manager access
- **dev-staff**: Staff access
- **dev-viewer**: Read-only access

### Mock Data
Each role has associated mock data:
- JWT payload with role-specific permissions
- Assigned outlet information
- Performance metrics
- Staff assignments
- Tasks and notices

## Permission System

### Permission Types
- `READ`: Basic read access
- `WRITE`: Ability to modify data
- `DELETE`: Ability to delete records
- `MANAGE_OUTLETS`: Full outlet management
- `MANAGE_STAFF`: Staff management capabilities
- `VIEW_PERFORMANCE`: Access to performance metrics
- `VIEW_SALES`: Access to sales data

### Permission Checking
```javascript
const { hasPermission, canManageOutlets, canViewPerformance } = useUserRole()

// Check specific permissions
if (hasPermission('MANAGE_OUTLETS')) {
  // Show admin features
}

// Use convenience methods
if (canManageOutlets()) {
  // Show outlet management
}
```

## Styling and Design

### Coral Theme
- Primary color: Coral (#ef4444)
- Consistent color palette across components
- Dark mode support
- Responsive design

### Component Styling
- Tailwind CSS utility classes
- Custom CSS variables for coral theme
- Consistent card and button styles
- Smooth animations and transitions

## API Integration

### Service Layer
- `outletService.js`: Handles all outlet-related API calls
- Development mode fallbacks to mock data
- Error handling and loading states

### Data Flow
1. User authentication determines role
2. Role determines which components render
3. Components fetch role-appropriate data
4. UI updates based on permissions

## Security Considerations

### Production Mode
- JWT token validation
- Server-side role verification
- API endpoint protection
- Secure token storage

### Development Mode
- Mock JWT tokens
- Role switching for testing
- No actual security enforcement
- Clear development indicators

## Usage Examples

### Adding New Role
1. Update `MOCK_JWT_PAYLOAD` in `useUserRole.js`
2. Add role to `mockRoles` array in `OutletBaseScreen.jsx`
3. Create new view component
4. Add role case to `renderRoleBasedView()`

### Adding New Permission
1. Add permission to JWT payload
2. Create helper function in `useUserRole.js`
3. Use permission check in components
4. Update documentation

## Testing

### Role Testing
- Switch between roles in development mode
- Verify correct components render
- Test permission-based features
- Validate data access restrictions

### Component Testing
- Test each view component independently
- Verify responsive design
- Test dark mode functionality
- Validate accessibility features

## Future Enhancements

### Planned Features
- Role-based notifications
- Advanced permission granularity
- Audit logging
- Role hierarchy system
- Bulk operations for admins

### Technical Improvements
- Real-time data updates
- Offline capability
- Performance optimizations
- Enhanced error handling 