import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Inventory as InventoryIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { recipeService, recipeUtils } from '../../services/recipeService';
import { RawMaterial, MaterialStatus, RawMaterialFilters } from '../../types/recipe';

interface RawMaterialsViewProps {
  onRefresh: () => void;
}

const RawMaterialsView: React.FC<RawMaterialsViewProps> = ({ onRefresh }) => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RawMaterialFilters>({
    page: 0,
    size: 25,
    sortBy: 'name',
    sortDir: 'asc',
  });
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [summary, setSummary] = useState({
    totalMaterials: 0,
    lowStockCount: 0,
    reorderNeeded: 0,
    totalValue: 0,
  });

  useEffect(() => {
    loadMaterials();
    loadCategories();
  }, [filters]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await recipeService.getRawMaterials(filters);
      
      // Mock data for demonstration
      const mockMaterials: RawMaterial[] = [
        {
          id: 1,
          materialCode: 'FLR-001',
          name: 'Premium Wheat Flour',
          description: 'High-quality all-purpose flour for baking',
          category: 'Grains & Cereals',
          subcategory: 'Flour',
          unitOfMeasure: 'KILOGRAM' as any,
          baseUnitCost: 2.50,
          currentStock: 85.5,
          minStockLevel: 50,
          maxStockLevel: 200,
          reorderPoint: 60,
          reorderQuantity: 100,
          leadTimeDays: 5,
          shelfLifeDays: 365,
          wastagePercentage: 3.0,
          status: 'ACTIVE' as MaterialStatus,
          stockValue: 213.75,
          isLowStock: false,
          needsReorder: false,
          isExpired: false,
          daysUntilReorderNeeded: 15,
          stockStatusColor: '#22c55e',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:45:00Z',
          primaryVendor: {
            id: 1,
            vendorCode: 'VND-001',
            name: 'Premium Ingredients Ltd',
            contactPerson: 'John Smith',
            email: 'orders@premium-ingredients.com',
            phone: '+1-555-0123',
            leadTimeDays: 5,
            qualityRating: 4.8,
            overallRating: 4.6,
          },
        },
        {
          id: 2,
          materialCode: 'SGR-002',
          name: 'Organic Cane Sugar',
          description: 'Certified organic sugar for premium products',
          category: 'Sweeteners',
          subcategory: 'Sugar',
          unitOfMeasure: 'KILOGRAM' as any,
          baseUnitCost: 1.80,
          currentStock: 25.0,
          minStockLevel: 30,
          maxStockLevel: 150,
          reorderPoint: 35,
          reorderQuantity: 75,
          leadTimeDays: 7,
          shelfLifeDays: 730,
          wastagePercentage: 2.0,
          status: 'ACTIVE' as MaterialStatus,
          stockValue: 45.00,
          isLowStock: true,
          needsReorder: true,
          isExpired: false,
          daysUntilReorderNeeded: 3,
          stockStatusColor: '#ef4444',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-22T16:20:00Z',
          primaryVendor: {
            id: 2,
            vendorCode: 'VND-002',
            name: 'Organic Supplies Co',
            contactPerson: 'Sarah Johnson',
            email: 'procurement@organicsupplies.com',
            phone: '+1-555-0456',
            leadTimeDays: 7,
            qualityRating: 4.9,
            overallRating: 4.7,
          },
        },
        {
          id: 3,
          materialCode: 'CCO-003',
          name: 'Dutch Cocoa Powder',
          description: 'Premium cocoa powder for chocolate products',
          category: 'Chocolate & Cocoa',
          subcategory: 'Cocoa Powder',
          unitOfMeasure: 'KILOGRAM' as any,
          baseUnitCost: 8.50,
          currentStock: 15.8,
          minStockLevel: 10,
          maxStockLevel: 50,
          reorderPoint: 15,
          reorderQuantity: 25,
          leadTimeDays: 10,
          shelfLifeDays: 1095,
          wastagePercentage: 1.5,
          status: 'ACTIVE' as MaterialStatus,
          stockValue: 134.30,
          isLowStock: false,
          needsReorder: true,
          isExpired: false,
          daysUntilReorderNeeded: 7,
          stockStatusColor: '#eab308',
          createdAt: '2024-01-08T11:00:00Z',
          updatedAt: '2024-01-21T13:30:00Z',
          primaryVendor: {
            id: 3,
            vendorCode: 'VND-003',
            name: 'Cocoa Specialists',
            contactPerson: 'Maria Garcia',
            email: 'supply@cocoaspecialists.com',
            phone: '+1-555-0789',
            leadTimeDays: 10,
            qualityRating: 4.9,
            overallRating: 4.8,
          },
        },
      ];

      setMaterials(mockMaterials);
      setTotalCount(mockMaterials.length);
      
      // Calculate summary
      const totalValue = mockMaterials.reduce((sum, m) => sum + m.stockValue, 0);
      const lowStockCount = mockMaterials.filter(m => m.isLowStock).length;
      const reorderNeeded = mockMaterials.filter(m => m.needsReorder).length;
      
      setSummary({
        totalMaterials: mockMaterials.length,
        lowStockCount,
        reorderNeeded,
        totalValue,
      });
      
    } catch (error) {
      console.error('Failed to load materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await recipeService.getMaterialCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleFilterChange = (field: keyof RawMaterialFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 0, // Reset to first page when filtering
    }));
  };

  const getStockLevelProgress = (current: number, min: number, max: number) => {
    if (!min || !max) return 100;
    const progress = ((current - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const getStockLevelColor = (material: RawMaterial) => {
    if (material.isExpired) return 'error';
    if (material.isLowStock) return 'error';
    if (material.needsReorder) return 'warning';
    return 'success';
  };

  const columns: GridColDef[] = [
    {
      field: 'materialCode',
      headerName: 'Code',
      width: 120,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}
          >
            {params.row.materialCode.slice(0, 2)}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Material Name',
      width: 250,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.category}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'currentStock',
      headerName: 'Stock Level',
      width: 200,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => {
        const progress = getStockLevelProgress(
          params.row.currentStock,
          params.row.minStockLevel || 0,
          params.row.maxStockLevel || 100
        );
        const color = getStockLevelColor(params.row);
        
        return (
          <Box width="100%">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="body2" fontWeight="medium">
                {recipeUtils.formatQuantity(params.value)} 
                {params.row.unitOfMeasure === 'KILOGRAM' ? 'kg' : 
                 params.row.unitOfMeasure === 'LITER' ? 'L' : 'pcs'}
              </Typography>
              <Chip
                size="small"
                icon={recipeUtils.getStockStatusIcon(
                  params.row.isLowStock,
                  params.row.needsReorder,
                  params.row.isExpired
                )}
                label={
                  params.row.isExpired ? 'Expired' :
                  params.row.isLowStock ? 'Low' :
                  params.row.needsReorder ? 'Reorder' : 'OK'
                }
                color={color}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'baseUnitCost',
      headerName: 'Unit Cost',
      width: 120,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Typography variant="body2" fontWeight="medium">
          {recipeUtils.formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'stockValue',
      headerName: 'Total Value',
      width: 130,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Typography variant="body2" fontWeight="medium" color="success.main">
          {recipeUtils.formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'primaryVendor',
      headerName: 'Primary Vendor',
      width: 200,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => {
        const vendor = params.value;
        if (!vendor) return <Typography variant="body2">-</Typography>;
        
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {vendor.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lead time: {vendor.leadTimeDays} days
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Chip
          label={params.value}
          color={params.value === 'ACTIVE' ? 'success' : 'default'}
          size="small"
          icon={params.value === 'ACTIVE' ? <CheckIcon /> : <ErrorIcon />}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<RawMaterial>) => (
        <Box>
          <Tooltip title="Edit Material">
            <IconButton size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Material">
            <IconButton size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {summary.totalMaterials}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Materials
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {summary.lowStockCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingDownIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {summary.reorderNeeded}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reorder Needed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {recipeUtils.formatCurrency(summary.totalValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Inventory Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search materials..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || ''}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value as MaterialStatus)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="DISCONTINUED">Discontinued</MenuItem>
                  <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <DataGrid
          rows={materials}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{
            page: filters.page || 0,
            pageSize: filters.size || 25,
          }}
          onPaginationModelChange={(model) => {
            handleFilterChange('page', model.page);
            handleFilterChange('size', model.pageSize);
          }}
          rowCount={totalCount}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={(model) => {
            if (model.length > 0) {
              handleFilterChange('sortBy', model[0].field);
              handleFilterChange('sortDir', model[0].sort);
            }
          }}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          autoHeight
        />
      </Card>
    </Box>
  );
};

export default RawMaterialsView;