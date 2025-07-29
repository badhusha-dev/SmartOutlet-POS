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
  Fade,
  Zoom,
  Slide,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  LocalShipping as DeliveryIcon,
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

const getStatusGradient = (status: Order['status']) => {
  switch (status) {
    case 'OPEN':
      return 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)';
    case 'PREPARING':
      return 'linear-gradient(135deg, #F39C12 0%, #D68910 100%)';
    case 'READY':
      return 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)';
    case 'COMPLETED':
      return 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)';
    default:
      return 'linear-gradient(135deg, #95A5A6 0%, #7F8C8D 100%)';
  }
};

const KPICard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  subtitle,
  loading = false 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: { value: number; direction: 'up' | 'down' };
  subtitle?: string;
  loading?: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
          border: `1px solid ${color}20`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: color,
          },
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative' }}>
          {loading && (
            <LinearProgress 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0,
                height: '4px',
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                }
              }} 
            />
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: `${color}CC`, 
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
              
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: color,
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>
              
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {subtitle}
                </Typography>
              )}
              
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUpIcon 
                    sx={{ 
                      fontSize: 16, 
                      color: trend.direction === 'up' ? 'success.main' : 'error.main',
                      transform: trend.direction === 'down' ? 'rotate(180deg)' : 'none',
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: trend.direction === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {trend.value}% {trend.direction === 'up' ? 'increase' : 'decrease'}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: `${color}20`,
                color: color,
                fontSize: 24,
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const OrderTile = ({ order, onClick }: { order: Order; onClick?: () => void }) => {
  const theme = useTheme();
  const statusColor = getStatusColor(order.status);
  const statusGradient = getStatusGradient(order.status);
  
  return (
    <Fade in={true}>
      <Card
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[statusColor].main}08 0%, ${theme.palette[statusColor].main}04 100%)`,
          border: `2px solid ${theme.palette[statusColor].main}30`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            borderColor: theme.palette[statusColor].main,
            '& .order-status-indicator': {
              width: '100%',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: statusGradient,
            transition: 'width 0.3s ease-in-out',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                Order #{order.id.slice(-6)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {new Date(order.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={`${getStatusIcon(order.status)} ${order.status}`}
                  color={statusColor}
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {order.items.length} items
                </Typography>
              </Box>
            </Box>
            
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color="primary"
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatCurrency(order.total)}
            </Typography>
          </Box>
          
          {order.customerName && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {order.customerName.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {order.customerName}
              </Typography>
            </Box>
          )}
          
          <Box 
            className="order-status-indicator"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              width: '4px',
              background: statusGradient,
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </CardContent>
      </Card>
    </Fade>
  );
};

const QuickAddButton = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const theme = useTheme();
  
  return (
    <Zoom in={true}>
      <Button
        variant="outlined"
        fullWidth
        onClick={onClick}
        disabled={product.stock === 0}
        sx={{
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          borderRadius: 2,
          border: `2px solid ${theme.palette.primary.main}30`,
          backgroundColor: `${theme.palette.primary.main}08`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}15`,
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
          '&:disabled': {
            backgroundColor: theme.palette.grey[100],
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[500],
          },
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(product.price)}
        </Typography>
        {product.stock === 0 && (
          <Chip 
            label="Out of Stock" 
            size="small" 
            color="error" 
            sx={{ fontSize: '0.625rem', height: 16 }}
          />
        )}
      </Button>
    </Zoom>
  );
};

export const POSDashboard: React.FC<POSDashboardProps> = ({ outletId }) => {
  const theme = useTheme();
  const { orders, products, addItemToOrder, setLoading } = usePOSStore();
  const { isConnected, connectionError } = useLiveOrders(outletId);
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetrics | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const openOrders = orders.filter(order => 
    ['OPEN', 'PREPARING', 'READY'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'COMPLETED' && 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  const kpiData = [
    {
      title: "Today's Revenue",
      value: kpiMetrics ? formatCurrency(kpiMetrics.todayRevenue) : '$0.00',
      icon: <MoneyIcon />,
      color: theme.palette.primary.main,
      trend: { value: 12, direction: 'up' as const },
      subtitle: 'vs yesterday',
      loading: !kpiMetrics,
    },
    {
      title: "Avg Order Value",
      value: kpiMetrics ? formatCurrency(kpiMetrics.averageOrderValue) : '$0.00',
      icon: <SpeedIcon />,
      color: theme.palette.secondary.main,
      trend: { value: 5, direction: 'up' as const },
      subtitle: 'per order',
      loading: !kpiMetrics,
    },
    {
      title: "Open Orders",
      value: openOrders.length,
      icon: <ReceiptIcon />,
      color: theme.palette.warning.main,
      subtitle: 'in progress',
      loading: false,
    },
    {
      title: "Orders Today",
      value: completedOrders.length,
      icon: <PeopleIcon />,
      color: theme.palette.info.main,
      trend: { value: 8, direction: 'up' as const },
      subtitle: 'completed',
      loading: false,
    },
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: theme.palette.background.default }}>
      {/* Connection Status */}
      <Slide direction="down" in={!!connectionError}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 20,
            },
          }}
        >
          {connectionError}
        </Alert>
      </Slide>

      {/* Header with Connection Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            POS Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time order management and analytics
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                sx={{ 
                  color: isConnected ? 'success.main' : 'error.main',
                  backgroundColor: isConnected ? 'success.main' : 'error.main',
                  '&:hover': {
                    backgroundColor: isConnected ? 'success.dark' : 'error.dark',
                  },
                }}
              >
                {isConnected ? <WifiIcon /> : <WifiOffIcon />}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {isConnected ? 'Live' : 'Offline'}
              </Typography>
            </Box>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            size="small"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.title}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Add Section */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <AddIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Quick Add - Top Sellers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add popular items to orders instantly
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {topProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={product.id}>
                <QuickAddButton product={product} onClick={() => handleQuickAdd(product)} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Live Orders Grid */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Live Orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {openOrders.length} active orders • Real-time updates
              </Typography>
            </Box>
            
            <Badge 
              badgeContent={openOrders.length} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  height: 24,
                  minWidth: 24,
                },
              }}
            >
              <Avatar sx={{ bgcolor: 'error.main', width: 40, height: 40 }}>
                <ReceiptIcon />
              </Avatar>
            </Badge>
          </Box>

          {openOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'grey.100', 
                  color: 'grey.500',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <ReceiptIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No active orders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders will appear here when created
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {openOrders.map((order, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
                  <OrderTile order={order} />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};