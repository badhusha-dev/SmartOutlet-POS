import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tab,
  Tabs,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Alert,
  Autocomplete,
  InputAdornment,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Add as AddIcon,
  SwapHoriz as SwapHorizIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { 
  StockReceiveRequest, 
  StockTransferRequest, 
  StockAdjustmentRequest,
  TransactionType,
  InventoryItem 
} from '../types/inventory';
import { inventoryService } from '../services/inventoryService';

interface StockOperationsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: number;
  preselectedProduct?: { id: number; name: string; sku: string };
  preselectedOutlet?: { id: number; name: string };
}

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
      id={`operation-tabpanel-${index}`}
      aria-labelledby={`operation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const StockOperationsModal: React.FC<StockOperationsModalProps> = ({
  open,
  onClose,
  onSuccess,
  initialTab = 0,
  preselectedProduct,
  preselectedOutlet,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock data - replace with actual service calls
  const outlets = [
    { id: 1, name: 'Main Store' },
    { id: 2, name: 'Downtown Branch' },
    { id: 3, name: 'Mall Outlet' },
  ];

  const products = [
    { id: 1, name: 'Smart LED Bulb', sku: 'LED-001' },
    { id: 2, name: 'Wireless Charger', sku: 'WC-002' },
    { id: 3, name: 'Smart Thermostat', sku: 'ST-003' },
  ];

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Receive Stock Form
  const [receiveForm, setReceiveForm] = useState<StockReceiveRequest>({
    productId: preselectedProduct?.id || 0,
    outletId: preselectedOutlet?.id || 0,
    batchNumber: '',
    quantity: 0,
    unitCost: 0,
    expiryDate: '',
    manufacturedDate: '',
    receivedDate: new Date().toISOString().split('T')[0],
    supplierReference: '',
    locationCode: '',
    reason: '',
  });

  // Transfer Stock Form
  const [transferForm, setTransferForm] = useState<StockTransferRequest>({
    productId: preselectedProduct?.id || 0,
    sourceOutletId: preselectedOutlet?.id || 0,
    destinationOutletId: 0,
    quantity: 0,
    reason: '',
    batchNumber: '',
    referenceId: '',
    referenceType: 'MANUAL_TRANSFER',
  });

  // Adjust Stock Form
  const [adjustForm, setAdjustForm] = useState<StockAdjustmentRequest>({
    inventoryItemId: 0,
    adjustmentType: TransactionType.ADJUSTMENT,
    quantity: 0,
    reason: '',
    referenceId: '',
    referenceType: 'MANUAL_ADJUSTMENT',
  });

  // Load inventory items for adjustment
  const loadInventoryItems = async () => {
    try {
      const data = await inventoryService.searchInventoryItems({
        outletId: adjustForm.inventoryItemId ? undefined : outlets[0]?.id,
        page: 0,
        size: 100,
      });
      setInventoryItems(data.content);
    } catch (error) {
      console.error('Error loading inventory items:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 2 && open) {
      loadInventoryItems();
    }
  }, [activeTab, open]);

  // Reset forms when modal opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Handle receive stock
  const handleReceiveStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!receiveForm.productId || !receiveForm.outletId || !receiveForm.batchNumber || !receiveForm.quantity) {
        throw new Error('Please fill in all required fields');
      }

      await inventoryService.receiveStock(receiveForm);
      setSuccess('Stock received successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to receive stock');
    } finally {
      setLoading(false);
    }
  };

  // Handle transfer stock
  const handleTransferStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!transferForm.productId || !transferForm.sourceOutletId || !transferForm.destinationOutletId || !transferForm.quantity) {
        throw new Error('Please fill in all required fields');
      }

      if (transferForm.sourceOutletId === transferForm.destinationOutletId) {
        throw new Error('Source and destination outlets must be different');
      }

      await inventoryService.transferStock(transferForm);
      setSuccess('Stock transferred successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to transfer stock');
    } finally {
      setLoading(false);
    }
  };

  // Handle adjust stock
  const handleAdjustStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!adjustForm.inventoryItemId || !adjustForm.quantity || !adjustForm.reason) {
        throw new Error('Please fill in all required fields');
      }

      await inventoryService.adjustStock(adjustForm);
      setSuccess('Stock adjusted successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  const getTabIcon = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return <AddIcon />;
      case 1: return <SwapHorizIcon />;
      case 2: return <EditIcon />;
      default: return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Stock Operations
          <Box sx={{ ml: 'auto' }}>
            <Button onClick={onClose} size="small">
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab 
                icon={getTabIcon(0)} 
                label="Receive Stock" 
                iconPosition="start"
              />
              <Tab 
                icon={getTabIcon(1)} 
                label="Transfer Stock" 
                iconPosition="start"
              />
              <Tab 
                icon={getTabIcon(2)} 
                label="Adjust Stock" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Receive Stock Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => `${option.name} (${option.sku})`}
                  value={products.find(p => p.id === receiveForm.productId) || null}
                  onChange={(_, value) => setReceiveForm(prev => ({ ...prev, productId: value?.id || 0 }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Product *" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Outlet *</InputLabel>
                  <Select
                    value={receiveForm.outletId}
                    label="Outlet *"
                    onChange={(e) => setReceiveForm(prev => ({ ...prev, outletId: e.target.value as number }))}
                  >
                    {outlets.map(outlet => (
                      <MenuItem key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Batch Number *"
                  value={receiveForm.batchNumber}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, batchNumber: e.target.value }))}
                  placeholder="Enter batch/lot number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  type="number"
                  value={receiveForm.quantity}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Cost"
                  type="number"
                  value={receiveForm.unitCost}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Received Date *"
                  value={receiveForm.receivedDate ? new Date(receiveForm.receivedDate) : new Date()}
                  onChange={(date) => setReceiveForm(prev => ({ 
                    ...prev, 
                    receivedDate: date ? date.toISOString().split('T')[0] : ''
                  }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Expiry Date"
                  value={receiveForm.expiryDate ? new Date(receiveForm.expiryDate) : null}
                  onChange={(date) => setReceiveForm(prev => ({ 
                    ...prev, 
                    expiryDate: date ? date.toISOString().split('T')[0] : ''
                  }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Manufactured Date"
                  value={receiveForm.manufacturedDate ? new Date(receiveForm.manufacturedDate) : null}
                  onChange={(date) => setReceiveForm(prev => ({ 
                    ...prev, 
                    manufacturedDate: date ? date.toISOString().split('T')[0] : ''
                  }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier Reference"
                  value={receiveForm.supplierReference}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, supplierReference: e.target.value }))}
                  placeholder="PO number, invoice reference, etc."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location Code"
                  value={receiveForm.locationCode}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, locationCode: e.target.value }))}
                  placeholder="Warehouse aisle, shelf number, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason/Notes"
                  multiline
                  rows={2}
                  value={receiveForm.reason}
                  onChange={(e) => setReceiveForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Additional notes about this stock receipt..."
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Transfer Stock Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => `${option.name} (${option.sku})`}
                  value={products.find(p => p.id === transferForm.productId) || null}
                  onChange={(_, value) => setTransferForm(prev => ({ ...prev, productId: value?.id || 0 }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Product *" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>From Outlet *</InputLabel>
                  <Select
                    value={transferForm.sourceOutletId}
                    label="From Outlet *"
                    onChange={(e) => setTransferForm(prev => ({ ...prev, sourceOutletId: e.target.value as number }))}
                  >
                    {outlets.map(outlet => (
                      <MenuItem key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>To Outlet *</InputLabel>
                  <Select
                    value={transferForm.destinationOutletId}
                    label="To Outlet *"
                    onChange={(e) => setTransferForm(prev => ({ ...prev, destinationOutletId: e.target.value as number }))}
                  >
                    {outlets.filter(outlet => outlet.id !== transferForm.sourceOutletId).map(outlet => (
                      <MenuItem key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  type="number"
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specific Batch (Optional)"
                  value={transferForm.batchNumber}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, batchNumber: e.target.value }))}
                  placeholder="Leave empty for FIFO allocation"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason *"
                  multiline
                  rows={2}
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Reason for transfer (restocking, demand, etc.)"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Adjust Stock Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={inventoryItems}
                  getOptionLabel={(option) => `${option.productName} - Batch ${option.batchNumber} (${option.availableQuantity} available)`}
                  value={inventoryItems.find(item => item.id === adjustForm.inventoryItemId) || null}
                  onChange={(_, value) => setAdjustForm(prev => ({ ...prev, inventoryItemId: value?.id || 0 }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Inventory Item *" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Adjustment Type *</InputLabel>
                  <Select
                    value={adjustForm.adjustmentType}
                    label="Adjustment Type *"
                    onChange={(e) => setAdjustForm(prev => ({ ...prev, adjustmentType: e.target.value as TransactionType }))}
                  >
                    <MenuItem value={TransactionType.ADJUSTMENT}>General Adjustment</MenuItem>
                    <MenuItem value={TransactionType.DAMAGE}>Damage</MenuItem>
                    <MenuItem value={TransactionType.EXPIRE}>Expired</MenuItem>
                    <MenuItem value={TransactionType.WASTE}>Waste/Loss</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  type="number"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason *"
                  multiline
                  rows={3}
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Detailed reason for stock adjustment..."
                />
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              switch (activeTab) {
                case 0: handleReceiveStock(); break;
                case 1: handleTransferStock(); break;
                case 2: handleAdjustStock(); break;
              }
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 
             activeTab === 0 ? 'Receive Stock' :
             activeTab === 1 ? 'Transfer Stock' : 'Adjust Stock'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default StockOperationsModal;