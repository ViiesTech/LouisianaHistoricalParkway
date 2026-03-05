import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

// Helper to perform Sign In With Apple and return a normalized result
export async function signInWithApple() {
  if (Platform.OS !== 'ios' || !appleAuth.isSupported) {
    throw new Error('Apple Sign-In is only supported on iOS devices');
  }

  // Perform the login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const {
    user,
    email,
    fullName,
    identityToken,
    authorizationCode,
  } = appleAuthRequestResponse;

  if (!identityToken) {
    throw new Error('Apple Sign-In failed: no identity token returned');
  }

  // Normalize full name
  const name = fullName
    ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ')
    : undefined;

  return {
    user,
    email,
    name,
    identityToken,
    authorizationCode,
  };
}

// Utility to check availability
export function isAppleAuthAvailable() {
  return Platform.OS === 'ios' && appleAuth.isSupported;
}
