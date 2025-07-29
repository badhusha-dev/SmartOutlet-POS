import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import { RootState } from '@/types';
import { Colors } from '@/constants/Colors';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import OutletCard from '@/components/OutletCard';
import ProductCard from '@/components/ProductCard';
import PromotionBanner from '@/components/PromotionBanner';
import LocationHeader from '@/components/LocationHeader';
import { fetchNearbyOutlets } from '@/store/slices/outletSlice';
import { fetchFeaturedProducts, fetchCategories } from '@/store/slices/productSlice';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    nearbyOutlets, 
    isLoading: outletsLoading 
  } = useSelector((state: RootState) => state.outlets);
  
  const { 
    featuredProducts, 
    categories, 
    isLoading: productsLoading 
  } = useSelector((state: RootState) => state.products);
  
  const { currentLocation } = useSelector((state: RootState) => state.app);
  const { itemCount } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    loadData();
  }, [currentLocation]);

  const loadData = useCallback(() => {
    if (currentLocation) {
      dispatch(fetchNearbyOutlets(currentLocation) as any);
      dispatch(fetchFeaturedProducts() as any);
      dispatch(fetchCategories() as any);
    }
  }, [dispatch, currentLocation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadData]);

  const handleSearchPress = () => {
    navigation.navigate('Search' as never);
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Search' as never, { categoryId } as never);
  };

  const handleOutletPress = (outletId: string) => {
    navigation.navigate('OutletDetails' as never, { outletId } as never);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails' as never, { productId } as never);
  };

  const handleCartPress = () => {
    navigation.navigate('Cart' as never);
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <CategoryCard
      category={item}
      onPress={() => handleCategoryPress(item.id)}
    />
  );

  const renderOutletItem = ({ item }: { item: any }) => (
    <OutletCard
      outlet={item}
      onPress={() => handleOutletPress(item.id)}
      style={{ marginRight: 16 }}
    />
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id)}
      style={{ marginRight: 16 }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LocationHeader />
        
        {/* Cart Button */}
        <TouchableOpacity 
          style={styles.cartButton} 
          onPress={handleCartPress}
        >
          <Icon name="shopping-cart" size={24} color={Colors.primary} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            onPress={handleSearchPress}
            placeholder="Search for food, restaurants..."
          />
        </View>

        {/* Promotion Banner */}
        <PromotionBanner />

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories.slice(0, 8)}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Nearby Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Restaurants Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={nearbyOutlets.slice(0, 5)}
            renderItem={renderOutletItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts.slice(0, 10)}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
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
                <Icon name="receipt-long" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Favorites' as never)}
            >
              <LinearGradient
                colors={Colors.gradientSecondary}
                style={styles.quickActionGradient}
              >
                <Icon name="favorite" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Support' as never)}
            >
              <LinearGradient
                colors={Colors.gradientSuccess}
                style={styles.quickActionGradient}
              >
                <Icon name="help" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('Notifications' as never)}
            >
              <LinearGradient
                colors={Colors.gradientWarning}
                style={styles.quickActionGradient}
              >
                <Icon name="notifications" size={24} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.quickActionText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
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