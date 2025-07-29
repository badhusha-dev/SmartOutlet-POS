import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { RootStackParamList, RootState } from '@/types';
import SplashScreen from '@/screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OutletDetailsScreen from '@/screens/OutletDetailsScreen';
import ProductDetailsScreen from '@/screens/ProductDetailsScreen';
import CartScreen from '@/screens/CartScreen';
import CheckoutScreen from '@/screens/CheckoutScreen';
import OrderTrackingScreen from '@/screens/OrderTrackingScreen';
import OrderDetailsScreen from '@/screens/OrderDetailsScreen';
import AddressesScreen from '@/screens/AddressesScreen';
import AddAddressScreen from '@/screens/AddAddressScreen';
import PaymentMethodsScreen from '@/screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from '@/screens/AddPaymentMethodScreen';
import SearchScreen from '@/screens/SearchScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';
import ReviewsScreen from '@/screens/ReviewsScreen';
import SupportScreen from '@/screens/SupportScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isFirstLaunch } = useSelector((state: RootState) => state.app);

  if (isFirstLaunch) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="OutletDetails"
            component={OutletDetailsScreen}
            options={{
              headerShown: true,
              title: 'Restaurant Details',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{
              headerShown: true,
              title: 'Product Details',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{
              headerShown: true,
              title: 'Your Cart',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{
              headerShown: true,
              title: 'Checkout',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="OrderTracking"
            component={OrderTrackingScreen}
            options={{
              headerShown: true,
              title: 'Track Order',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetailsScreen}
            options={{
              headerShown: true,
              title: 'Order Details',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Addresses"
            component={AddressesScreen}
            options={{
              headerShown: true,
              title: 'Delivery Addresses',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="AddAddress"
            component={AddAddressScreen}
            options={{
              headerShown: true,
              title: 'Add Address',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethodsScreen}
            options={{
              headerShown: true,
              title: 'Payment Methods',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="AddPaymentMethod"
            component={AddPaymentMethodScreen}
            options={{
              headerShown: true,
              title: 'Add Payment Method',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              headerShown: true,
              title: 'Search',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: true,
              title: 'Notifications',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
            options={{
              headerShown: true,
              title: 'Rate & Review',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{
              headerShown: true,
              title: 'Help & Support',
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Settings',
              headerBackTitleVisible: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;