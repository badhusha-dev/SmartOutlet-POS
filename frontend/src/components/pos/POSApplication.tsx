import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip,
  Fade,
  Zoom,
  Slide,
  Stack,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  ListItemAvatar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ShoppingCart as CartIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Receipt as ReceiptIcon,
  LocalOffer as DiscountIcon,
  Loyalty as LoyaltyIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { POSDashboard } from './POSDashboard';
import { OrderEntryForm } from './OrderEntryForm';
import { OrderHistoryList } from './OrderHistoryList';
import { CustomerProfile } from './CustomerProfile';
import { CheckoutModal } from './CheckoutModal';
import { usePOSStore } from '../../store/posStore';
import { useLiveOrders } from '../../hooks/useLiveOrders';
import { formatCurrency } from '../../utils/formatters';

interface POSApplicationProps {
  outletId: string;
}

const drawerWidth = 280;

const NavigationItem = ({ 
  icon, 
  text, 
  selected, 
  onClick, 
  badge, 
  color = 'primary' 
}: {
  icon: React.ReactNode;
  text: string;
  selected: boolean;
  onClick: () => void;
  badge?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}) => {
  const theme = useTheme();
  
  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      <ListItemButton
        selected={selected}
        onClick={onClick}
        sx={{
          borderRadius: 2,
          mx: 1,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette[color].main + '10',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette[color].main + '20',
            '&:hover': {
              backgroundColor: theme.palette[color].main + '30',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: selected ? theme.palette[color].main : 'inherit',
            minWidth: 40,
          }}
        >
          {badge ? (
            <Badge badgeContent={badge} color={color} max={99}>
              {icon}
            </Badge>
          ) : (
            icon
          )}
        </ListItemIcon>
        <ListItemText 
          primary={text}
          primaryTypographyProps={{
            fontWeight: selected ? 600 : 400,
            color: selected ? theme.palette[color].main : 'inherit',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const HeaderStats = ({ orders, revenue }: { orders: number; revenue: number }) => {
  const theme = useTheme();
  
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}08 100%)`,
          border: `1px solid ${theme.palette.success.main}30`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="caption" color="success.main" fontWeight={600}>
            Today: {formatCurrency(revenue)}
          </Typography>
        </Box>
      </Paper>
      
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.warning.main}08 100%)`,
          border: `1px solid ${theme.palette.warning.main}30`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon sx={{ fontSize: 16, color: 'warning.main' }} />
          <Typography variant="caption" color="warning.main" fontWeight={600}>
            {orders} Orders
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
};

export const POSApplication: React.FC<POSApplicationProps> = ({ outletId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    currentOrder, 
    orders, 
    addItemToOrder, 
    clearCurrentOrder, 
    setError, 
    error, 
    loading 
  } = usePOSStore();
  
  const { isConnected, connectionError } = useLiveOrders(outletId);
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'order-entry' | 'history' | 'customers' | 'settings'>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Calculate stats
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const openOrdersCount = orders.filter(order => 
    ['OPEN', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        // Simulate API calls
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 500)), // Products
          new Promise(resolve => setTimeout(resolve, 800)), // Customers
          new Promise(resolve => setTimeout(resolve, 600)), // Orders
        ]);
      } catch (error) {
        setError('Failed to load initial data');
      }
    };

    loadInitialData();
  }, [setError]);

  const handleItemAdded = () => {
    setNotification({
      message: 'Item added to order successfully!',
      severity: 'success'
    });
  };

  const handleError = (error: string) => {
    setNotification({
      message: error,
      severity: 'error'
    });
  };

  const handleViewChange = (view: typeof currentView) => {
    setCurrentView(view);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleCheckout = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setCheckoutOpen(true);
    } else {
      setNotification({
        message: 'Please add items to the order before checkout',
        severity: 'warning'
      });
    }
  };

  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
    clearCurrentOrder();
  };

  const navigationItems = [
    {
      key: 'dashboard' as const,
      icon: <DashboardIcon />,
      text: 'Dashboard',
      badge: openOrdersCount,
      color: 'primary' as const,
    },
    {
      key: 'order-entry' as const,
      icon: <AddIcon />,
      text: 'Order Entry',
      badge: currentOrder?.items.length || 0,
      color: 'success' as const,
    },
    {
      key: 'history' as const,
      icon: <HistoryIcon />,
      text: 'Order History',
      color: 'info' as const,
    },
    {
      key: 'customers' as const,
      icon: <PeopleIcon />,
      text: 'Customers',
      color: 'secondary' as const,
    },
    {
      key: 'settings' as const,
      icon: <SettingsIcon />,
      text: 'Settings',
      color: 'warning' as const,
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <POSDashboard outletId={outletId} />;
      case 'order-entry':
        return <OrderEntryForm onItemAdded={handleItemAdded} />;
      case 'history':
        return <OrderHistoryList />;
      case 'customers':
        return <CustomerProfile />;
      case 'settings':
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Settings panel coming soon...
            </Typography>
          </Box>
        );
      default:
        return <POSDashboard outletId={outletId} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box>
              <Typography variant="h6" fontWeight="bold">
                CoralServe POS
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {outletId} • {isConnected ? 'Live' : 'Offline'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Connection Status */}
            <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small"
                  sx={{ 
                    color: 'white',
                    backgroundColor: isConnected ? 'success.main' : 'error.main',
                    '&:hover': {
                      backgroundColor: isConnected ? 'success.dark' : 'error.dark',
                    },
                  }}
                >
                  {isConnected ? <WifiIcon /> : <WifiOffIcon />}
                </IconButton>
              </Box>
            </Tooltip>

            {/* Stats */}
            <HeaderStats orders={todayOrders.length} revenue={todayRevenue} />

            {/* Notifications */}
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AccountIcon />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          },
        }}
      >
        <Toolbar />
        
        <Box sx={{ p: 2 }}>
          {/* Brand Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.5rem',
              }}
            >
              <RestaurantIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                CoralServe
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Point of Sale
              </Typography>
            </Box>
          </Box>

          {/* Current Order Summary */}
          {currentOrder && currentOrder.items.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.success.main}08 0%, ${theme.palette.success.main}04 100%)`,
                border: `1px solid ${theme.palette.success.main}20`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main' }}>
                  <CartIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Current Order
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentOrder.items.length} items
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {formatCurrency(currentOrder.total)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={handleCheckout}
                sx={{ borderRadius: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          )}

          {/* Navigation */}
          <List sx={{ px: 1 }}>
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.key}
                icon={item.icon}
                text={item.text}
                selected={currentView === item.key}
                onClick={() => handleViewChange(item.key)}
                badge={item.badge}
                color={item.color}
              />
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Quick Actions */}
          <Box sx={{ px: 1 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Quick Actions
            </Typography>
            
            <Stack spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DiscountIcon />}
                fullWidth
                sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
              >
                Manage Discounts
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<LoyaltyIcon />}
                fullWidth
                sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
              >
                Loyalty Program
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflow: 'auto',
          background: theme.palette.background.default,
        }}
      >
        <Toolbar />
        {renderCurrentView()}
      </Box>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={handleCheckoutClose}
        order={currentOrder!}
        customer={undefined} // TODO: Add customer selection
      />

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.severity}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Connection Error */}
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

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};