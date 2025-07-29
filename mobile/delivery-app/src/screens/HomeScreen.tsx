import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch,
  Alert,
  Vibration,
  AppState,
  Platform,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

import { RootState, DeliveryOrder, PartnerAvailability, DeliveryStatus } from '@/types';
import { Colors } from '@/constants/Colors';
import DeliveryCard from '@/components/DeliveryCard';
import EarningsSummary from '@/components/EarningsSummary';
import LocationStatus from '@/components/LocationStatus';
import OrderRequestModal from '@/components/OrderRequestModal';
import ShiftControls from '@/components/ShiftControls';
import { 
  updateAvailability, 
  fetchAvailableOrders,
  acceptOrder,
  rejectOrder 
} from '@/store/slices/orderSlice';
import { 
  updateLocation, 
  startShift, 
  endShift 
} from '@/store/slices/partnerSlice';
import { showToast } from '@/utils/toast';
import { requestLocationPermission } from '@/utils/permissions';
import { formatCurrency, formatTime } from '@/utils/formatters';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showOrderRequest, setShowOrderRequest] = useState(false);
  const [currentOrderRequest, setCurrentOrderRequest] = useState<DeliveryOrder | null>(null);
  
  const { 
    partner, 
    currentShift, 
    isLoading 
  } = useSelector((state: RootState) => state.partner);
  
  const { 
    activeOrder, 
    availableOrders,
    isLoading: ordersLoading 
  } = useSelector((state: RootState) => state.orders);
  
  const { 
    summary: earningsSummary 
  } = useSelector((state: RootState) => state.earnings);
  
  const { 
    currentLocation, 
    isLocationEnabled 
  } = useSelector((state: RootState) => state.app);

  // Sound for new order notification
  const [orderSound] = useState(() => {
    const sound = new Sound('order_notification.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load order notification sound', error);
      }
    });
    return sound;
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (partner?.isOnline && currentLocation) {
        dispatch(updateLocation(currentLocation) as any);
      }
    }, 30000); // Update location every 30 seconds

    return () => {
      clearInterval(interval);
      orderSound.release();
    };
  }, []);

  // Listen for new order requests
  useEffect(() => {
    if (availableOrders.length > 0 && partner?.isOnline && !activeOrder) {
      const newOrder = availableOrders[0];
      handleNewOrderRequest(newOrder);
    }
  }, [availableOrders, partner?.isOnline, activeOrder]);

  const loadData = useCallback(() => {
    if (partner?.isOnline && currentLocation) {
      dispatch(fetchAvailableOrders(currentLocation) as any);
    }
  }, [dispatch, partner?.isOnline, currentLocation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadData]);

  const handleNewOrderRequest = (order: DeliveryOrder) => {
    // Play notification sound
    orderSound.play();
    
    // Vibrate
    Vibration.vibrate([0, 500, 200, 500]);
    
    // Show order request modal
    setCurrentOrderRequest(order);
    setShowOrderRequest(true);
    
    // Auto-reject after 30 seconds if no response
    setTimeout(() => {
      if (showOrderRequest && currentOrderRequest?.id === order.id) {
        handleRejectOrder();
      }
    }, 30000);
  };

  const handleToggleAvailability = async () => {
    if (!currentLocation) {
      Alert.alert(
        'Location Required',
        'Please enable location services to go online.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const newAvailability = partner?.isOnline 
      ? PartnerAvailability.OFFLINE 
      : PartnerAvailability.ONLINE;

    try {
      await dispatch(updateAvailability({
        availability: newAvailability,
        location: currentLocation
      }) as any);

      if (newAvailability === PartnerAvailability.ONLINE) {
        showToast('You are now online and ready to receive orders!', 'success');
        if (!currentShift) {
          dispatch(startShift() as any);
        }
      } else {
        showToast('You are now offline', 'info');
        if (currentShift) {
          Alert.alert(
            'End Shift',
            'Do you want to end your current shift?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'End Shift', onPress: () => dispatch(endShift() as any) }
            ]
          );
        }
      }
    } catch (error) {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleAcceptOrder = async () => {
    if (!currentOrderRequest) return;

    try {
      await dispatch(acceptOrder(currentOrderRequest.id) as any);
      setShowOrderRequest(false);
      setCurrentOrderRequest(null);
      showToast('Order accepted! Navigate to pickup location.', 'success');
      
      // Navigate to order details
      navigation.navigate('OrderDetails' as never, { 
        orderId: currentOrderRequest.id 
      } as never);
    } catch (error) {
      showToast('Failed to accept order', 'error');
    }
  };

  const handleRejectOrder = async () => {
    if (!currentOrderRequest) return;

    try {
      await dispatch(rejectOrder(currentOrderRequest.id) as any);
      setShowOrderRequest(false);
      setCurrentOrderRequest(null);
    } catch (error) {
      showToast('Failed to reject order', 'error');
    }
  };

  const handleViewActiveOrder = () => {
    if (activeOrder) {
      navigation.navigate('OrderDetails' as never, { 
        orderId: activeOrder.id 
      } as never);
    }
  };

  const handleNavigateToOrder = () => {
    if (activeOrder) {
      navigation.navigate('Navigation' as never, { 
        orderId: activeOrder.id 
      } as never);
    }
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.ASSIGNED:
      case DeliveryStatus.ACCEPTED:
        return Colors.warning;
      case DeliveryStatus.HEADING_TO_RESTAURANT:
      case DeliveryStatus.ARRIVED_AT_RESTAURANT:
        return Colors.info;
      case DeliveryStatus.PICKED_UP:
      case DeliveryStatus.HEADING_TO_CUSTOMER:
        return Colors.primary;
      case DeliveryStatus.ARRIVED_AT_CUSTOMER:
        return Colors.secondary;
      case DeliveryStatus.DELIVERED:
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  if (!partner) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            Hello, {partner.firstName}!
          </Text>
          <LocationStatus />
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.availabilityToggle}
            onPress={handleToggleAvailability}
          >
            <Text style={styles.availabilityLabel}>
              {partner.isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={partner.isOnline}
              onValueChange={handleToggleAvailability}
              trackColor={{
                false: Colors.borderDark,
                true: Colors.success
              }}
              thumbColor={partner.isOnline ? Colors.white : Colors.textLight}
              disabled={isLoading}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Shift Controls */}
        <ShiftControls
          currentShift={currentShift}
          isOnline={partner.isOnline}
          onStartShift={() => dispatch(startShift() as any)}
          onEndShift={() => dispatch(endShift() as any)}
        />

        {/* Earnings Summary */}
        <EarningsSummary
          summary={earningsSummary}
          onViewDetails={() => navigation.navigate('Earnings' as never)}
        />

        {/* Active Order */}
        {activeOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Delivery</Text>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              style={styles.activeOrderCard}
            >
              <View style={styles.activeOrderHeader}>
                <View style={styles.orderStatus}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor(activeOrder.status) }
                  ]} />
                  <Text style={styles.activeOrderStatus}>
                    {activeOrder.status.replace(/_/g, ' ').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.activeOrderEarnings}>
                  {formatCurrency(activeOrder.partnerEarnings)}
                </Text>
              </View>
              
              <View style={styles.activeOrderDetails}>
                <Text style={styles.activeOrderNumber}>
                  Order #{activeOrder.orderNumber}
                </Text>
                <Text style={styles.activeOrderCustomer}>
                  {activeOrder.customer.name}
                </Text>
                <Text style={styles.activeOrderDistance}>
                  {activeOrder.distance.toFixed(1)} km • {activeOrder.estimatedDuration} min
                </Text>
              </View>

              <View style={styles.activeOrderActions}>
                <TouchableOpacity 
                  style={styles.orderActionButton}
                  onPress={handleViewActiveOrder}
                >
                  <Icon name="info" size={20} color={Colors.white} />
                  <Text style={styles.orderActionText}>Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.orderActionButton, styles.primaryAction]}
                  onPress={handleNavigateToOrder}
                >
                  <Icon name="navigation" size={20} color={Colors.white} />
                  <Text style={styles.orderActionText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Icon name="delivery-dining" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{earningsSummary.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="star" size={24} color={Colors.rating} />
              <Text style={styles.statValue}>
                {earningsSummary.averageRating.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="schedule" size={24} color={Colors.info} />
              <Text style={styles.statValue}>
                {Math.round(earningsSummary.onlineHours)}h
              </Text>
              <Text style={styles.statLabel}>Online</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="check-circle" size={24} color={Colors.success} />
              <Text style={styles.statValue}>
                {Math.round(earningsSummary.completionRate)}%
              </Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Orders' as never)}
            >
              <LinearGradient
                colors={Colors.gradientPrimary}
                style={styles.quickActionGradient}
              >
                <Icon name="history" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Order History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Earnings' as never)}
            >
              <LinearGradient
                colors={Colors.gradientSuccess}
                style={styles.quickActionGradient}
              >
                <Icon name="account-balance-wallet" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Help' as never)}
            >
              <LinearGradient
                colors={Colors.gradientWarning}
                style={styles.quickActionGradient}
              >
                <Icon name="help" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <LinearGradient
                colors={Colors.gradientSecondary}
                style={styles.quickActionGradient}
              >
                <Icon name="person" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Order Request Modal */}
      <OrderRequestModal
        visible={showOrderRequest}
        order={currentOrderRequest}
        onAccept={handleAcceptOrder}
        onReject={handleRejectOrder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  activeOrderCard: {
    borderRadius: 12,
    padding: 16,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeOrderStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  activeOrderEarnings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  activeOrderDetails: {
    marginBottom: 16,
  },
  activeOrderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  activeOrderCustomer: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  activeOrderDistance: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
  },
  activeOrderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  orderActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  orderActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;