import React, { useState } from 'react';
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

const Signup = ({ navigation, route }) => {
  const { interests } = route?.params || {};
  const [register, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPass: '',
  });
  console.log('interests', interests);
  const onChangeText = (state: string, value: string) => {
    setForm(prevState => ({
      ...prevState,
      [state]: value,
    }));
  };

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
        }}
      >
        <TouchableOpacity style={styles.iconsContainer}>
          <SVGXml icon={icons.google} height={25} width={25} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconsContainer}>
          <SVGXml icon={icons.apple} height={25} width={25} />
        </TouchableOpacity>
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
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
