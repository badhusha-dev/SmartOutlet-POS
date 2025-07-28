import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Warning as WarningIcon,
  QrCodeScanner as BarcodeIcon,
} from '@mui/icons-material';
import { usePOSStore } from '../../store/posStore';
import { Product, OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';

interface OrderEntryFormProps {
  onItemAdded?: () => void;
}

export const OrderEntryForm: React.FC<OrderEntryFormProps> = ({ onItemAdded }) => {
  const theme = useTheme();
  const { products, addItemToOrder } = usePOSStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showAllergenWarning, setShowAllergenWarning] = useState(false);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.filter(p => p.isActive && p.stock > 0));
    } else {
      const filtered = products.filter(product =>
        product.isActive &&
        product.stock > 0 &&
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Check for allergen warnings when product is selected
  useEffect(() => {
    if (selectedProduct?.allergens && selectedProduct.allergens.length > 0) {
      const hasCommonAllergens = selectedProduct.allergens.some(allergen =>
        ['gluten', 'nuts', 'dairy', 'eggs', 'shellfish'].includes(allergen.toLowerCase())
      );
      setShowAllergenWarning(hasCommonAllergens);
    } else {
      setShowAllergenWarning(false);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedProduct?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToOrder = () => {
    if (!selectedProduct) return;

    addItemToOrder(selectedProduct, quantity, notes.trim() || undefined);
    
    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setNotes('');
    setSearchQuery('');
    setShowAllergenWarning(false);
    
    onItemAdded?.();
  };

  const handleBarcodeScan = () => {
    // Simulate barcode scanner input
    const barcode = prompt('Scan barcode or enter product code:');
    if (barcode) {
      const product = products.find(p => p.id === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
      if (product) {
        setSelectedProduct(product);
        setSearchQuery(product.name);
      }
    }
  };

  const isAddDisabled = !selectedProduct || quantity < 1 || quantity > (selectedProduct?.stock || 0);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Items to Order
        </Typography>

        {/* Product Search */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Autocomplete
              options={filteredProducts}
              getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
              value={selectedProduct}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              inputValue={searchQuery}
              onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Products"
                  placeholder="Type product name or category..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="body1" fontWeight="bold">
                      {option.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {option.category}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(option.price)}
                      </Typography>
                    </Box>
                    {option.stock < 10 && (
                      <Typography variant="caption" color="warning.main">
                        Only {option.stock} left in stock
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<BarcodeIcon />}
              onClick={handleBarcodeScan}
              sx={{ height: 56 }}
            >
              Scan Barcode
            </Button>
          </Grid>
        </Grid>

        {/* Selected Product Details */}
        {selectedProduct && (
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProduct.category}
                </Typography>
                {selectedProduct.description && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedProduct.description}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {formatCurrency(selectedProduct.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {selectedProduct.stock}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    type="number"
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{
                      min: 1,
                      max: selectedProduct.stock,
                    }}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= selectedProduct.stock}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>

            {/* Allergen Warning */}
            <Collapse in={showAllergenWarning}>
              <Alert 
                severity="warning" 
                icon={<WarningIcon />}
                sx={{ mt: 2 }}
              >
                ⚠️ This product contains: {selectedProduct.allergens?.join(', ')}
              </Alert>
            </Collapse>

            {/* Allergen Tags */}
            {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Allergens:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedProduct.allergens.map((allergen) => (
                    <Chip
                      key={allergen}
                      label={allergen}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Card>
        )}

        {/* Notes Field */}
        <TextField
          fullWidth
          label="Special Instructions"
          placeholder="e.g., No onions, extra spicy, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        {/* Add to Order Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleAddToOrder}
          disabled={isAddDisabled}
          startIcon={<AddIcon />}
        >
          Add to Order ({quantity} × {selectedProduct ? formatCurrency(selectedProduct.price) : '$0.00'} = {selectedProduct ? formatCurrency(selectedProduct.price * quantity) : '$0.00'})
        </Button>

        {isAddDisabled && selectedProduct && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {quantity > selectedProduct.stock ? 'Insufficient stock' : 'Please select a valid quantity'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};