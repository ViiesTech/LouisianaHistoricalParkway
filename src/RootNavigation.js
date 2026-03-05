import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady && navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// wait until navigation is ready (poll), resolves when ready or rejects after timeout
export function waitForNavigationReady({ timeout = 5000, interval = 200 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      if (navigationRef.isReady && navigationRef.isReady()) {
        clearInterval(iv);
        resolve(true);
      } else if (Date.now() - start > timeout) {
        clearInterval(iv);
        reject(new Error('navigationRef not ready'));
      }
    }, interval);
  });
}

export default {
  navigationRef,
  navigate,
  waitForNavigationReady,
};
