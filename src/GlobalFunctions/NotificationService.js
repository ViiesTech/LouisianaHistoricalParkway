import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
  navigate,
  navigationRef,
  waitForNavigationReady,
} from '../RootNavigation';
import { NOTIF_NAV_KEY, isValidScreen } from './notificationConfig';

// 🔹 Android channel only
async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'Louisiana1234',
      name: 'Louisiana',
      importance: AndroidImportance.HIGH,
    });
  }
}

// 🔹 Permissions (Android + iOS)
async function requestUserPermission() {
  await notifee.requestPermission(); // 🔥 REQUIRED FOR iOS

  // Ensure device is registered for remote messages on iOS
  if (Platform.OS === 'ios') {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.warn('registerDeviceForRemoteMessages failed', e?.message || e);
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔔 Notification permission granted');
  }
}

// 🔹 Main listener
export function setupNotificationListeners() {
  createDefaultChannel();
  requestUserPermission();
  // foreground FCM message handler (shows a Notifee notification)
  const messageUnsub = messaging().onMessage(async remoteMessage => {
    console.log('📩 FCM Message (foreground):', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      data: remoteMessage?.data || {},

      android: {
        channelId: 'Louisiana1234',
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },

      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  });

  // Notifee foreground press handler
  const notifeeUnsub = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('🔔 Notifee press (foreground):', detail);
      const screenFromData = detail.notification?.data?.screen;
      const targetScreen = screenFromData || 'Notification';
      // route into the Main navigator and open target screen
      navigate('Main', {
        screen: targetScreen,
        params: {
          data: detail.notification?.data,
          notification: detail.notification,
        },
      });
    }
  });

  // If the app was opened from a Notifee notification (cold start)
  notifee.getInitialNotification().then(async initial => {
    if (!initial) return;
    try {
      console.log('🔔 Notifee initial notification (cold start):', initial);
      const data = initial.notification?.data || {};
      const screenFromData = data.screen;
      const targetScreen = isValidScreen(screenFromData)
        ? screenFromData
        : 'Notification';

      // wait for navigation readiness with timeout
      await waitForNavigationReady({ timeout: 5000 });
      navigate('Main', {
        screen: targetScreen,
        params: { data, notification: initial.notification },
      });
    } catch (e) {
      console.warn(
        'Failed to navigate from initial Notifee notification:',
        e?.message || e,
      );
    }
  });

  // return cleanup function used by App.tsx
  return () => {
    try {
      messageUnsub && messageUnsub();
    } catch (e) {}
    try {
      notifeeUnsub && notifeeUnsub();
    } catch (e) {}
  };
}
