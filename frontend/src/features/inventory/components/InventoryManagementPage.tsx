import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  Button,
  Typography,
  Fab,
  Badge,
} from '@mui/material';
import {
  Inventory2 as InventoryIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import StockLevelsView from './StockLevelsView';
import ExpiryManagementView from './ExpiryManagementView';
import StockOperationsModal from './StockOperationsModal';

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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const InventoryManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [operationsModalOpen, setOperationsModalOpen] = useState(false);
  const [operationsModalTab, setOperationsModalTab] = useState(0);

  // Mock alert counts - replace with actual data
  const alertCounts = {
    lowStock: 5,
    expiring: 12,
    expired: 3,
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenOperations = (tabIndex: number = 0) => {
    setOperationsModalTab(tabIndex);
    setOperationsModalOpen(true);
  };

  const handleOperationsSuccess = () => {
    // Refresh data in active tab
    console.log('Operations completed successfully');
  };

  const tabs = [
    {
      label: 'Stock Levels',
      icon: <InventoryIcon />,
      badge: alertCounts.lowStock > 0 ? alertCounts.lowStock : undefined,
      component: <StockLevelsView />,
    },
    {
      label: 'Expiry Management',
      icon: <ScheduleIcon />,
      badge: (alertCounts.expiring + alertCounts.expired) > 0 ? 
             (alertCounts.expiring + alertCounts.expired) : undefined,
      component: <ExpiryManagementView />,
    },
    {
      label: 'Stock Transactions',
      icon: <AssessmentIcon />,
      component: (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 400,
          flexDirection: 'column',
          gap: 2
        }}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Stock Transaction Log
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coming soon - detailed transaction history and audit trail
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          📦 Stock Management
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Comprehensive inventory tracking with FIFO management and expiry monitoring
        </Typography>
        
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenOperations(0)}
            size="large"
          >
            Receive Stock
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleOpenOperations(1)}
            size="large"
          >
            Transfer Stock
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleOpenOperations(2)}
            size="large"
          >
            Adjust Stock
          </Button>
        </Box>
      </Box>

      {/* Alert Summary */}
      {(alertCounts.lowStock > 0 || alertCounts.expiring > 0 || alertCounts.expired > 0) && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon />
            <Typography variant="body1" fontWeight="medium">
              Active Alerts:
            </Typography>
            {alertCounts.lowStock > 0 && (
              <Typography variant="body2">
                {alertCounts.lowStock} low stock items
              </Typography>
            )}
            {alertCounts.expiring > 0 && (
              <Typography variant="body2">
                {alertCounts.expiring} items expiring soon
              </Typography>
            )}
            {alertCounts.expired > 0 && (
              <Typography variant="body2">
                {alertCounts.expired} expired items
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              '& .MuiTab-root': { 
                minHeight: 64,
                fontSize: '1rem',
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={
                  tab.badge ? (
                    <Badge badgeContent={tab.badge} color="error">
                      {tab.label}
                    </Badge>
                  ) : (
                    tab.label
                  )
                }
                sx={{ 
                  '& .MuiTab-iconWrapper': { 
                    marginBottom: '0px !important',
                    marginRight: 1
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add stock"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenOperations(0)}
      >
        <AddIcon />
      </Fab>

      {/* Stock Operations Modal */}
      <StockOperationsModal
        open={operationsModalOpen}
        onClose={() => setOperationsModalOpen(false)}
        onSuccess={handleOperationsSuccess}
        initialTab={operationsModalTab}
      />
    </Container>
  );
};

export default InventoryManagementPage;