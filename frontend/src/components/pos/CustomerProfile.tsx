import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Loyalty as LoyaltyIcon,
  History as HistoryIcon,
  Restaurant as RestaurantIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from 'react-to-pdf';
import { Customer, Order } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';
import { ReceiptPDF } from './ReceiptPDF';

interface CustomerProfileProps {
  customer: Customer;
  orders: Order[];
  onUpdate?: (customer: Customer) => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
  orders,
  onUpdate,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Customer>(customer);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const customerOrders = orders.filter(order => order.customerId === customer.id);
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
  const lastOrder = customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const loyaltyTier = (() => {
    if (customer.loyaltyPoints >= 1000) return { name: 'Gold', color: 'warning' as const };
    if (customer.loyaltyPoints >= 500) return { name: 'Silver', color: 'default' as const };
    return { name: 'Bronze', color: 'primary' as const };
  })();

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(customer);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Customer Profile
        </Typography>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => setShowOrderHistory(true)}
        >
          View Order History
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Customer Information
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(!isEditing)}
                  color={isEditing ? 'primary' : 'default'}
                >
                  {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: theme.palette.primary.main,
                    mr: 2 
                  }}
                >
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {customer.name}
                  </Typography>
                  <Chip
                    label={loyaltyTier.name}
                    color={loyaltyTier.color}
                    size="small"
                    icon={<StarIcon />}
                  />
                </Box>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <EmailIcon color="action" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                      ) : (
                        customer.email
                      )
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <PhoneIcon color="action" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Phone"
                    secondary={
                      isEditing ? (
                        <TextField
                          fullWidth
                          size="small"
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        />
                      ) : (
                        customer.phone || 'Not provided'
                      )
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <LoyaltyIcon color="action" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Loyalty Points"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold" color="secondary.main">
                          {customer.loyaltyPoints} pts
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({formatCurrency(customer.loyaltyPoints * 0.1)} value)
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>

              {isEditing && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
                      {customerOrders.length}
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Total Orders
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="secondary.contrastText">
                      {formatCurrency(totalSpent)}
                    </Typography>
                    <Typography variant="body2" color="secondary.contrastText">
                      Total Spent
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="success.contrastText">
                      {formatCurrency(averageOrderValue)}
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      Avg Order
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="info.contrastText">
                      {customerOrders.filter(o => o.status === 'COMPLETED').length}
                    </Typography>
                    <Typography variant="body2" color="info.contrastText">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {lastOrder && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Last Order
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(lastOrder.createdAt)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {formatCurrency(lastOrder.total)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Dietary Preferences */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Dietary Preferences
              </Typography>

              {customer.dietaryPreferences && customer.dietaryPreferences.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {customer.dietaryPreferences.map((preference) => (
                    <Chip
                      key={preference}
                      label={preference}
                      color="primary"
                      variant="outlined"
                      icon={<RestaurantIcon />}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No dietary preferences recorded
                </Typography>
              )}

              {isEditing && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Add Dietary Preferences</InputLabel>
                  <Select
                    multiple
                    value={editData.dietaryPreferences || []}
                    onChange={(e) => setEditData({
                      ...editData,
                      dietaryPreferences: typeof e.target.value === 'string' 
                        ? e.target.value.split(',') 
                        : e.target.value
                    })}
                    label="Add Dietary Preferences"
                  >
                    <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="Vegan">Vegan</MenuItem>
                    <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
                    <MenuItem value="Dairy-Free">Dairy-Free</MenuItem>
                    <MenuItem value="Nut-Free">Nut-Free</MenuItem>
                    <MenuItem value="Halal">Halal</MenuItem>
                    <MenuItem value="Kosher">Kosher</MenuItem>
                    <MenuItem value="Low-Sodium">Low-Sodium</MenuItem>
                    <MenuItem value="Low-Carb">Low-Carb</MenuItem>
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recent Orders
          </Typography>

          {customerOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No orders found for this customer
            </Typography>
          ) : (
            <List>
              {customerOrders.slice(0, 5).map((order) => (
                <ListItem key={order.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <ReceiptIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Order #${order.id.slice(-6)}`}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {formatDate(order.createdAt)} • {order.items.length} items
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatCurrency(order.total)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={order.status}
                      color={
                        order.status === 'COMPLETED' ? 'success' :
                        order.status === 'CANCELLED' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                    <PDFDownloadLink
                      document={<ReceiptPDF order={order} customer={customer} />}
                      fileName={`receipt_${order.id}.pdf`}
                    >
                      {({ loading }) => (
                        <Tooltip title="Print receipt">
                          <IconButton size="small" disabled={loading}>
                            <ReceiptIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </PDFDownloadLink>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Order History Dialog */}
      <Dialog
        open={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Complete Order History - {customer.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {customerOrders.map((order) => (
              <ListItem key={order.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ReceiptIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Order #${order.id.slice(-6)}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)} • {order.items.length} items
                      </Typography>
                      <Typography variant="body2">
                        Payment: {order.paymentMethod} • Status: {order.status}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(order.total)}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'COMPLETED' ? 'success' :
                      order.status === 'CANCELLED' ? 'error' : 'warning'
                    }
                    size="small"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderHistory(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};