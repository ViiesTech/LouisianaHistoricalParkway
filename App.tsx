/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { SafeAreaView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { initMemoryManagement } from './src/utils/memoryManager';
import messaging from '@react-native-firebase/messaging';
import { setupNotificationListeners } from './src/GlobalFunctions/NotificationService';
import {
  navigationRef,
  navigate,
  waitForNavigationReady,
} from './src/RootNavigation';
import {
  NOTIF_NAV_KEY,
  isValidScreen,
} from './src/GlobalFunctions/notificationConfig';
import { getFcmToken } from './src/GlobalFunctions/Firebase';

const App = () => {
  useEffect(() => {
    // hide nav bar when app loads
    SystemNavigationBar.stickyImmersive();

    // Initialize memory management to prevent crashes
    const cleanup = initMemoryManagement();

    // Foreground notification handling
    const unsubscribeForeground = setupNotificationListeners();

    // Ensure we have a token (requests permissions on iOS if needed)
    getFcmToken().then(token => {
      if (token) console.log('FCM token:', token);
    });

    // Handle notification opened when app in background
    const openedUnsub = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'Notification opened from background state:',
          remoteMessage,
        );
        if (!remoteMessage) return;
        try {
          const screenFromData = remoteMessage.data?.screen;
          const targetScreen = isValidScreen(screenFromData)
            ? screenFromData
            : 'Notification';
          await waitForNavigationReady({ timeout: 3000 });
          navigate('Main', { screen: targetScreen, params: { remoteMessage } });
        } catch (e) {
          console.warn(
            'Failed to navigate from background notification:',
            e?.message || e,
          );
        }
      },
    );

    // Handle notification that opened the app from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (!remoteMessage) return;
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        try {
          const screenFromData = remoteMessage.data?.screen;
          const targetScreen = isValidScreen(screenFromData)
            ? screenFromData
            : 'Notification';
          await waitForNavigationReady({ timeout: 5000 });
          navigate('Main', { screen: targetScreen, params: { remoteMessage } });
        } catch (e) {
          console.warn(
            'Failed to navigate from initial FCM notification:',
            e?.message || e,
          );
        }
      });

    // If a Notifee background press wrote navigation intent to storage, navigate once Navigation is ready
    const checkStoredNav = async () => {
      try {
        const raw = await AsyncStorage.getItem(NOTIF_NAV_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        const screenFromData = data.screen;
        const targetScreen = isValidScreen(screenFromData)
          ? screenFromData
          : 'Notification';

        await waitForNavigationReady({ timeout: 5000 });
        navigate('Main', { screen: targetScreen, params: { data } });
        await AsyncStorage.removeItem(NOTIF_NAV_KEY);
      } catch (e) {
        console.warn('checkStoredNav failed', e?.message || e);
      }
    };
    checkStoredNav();

    return () => {
      unsubscribeForeground && unsubscribeForeground();
      openedUnsub && openedUnsub();
      return cleanup;
    };
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer ref={navigationRef}>
            <Routes />
            {/* <View>
              <Text>fdsfsd</Text>
            </View> */}
          </NavigationContainer>
          <Toast position="top" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
//
