import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Paper } from '@mui/material';
import { POSApplication } from '../components/pos/POSApplication';
import { createPOSTheme } from '../theme/posTheme';
import { usePOSStore } from '../store/posStore';
import { Product, Customer, Order } from '../types/pos';

// Enhanced sample data with more realistic content
const sampleProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella cheese and fresh basil',
    price: 18.99,
    category: 'Pizza',
    stock: 25,
    isActive: true,
    allergens: ['dairy', 'gluten'],
    imageUrl: '/images/margherita.jpg',
  },
  {
    id: 'prod-002',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with melted cheese on crispy crust',
    price: 21.99,
    category: 'Pizza',
    stock: 20,
    isActive: true,
    allergens: ['dairy', 'gluten', 'pork'],
    imageUrl: '/images/pepperoni.jpg',
  },
  {
    id: 'prod-003',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 12.99,
    category: 'Salads',
    stock: 15,
    isActive: true,
    allergens: ['dairy', 'gluten', 'eggs'],
    imageUrl: '/images/caesar.jpg',
  },
  {
    id: 'prod-004',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce',
    price: 16.99,
    category: 'Appetizers',
    stock: 30,
    isActive: true,
    allergens: ['gluten'],
    imageUrl: '/images/wings.jpg',
  },
  {
    id: 'prod-005',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan',
    price: 19.99,
    category: 'Pasta',
    stock: 12,
    isActive: true,
    allergens: ['dairy', 'gluten', 'eggs'],
    imageUrl: '/images/carbonara.jpg',
  },
  {
    id: 'prod-006',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 6.99,
    category: 'Sides',
    stock: 40,
    isActive: true,
    allergens: ['dairy', 'gluten'],
    imageUrl: '/images/garlic-bread.jpg',
  },
  {
    id: 'prod-007',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 8.99,
    category: 'Desserts',
    stock: 8,
    isActive: true,
    allergens: ['dairy', 'eggs'],
    imageUrl: '/images/tiramisu.jpg',
  },
  {
    id: 'prod-008',
    name: 'Coca Cola',
    description: 'Refreshing soft drink',
    price: 3.99,
    category: 'Beverages',
    stock: 50,
    isActive: true,
    allergens: [],
    imageUrl: '/images/coke.jpg',
  },
  {
    id: 'prod-009',
    name: 'Chocolate Milkshake',
    description: 'Rich chocolate shake with whipped cream',
    price: 7.99,
    category: 'Beverages',
    stock: 15,
    isActive: true,
    allergens: ['dairy'],
    imageUrl: '/images/milkshake.jpg',
  },
  {
    id: 'prod-010',
    name: 'Supreme Pizza',
    description: 'Loaded with pepperoni, sausage, mushrooms, and vegetables',
    price: 24.99,
    category: 'Pizza',
    stock: 18,
    isActive: true,
    allergens: ['dairy', 'gluten', 'pork'],
    imageUrl: '/images/supreme.jpg',
  },
];

const sampleCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    loyaltyPoints: 1250,
    loyaltyTier: 'GOLD',
    dietaryPreferences: ['vegetarian'],
    createdAt: '2023-01-15T10:30:00Z',
    lastOrderAt: '2024-01-20T18:45:00Z',
  },
  {
    id: 'cust-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    loyaltyPoints: 850,
    loyaltyTier: 'SILVER',
    dietaryPreferences: ['gluten-free'],
    createdAt: '2023-03-22T14:20:00Z',
    lastOrderAt: '2024-01-19T12:30:00Z',
  },
  {
    id: 'cust-003',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1 (555) 345-6789',
    loyaltyPoints: 2100,
    loyaltyTier: 'GOLD',
    dietaryPreferences: [],
    createdAt: '2022-11-08T09:15:00Z',
    lastOrderAt: '2024-01-21T19:20:00Z',
  },
  {
    id: 'cust-004',
    name: 'Emily Wilson',
    email: 'emily.w@email.com',
    phone: '+1 (555) 456-7890',
    loyaltyPoints: 450,
    loyaltyTier: 'BRONZE',
    dietaryPreferences: ['vegan'],
    createdAt: '2023-08-12T16:45:00Z',
    lastOrderAt: '2024-01-18T20:15:00Z',
  },
  {
    id: 'cust-005',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+1 (555) 567-8901',
    loyaltyPoints: 3200,
    loyaltyTier: 'GOLD',
    dietaryPreferences: ['dairy-free'],
    createdAt: '2022-06-30T11:00:00Z',
    lastOrderAt: '2024-01-21T21:30:00Z',
  },
];

const sampleOrders: Order[] = [
  {
    id: 'order-001',
    items: [
      {
        id: 'item-001',
        product: sampleProducts[0],
        quantity: 2,
        notes: 'Extra cheese please',
        totalPrice: 37.98,
      },
      {
        id: 'item-002',
        product: sampleProducts[2],
        quantity: 1,
        notes: 'No croutons',
        totalPrice: 12.99,
      },
    ],
    customerId: 'cust-001',
    customerName: 'John Smith',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    subtotal: 50.97,
    tax: 4.08,
    taxRate: 8,
    total: 54.05,
    tip: 8.11,
    discount: 0,
    loyaltyPointsEarned: 54,
    loyaltyPointsRedeemed: 0,
    notes: 'Delivery to 123 Main St',
    createdAt: '2024-01-21T18:30:00Z',
    updatedAt: '2024-01-21T19:15:00Z',
    completedAt: '2024-01-21T19:15:00Z',
  },
  {
    id: 'order-002',
    items: [
      {
        id: 'item-003',
        product: sampleProducts[1],
        quantity: 1,
        notes: 'Well done',
        totalPrice: 21.99,
      },
      {
        id: 'item-004',
        product: sampleProducts[3],
        quantity: 1,
        notes: 'Buffalo sauce',
        totalPrice: 16.99,
      },
    ],
    customerId: 'cust-002',
    customerName: 'Sarah Johnson',
    status: 'PREPARING',
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    subtotal: 38.98,
    tax: 3.12,
    taxRate: 8,
    total: 42.10,
    tip: 6.32,
    discount: 0,
    loyaltyPointsEarned: 42,
    loyaltyPointsRedeemed: 100,
    notes: '',
    createdAt: '2024-01-21T19:45:00Z',
    updatedAt: '2024-01-21T19:50:00Z',
  },
  {
    id: 'order-003',
    items: [
      {
        id: 'item-005',
        product: sampleProducts[4],
        quantity: 1,
        notes: '',
        totalPrice: 19.99,
      },
      {
        id: 'item-006',
        product: sampleProducts[5],
        quantity: 2,
        notes: 'Extra garlic',
        totalPrice: 13.98,
      },
    ],
    customerId: 'cust-003',
    customerName: 'Mike Davis',
    status: 'READY',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    subtotal: 33.97,
    tax: 2.72,
    taxRate: 8,
    total: 36.69,
    tip: 5.50,
    discount: 5.00,
    loyaltyPointsEarned: 37,
    loyaltyPointsRedeemed: 0,
    notes: 'Pickup',
    createdAt: '2024-01-21T20:15:00Z',
    updatedAt: '2024-01-21T20:45:00Z',
  },
  {
    id: 'order-004',
    items: [
      {
        id: 'item-007',
        product: sampleProducts[9],
        quantity: 1,
        notes: 'No mushrooms',
        totalPrice: 24.99,
      },
      {
        id: 'item-008',
        product: sampleProducts[8],
        quantity: 2,
        notes: '',
        totalPrice: 15.98,
      },
    ],
    customerId: 'cust-004',
    customerName: 'Emily Wilson',
    status: 'OPEN',
    paymentStatus: 'PENDING',
    paymentMethod: 'CASH',
    subtotal: 40.97,
    tax: 3.28,
    taxRate: 8,
    total: 44.25,
    tip: 0,
    discount: 0,
    loyaltyPointsEarned: 0,
    loyaltyPointsRedeemed: 0,
    notes: '',
    createdAt: '2024-01-21T20:30:00Z',
    updatedAt: '2024-01-21T20:30:00Z',
  },
  {
    id: 'order-005',
    items: [
      {
        id: 'item-009',
        product: sampleProducts[6],
        quantity: 1,
        notes: '',
        totalPrice: 8.99,
      },
      {
        id: 'item-010',
        product: sampleProducts[7],
        quantity: 1,
        notes: '',
        totalPrice: 3.99,
      },
    ],
    customerId: 'cust-005',
    customerName: 'David Brown',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    subtotal: 12.98,
    tax: 1.04,
    taxRate: 8,
    total: 14.02,
    tip: 2.10,
    discount: 0,
    loyaltyPointsEarned: 14,
    loyaltyPointsRedeemed: 0,
    notes: 'Dessert only',
    createdAt: '2024-01-21T21:00:00Z',
    updatedAt: '2024-01-21T21:10:00Z',
    completedAt: '2024-01-21T21:10:00Z',
  },
];

export const POSDemo: React.FC = () => {
  const { setProducts, setCustomers, setOrders } = usePOSStore();

  useEffect(() => {
    // Initialize the store with sample data
    setProducts(sampleProducts);
    setCustomers(sampleCustomers);
    setOrders(sampleOrders);
  }, [setProducts, setCustomers, setOrders]);

  return (
    <ThemeProvider theme={createPOSTheme()}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Demo Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: `linear-gradient(135deg, #FF6B6B 0%, #E55A5A 100%)`,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
            🍕 CoralServe POS System - Demo
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Enhanced UI/UX with modern design patterns • Real-time updates • Responsive layout
          </Typography>
        </Paper>
        
        {/* Main Application */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <POSApplication outletId="demo-outlet-001" />
        </Box>
      </Box>
    </ThemeProvider>
  );
};