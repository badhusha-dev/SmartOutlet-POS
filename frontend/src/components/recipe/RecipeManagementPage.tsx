
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  Fab,
  Badge,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Restaurant as RecipeIcon,
  Inventory2 as MaterialIcon,
  Business as VendorIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import RawMaterialsView from './RawMaterialsView';
import RecipesView from './RecipesView';
import MaterialForecastView from './MaterialForecastView';
import VendorReorderView from './VendorReorderView';
import AddMaterialModal from './AddMaterialModal';
import RecipeBuilderModal from './RecipeBuilderModal';
import { recipeService, recipeUtils } from '../../services/recipeService';
import { RawMaterial, Recipe } from '../../types/recipe';

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
      id={`recipe-tabpanel-${index}`}
      aria-labelledby={`recipe-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const RecipeManagementPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState({
    lowStockMaterials: 0,
    pendingReorders: 0,
    draftRecipes: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load raw materials to check for alerts
      const materialsResponse = await recipeService.getRawMaterials({
        page: 0,
        size: 100,
      });
      
      // Load recipes for status counts
      const recipesResponse = await recipeService.getRecipes({
        page: 0,
        size: 100,
      });

      // Calculate alerts
      const materials = materialsResponse.content || [];
      const recipes = recipesResponse.content || [];
      
      setAlerts({
        lowStockMaterials: materials.filter((m: RawMaterial) => m.isLowStock).length,
        pendingReorders: materials.filter((m: RawMaterial) => m.needsReorder).length,
        draftRecipes: recipes.filter((r: Recipe) => r.status === 'DRAFT').length,
        pendingApprovals: recipes.filter((r: Recipe) => r.status === 'PENDING_APPROVAL').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddMaterial = () => {
    setShowAddMaterial(true);
  };

  const handleAddRecipe = () => {
    setShowRecipeBuilder(true);
  };

  const handleMaterialAdded = () => {
    setShowAddMaterial(false);
    loadDashboardData();
  };

  const handleRecipeAdded = () => {
    setShowRecipeBuilder(false);
    loadDashboardData();
  };

  const quickActionCards = [
    {
      title: 'Raw Materials',
      subtitle: 'Manage inventory and supplier information',
      icon: MaterialIcon,
      color: theme.palette.primary.main,
      onClick: () => setActiveTab(0),
      badge: alerts.lowStockMaterials,
    },
    {
      title: 'Recipes & BOM',
      subtitle: 'Build recipes and manage bill of materials',
      icon: RecipeIcon,
      color: theme.palette.secondary.main,
      onClick: () => setActiveTab(1),
      badge: alerts.draftRecipes + alerts.pendingApprovals,
    },
    {
      title: 'Usage Forecast',
      subtitle: 'Predict material consumption based on sales',
      icon: AnalyticsIcon,
      color: theme.palette.info.main,
      onClick: () => setActiveTab(2),
      badge: 0,
    },
    {
      title: 'Vendor Reorder',
      subtitle: 'Plan reorders and manage vendor relationships',
      icon: VendorIcon,
      color: theme.palette.success.main,
      onClick: () => setActiveTab(3),
      badge: alerts.pendingReorders,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Modern Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderRadius: theme.shape.borderRadius * 2,
          p: 3,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            🧂 Recipe Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Comprehensive recipe and raw materials management system
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<MaterialIcon />}
            onClick={handleAddMaterial}
            sx={{ 
              borderRadius: theme.shape.borderRadius * 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Material
          </Button>
          <Button
            variant="contained"
            startIcon={<RecipeIcon />}
            onClick={handleAddRecipe}
            sx={{ 
              borderRadius: theme.shape.borderRadius * 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: theme.shadows[4],
            }}
          >
            Create Recipe
          </Button>
        </Box>
      </Box>

      {/* Enhanced Alert Summary */}
      {!loading && (alerts.lowStockMaterials > 0 || alerts.pendingReorders > 0 || 
                    alerts.draftRecipes > 0 || alerts.pendingApprovals > 0) && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            borderRadius: theme.shape.borderRadius * 2,
            boxShadow: theme.shadows[2],
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>🚨 Action Required</AlertTitle>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {alerts.lowStockMaterials > 0 && (
              <Grid item>
                <Chip 
                  icon={<WarningIcon />}
                  label={`${alerts.lowStockMaterials} Low Stock Materials`}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
            )}
            {alerts.pendingReorders > 0 && (
              <Grid item>
                <Chip 
                  icon={<TrendingIcon />}
                  label={`${alerts.pendingReorders} Pending Reorders`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
            )}
            {alerts.draftRecipes > 0 && (
              <Grid item>
                <Chip 
                  icon={<RecipeIcon />}
                  label={`${alerts.draftRecipes} Draft Recipes`}
                  color="info"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
            )}
            {alerts.pendingApprovals > 0 && (
              <Grid item>
                <Chip 
                  icon={<RecipeIcon />}
                  label={`${alerts.pendingApprovals} Pending Approvals`}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
            )}
          </Grid>
        </Alert>
      )}

      {/* Modern Quick Actions Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActionCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: theme.shape.borderRadius * 2,
                background: `linear-gradient(135deg, ${alpha(card.color, 0.05)} 0%, ${alpha(card.color, 0.02)} 100%)`,
                border: `1px solid ${alpha(card.color, 0.12)}`,
                position: 'relative',
                overflow: 'visible',
                '&:hover': { 
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: theme.shadows[8],
                  '& .card-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  }
                }
              }}
              onClick={card.onClick}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                {card.badge > 0 && (
                  <Badge
                    badgeContent={card.badge}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }
                    }}
                  />
                )}
                <Box
                  className="card-icon"
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: alpha(card.color, 0.1),
                    mb: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <card.icon sx={{ fontSize: 32, color: card.color }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {card.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.5,
                    fontSize: '0.875rem',
                  }}
                >
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Main Content Tabs */}
      <Paper 
        sx={{ 
          width: '100%',
          borderRadius: theme.shape.borderRadius * 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
        }}
      >
        <Box 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="recipe management tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
              },
              '& .Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <Tab 
              label={
                <Badge badgeContent={alerts.lowStockMaterials} color="error">
                  <Box display="flex" alignItems="center" gap={1}>
                    <MaterialIcon />
                    Raw Materials
                  </Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={alerts.draftRecipes + alerts.pendingApprovals} color="warning">
                  <Box display="flex" alignItems="center" gap={1}>
                    <RecipeIcon />
                    Recipes
                  </Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <AnalyticsIcon />
                  Material Forecast
                </Box>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={alerts.pendingReorders} color="error">
                  <Box display="flex" alignItems="center" gap={1}>
                    <VendorIcon />
                    Vendor Reorder
                  </Box>
                </Badge>
              } 
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <RawMaterialsView onRefresh={loadDashboardData} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <RecipesView onRefresh={loadDashboardData} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <MaterialForecastView />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <VendorReorderView />
        </TabPanel>
      </Paper>

      {/* Modern Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          boxShadow: theme.shadows[8],
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: theme.shadows[16],
          }
        }}
        onClick={activeTab === 0 ? handleAddMaterial : handleAddRecipe}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* Modals */}
      <AddMaterialModal
        open={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
        onSuccess={handleMaterialAdded}
      />

      <RecipeBuilderModal
        open={showRecipeBuilder}
        onClose={() => setShowRecipeBuilder(false)}
        onSuccess={handleRecipeAdded}
      />

      {/* Global Styles for Animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Container>
  );
};

export default RecipeManagementPage;
