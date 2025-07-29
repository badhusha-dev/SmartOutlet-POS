# Outlet Components

This directory contains the role-based outlet management components for the SmartOutlet POS system.

## Component Overview

### Core Components

- **OutletBaseScreen.jsx** - Main entry point with role-based routing
- **OutletManagerView.jsx** - Dashboard for outlet managers
- **OutletStaffView.jsx** - Interface for outlet staff
- **OutletViewerView.jsx** - Read-only view for viewers

### Admin Components (Original)

- **../outlets/OutletList.jsx** - Admin outlet list view
- **../outlets/AddOutletModal.jsx** - Modal for adding/editing outlets
- **../outlets/OutletCard.jsx** - Card component for outlet display
- **../outlets/OutletDetailView.jsx** - Detailed outlet view

## Role-Based Access

### Admin
- Full access to all outlets
- Can add, edit, delete outlets
- Uses original OutletList component

### Outlet Manager
- Manages assigned outlet
- KPI dashboard with sales, waste, profit
- Staff management
- Performance charts
- Internal notices

### Outlet Staff
- View assigned outlet
- Today's sales (read-only)
- Assigned tasks
- No profit access

### Viewer
- Read-only access
- Basic outlet info
- Sales count and waste percentage
- No interactive actions

## Development Mode

In development mode, you can switch between roles using the dropdown in the header:

1. **dev-admin** - Full admin access
2. **dev-manager** - Outlet manager access
3. **dev-staff** - Staff access
4. **dev-viewer** - Read-only access

## Usage

```jsx
import OutletBaseScreen from './components/outlet/OutletBaseScreen'

// In your route or page component
<OutletBaseScreen />
```

The component automatically detects the user's role and renders the appropriate view.

## Styling

All components use the coral theme with Tailwind CSS:
- Primary color: Coral (#ef4444)
- Consistent card and button styles
- Dark mode support
- Responsive design

## Dependencies

- React 18+
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (charts)
- Tailwind CSS (styling)

## File Structure

```
/src/components/outlet/
├── OutletBaseScreen.jsx      ← Entry point
├── OutletManagerView.jsx     ← Manager dashboard
├── OutletStaffView.jsx       ← Staff interface
├── OutletViewerView.jsx      ← Read-only view
└── README.md                 ← This file

/src/components/outlets/      ← Original admin components
├── OutletList.jsx
├── AddOutletModal.jsx
├── OutletCard.jsx
└── OutletDetailView.jsx
``` 