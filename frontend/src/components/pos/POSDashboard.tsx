import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Badge,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { usePOSStore } from '../../store/posStore';
import { useLiveOrders } from '../../hooks/useLiveOrders';
import { Order, Product, KPIMetrics } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';

interface POSDashboardProps {
  outletId: string;
}

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'OPEN':
      return 'success';
    case 'PREPARING':
      return 'warning';
    case 'READY':
      return 'error';
    case 'COMPLETED':
      return 'default';
    case 'CANCELLED':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'OPEN':
      return '🟢';
    case 'PREPARING':
      return '🟡';
    case 'READY':
      return '🔴';
    case 'COMPLETED':
      return '✅';
    case 'CANCELLED':
      return '❌';
    default:
      return '⚪';
  }
};

export const POSDashboard: React.FC<POSDashboardProps> = ({ outletId }) => {
  const theme = useTheme();
  const { orders, products, addItemToOrder, setLoading } = usePOSStore();
  const { isConnected, connectionError } = useLiveOrders(outletId);
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  // Fetch KPI metrics
  useEffect(() => {
    const fetchKPIMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/pos/outlets/${outletId}/metrics`);
        const data = await response.json();
        setKpiMetrics(data);
      } catch (error) {
        console.error('Error fetching KPI metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIMetrics();
  }, [outletId, setLoading]);

  // Fetch top products
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('/api/products/top');
        const data = await response.json();
        setTopProducts(data.slice(0, 5)); // Top 5 products
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };

    fetchTopProducts();
  }, []);

  const handleQuickAdd = (product: Product) => {
    addItemToOrder(product, 1);
  };

  const openOrders = orders.filter(order => 
    ['OPEN', 'PREPARING', 'READY'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'COMPLETED' && 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Connection Status */}
      {connectionError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {connectionError}
        </Alert>
      )}

      {/* Header with Connection Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          POS Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
            <IconButton size="small">
              {isConnected ? <WifiIcon color="success" /> : <WifiOffIcon color="error" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            {isConnected ? 'Live' : 'Offline'}
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Today's Revenue
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="primary">
                    {kpiMetrics ? formatCurrency(kpiMetrics.todayRevenue) : '$0.00'}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="secondary">
                    {kpiMetrics ? formatCurrency(kpiMetrics.averageOrderValue) : '$0.00'}
                  </Typography>
                </Box>
                <CartIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Open Orders
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                    {openOrders.length}
                  </Typography>
                </Box>
                <Badge badgeContent={openOrders.length} color="warning">
                  <ReceiptIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Orders Today
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                    {completedOrders.length}
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Add Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Add - Top Sellers
          </Typography>
          <Grid container spacing={2}>
            {topProducts.map((product) => (
              <Grid item xs={12} sm={6} md={2.4} key={product.id}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleQuickAdd(product)}
                  disabled={product.stock === 0}
                  sx={{
                    height: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(product.price)}
                  </Typography>
                  {product.stock === 0 && (
                    <Chip label="Out of Stock" size="small" color="error" />
                  )}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Live Orders Grid */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Live Orders ({openOrders.length})
            </Typography>
            <IconButton size="small">
              <RefreshIcon />
            </IconButton>
          </Box>

          {openOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No active orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders will appear here when created
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {openOrders.map((order) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
                  <Card
                    sx={{
                      border: `2px solid ${theme.palette[getStatusColor(order.status)].main}`,
                      '&:hover': {
                        boxShadow: `0 4px 20px ${theme.palette[getStatusColor(order.status)].main}20`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Order #{order.id.slice(-6)}
                        </Typography>
                        <Chip
                          label={getStatusIcon(order.status) + ' ' + order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        {order.items.length} items
                      </Typography>
                      
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatCurrency(order.total)}
                      </Typography>
                      
                      {order.customerName && (
                        <Typography variant="caption" color="text.secondary">
                          Customer: {order.customerName}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};