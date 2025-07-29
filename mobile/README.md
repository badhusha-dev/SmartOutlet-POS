# 📱 SmartOutlet Mobile Apps

This directory contains the React Native mobile applications for the SmartOutlet POS system, designed for both customers and delivery partners.

## 🏗️ Architecture

### Customer App (`customer-app/`)
**Purpose**: Customer-facing mobile application for ordering food and tracking deliveries.

**Key Features**:
- **User Authentication**: Login, registration, profile management
- **Restaurant Discovery**: Browse nearby restaurants with real-time location
- **Menu Browsing**: Search products, view categories, detailed product info
- **Order Management**: Add to cart, customize orders, place orders
- **Real-time Tracking**: Live order tracking with GPS and delivery partner info
- **Payment Integration**: Multiple payment methods (card, wallet, UPI, cash)
- **Address Management**: Save multiple delivery addresses
- **Order History**: Past orders, reorder functionality, reviews and ratings
- **Favorites**: Save favorite restaurants and dishes
- **Push Notifications**: Order updates, promotions, delivery notifications
- **Support**: In-app help, chat support, issue reporting

### Delivery Partner App (`delivery-app/`)
**Purpose**: Delivery partner application for managing deliveries and earnings.

**Key Features**:
- **Partner Dashboard**: Real-time earnings, performance metrics, shift management
- **Order Management**: Accept/reject orders, real-time order notifications
- **GPS Navigation**: Turn-by-turn navigation to pickup and delivery locations
- **Status Updates**: Update delivery status, proof of delivery
- **Earnings Tracking**: Daily, weekly, monthly earnings with detailed breakdowns
- **Document Management**: Upload and manage verification documents
- **Issue Reporting**: Report delivery issues, customer problems
- **Shift Controls**: Start/end shifts, break management, availability toggle
- **Performance Analytics**: Ratings, completion rates, delivery times
- **Vehicle Management**: Add vehicle details, insurance, registration

## 🛠️ Technology Stack

### Core Technologies
- **React Native 0.73**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation 6**: Navigation and routing
- **Redux Toolkit**: State management
- **React Hook Form**: Form handling and validation

### Key Libraries

#### Navigation & UI
- `@react-navigation/native`: Core navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `@react-navigation/native-stack`: Stack navigation
- `react-native-vector-icons`: Icon library
- `react-native-linear-gradient`: Gradient backgrounds
- `react-native-modal`: Modal components
- `react-native-toast-message`: Toast notifications

#### Location & Maps
- `react-native-maps`: Map integration
- `react-native-maps-directions`: Route directions
- `@react-native-community/geolocation`: GPS location
- `react-native-permissions`: Runtime permissions

#### Media & Storage
- `react-native-fast-image`: Optimized image loading
- `react-native-image-picker`: Camera and gallery access
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-document-picker`: Document selection

#### Network & Communication
- `axios`: HTTP client
- `@react-native-community/netinfo`: Network status
- `react-native-push-notification`: Push notifications

#### Device Features
- `react-native-sound`: Audio playback
- `react-native-qrcode-scanner`: QR code scanning
- `react-native-orientation-locker`: Orientation control
- `react-native-background-timer`: Background processing

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+
node --version

# React Native CLI
npm install -g react-native-cli

# For iOS development
xcode-select --install
sudo gem install cocoapods

# For Android development
# Install Android Studio and SDK
```

### Customer App Setup

```bash
# Navigate to customer app
cd mobile/customer-app

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Delivery Partner App Setup

```bash
# Navigate to delivery app
cd mobile/delivery-app

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📁 Project Structure

```
mobile/
├── customer-app/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── OutletCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── OrderTracker.tsx
│   │   │   └── ...
│   │   ├── screens/           # App screens
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── CartScreen.tsx
│   │   │   ├── CheckoutScreen.tsx
│   │   │   ├── OrderTrackingScreen.tsx
│   │   │   └── ...
│   │   ├── navigation/        # Navigation setup
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── MainNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── NavigationService.ts
│   │   ├── store/            # Redux store
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── userSlice.ts
│   │   │       ├── cartSlice.ts
│   │   │       ├── orderSlice.ts
│   │   │       └── ...
│   │   ├── services/         # API services
│   │   │   ├── authService.ts
│   │   │   ├── orderService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── ...
│   │   ├── types/           # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── permissions.ts
│   │   │   ├── storage.ts
│   │   │   └── ...
│   │   └── constants/       # App constants
│   │       ├── Colors.ts
│   │       ├── Config.ts
│   │       └── ...
│   ├── android/            # Android-specific code
│   ├── ios/                # iOS-specific code
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── delivery-app/
    ├── src/
    │   ├── components/        # Delivery-specific components
    │   │   ├── DeliveryCard.tsx
    │   │   ├── EarningsSummary.tsx
    │   │   ├── LocationStatus.tsx
    │   │   ├── OrderRequestModal.tsx
    │   │   ├── ShiftControls.tsx
    │   │   └── ...
    │   ├── screens/           # Delivery app screens
    │   │   ├── HomeScreen.tsx
    │   │   ├── OrdersScreen.tsx
    │   │   ├── EarningsScreen.tsx
    │   │   ├── NavigationScreen.tsx
    │   │   ├── ProfileScreen.tsx
    │   │   └── ...
    │   └── ... (similar structure)
    └── ...
```

## 🎨 UI/UX Design

### Design System
- **Primary Colors**: Orange gradient (`#FF6B35` to `#FF8C69`)
- **Typography**: System fonts with weight hierarchy
- **Spacing**: 4px grid system (4, 8, 12, 16, 20, 24px)
- **Border Radius**: Consistent 8-12px for cards and buttons
- **Shadows**: Subtle elevation for cards and modals

### Component Library
- **Cards**: Product cards, outlet cards, order cards
- **Buttons**: Primary, secondary, outline, icon buttons
- **Forms**: Input fields, selectors, validation states
- **Navigation**: Tab bars, headers, drawer navigation
- **Feedback**: Toast messages, loading states, error states

### Responsive Design
- **Phone**: Optimized for 375px - 414px widths
- **Tablet**: Adaptive layouts for larger screens
- **Orientation**: Support for portrait and landscape modes

## 🔧 Configuration

### Environment Variables

#### Customer App
```env
# API Configuration
API_BASE_URL=https://api.smartoutlet.com
WEBSOCKET_URL=wss://ws.smartoutlet.com

# Payment Gateways
STRIPE_PUBLISHABLE_KEY=pk_...
RAZORPAY_KEY_ID=rzp_...

# Maps & Location
GOOGLE_MAPS_API_KEY=AIza...
MAPBOX_API_KEY=pk.eyJ1...

# Push Notifications
FCM_SENDER_ID=123456789
ONESIGNAL_APP_ID=xxx-xxx-xxx

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
DEBUG_MODE=false
```

#### Delivery Partner App
```env
# API Configuration
API_BASE_URL=https://api.smartoutlet.com
DELIVERY_API_URL=https://delivery-api.smartoutlet.com
WEBSOCKET_URL=wss://ws.smartoutlet.com

# Maps & Navigation
GOOGLE_MAPS_API_KEY=AIza...
MAPBOX_DIRECTIONS_KEY=pk.eyJ1...

# Background Services
LOCATION_UPDATE_INTERVAL=30000
ORDER_CHECK_INTERVAL=10000

# Audio & Notifications
ENABLE_ORDER_SOUNDS=true
VIBRATION_PATTERN=[0,500,200,500]

# Performance
MAX_CONCURRENT_ORDERS=3
LOCATION_ACCURACY_THRESHOLD=10
```

### Build Configuration

#### Android
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        applicationId "com.smartoutlet.customer" // or delivery
        minSdkVersion 23
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### iOS
```plist
<!-- ios/SmartOutletCustomer/Info.plist -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show nearby restaurants</string>

<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos for reviews</string>

<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice notes</string>
```

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure API authentication
- **Biometric Auth**: Fingerprint/Face ID for quick login
- **Token Refresh**: Automatic token renewal
- **Session Management**: Secure session handling

### Data Protection
- **SSL Pinning**: Certificate pinning for API calls
- **Keychain Storage**: Secure storage for sensitive data
- **Data Encryption**: Local data encryption
- **Privacy**: GDPR/CCPA compliance

### API Security
- **Request Signing**: HMAC request signatures
- **Rate Limiting**: Client-side rate limiting
- **Certificate Validation**: SSL certificate validation
- **Secure Headers**: Security headers for all requests

## 📊 Analytics & Monitoring

### Customer App Analytics
- **User Journey**: Screen navigation, funnel analysis
- **Order Analytics**: Conversion rates, cart abandonment
- **Performance**: App crashes, load times, API response times
- **User Behavior**: Search queries, favorite items, review patterns

### Delivery Partner Analytics
- **Operational Metrics**: Delivery times, completion rates, earnings
- **Performance**: GPS accuracy, battery usage, app stability
- **Partner Behavior**: Online hours, order acceptance rates
- **Route Optimization**: Delivery route efficiency

### Crash Reporting
- **Error Tracking**: Real-time crash reporting
- **Performance Monitoring**: ANR detection, memory leaks
- **User Feedback**: In-app feedback and bug reporting

## 🧪 Testing

### Unit Testing
```bash
# Run unit tests
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Integration Testing
```bash
# E2E testing with Detox
npm run e2e:build
npm run e2e:test

# Component testing
npm run test:components
```

### Device Testing
```bash
# iOS Simulators
npm run ios -- --simulator="iPhone 15 Pro"

# Android Emulators
npm run android -- --deviceId="emulator-5554"

# Physical devices
npx react-native run-ios --device
npx react-native run-android --deviceId="DEVICE_ID"
```

## 🚀 Deployment

### Development Build
```bash
# Debug build
npm run build:debug

# Development release
npm run build:dev
```

### Production Build
```bash
# Android APK/AAB
cd android && ./gradlew assembleRelease
cd android && ./gradlew bundleRelease

# iOS Archive
xcodebuild -workspace ios/SmartOutletCustomer.xcworkspace -scheme SmartOutletCustomer archive
```

### App Store Deployment
```bash
# iOS App Store
npm run deploy:ios

# Google Play Store
npm run deploy:android

# Both platforms
npm run deploy:all
```

### CI/CD Pipeline
```yaml
# .github/workflows/mobile-deploy.yml
name: Mobile App Deployment
on:
  push:
    branches: [main]
    paths: ['mobile/**']

jobs:
  build-and-deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build iOS
        run: npm run build:ios
      - name: Build Android
        run: npm run build:android
      - name: Deploy to stores
        run: npm run deploy:all
```

## 📱 Features Deep Dive

### Customer App Features

#### **Order Management**
- Real-time order tracking with GPS
- Order history and reordering
- Multiple payment options
- Order customization and special instructions
- Group ordering capabilities

#### **Discovery & Search**
- Location-based restaurant discovery
- Advanced search with filters
- Category browsing
- Personalized recommendations
- Trending and popular items

#### **User Experience**
- Offline mode for browsing
- Dark mode support
- Multi-language support
- Accessibility features
- Voice search capability

### Delivery Partner Features

#### **Order Handling**
- Real-time order notifications
- Auto-assignment based on location
- Order acceptance/rejection
- Batch delivery optimization
- Customer communication

#### **Navigation & Tracking**
- Turn-by-turn GPS navigation
- Real-time location sharing
- Traffic-aware routing
- Offline maps support
- Route optimization

#### **Earnings & Analytics**
- Real-time earnings tracking
- Performance metrics
- Payout management
- Tax documentation
- Incentive tracking

## 🔧 Troubleshooting

### Common Issues

#### **Build Issues**
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clean builds
cd android && ./gradlew clean
cd ios && xcodebuild clean

# Reset Metro cache
npx react-native start --reset-cache
```

#### **Permission Issues**
```bash
# Android permissions
adb shell pm grant com.smartoutlet.customer android.permission.ACCESS_FINE_LOCATION

# iOS permissions - Reset simulator
xcrun simctl erase all
```

#### **Performance Issues**
```bash
# Enable Flipper debugging
npx react-native run-ios --configuration Debug

# Profile bundle size
npx react-native bundle --platform ios --analyze
```

### Debug Mode
```typescript
// Enable debug mode
import { enableDebugMode } from '@/utils/debug';

if (__DEV__) {
  enableDebugMode({
    logApiCalls: true,
    showPerformanceMetrics: true,
    enableReduxLogger: true
  });
}
```

## 📈 Performance Optimization

### Bundle Size Optimization
- **Code Splitting**: Dynamic imports for screens
- **Tree Shaking**: Remove unused dependencies
- **Image Optimization**: WebP format, lazy loading
- **Font Optimization**: Subset fonts, system fonts

### Memory Management
- **Image Caching**: Efficient image caching strategy
- **List Optimization**: VirtualizedList for large datasets
- **Memory Leaks**: Proper cleanup of listeners and timers
- **Background Processing**: Optimize background tasks

### Network Optimization
- **API Caching**: Smart caching strategies
- **Request Batching**: Batch multiple API calls
- **Offline Support**: Offline-first architecture
- **Connection Handling**: Graceful degradation

## 🔄 Updates & Maintenance

### Over-the-Air Updates
```typescript
// CodePush integration
import CodePush from 'react-native-code-push';

const App = () => {
  useEffect(() => {
    CodePush.sync({
      updateDialog: true,
      installMode: CodePush.InstallMode.IMMEDIATE
    });
  }, []);
};

export default CodePush(App);
```

### App Store Updates
- **Semantic Versioning**: Follow semver for releases
- **Release Notes**: Detailed changelog for each version
- **Gradual Rollout**: Phased deployment strategy
- **Rollback Plan**: Quick rollback for critical issues

## 📞 Support & Documentation

### Developer Resources
- **API Documentation**: `/docs/api`
- **Component Library**: `/docs/components`
- **Style Guide**: `/docs/style-guide`
- **Architecture Guide**: `/docs/architecture`

### Support Channels
- **Internal Issues**: GitHub Issues
- **Team Chat**: Slack #mobile-team
- **Documentation**: Confluence wiki
- **Code Reviews**: GitHub Pull Requests

---

**SmartOutlet Mobile Apps** - Delivering excellence in mobile food ordering and delivery management.

For more information, see individual app READMEs:
- [Customer App README](./customer-app/README.md)
- [Delivery Partner App README](./delivery-app/README.md)