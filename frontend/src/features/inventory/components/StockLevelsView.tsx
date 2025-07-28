import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { StockLevel, StockStatus, ExpiryStatus } from '../types/inventory';
import { inventoryService, formatCurrency, formatDate, getStockStatusIcon } from '../services/inventoryService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StockLevelsView: React.FC = () => {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedOutlet, setSelectedOutlet] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState(0);

  // Mock outlets - replace with actual outlet service
  const outlets = [
    { id: 1, name: 'Main Store' },
    { id: 2, name: 'Downtown Branch' },
    { id: 3, name: 'Mall Outlet' },
  ];

  // Load stock levels
  const loadStockLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: StockLevel[] = [];
      
      if (selectedOutlet === 'all') {
        // Load for all outlets
        const promises = outlets.map(outlet => 
          inventoryService.getStockLevelsByOutlet(outlet.id)
        );
        const results = await Promise.all(promises);
        data = results.flat();
      } else {
        data = await inventoryService.getStockLevelsByOutlet(selectedOutlet as number);
      }
      
      setStockLevels(data);
    } catch (err) {
      setError('Failed to load stock levels. Please try again.');
      console.error('Error loading stock levels:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter stock levels based on search and status
  const filterStockLevels = () => {
    let filtered = stockLevels;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(level => 
        level.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(level => level.stockStatus === statusFilter);
    }

    // Apply tab-based filtering
    switch (activeTab) {
      case 1: // Low Stock
        filtered = filtered.filter(level => level.isLowStock);
        break;
      case 2: // Out of Stock
        filtered = filtered.filter(level => level.isOutOfStock);
        break;
      case 3: // Expiring Items
        filtered = filtered.filter(level => level.hasExpiringItems);
        break;
      default:
        // All items - no additional filter
        break;
    }

    setFilteredLevels(filtered);
  };

  // Effects
  useEffect(() => {
    loadStockLevels();
  }, [selectedOutlet]);

  useEffect(() => {
    filterStockLevels();
  }, [stockLevels, searchTerm, statusFilter, activeTab]);

  // Get status chip color
  const getStatusChipColor = (status: StockStatus): 'error' | 'warning' | 'info' | 'success' => {
    switch (status) {
      case StockStatus.OUT_OF_STOCK:
        return 'error';
      case StockStatus.LOW_STOCK:
        return 'warning';
      case StockStatus.EXPIRING_ITEMS:
        return 'info';
      case StockStatus.ADEQUATE:
        return 'success';
      default:
        return 'info';
    }
  };

  // Get expiry status color
  const getExpiryStatusColor = (status: ExpiryStatus): string => {
    switch (status) {
      case ExpiryStatus.FRESH:
        return '#22c55e'; // green
      case ExpiryStatus.WARNING:
        return '#eab308'; // yellow
      case ExpiryStatus.CRITICAL:
        return '#f97316'; // orange
      case ExpiryStatus.EXPIRED:
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: 'Product',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.productName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.productSku}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.row.category} size="small" variant="outlined" />
      ),
    },
    {
      field: 'outletName',
      headerName: 'Outlet',
      width: 140,
    },
    {
      field: 'availableQuantity',
      headerName: 'Available Stock',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {params.row.availableQuantity}
          </Typography>
          {params.row.reservedQuantity > 0 && (
            <Tooltip title={`${params.row.reservedQuantity} reserved`}>
              <Chip label={`-${params.row.reservedQuantity}`} size="small" color="warning" />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: 'stockLevel',
      headerName: 'Stock Level',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const level = (params.row.availableQuantity / params.row.maxStockLevel) * 100;
        const color = level <= 20 ? 'error' : level <= 50 ? 'warning' : 'success';
        
        return (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 35 }}>
                {Math.round(level)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={level} 
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'stockStatus',
      headerName: 'Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>{getStockStatusIcon(params.row.stockStatus)}</span>
          <Chip 
            label={params.row.stockStatus.replace('_', ' ')}
            color={getStatusChipColor(params.row.stockStatus)}
            size="small"
          />
        </Box>
      ),
    },
    {
      field: 'expiryInfo',
      headerName: 'Expiry Status',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          {params.row.hasExpiringItems && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ScheduleIcon color="warning" fontSize="small" />
              <Typography variant="caption" color="warning.main">
                {params.row.expiringItemsCount} expiring
              </Typography>
            </Box>
          )}
          {params.row.expiredItemsCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ErrorIcon color="error" fontSize="small" />
              <Typography variant="caption" color="error.main">
                {params.row.expiredItemsCount} expired
              </Typography>
            </Box>
          )}
          {!params.row.hasExpiringItems && params.row.expiredItemsCount === 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="caption" color="success.main">
                Fresh
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(params.row.totalValue)}
        </Typography>
      ),
    },
    {
      field: 'batchCount',
      headerName: 'Batches',
      width: 80,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.row.batchCount} size="small" />
      ),
    },
  ];

  // Calculate summary stats
  const summaryStats = {
    total: filteredLevels.length,
    lowStock: filteredLevels.filter(l => l.isLowStock).length,
    outOfStock: filteredLevels.filter(l => l.isOutOfStock).length,
    expiring: filteredLevels.filter(l => l.hasExpiringItems).length,
    totalValue: filteredLevels.reduce((sum, l) => sum + l.totalValue, 0),
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon color="primary" />
          Stock Levels by Outlet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track inventory levels across all outlets with real-time expiry monitoring
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">{summaryStats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Products</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error">{summaryStats.outOfStock}</Typography>
              <Typography variant="body2" color="text.secondary">Out of Stock</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning">{summaryStats.lowStock}</Typography>
              <Typography variant="body2" color="text.secondary">Low Stock</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info">{summaryStats.expiring}</Typography>
              <Typography variant="body2" color="text.secondary">Expiring Items</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success">{formatCurrency(summaryStats.totalValue)}</Typography>
              <Typography variant="body2" color="text.secondary">Total Value</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Outlet</InputLabel>
                <Select
                  value={selectedOutlet}
                  label="Outlet"
                  onChange={(e) => setSelectedOutlet(e.target.value as number | 'all')}
                >
                  <MenuItem value="all">All Outlets</MenuItem>
                  {outlets.map(outlet => (
                    <MenuItem key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value as StockStatus | 'all')}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value={StockStatus.ADEQUATE}>Adequate</MenuItem>
                  <MenuItem value={StockStatus.LOW_STOCK}>Low Stock</MenuItem>
                  <MenuItem value={StockStatus.OUT_OF_STOCK}>Out of Stock</MenuItem>
                  <MenuItem value={StockStatus.EXPIRING_ITEMS}>Expiring Items</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Tooltip title="Refresh data">
                <IconButton onClick={loadStockLevels} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="All Items" />
            <Tab 
              label={
                <Badge badgeContent={summaryStats.lowStock} color="warning">
                  Low Stock
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={summaryStats.outOfStock} color="error">
                  Out of Stock
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={summaryStats.expiring} color="info">
                  Expiring Items
                </Badge>
              } 
            />
          </Tabs>
        </Box>

        {/* Data Grid */}
        <TabPanel value={activeTab} index={activeTab}>
          <DataGrid
            rows={filteredLevels}
            columns={columns}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
            getRowId={(row) => `${row.productId}-${row.outletId}`}
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </TabPanel>
      </Card>
    </Box>
  );
};

export default StockLevelsView;