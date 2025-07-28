import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Divider,
  Alert,
  IconButton,
  Collapse,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Print as PrintIcon,
  Loyalty as LoyaltyIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { PDFDownloadLink } from 'react-to-pdf';
import { usePOSStore } from '../../store/posStore';
import { Order, Customer, Discount } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';
import { validateDiscount, calculateDiscountAmount } from '../../utils/discountCalculator';
import { ReceiptPDF } from './ReceiptPDF';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  customer?: Customer;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  order,
  customer,
}) => {
  const theme = useTheme();
  const { updateOrder, clearCurrentOrder } = usePOSStore();
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'EWALLET'>('CASH');
  const [loyaltyPointsRedeemed, setLoyaltyPointsRedeemed] = useState(0);
  const [tip, setTip] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState(order.notes || '');

  const maxLoyaltyPoints = customer ? Math.min(customer.loyaltyPoints, Math.floor(order.subtotal / 10) * 100) : 0;
  const loyaltyDiscount = loyaltyPointsRedeemed * 0.1; // 100 points = $10
  const tipOptions = [0, 5, 10, 15, 20];
  const tipAmount = (order.subtotal * tip) / 100;
  const discountAmount = discount ? calculateDiscountAmount(order.subtotal, discount) : 0;
  const finalTotal = order.subtotal + order.tax + tipAmount - discountAmount - loyaltyDiscount;

  useEffect(() => {
    if (customer) {
      setLoyaltyPointsRedeemed(0);
    }
  }, [customer]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      const response = await fetch(`/api/discounts/validate?code=${discountCode}`);
      const discountData = await response.json();

      if (response.ok) {
        const validation = validateDiscount(discountData, order.subtotal);
        if (validation.isValid) {
          setDiscount(discountData);
          setDiscountError(null);
        } else {
          setDiscountError(validation.error || 'Invalid discount code');
          setDiscount(null);
        }
      } else {
        setDiscountError('Discount code not found');
        setDiscount(null);
      }
    } catch (error) {
      setDiscountError('Error validating discount code');
      setDiscount(null);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscount(null);
    setDiscountCode('');
    setDiscountError(null);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedOrder: Order = {
        ...order,
        paymentMethod,
        paymentStatus: 'PAID',
        status: 'COMPLETED',
        loyaltyPointsRedeemed,
        loyaltyPointsEarned: Math.floor(order.subtotal),
        tip: tipAmount,
        discount: discountAmount,
        notes,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update order in store
      updateOrder(order.id, updatedOrder);
      
      // Clear current order
      clearCurrentOrder();
      
      onClose();
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTipChange = (tipPercentage: number) => {
    setTip(tipPercentage);
  };

  const handleLoyaltyPointsChange = (points: number) => {
    setLoyaltyPointsRedeemed(Math.min(points, maxLoyaltyPoints));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Checkout - Order #{order.id.slice(-6)}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {order.items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {item.quantity}× {item.productName}
                    </Typography>
                    {item.notes && (
                      <Typography variant="caption" color="text.secondary">
                        Note: {item.notes}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(item.totalPrice)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Tax Breakdown */}
            <Box sx={{ mb: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
              >
                <Typography variant="body2">
                  Subtotal
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(order.subtotal)}
                  </Typography>
                  {showTaxBreakdown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>
              
              <Collapse in={showTaxBreakdown}>
                <Box sx={{ pl: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tax (8%)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(order.tax)}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
            </Box>

            {/* Discount */}
            {discount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">
                  Discount ({discount.code})
                </Typography>
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  -{formatCurrency(discountAmount)}
                </Typography>
              </Box>
            )}

            {/* Loyalty Points */}
            {loyaltyPointsRedeemed > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="secondary.main">
                  Loyalty Points ({loyaltyPointsRedeemed} pts)
                </Typography>
                <Typography variant="body2" color="secondary.main" fontWeight="bold">
                  -{formatCurrency(loyaltyDiscount)}
                </Typography>
              </Box>
            )}

            {/* Tip */}
            {tip > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="info.main">
                  Tip ({tip}%)
                </Typography>
                <Typography variant="body2" color="info.main" fontWeight="bold">
                  {formatCurrency(tipAmount)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatCurrency(finalTotal)}
              </Typography>
            </Box>
          </Grid>

          {/* Payment Options */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Options
            </Typography>

            {/* Payment Method */}
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>
                Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'CARD' | 'EWALLET')}
              >
                <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                <FormControlLabel value="CARD" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="EWALLET" control={<Radio />} label="E-Wallet" />
              </RadioGroup>
            </FormControl>

            {/* Tip Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tip
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tipOptions.map((tipOption) => (
                  <Chip
                    key={tipOption}
                    label={`${tipOption}%`}
                    onClick={() => handleTipChange(tipOption)}
                    color={tip === tipOption ? 'primary' : 'default'}
                    variant={tip === tipOption ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Custom"
                  value={tip === 0 ? '' : tip}
                  onChange={(e) => handleTipChange(parseFloat(e.target.value) || 0)}
                  sx={{ width: 80 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>
            </Box>

            {/* Loyalty Points */}
            {customer && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <LoyaltyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Loyalty Points (Available: {customer.loyaltyPoints})
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={loyaltyPointsRedeemed}
                  onChange={(e) => handleLoyaltyPointsChange(parseInt(e.target.value) || 0)}
                  inputProps={{
                    min: 0,
                    max: maxLoyaltyPoints,
                    step: 100,
                  }}
                  helperText={`Redeem points for ${formatCurrency(loyaltyDiscount)} off`}
                />
              </Box>
            )}

            {/* Discount Code */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Discount Code
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  error={!!discountError}
                  helperText={discountError}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim()}
                >
                  Apply
                </Button>
                {discount && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveDiscount}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            </Box>

            {/* Notes */}
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Order Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <PDFDownloadLink
            document={<ReceiptPDF order={order} customer={customer} />}
            fileName={`receipt_${order.id}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                disabled={loading}
              >
                {loading ? 'Generating...' : '🖨️ Print Receipt'}
              </Button>
            )}
          </PDFDownloadLink>
          
          <Box sx={{ flex: 1 }} />
          
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            onClick={handleProcessPayment}
            disabled={isProcessing || finalTotal <= 0}
            startIcon={<PaymentIcon />}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatCurrency(finalTotal)}`}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};