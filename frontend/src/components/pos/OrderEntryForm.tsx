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
  Avatar,
  Fade,
  Zoom,
  Slide,
  Stack,
  Paper,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Warning as WarningIcon,
  QrCodeScanner as BarcodeIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as PriceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useOrderEntry } from '../../store/hooks/usePOS';
import { Product, OrderItem } from '../../types/pos';
import { formatCurrency } from '../../utils/formatters';

interface OrderEntryFormProps {
  onItemAdded?: () => void;
}

const ProductCard = ({ 
  product, 
  onAdd, 
  selected 
}: { 
  product: Product; 
  onAdd: (product: Product) => void;
  selected?: boolean;
}) => {
  const theme = useTheme();
  
  return (
    <Zoom in={true}>
      <Card
        onClick={() => onAdd(product)}
        sx={{
          cursor: 'pointer',
          height: '100%',
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
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.25rem',
              }}
            >
              <RestaurantIcon />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.2 }}>
                {product.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
                {product.description || 'No description available'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={product.category}
                  size="small"
                  icon={<CategoryIcon />}
                  sx={{ fontSize: '0.625rem' }}
                />
                <Chip
                  label={`${product.stock} in stock`}
                  size="small"
                  icon={<InventoryIcon />}
                  color={product.stock < 10 ? 'warning' : 'default'}
                  sx={{ fontSize: '0.625rem' }}
                />
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatCurrency(product.price)}
            </Typography>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              disabled={product.stock === 0}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              Add
            </Button>
          </Box>
          
          {product.allergens && product.allergens.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Allergens:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {product.allergens.slice(0, 3).map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{ fontSize: '0.625rem', height: 20 }}
                  />
                ))}
                {product.allergens.length > 3 && (
                  <Chip
                    label={`+${product.allergens.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.625rem', height: 20 }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

const SelectedProductCard = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onRemove, 
  notes, 
  onNotesChange 
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}) => {
  const theme = useTheme();
  const hasCommonAllergens = product.allergens?.some(allergen =>
    ['gluten', 'nuts', 'dairy', 'eggs', 'shellfish'].includes(allergen.toLowerCase())
  );
  
  return (
    <Slide direction="up" in={true}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}04 100%)`,
          border: `1px solid ${theme.palette.primary.main}20`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main,
              fontSize: '1.5rem',
            }}
          >
            <RestaurantIcon />
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {product.name}
              </Typography>
              
              <IconButton
                onClick={onRemove}
                color="error"
                size="small"
                sx={{ ml: 1 }}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {product.category} • {product.stock} available
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatCurrency(product.price)}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  size="small"
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <Typography variant="h6" fontWeight="bold" sx={{ minWidth: 40, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                
                <IconButton
                  onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  size="small"
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h6" fontWeight="bold" color="secondary">
                = {formatCurrency(product.price * quantity)}
              </Typography>
            </Box>
            
            {hasCommonAllergens && (
              <Alert 
                severity="warning" 
                icon={<WarningIcon />}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                ⚠️ This product contains: {product.allergens?.join(', ')}
              </Alert>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Special Instructions"
              placeholder="e.g., No onions, extra spicy, etc."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => onRemove()} // This will trigger add to order
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Add to Order ({quantity} × {formatCurrency(product.price)} = {formatCurrency(product.price * quantity)})
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};

export const OrderEntryForm: React.FC<OrderEntryFormProps> = ({ onItemAdded }) => {
  const theme = useTheme();
  const { products, currentOrder, addItemToOrder, loading, error } = useOrderEntry();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showAllergenWarning, setShowAllergenWarning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on search query and category
  useEffect(() => {
    let filtered = products.filter(product => product.isActive && product.stock > 0);
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

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

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setNotes('');
  };

  const handleBarcodeScan = () => {
    // Simulate barcode scanner input
    const barcode = prompt('Scan barcode or enter product code:');
    if (barcode) {
      const product = products.find(p => p.id === barcode || p.name.toLowerCase().includes(barcode.toLowerCase()));
      if (product) {
        handleProductSelect(product);
        setSearchQuery(product.name);
      }
    }
  };

  const isAddDisabled = !selectedProduct || quantity < 1 || quantity > (selectedProduct?.stock || 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <AddIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Add Items to Order
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Search products, scan barcodes, and build orders quickly
              </Typography>
            </Box>
          </Box>

          {/* Search and Filter Section */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Autocomplete
                options={filteredProducts}
                getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
                value={selectedProduct}
                onChange={(_, newValue) => handleProductSelect(newValue!)}
                inputValue={searchQuery}
                onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Products"
                    placeholder="Type product name, category, or description..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '1rem',
                      },
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
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                    sx={{ borderRadius: 2 }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Tooltip title="Scan barcode">
                  <Button
                    variant="outlined"
                    onClick={handleBarcodeScan}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      borderRadius: 2,
                      borderWidth: 2,
                    }}
                  >
                    <BarcodeIcon />
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>

          {/* Selected Product Details */}
          {selectedProduct && (
            <Box sx={{ mb: 3 }}>
              <SelectedProductCard
                product={selectedProduct}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleAddToOrder}
                notes={notes}
                onNotesChange={setNotes}
              />
            </Box>
          )}

          {/* Product Grid */}
          {!selectedProduct && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Available Products
                </Typography>
                <Chip 
                  label={`${filteredProducts.length} products`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              
              {filteredProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'grey.100', 
                      color: 'grey.500',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or category filter
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <ProductCard 
                        product={product} 
                        onAdd={handleProductSelect}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};