import React, { useEffect } from 'react';
import { StatusBar, Platform, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';

import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { requestPermissions } from './src/utils/permissions';
import { initializeApp } from './src/utils/appInitializer';
import { navigationRef } from './src/navigation/NavigationService';
import ErrorBoundary from './src/components/ErrorBoundary';
import NetworkListener from './src/components/NetworkListener';
import PushNotificationHandler from './src/components/PushNotificationHandler';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
]);

// Enable screens for better performance
enableScreens();

const App: React.FC = () => {
  useEffect(() => {
    initializeApp();
    requestPermissions();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer ref={navigationRef}>
              <StatusBar
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                backgroundColor="#FF6B35"
                translucent={false}
              />
              <NetworkListener />
              <PushNotificationHandler />
              <RootNavigator />
              <Toast />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;