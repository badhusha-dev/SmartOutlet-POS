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
  Card,
  CardContent,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Divider,
  useTheme,
  Avatar,
  Fade,
  Zoom,
  Slide,
  Stack,
  Paper,
  LinearProgress,
  Tooltip,
  Switch,
  FormControlLabel as MuiFormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  LocalOffer as DiscountIcon,
  Loyalty as LoyaltyIcon,
  CreditCard as CardIcon,
  AttachMoney as CashIcon,
  AccountBalanceWallet as WalletIcon,
  Print as PrintIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Percent as PercentIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { usePOSStore } from '../../store/posStore';
import { Order, Customer, Discount } from '../../types/pos';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { applyDiscount, validateDiscount } from '../../utils/discountCalculator';
import { ReceiptPDF } from './ReceiptPDF';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  customer?: Customer;
}

const PaymentMethodCard = ({ 
  method, 
  selected, 
  onSelect, 
  icon, 
  title, 
  description 
}: {
  method: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const theme = useTheme();
  
  return (
    <Zoom in={true}>
      <Card
        onClick={onSelect}
        sx={{
          cursor: 'pointer',
          border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
          background: selected 
            ? `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}04 100%)`
            : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: selected ? theme.palette.primary.main : theme.palette.grey[200],
                color: selected ? 'white' : theme.palette.grey[600],
              }}
            >
              {icon}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
            
            {selected && (
              <CheckIcon color="primary" sx={{ fontSize: 24 }} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const TipOption = ({ 
  percentage, 
  selected, 
  onSelect, 
  custom = false 
}: {
  percentage: number;
  selected: boolean;
  onSelect: () => void;
  custom?: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <Chip
      label={custom ? 'Custom' : `${percentage}%`}
      onClick={onSelect}
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      sx={{
        fontSize: '0.875rem',
        fontWeight: 600,
        height: 40,
        px: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    />
  );
};

const OrderSummaryCard = ({ order, expanded, onToggle }: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            mb: expanded ? 2 : 0,
          }}
          onClick={onToggle}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
              <ReceiptIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Order Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.items.length} items • {formatCurrency(order.subtotal)}
              </Typography>
            </Box>
          </Box>
          
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            {order.items.map((item, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1,
                  borderBottom: index < order.items.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {item.quantity}× {item.product.name}
                  </Typography>
                  {item.notes && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{item.notes}"
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(item.product.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Tax ({order.taxRate}%)</Typography>
              <Typography variant="body2">{formatCurrency(order.tax)}</Typography>
            </Box>
            {order.discount && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="success.main">Discount</Typography>
                <Typography variant="body2" color="success.main">-{formatCurrency(order.discount)}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {formatCurrency(order.total)}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  order,
  customer,
}) => {
  const theme = useTheme();
  const { updateOrder } = usePOSStore();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTip, setCustomTip] = useState('');
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const tipAmount = showCustomTip 
    ? parseFloat(customTip) || 0 
    : (order.total * tipPercentage) / 100;
  
  const finalTotal = order.total + tipAmount;
  const availableLoyaltyPoints = customer?.loyaltyPoints || 0;
  const maxLoyaltyPoints = Math.min(availableLoyaltyPoints, Math.floor(finalTotal * 10)); // 10 points per dollar

  const paymentMethods = [
    {
      value: 'card',
      title: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: <CardIcon />,
    },
    {
      value: 'cash',
      title: 'Cash',
      description: 'Pay with cash',
      icon: <CashIcon />,
    },
    {
      value: 'wallet',
      title: 'E-Wallet',
      description: 'Apple Pay, Google Pay, PayPal',
      icon: <WalletIcon />,
    },
  ];

  const tipOptions = [5, 10, 15, 20];

  const handleDiscountApply = () => {
    setDiscountError('');
    setDiscountSuccess('');
    
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    // Simulate discount validation
    const mockDiscount: Discount = {
      id: 'discount-1',
      code: discountCode.toUpperCase(),
      type: 'PERCENT',
      value: 10,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      minOrderAmount: 0,
      maxUses: 100,
      usedCount: 50,
    };

    const validation = validateDiscount(mockDiscount, order.total);
    if (!validation.isValid) {
      setDiscountError(validation.error || 'Invalid discount code');
      return;
    }

    const discountAmount = applyDiscount(order.total, mockDiscount.type, mockDiscount.value);
    const updatedOrder = {
      ...order,
      discount: order.total - discountAmount,
      total: discountAmount + order.tax,
    };

    updateOrder(updatedOrder);
    setDiscountSuccess(`Discount applied! Saved ${formatCurrency(order.total - discountAmount)}`);
    setDiscountCode('');
  };

  const handleLoyaltyToggle = () => {
    setLoyaltyEnabled(!loyaltyEnabled);
    if (!loyaltyEnabled) {
      setLoyaltyPoints(Math.min(100, maxLoyaltyPoints)); // Default to 100 points or max available
    } else {
      setLoyaltyPoints(0);
    }
  };

  const handleLoyaltyPointsChange = (points: number) => {
    const newPoints = Math.max(0, Math.min(points, maxLoyaltyPoints));
    setLoyaltyPoints(newPoints);
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing steps
    const steps = [
      'Validating payment method...',
      'Processing payment...',
      'Updating inventory...',
      'Generating receipt...',
      'Completing transaction...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Update order status
    const completedOrder = {
      ...order,
      status: 'COMPLETED',
      paymentMethod,
      tipAmount,
      loyaltyPointsUsed: loyaltyPoints,
      completedAt: new Date().toISOString(),
    };

    updateOrder(completedOrder);
    setProcessing(false);
    onClose();
  };

  const handlePrintReceipt = () => {
    // Trigger PDF download
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${btoa('mock-pdf-content')}`;
    link.download = `receipt-${order.id}.pdf`;
    link.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <PaymentIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Checkout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete your order payment
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {processing ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LinearProgress 
              variant="determinate" 
              value={(processingStep / 4) * 100} 
              sx={{ mb: 3, height: 8, borderRadius: 4 }}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Processing Payment...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {['Validating payment method...', 'Processing payment...', 'Updating inventory...', 'Generating receipt...', 'Completing transaction...'][processingStep]}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Left Column - Order Summary and Payment */}
            <Grid item xs={12} md={8}>
              {/* Order Summary */}
              <OrderSummaryCard 
                order={order} 
                expanded={orderSummaryExpanded}
                onToggle={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
              />

              {/* Payment Methods */}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                      <PaymentIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Payment Method
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={12} sm={4} key={method.value}>
                        <PaymentMethodCard
                          method={method.value}
                          selected={paymentMethod === method.value}
                          onSelect={() => setPaymentMethod(method.value)}
                          icon={method.icon}
                          title={method.title}
                          description={method.description}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Tipping Section */}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                      <StarIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Add a Tip
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {tipOptions.map((percentage) => (
                        <TipOption
                          key={percentage}
                          percentage={percentage}
                          selected={!showCustomTip && tipPercentage === percentage}
                          onSelect={() => {
                            setTipPercentage(percentage);
                            setShowCustomTip(false);
                          }}
                        />
                      ))}
                      <TipOption
                        percentage={0}
                        selected={showCustomTip}
                        onSelect={() => setShowCustomTip(true)}
                        custom
                      />
                    </Box>
                    
                    {showCustomTip && (
                      <TextField
                        fullWidth
                        label="Custom Tip Amount"
                        type="number"
                        value={customTip}
                        onChange={(e) => setCustomTip(e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ maxWidth: 200 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}>
                    <Typography variant="body1" fontWeight="medium">
                      Tip Amount:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatCurrency(tipAmount)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Discount, Loyalty, and Total */}
            <Grid item xs={12} md={4}>
              {/* Discount Code */}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                      <DiscountIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Discount Code
                    </Typography>
                  </Box>
                  
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleDiscountApply}
                      disabled={!discountCode.trim()}
                      fullWidth
                    >
                      Apply Discount
                    </Button>
                    
                    {discountError && (
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {discountError}
                      </Alert>
                    )}
                    
                    {discountSuccess && (
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        {discountSuccess}
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Loyalty Points */}
              {customer && (
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'info.main', width: 40, height: 40 }}>
                        <LoyaltyIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        Loyalty Points
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Available Points
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {availableLoyaltyPoints}
                        </Typography>
                      </Box>
                      
                      <MuiFormControlLabel
                        control={
                          <Switch
                            checked={loyaltyEnabled}
                            onChange={handleLoyaltyToggle}
                            color="primary"
                          />
                        }
                        label="Redeem points"
                      />
                      
                      {loyaltyEnabled && (
                        <Box>
                          <TextField
                            fullWidth
                            label="Points to redeem"
                            type="number"
                            value={loyaltyPoints}
                            onChange={(e) => handleLoyaltyPointsChange(parseInt(e.target.value) || 0)}
                            size="small"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">pts</InputAdornment>,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Max: {maxLoyaltyPoints} points (${formatCurrency(maxLoyaltyPoints / 10)} off)
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Final Total */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Order Total
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                      <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Tax</Typography>
                      <Typography variant="body2">{formatCurrency(order.tax)}</Typography>
                    </Box>
                    {order.discount && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="success.main">Discount</Typography>
                        <Typography variant="body2" color="success.main">-{formatCurrency(order.discount)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Tip</Typography>
                      <Typography variant="body2">{formatCurrency(tipAmount)}</Typography>
                    </Box>
                    {loyaltyEnabled && loyaltyPoints > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="info.main">Loyalty Discount</Typography>
                        <Typography variant="body2" color="info.main">-{formatCurrency(loyaltyPoints / 10)}</Typography>
                      </Box>
                    )}
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h5" fontWeight="bold">Total</Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {formatCurrency(finalTotal - (loyaltyPoints / 10))}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={handlePrintReceipt}
          startIcon={<PrintIcon />}
          disabled={processing}
        >
          Print Receipt
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={processing}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          size="large"
          onClick={handlePayment}
          disabled={processing}
          startIcon={<PaymentIcon />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {processing ? 'Processing...' : `Pay ${formatCurrency(finalTotal - (loyaltyPoints / 10))}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};