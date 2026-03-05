import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import LineBreak from '../../components/LineBreak';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import NormalText from '../../components/NormalText';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/helperFunctions';
import SVGXml from '../../components/SvgIcon';
import { icons } from '../../icons';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';
import { useLoginMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';
import { ActivityIndicator } from 'react-native';
import { getFcmToken } from '../../GlobalFunctions/Firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import useSocialAuth from '../../hooks/useSocialAuth';
import {
  GOOGLE_ICON_SIZE,
  SOCIAL_BUTTON_HEIGHT,
} from '../../utils/socialButton';
const Signin = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });
  const {
    signInWithGoogleHandler,
    signInWithAppleHandler,
    googleBusy,
    appleBusy,
  } = useSocialAuth();
  const [fcmToken, setFcmToken] = useState();

  const onChangeText = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    // Configure Google Signin once on mount
    GoogleSignin.configure({
      // webClientId:
      //   '985993038096-pg0pmp2tdn6hpv9pij38arci06kpuc4p.apps.googleusercontent.com',
      webClientId:
        '347704860572-j2b44687me4rbmkn7p7hi3in5q5hj67n.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId:
        '347704860572-j1g1gm35vjqircc4p9o0as6tlfdo91mt.apps.googleusercontent.com', // add your iOS client ID here
      // iosClientId: '<YOUR_IOS_CLIENT_ID.apps.googleusercontent.com>', // optional: add if using iOS OAuth client
    });
  }, []);

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const newFcmToken = await getFcmToken();
        console.log('FCM Token:', newFcmToken);
        setFcmToken(newFcmToken);
      } catch (err) {
        console.error('Error fetching FCM token:', err);
      }
    };
    fetchFcmToken();
  }, []);
  const handleLogin = async () => {
    if (!form.email) {
      return ShowToast('error', 'Email cannot be empty');
    }
    if (!form.password) {
      return ShowToast('error', 'Password cannot be empty');
    }
    try {
      const payload = { email: form.email, password: form.password, fcmToken };
      const res = await login(payload).unwrap();
      ShowToast(res.success ? 'success' : 'error', res.message || '');
    } catch (error) {
      console.log('Login error:', error);
      ShowToast('error', error?.data?.message || 'Login failed');
    }
  };

  return (
    <Container gap={8} heading={'Welcome back!'} showBack={true}>
      <BoldText title="Glad to see you, again" />
      <LineBreak val={2.5} />
      <InputField
        keyboardType={'email-address'}
        placeholder={'Enter your email'}
        value={form.email}
        onChangeText={val => onChangeText('email', val)}
      />
      <LineBreak val={2.7} />
      <InputField
        showEye={true}
        showPassword={showPassword}
        onEyePress={() => setShowPassword(!showPassword)}
        placeholder={'Enter your password'}
        value={form.password}
        onChangeText={val => onChangeText('password', val)}
      />
      <LineBreak val={2.7} />
      <Button
        onPress={handleLogin}
        title={
          isLoading ? <ActivityIndicator color={colors.white} /> : 'Sign in'
        }
      />
      <LineBreak val={1.5} />
      <TouchableOpacity
        style={{ right: 5 }}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <NormalText
          color={colors.smallSideTxt}
          align={'right'}
          title="Forgot Password?"
        />
      </TouchableOpacity>
      <LineBreak val={2.7} />
      <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(2),
          }}
        >
          <View
            style={{
              height: responsiveHeight(0.25),
              backgroundColor: '#307C71',
              width: '30%',
            }}
          />
          <NormalText title="Or Login with" />
          <View
            style={{
              height: responsiveHeight(0.25),
              backgroundColor: '#307C71',
              width: '30%',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(1.5),
            marginTop:responsiveHeight(2),
            justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
          }}
        >
          {Platform.OS === 'ios' ? (
            <>
              <TouchableOpacity
                onPress={signInWithGoogleHandler}
                style={styles.iconsContainer}
              >
                {googleBusy ? (
                  <ActivityIndicator
                    size={GOOGLE_ICON_SIZE}
                    color={colors.theme2}
                  />
                ) : (
                  <SVGXml
                    icon={icons.google}
                    height={GOOGLE_ICON_SIZE}
                    width={GOOGLE_ICON_SIZE}
                  />
                )}
              </TouchableOpacity>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <AppleButton
                  style={{
                    width: '100%',
                    height: SOCIAL_BUTTON_HEIGHT,
                    borderRadius: 6,
                  }}
                  cornerRadius={6}
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  onPress={signInWithAppleHandler}
                />
              </View>
            </>
          ) : (
            <Pressable
              onPress={signInWithGoogleHandler}
              android_ripple={{ color: '#eee' }}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              {googleBusy ? (
                <ActivityIndicator size={20} color={colors.theme2} />
              ) : (
                <View style={styles.socialContent}>
                  <SVGXml icon={icons.google} height={20} width={20} />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
        <LineBreak val={5} />
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.2),
              alignSelf: 'center',
              color: colors.theme,
            }}
          >
            Don’t have an account?{' '}
            <NormalText color={colors.theme2} size={2.2} title="Register Now" />
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Signin;

const styles = StyleSheet.create({
  iconsContainer: {
    borderWidth: 1.5,
    borderColor: colors.theme,
    borderRadius: responsiveHeight(1),
    height: SOCIAL_BUTTON_HEIGHT,
    // width: '31%',
    flexGrow: 1,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenApple: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    opacity: 0,
  },
  socialSingle: {
    width: '62%',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: colors.theme,
    borderRadius: responsiveHeight(1),
    paddingVertical: responsiveHeight(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
  },
  socialButton: {
    width: '100%',
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
    borderRadius: responsiveHeight(1.2),
    paddingVertical: responsiveHeight(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  socialButtonPressed: {
    opacity: 0.9,
  },
  socialText: {
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.9),
    color: '#333',
    fontWeight: '600',
  },
});
