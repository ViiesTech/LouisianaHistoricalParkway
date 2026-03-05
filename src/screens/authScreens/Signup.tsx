import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import LineBreak from '../../components/LineBreak';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import NormalText from '../../components/NormalText';
import {
  ActivityIndicator,
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
import { useRegisterMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';
import { getFcmToken } from '../../GlobalFunctions/Firebase';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import useSocialAuth from '../../hooks/useSocialAuth';
import {
  GOOGLE_ICON_SIZE,
  SOCIAL_BUTTON_HEIGHT,
} from '../../utils/socialButton';

const Signup = ({ navigation, route }) => {
  const { interests } = route?.params || {};
  const [register, { isLoading }] = useRegisterMutation();
  const {
    signInWithGoogleHandler,
    signInWithAppleHandler,
    googleBusy,
    appleBusy,
  } = useSocialAuth();
  const [fcmToken, setFcmToken] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPass: '',
  });
  console.log('fcmToken====>>>>>>>', fcmToken);
  const onChangeText = (state: string, value: string) => {
    setForm(prevState => ({
      ...prevState,
      [state]: value,
    }));
  };
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

  const HandleRegisteration = async () => {
    if (!form.username) {
      return ShowToast('error', 'Username cannot be empty');
    } else if (!form.email) {
      return ShowToast('error', 'Email cannot be empty');
    } else if (!form.password) {
      return ShowToast('error', 'Password cannot be empty');
    } else if (!form.confirmPass) {
      return ShowToast('error', 'Re-enter your password');
    } else if (form.password !== form.confirmPass) {
      return ShowToast('error', 'Passwords do not match');
    }
    try {
      const userData = {
        username: form.username,
        email: form.email,
        password: form.password,
        fcmToken,
        ...(interests?.length > 0 && {
          personalization: interests,
        }),
      };
      await register(userData)
        .unwrap()
        .then(res => {
          console.log('ress', res);
          ShowToast(res.success ? 'success' : 'error', res.message);
        });
    } catch (error) {
      console.error('Registration error:', error);
      ShowToast(
        'error',
        error?.data?.message || 'Registration failed. Please try again.',
      );
    }
  };

  return (
    <Container gap={8} padding={3} heading={'Registration'} showBack={true}>
      <LineBreak val={2.5} />
      <InputField
        keyboardType={'default'}
        onChangeText={val => onChangeText('username', val)}
        placeholder={'Username'}
      />
      <LineBreak val={2.7} />
      <InputField
        keyboardType={'email-address'}
        onChangeText={val => onChangeText('email', val)}
        placeholder={'Email'}
      />
      <LineBreak val={2.7} />
      <InputField
        onChangeText={val => onChangeText('password', val)}
        placeholder={'Password'}
      />
      <LineBreak val={2.7} />
      <InputField
        onChangeText={val => onChangeText('confirmPass', val)}
        placeholder={'Confirm Password'}
      />
      <LineBreak val={2.7} />
      <Button
        onPress={HandleRegisteration}
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            'Sign up'
          )
        }
      />
      <LineBreak val={2.7} />

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
        <NormalText title="Or Sign up with" />
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
          marginTop: responsiveHeight(2),
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
            disabled={googleBusy}
            android_ripple={{ color: '#eee' }}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
          >
            <View style={styles.socialContent}>
              {googleBusy ? (
                <ActivityIndicator size="small" color={colors.theme2} />
              ) : (
                <>
                  <SVGXml icon={icons.google} height={20} width={20} />
                  <Text style={styles.socialText}>Continue with Google</Text>
                </>
              )}
            </View>
          </Pressable>
        )}
      </View>
      <LineBreak val={2} />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text
          style={{
            fontSize: responsiveFontSize(2.2),
            alignSelf: 'center',
            color: colors.theme,
          }}
        >
          Already have an account?{' '}
          <NormalText color={colors.theme2} size={2.2} title="Sign In" />
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Signup;

const styles = StyleSheet.create({
  iconsContainer: {
    borderWidth: 1.5,
    borderColor: colors.theme,
    borderRadius: responsiveHeight(1),
    // width: '31%',
    flexGrow: 1,
    height: SOCIAL_BUTTON_HEIGHT,
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
    marginTop: responsiveHeight(2),
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
