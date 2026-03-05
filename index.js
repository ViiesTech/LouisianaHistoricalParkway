/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { name as appName } from './app.json';
import App from './App';

// Register background handler before AppRegistry.registerComponent
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('FCM background message', remoteMessage);

  // Try to show a notification in background using Notifee if available
  try {
    // Android only: ensure channel exists in background context
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'Louisiana1234',
        name: 'Louisiana',
        importance: 4,
      });
    }

    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId: 'Louisiana1234',
        smallIcon: 'ic_launcher',
      },
      ios: {
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });
  } catch (e) {
    // notifee may not be available in all execution contexts; ignore errors
    console.warn(
      'Notifee display failed in background handler',
      e?.message || e,
    );
  }
});

// Notifee background press handler: persist press data so app can navigate on resume
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.PRESS) return;
  try {
    console.log('Notifee background press (headless):', detail);
    const data = detail?.notification?.data || {};
    // persist minimal useful info
    await AsyncStorage.setItem('NOTIF_NAV', JSON.stringify({ screen: data.screen, data }));
  } catch (e) {
    console.warn('Failed to persist background notification press', e?.message || e);
  }
});

AppRegistry.registerComponent(appName, () => App);
