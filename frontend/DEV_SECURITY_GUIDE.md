# Frontend Development Security Guide

## 🔓 Development Mode - Security Disabled

This guide explains how to run the frontend with security features disabled for development purposes.

## Available Screens

The frontend application includes **9 main screens**:

1. **Login** (`/login`) - Authentication screen
2. **Register** (`/register`) - User registration screen  
3. **Dashboard** (`/dashboard`) - Main dashboard with stats and charts
4. **Outlet Management** (`/outlets`) - Manage retail outlets
5. **Product Management** (`/products`) - Manage products and categories
6. **POS Sales** (`/pos`) - Point of sale interface
7. **Sales Report** (`/sales`) - Sales analytics and reports
8. **Expense Tracker** (`/expenses`) - Track business expenses
9. **Profile** (`/profile`) - User profile management

## Running with Security Disabled

### Option 1: Using the Development Script
```bash
npm run dev:no-auth
```

### Option 2: Manual Environment Setup
Create a `.env.development` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DISABLE_AUTH=true
VITE_DISABLE_PROTECTED_ROUTES=true
VITE_MOCK_USER=true
VITE_DEV_MODE=true
```

Then run:
```bash
npm run dev
```

## What Gets Disabled

When running in development mode with security disabled:

### ✅ Authentication Bypassed
- No login required
- Mock admin user automatically created
- All login/register forms work but don't make real API calls
- Logout resets to mock user instead of clearing session

### ✅ Route Protection Disabled
- All protected routes are accessible without authentication
- No redirects to login page
- Role-based access control is bypassed

### ✅ API Security Disabled
- No JWT tokens required for API calls
- Authentication headers are not injected
- Error handling for auth failures is disabled

### ✅ Visual Indicators
- Red "🔓 DEV MODE" indicator appears in top-right corner
- Console logs show when security features are bypassed

## Mock User Details

When security is disabled, a mock admin user is created with:
- **Username**: `dev-admin`
- **Email**: `admin@smartoutlet.dev`
- **Role**: `ADMIN`
- **Name**: Development Admin
- **Permissions**: Full access to all features

## Switching Back to Production Mode

To re-enable security:

1. Remove or rename `.env.development` file
2. Run `npm run dev` (normal mode)
3. Or set environment variables to `false`:
   ```env
   VITE_DISABLE_AUTH=false
   VITE_DISABLE_PROTECTED_ROUTES=false
   VITE_MOCK_USER=false
   VITE_DEV_MODE=false
   ```

## Development Workflow

1. **Start with security disabled**: `npm run dev:no-auth`
2. **Access any screen directly**: Navigate to any route without login
3. **Test all features**: All functionality works with mock data
4. **Switch to production mode**: When ready to test real authentication

## Security Notes

⚠️ **Important**: This mode is for development only. Never deploy with security disabled.

- All security checks are bypassed
- Mock data is used instead of real API calls
- No real authentication occurs
- Console shows security bypass messages

## Troubleshooting

If you see authentication errors:
1. Check that `.env.development` file exists
2. Verify environment variables are set to `true`
3. Restart the development server
4. Clear browser cache and localStorage

If the dev mode indicator doesn't appear:
1. Check browser console for errors
2. Verify `VITE_DEV_MODE=true` is set
3. Refresh the page 