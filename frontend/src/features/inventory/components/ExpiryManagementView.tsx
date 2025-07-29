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
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { InventoryItem, ExpiryStatus } from '../types/inventory';
import { inventoryService, formatDate, formatCurrency, getDaysToExpiry } from '../services/inventoryService';

const ExpiryManagementView: React.FC = () => {
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
  const [expiredItems, setExpiredItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedOutlet, setSelectedOutlet] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'expiring' | 'expired'>('all');
  const [daysFilter, setDaysFilter] = useState(30);
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  // Mock outlets - replace with actual outlet service
  const outlets = [
    { id: 1, name: 'Main Store' },
    { id: 2, name: 'Downtown Branch' },
    { id: 3, name: 'Mall Outlet' },
  ];

  // Load expiry data
  const loadExpiryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let expiringData: InventoryItem[] = [];
      let expiredData: InventoryItem[] = [];
      
      if (selectedOutlet === 'all') {
        // Load for all outlets
        const expiringPromises = outlets.map(outlet => 
          inventoryService.getExpiringItems(outlet.id, daysFilter)
        );
        const expiredPromises = outlets.map(outlet => 
          inventoryService.getExpiredItems(outlet.id)
        );
        
        const [expiringResults, expiredResults] = await Promise.all([
          Promise.all(expiringPromises),
          Promise.all(expiredPromises)
        ]);
        
        expiringData = expiringResults.flat();
        expiredData = expiredResults.flat();
      } else {
        expiringData = await inventoryService.getExpiringItems(selectedOutlet as number, daysFilter);
        expiredData = await inventoryService.getExpiredItems(selectedOutlet as number);
      }
      
      setExpiringItems(expiringData);
      setExpiredItems(expiredData);
    } catch (err) {
      setError('Failed to load expiry data. Please try again.');
      console.error('Error loading expiry data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on criteria
  const filterItems = () => {
    let allItems = [...expiringItems, ...expiredItems];
    
    // Remove duplicates
    allItems = allItems.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );
    
    // Apply expiry filter
    if (expiryFilter === 'expiring') {
      allItems = expiringItems;
    } else if (expiryFilter === 'expired') {
      allItems = expiredItems;
    }
    
    // Apply search filter
    if (searchTerm) {
      allItems = allItems.filter(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by expiry date (nearest first)
    allItems.sort((a, b) => {
      if (!a.expiryDate && !b.expiryDate) return 0;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
    
    setFilteredItems(allItems);
  };

  // Effects
  useEffect(() => {
    loadExpiryData();
  }, [selectedOutlet, daysFilter]);

  useEffect(() => {
    filterItems();
  }, [expiringItems, expiredItems, searchTerm, expiryFilter]);

  // Get expiry status with colors
  const getExpiryStatusDisplay = (item: InventoryItem) => {
    if (!item.expiryDate) {
      return { status: 'No Expiry', color: '#6b7280', icon: '⚪', bgColor: '#f3f4f6' };
    }

    const daysToExpiry = getDaysToExpiry(item.expiryDate);
    
    if (daysToExpiry < 0) {
      return { 
        status: 'Expired', 
        color: '#ef4444', 
        icon: '🔴', 
        bgColor: '#fef2f2',
        days: Math.abs(daysToExpiry) + ' days ago'
      };
    } else if (daysToExpiry <= 7) {
      return { 
        status: 'Critical', 
        color: '#f97316', 
        icon: '🟠', 
        bgColor: '#fff7ed',
        days: daysToExpiry + ' days left'
      };
    } else if (daysToExpiry <= 30) {
      return { 
        status: 'Warning', 
        color: '#eab308', 
        icon: '🟡', 
        bgColor: '#fffbeb',
        days: daysToExpiry + ' days left'
      };
    } else {
      return { 
        status: 'Fresh', 
        color: '#22c55e', 
        icon: '🟢', 
        bgColor: '#f0fdf4',
        days: daysToExpiry + ' days left'
      };
    }
  };

  // Handle item action
  const handleItemAction = (item: InventoryItem) => {
    setSelectedItem(item);
    setActionModalOpen(true);
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'productInfo',
      headerName: 'Product',
      width: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.productName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU: {params.row.productSku} | Batch: {params.row.batchNumber}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'outletName',
      headerName: 'Outlet',
      width: 140,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="medium">
          {params.row.availableQuantity}
        </Typography>
      ),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.expiryDate ? formatDate(params.row.expiryDate) : 'No expiry'}
        </Typography>
      ),
    },
    {
      field: 'expiryStatus',
      headerName: 'Status',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const statusInfo = getExpiryStatusDisplay(params.row);
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 1,
            borderRadius: 1,
            backgroundColor: statusInfo.bgColor,
            border: `1px solid ${statusInfo.color}20`
          }}>
            <span style={{ fontSize: '16px' }}>{statusInfo.icon}</span>
            <Box>
              <Typography variant="body2" fontWeight="medium" sx={{ color: statusInfo.color }}>
                {statusInfo.status}
              </Typography>
              {statusInfo.days && (
                <Typography variant="caption" color="text.secondary">
                  {statusInfo.days}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'receivedDate',
      headerName: 'Received',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {formatDate(params.row.receivedDate)}
        </Typography>
      ),
    },
    {
      field: 'totalValue',
      headerName: 'Value',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="medium">
          {formatCurrency(params.row.totalValue)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleItemAction(params.row)}
          startIcon={<AssignmentIcon />}
        >
          Manage
        </Button>
      ),
    },
  ];

  // Calculate summary stats
  const summaryStats = {
    total: filteredItems.length,
    expired: expiredItems.length,
    critical: expiringItems.filter(item => {
      if (!item.expiryDate) return false;
      const days = getDaysToExpiry(item.expiryDate);
      return days >= 0 && days <= 7;
    }).length,
    warning: expiringItems.filter(item => {
      if (!item.expiryDate) return false;
      const days = getDaysToExpiry(item.expiryDate);
      return days > 7 && days <= 30;
    }).length,
    totalValue: filteredItems.reduce((sum, item) => sum + item.totalValue, 0),
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon color="primary" />
          Expiry Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage product expiry dates with automated alerts and color-coded warnings
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">{summaryStats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Items</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="error">{summaryStats.expired}</Typography>
              <Typography variant="body2" color="text.secondary">Expired</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#f97316' }}>{summaryStats.critical}</Typography>
              <Typography variant="body2" color="text.secondary">Critical (≤7 days)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#eab308' }}>{summaryStats.warning}</Typography>
              <Typography variant="body2" color="text.secondary">Warning (≤30 days)</Typography>
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
            <Grid item xs={12} sm={6} md={2.5}>
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
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Expiry Filter</InputLabel>
                <Select
                  value={expiryFilter}
                  label="Expiry Filter"
                  onChange={(e) => setExpiryFilter(e.target.value as 'all' | 'expiring' | 'expired')}
                >
                  <MenuItem value="all">All Items</MenuItem>
                  <MenuItem value="expiring">Expiring Soon</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Days Ahead"
                type="number"
                value={daysFilter}
                onChange={(e) => setDaysFilter(parseInt(e.target.value) || 30)}
                inputProps={{ min: 1, max: 365 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh data">
                  <IconButton onClick={loadExpiryData} disabled={loading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
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

      {/* Expiry Legend */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Expiry Status Legend
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '16px' }}>🟢</span>
                <Typography variant="body2">Fresh (&gt;30 days)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '16px' }}>🟡</span>
                <Typography variant="body2">Warning (8-30 days)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '16px' }}>🟠</span>
                <Typography variant="body2">Critical (1-7 days)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '16px' }}>🔴</span>
                <Typography variant="body2">Expired</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <DataGrid
          rows={filteredItems}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Card>

      {/* Action Modal */}
      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Manage Expiry Item
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedItem.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Batch: {selectedItem.batchNumber} | Available: {selectedItem.availableQuantity}
              </Typography>
              
              {selectedItem.expiryDate && (
                <Box sx={{ mt: 2 }}>
                  {(() => {
                    const statusInfo = getExpiryStatusDisplay(selectedItem);
                    return (
                      <Alert 
                        severity={
                          statusInfo.status === 'Expired' ? 'error' :
                          statusInfo.status === 'Critical' ? 'warning' :
                          statusInfo.status === 'Warning' ? 'info' : 'success'
                        }
                        sx={{ mb: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{statusInfo.icon}</span>
                          <Typography>
                            {statusInfo.status}: {statusInfo.days}
                          </Typography>
                        </Box>
                      </Alert>
                    );
                  })()}
                </Box>
              )}

              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Expiry Date:</strong> {selectedItem.expiryDate ? formatDate(selectedItem.expiryDate) : 'No expiry date'}
              </Typography>
              <Typography variant="body2">
                <strong>Received:</strong> {formatDate(selectedItem.receivedDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Value:</strong> {formatCurrency(selectedItem.totalValue)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionModalOpen(false)}>
            Close
          </Button>
          <Button variant="outlined" color="warning">
            Mark as Damaged
          </Button>
          <Button variant="outlined" color="error">
            Mark as Expired
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpiryManagementView;