import { useCallback, useEffect, useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { ShowToast } from '../GlobalFunctions';
import { getFcmToken } from '../GlobalFunctions/Firebase';
import {
  signInWithApple,
  isAppleAuthAvailable,
} from '../GlobalFunctions/AppleAuth';
import {
  useGoogleLoginMutation,
  useAppleLoginMutation,
} from '../redux/services';

export default function useSocialAuth() {
  const [googleLogin, { isLoading: googleLoading }] = useGoogleLoginMutation();
  const [appleLogin, { isLoading: appleLoading }] = useAppleLoginMutation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [googleSigning, setGoogleSigning] = useState(false);
  const [appleSigning, setAppleSigning] = useState(false);

  const signInWithGoogleHandler = useCallback(async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setGoogleSigning(true);
    try {
      // ensure GoogleSignin is configured (webClientId / iosClientId)
      // configure will be a no-op if already configured
      try {
        GoogleSignin.configure({
          webClientId:
            '347704860572-j2b44687me4rbmkn7p7hi3in5q5hj67n.apps.googleusercontent.com',
          offlineAccess: true,
          iosClientId:
            '347704860572-j1g1gm35vjqircc4p9o0as6tlfdo91mt.apps.googleusercontent.com',
        });
      } catch (cfgErr) {
        // ignore configure errors
        console.warn('GoogleSignin.configure warning:', cfgErr);
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // ignore
      }

      let userInfo;
      try {
        userInfo = await GoogleSignin.signIn();
      } catch (signInErr) {
        // If user cancelled the Google modal, show a friendly message and return
        if (signInErr?.code === statusCodes.SIGN_IN_CANCELLED) {
          ShowToast('error', 'Google sign-in was cancelled');
          return;
        }
        throw signInErr;
      }
      if (!userInfo) {
        // user cancelled
        return;
      }
      console.log(
        'Google sign-in raw response:',
        JSON.stringify(userInfo, null, 2),
      );
      // idToken may be located at different keys depending on platform/version
      const idToken =
        userInfo?.idToken ||
        userInfo?.data?.idToken ||
        userInfo?.authentication?.idToken;
      console.log(
        'Google selected token value (idToken/serverAuthCode/authentication.idToken):',
        idToken,
      );
      if (!idToken) {
        ShowToast(
          'error',
          'Google did not return authentication token. Please try again.',
        );
        throw new Error('Google did not return idToken');
      }

      const fcmToken = await getFcmToken();
      const payload = { idToken, fcmToken };
      if (payload) {
        const response = await googleLogin(payload).unwrap();
        console.log('ressssssssssssss',response)
        ShowToast(
          response.success ? 'success' : 'error',
          response.message || '',
        );
        return response;
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // friendly messages for common Google Sign-In errors
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        ShowToast('error', 'Google sign-in was cancelled');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        ShowToast('error', 'Google sign-in already in progress');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        ShowToast('error', 'Google Play Services not available or outdated');
      } else if (error?.data?.message) {
        ShowToast('error', error.data.message);
      } else {
        ShowToast('error', error?.message || 'Google sign-in error');
      }
      throw error;
    } finally {
      setGoogleSigning(false);
      setIsSigningIn(false);
    }
  }, [googleLogin, isSigningIn]);

  const signInWithAppleHandler = useCallback(async () => {
    if (!isAppleAuthAvailable()) {
      ShowToast('error', 'Apple Sign-In is not available on this device');
      return;
    }
    if (isSigningIn) return;
    setIsSigningIn(true);
    setAppleSigning(true);

    try {
      const res = await signInWithApple();
      const identityToken = res.identityToken;
      if (!identityToken)
        throw new Error('Apple did not return identity token');

      // include name only if provided by Apple
      const name = res.name;
      const fcmToken = await getFcmToken();

      const payload = name
        ? { identityToken, name, fcmToken }
        : { identityToken, fcmToken };

      const response = await appleLogin(payload).unwrap();
      ShowToast(response.success ? 'success' : 'error', response.message || '');
      return response;
    } catch (e) {
      console.error('Apple Sign-In error:', e);
      // detect cancellation or user dismissal
      const msg = e?.message || '';
      if (
        msg.toLowerCase().includes('cancel') ||
        msg.toLowerCase().includes('user canceled')
      ) {
        ShowToast('error', 'Apple sign-in was cancelled');
      } else if (e?.data?.message) {
        ShowToast('error', e.data.message);
      } else {
        ShowToast('error', msg || 'Apple sign-in failed');
      }
      throw e;
    } finally {
      setAppleSigning(false);
      setIsSigningIn(false);
    }
  }, [appleLogin, isSigningIn]);

  return {
    signInWithGoogleHandler,
    signInWithAppleHandler,
    googleLoading,
    appleLoading,
    googleBusy: googleSigning || googleLoading,
    appleBusy: appleSigning || appleLoading,
  };
}
