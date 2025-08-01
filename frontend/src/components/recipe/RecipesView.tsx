
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Skeleton,
  Fab,
} from '@mui/material';
import {
  Restaurant as RecipeIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Kitchen as KitchenIcon,
  LocalDining as DiningIcon,
} from '@mui/icons-material';
import { recipeService, recipeUtils } from '../../services/recipeService';
import { Recipe, RecipeStatus } from '../../types/recipe';

interface RecipesViewProps {
  onRefresh: () => void;
}

const RecipesView: React.FC<RecipesViewProps> = ({ onRefresh }) => {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RecipeStatus | ''>('');
  const [totalRecipes, setTotalRecipes] = useState(0);

  // Mock data for demonstration
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      productId: 1,
      productName: 'Classic Chocolate Cake',
      recipeCode: 'RCP-CHOC-001',
      name: 'Classic Chocolate Cake',
      description: 'Rich and moist chocolate cake with premium cocoa',
      version: 1,
      batchSize: 8,
      batchUnit: 'PIECE' as any,
      yieldPercentage: 95,
      preparationTimeMinutes: 30,
      cookingTimeMinutes: 45,
      totalTimeMinutes: 75,
      difficultyLevel: 3,
      servingSize: 1,
      servingUnit: 'PIECE' as any,
      status: 'ACTIVE' as RecipeStatus,
      costPerBatch: 24.50,
      costPerServing: 3.06,
      materialCost: 18.75,
      costPerUnit: 3.06,
      statusColor: '#22c55e',
      isActive: true,
      isApproved: true,
      ingredients: [],
      steps: [],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
    },
    {
      id: 2,
      productId: 2,
      productName: 'Fresh Garden Salad',
      recipeCode: 'RCP-SALD-002',
      name: 'Fresh Garden Salad',
      description: 'Crisp lettuce with seasonal vegetables and house dressing',
      version: 2,
      batchSize: 4,
      batchUnit: 'PIECE' as any,
      yieldPercentage: 98,
      preparationTimeMinutes: 15,
      cookingTimeMinutes: 0,
      totalTimeMinutes: 15,
      difficultyLevel: 1,
      servingSize: 1,
      servingUnit: 'PIECE' as any,
      status: 'ACTIVE' as RecipeStatus,
      costPerBatch: 12.00,
      costPerServing: 3.00,
      materialCost: 9.50,
      costPerUnit: 3.00,
      statusColor: '#22c55e',
      isActive: true,
      isApproved: true,
      ingredients: [],
      steps: [],
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-22T09:30:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
    },
    {
      id: 3,
      productId: 3,
      productName: 'Artisan Pizza Margherita',
      recipeCode: 'RCP-PIZZ-003',
      name: 'Artisan Pizza Margherita',
      description: 'Traditional Italian pizza with fresh mozzarella and basil',
      version: 1,
      batchSize: 2,
      batchUnit: 'PIECE' as any,
      yieldPercentage: 92,
      preparationTimeMinutes: 45,
      cookingTimeMinutes: 12,
      totalTimeMinutes: 57,
      difficultyLevel: 4,
      servingSize: 1,
      servingUnit: 'PIECE' as any,
      status: 'DRAFT' as RecipeStatus,
      costPerBatch: 16.80,
      costPerServing: 8.40,
      materialCost: 12.60,
      costPerUnit: 8.40,
      statusColor: '#6b7280',
      isActive: false,
      isApproved: false,
      ingredients: [],
      steps: [],
      createdAt: '2024-01-25T16:45:00Z',
      updatedAt: '2024-01-25T16:45:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
    },
  ];

  useEffect(() => {
    loadRecipes();
  }, [searchTerm, statusFilter]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      // For now, use mock data
      const filteredRecipes = mockRecipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            recipe.recipeCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || recipe.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
      
      setRecipes(filteredRecipes);
      setTotalRecipes(filteredRecipes.length);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      // Fallback to mock data
      setRecipes(mockRecipes);
      setTotalRecipes(mockRecipes.length);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: RecipeStatus) => {
    const statusConfig = {
      ACTIVE: { color: 'success' as const, label: 'Active', icon: '✅' },
      DRAFT: { color: 'default' as const, label: 'Draft', icon: '📝' },
      PENDING_APPROVAL: { color: 'warning' as const, label: 'Pending', icon: '⏳' },
      APPROVED: { color: 'info' as const, label: 'Approved', icon: '👍' },
      INACTIVE: { color: 'error' as const, label: 'Inactive', icon: '❌' },
      ARCHIVED: { color: 'default' as const, label: 'Archived', icon: '📦' },
      REJECTED: { color: 'error' as const, label: 'Rejected', icon: '❌' },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    return (
      <Chip
        label={`${config.icon} ${config.label}`}
        color={config.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        sx={{
          fontSize: 16,
          color: i < level ? theme.palette.warning.main : theme.palette.grey[300],
        }}
      />
    ));
  };

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ borderRadius: theme.shape.borderRadius * 2 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filter Header */}
      <Box 
        sx={{ 
          mb: 4,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          borderRadius: theme.shape.borderRadius * 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Recipe Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalRecipes} recipes found
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: theme.shape.borderRadius * 1.5,
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as RecipeStatus)}
                label="Status Filter"
                sx={{
                  borderRadius: theme.shape.borderRadius * 1.5,
                }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PENDING_APPROVAL">Pending Approval</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={{
                height: 56,
                borderRadius: theme.shape.borderRadius * 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Recipe Cards Grid */}
      {recipes.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Card 
            sx={{ 
              maxWidth: 400, 
              mx: 'auto',
              borderRadius: theme.shape.borderRadius * 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <RecipeIcon 
                sx={{ 
                  fontSize: 64, 
                  color: 'text.secondary', 
                  mb: 2,
                  opacity: 0.7,
                }} 
              />
              <Typography variant="h6" gutterBottom fontWeight="bold">
                No Recipes Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start building your recipe library by creating your first recipe'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: theme.shape.borderRadius * 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Create First Recipe
              </Button>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: theme.shape.borderRadius * 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    '& .recipe-image': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                {/* Recipe Image */}
                <Box 
                  sx={{ 
                    height: 200, 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
                  }}
                >
                  <Box
                    className="recipe-image"
                    component="img"
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                    alt={recipe.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    {getStatusChip(recipe.status)}
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: alpha(theme.palette.background.paper, 0.9),
                      borderRadius: theme.shape.borderRadius,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      {recipe.recipeCode}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, height: 'calc(100% - 200px)', display: 'flex', flexDirection: 'column' }}>
                  {/* Recipe Title */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {recipe.name}
                  </Typography>
                  
                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {recipe.description}
                  </Typography>

                  {/* Recipe Stats */}
                  <Box sx={{ mb: 2, flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {recipe.totalTimeMinutes}min
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <DiningIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {recipe.batchSize} servings
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                          <Typography variant="caption" color="text.secondary">
                            Difficulty:
                          </Typography>
                          <Box display="flex" gap={0.25}>
                            {getDifficultyStars(recipe.difficultyLevel)}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Cost Information */}
                  <Box 
                    sx={{ 
                      p: 2,
                      background: alpha(theme.palette.primary.main, 0.04),
                      borderRadius: theme.shape.borderRadius,
                      mb: 2,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Cost per serving
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${recipe.costPerServing?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      sx={{
                        flex: 1,
                        borderRadius: theme.shape.borderRadius,
                        textTransform: 'none',
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{
                        flex: 1,
                        borderRadius: theme.shape.borderRadius,
                        textTransform: 'none',
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecipesView;
