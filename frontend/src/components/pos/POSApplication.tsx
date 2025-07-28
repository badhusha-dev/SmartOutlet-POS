import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  Fab,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { usePOSStore } from '../../store/posStore';
import { POSDashboard } from './POSDashboard';
import { OrderEntryForm } from './OrderEntryForm';
import { CheckoutModal } from './CheckoutModal';
import { OrderHistoryList } from './OrderHistoryList';
import { CustomerProfile } from './CustomerProfile';
import { useLiveOrders } from '../../hooks/useLiveOrders';

interface POSApplicationProps {
  outletId: string;
}

type ViewType = 'dashboard' | 'order-entry' | 'order-history' | 'customers' | 'settings';

export const POSApplication: React.FC<POSApplicationProps> = ({ outletId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { 
    currentOrder, 
    orders, 
    customers, 
    products, 
    isLoading, 
    error,
    setCurrentOrder,
    addItemToOrder,
    clearCurrentOrder,
    setLoading,
    setError 
  } = usePOSStore();

  const { isConnected, connectionError } = useLiveOrders(outletId);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Load products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        usePOSStore.getState().setProducts(productsData);

        // Load customers
        const customersResponse = await fetch('/api/customers');
        const customersData = await customersResponse.json();
        usePOSStore.getState().setCustomers(customersData);

        // Load recent orders
        const ordersResponse = await fetch(`/api/pos/outlets/${outletId}/orders`);
        const ordersData = await ordersResponse.json();
        usePOSStore.getState().setOrders(ordersData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [outletId, setLoading, setError]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleCheckout = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setCheckoutOpen(true);
    } else {
      setNotification({ message: 'No items in order', type: 'error' });
    }
  };

  const handleItemAdded = () => {
    setNotification({ message: 'Item added to order', type: 'success' });
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    if (currentOrder) {
      setCurrentOrder({
        ...currentOrder,
        customerId: customer.id,
        customerName: customer.name,
      });
    }
  };

  const handleCheckoutComplete = () => {
    setCheckoutOpen(false);
    setNotification({ message: 'Order completed successfully!', type: 'success' });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'order-entry', label: 'Order Entry', icon: <CartIcon /> },
    { id: 'order-history', label: 'Order History', icon: <ReceiptIcon /> },
    { id: 'customers', label: 'Customers', icon: <PeopleIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <POSDashboard outletId={outletId} />;
      case 'order-entry':
        return (
          <Box sx={{ p: 3 }}>
            <OrderEntryForm onItemAdded={handleItemAdded} />
          </Box>
        );
      case 'order-history':
        return <OrderHistoryList />;
      case 'customers':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Customer Management
            </Typography>
            {/* Customer list component would go here */}
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Settings
            </Typography>
            {/* Settings component would go here */}
          </Box>
        );
      default:
        return <POSDashboard outletId={outletId} />;
    }
  };

  const openOrdersCount = orders.filter(order => 
    ['OPEN', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CoralServe POS - {outletId}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isConnected && (
              <Alert severity="warning" sx={{ mr: 2 }}>
                Offline Mode
              </Alert>
            )}
            
            <Badge badgeContent={openOrdersCount} color="error">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Badge>
            
            <IconButton color="inherit">
              <AccountIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentView === item.id}
                onClick={() => handleViewChange(item.id as ViewType)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem>
            <ListItemText
              primary="Connection Status"
              secondary={isConnected ? 'Connected' : 'Offline'}
              secondaryTypographyProps={{
                color: isConnected ? 'success.main' : 'error.main',
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${drawerOpen ? 240 : 0}px)` },
          ml: { sm: `${drawerOpen ? 240 : 0}px` },
          mt: 8, // Account for AppBar height
        }}
      >
        {renderCurrentView()}

        {/* Floating Action Button for Checkout */}
        {currentView === 'order-entry' && currentOrder && currentOrder.items.length > 0 && (
          <Fab
            color="primary"
            aria-label="checkout"
            onClick={handleCheckout}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <CartIcon />
          </Fab>
        )}
      </Box>

      {/* Checkout Modal */}
      {currentOrder && (
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          order={currentOrder}
          customer={selectedCustomer}
        />
      )}

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert
            onClose={() => setNotification(null)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>

      {/* Error Display */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Connection Error */}
      {connectionError && (
        <Snackbar
          open={!!connectionError}
          autoHideDuration={0}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity="warning"
            sx={{ width: '100%' }}
          >
            {connectionError}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};