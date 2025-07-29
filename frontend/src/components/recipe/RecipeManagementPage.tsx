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
  CardActions,
  Chip,
  Alert,
  AlertTitle,
  Fab,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Restaurant as RecipeIcon,
  Inventory2 as MaterialIcon,
  Business as VendorIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
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
  const [activeTab, setActiveTab] = useState(0);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          🧂 Recipe & Raw Materials Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<MaterialIcon />}
            onClick={handleAddMaterial}
          >
            Add Material
          </Button>
          <Button
            variant="contained"
            startIcon={<RecipeIcon />}
            onClick={handleAddRecipe}
          >
            Create Recipe
          </Button>
        </Box>
      </Box>

      {/* Alert Summary */}
      {!loading && (alerts.lowStockMaterials > 0 || alerts.pendingReorders > 0 || 
                    alerts.draftRecipes > 0 || alerts.pendingApprovals > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Action Required</AlertTitle>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {alerts.lowStockMaterials > 0 && (
              <Grid item>
                <Chip 
                  icon={<WarningIcon />}
                  label={`${alerts.lowStockMaterials} Low Stock Materials`}
                  color="warning"
                  size="small"
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
                />
              </Grid>
            )}
          </Grid>
        </Alert>
      )}

      {/* Quick Actions Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
            onClick={() => setActiveTab(0)}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <MaterialIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Raw Materials
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage inventory and supplier information
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
            onClick={() => setActiveTab(1)}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <RecipeIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Recipes & BOM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build recipes and manage bill of materials
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
            onClick={() => setActiveTab(2)}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Usage Forecast
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Predict material consumption based on sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
            onClick={() => setActiveTab(3)}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <VendorIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Vendor Reorder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan reorders and manage vendor relationships
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="recipe management tabs">
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

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={activeTab === 0 ? handleAddMaterial : handleAddRecipe}
      >
        <AddIcon />
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
    </Container>
  );
};

export default RecipeManagementPage;