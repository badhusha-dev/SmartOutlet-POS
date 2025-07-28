import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createPOSTheme } from '../theme/posTheme';
import { POSApplication } from '../components/pos/POSApplication';

// Sample data for demo
const sampleProducts = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella cheese',
    price: 14.99,
    category: 'Pizza',
    stock: 50,
    allergens: ['dairy', 'gluten'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with melted cheese',
    price: 16.99,
    category: 'Pizza',
    stock: 45,
    allergens: ['dairy', 'gluten'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing',
    price: 12.99,
    category: 'Salad',
    stock: 30,
    allergens: ['dairy', 'eggs'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce',
    price: 13.99,
    category: 'Appetizer',
    stock: 60,
    allergens: ['gluten'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and parmesan',
    price: 18.99,
    category: 'Pasta',
    stock: 25,
    allergens: ['dairy', 'eggs', 'gluten'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const sampleCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-0123',
    loyaltyPoints: 750,
    dietaryPreferences: ['Vegetarian'],
    totalSpent: 450.00,
    lastOrderDate: '2024-01-15T18:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0456',
    loyaltyPoints: 1200,
    dietaryPreferences: ['Gluten-Free', 'Dairy-Free'],
    totalSpent: 890.00,
    lastOrderDate: '2024-01-14T19:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@email.com',
    phone: '555-0789',
    loyaltyPoints: 300,
    dietaryPreferences: [],
    totalSpent: 220.00,
    lastOrderDate: '2024-01-13T20:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const sampleOrders = [
  {
    id: 'order-001',
    customerId: '1',
    customerName: 'John Smith',
    items: [
      {
        id: 'item-001',
        productId: '1',
        productName: 'Margherita Pizza',
        quantity: 2,
        unitPrice: 14.99,
        totalPrice: 29.98,
        notes: 'Extra cheese please',
        allergens: ['dairy', 'gluten'],
      },
      {
        id: 'item-002',
        productId: '3',
        productName: 'Caesar Salad',
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
        notes: 'Dressing on the side',
        allergens: ['dairy', 'eggs'],
      },
    ],
    subtotal: 42.97,
    tax: 3.44,
    discount: 0,
    total: 46.41,
    status: 'COMPLETED',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    loyaltyPointsRedeemed: 0,
    loyaltyPointsEarned: 46,
    tip: 9.28,
    notes: 'Delivery to 123 Main St',
    createdAt: '2024-01-15T18:30:00Z',
    updatedAt: '2024-01-15T19:00:00Z',
    completedAt: '2024-01-15T19:00:00Z',
  },
  {
    id: 'order-002',
    customerId: '2',
    customerName: 'Sarah Johnson',
    items: [
      {
        id: 'item-003',
        productId: '4',
        productName: 'Chicken Wings',
        quantity: 1,
        unitPrice: 13.99,
        totalPrice: 13.99,
        notes: 'Buffalo sauce',
        allergens: ['gluten'],
      },
    ],
    subtotal: 13.99,
    tax: 1.12,
    discount: 2.00,
    total: 13.11,
    status: 'PREPARING',
    paymentMethod: 'EWALLET',
    paymentStatus: 'PAID',
    loyaltyPointsRedeemed: 200,
    loyaltyPointsEarned: 13,
    tip: 2.62,
    notes: 'Pickup order',
    createdAt: '2024-01-16T12:15:00Z',
    updatedAt: '2024-01-16T12:20:00Z',
  },
  {
    id: 'order-003',
    customerId: null,
    customerName: null,
    items: [
      {
        id: 'item-004',
        productId: '2',
        productName: 'Pepperoni Pizza',
        quantity: 1,
        unitPrice: 16.99,
        totalPrice: 16.99,
        notes: 'Extra crispy',
        allergens: ['dairy', 'gluten'],
      },
    ],
    subtotal: 16.99,
    tax: 1.36,
    discount: 0,
    total: 18.35,
    status: 'OPEN',
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    loyaltyPointsRedeemed: 0,
    loyaltyPointsEarned: 0,
    tip: 0,
    notes: '',
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-16T13:00:00Z',
  },
];

export const POSDemo: React.FC = () => {
  // Initialize store with sample data
  React.useEffect(() => {
    const { setProducts, setCustomers, setOrders } = require('../store/posStore').usePOSStore.getState();
    setProducts(sampleProducts);
    setCustomers(sampleCustomers);
    setOrders(sampleOrders);
  }, []);

  return (
    <ThemeProvider theme={createPOSTheme()}>
      <CssBaseline />
      <POSApplication outletId="demo-outlet-001" />
    </ThemeProvider>
  );
};