/**
 * Memory Management Utility
 * Prevents app crashes by managing cache and memory usage
 */

import FastImage from 'react-native-fast-image';
import { AppState } from 'react-native';

// Track app state changes
let appStateSubscription: any = null;
let lastClearTime = Date.now();
const CLEAR_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Clear all image caches
 */
export const clearImageCaches = async () => {
  try {
    await FastImage.clearMemoryCache();
    await FastImage.clearDiskCache();
    console.log('✓ Image caches cleared');
  } catch (e) {
    console.error('Failed to clear image caches', e);
  }
};

/**
 * Clear caches if enough time has passed
 */
export const clearCachesIfNeeded = async () => {
  const now = Date.now();
  if (now - lastClearTime >= CLEAR_INTERVAL) {
    await clearImageCaches();
    lastClearTime = now;
  }
};

/**
 * Initialize memory management
 * Call this in App.tsx
 */
export const initMemoryManagement = () => {
  // Clear caches when app goes to background
  appStateSubscription = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'background') {
      clearImageCaches();
    }
  });

  // Periodic cleanup every 5 minutes
  const interval = setInterval(() => {
    clearCachesIfNeeded();
  }, CLEAR_INTERVAL);

  // Return cleanup function
  return () => {
    if (appStateSubscription) {
      appStateSubscription.remove();
    }
    clearInterval(interval);
  };
};

/**
 * Limit object size by removing oldest entries
 */
export const limitObjectSize = <T extends Record<string, any>>(
  obj: T,
  maxSize: number
): T => {
  const keys = Object.keys(obj);
  if (keys.length <= maxSize) return obj;

  // Keep only the last maxSize entries
  const keysToKeep = keys.slice(-maxSize);
  const limited: any = {};
  keysToKeep.forEach(key => {
    limited[key] = obj[key];
  });
  return limited as T;
};
