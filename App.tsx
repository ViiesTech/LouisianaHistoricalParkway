/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import { SafeAreaView } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { initMemoryManagement } from './src/utils/memoryManager';

const App = () => {
  useEffect(() => {
    // hide nav bar when app loads
    SystemNavigationBar.stickyImmersive();
    
    // Initialize memory management to prevent crashes
    const cleanup = initMemoryManagement();
    
    return cleanup;
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
          <Toast position="top" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
