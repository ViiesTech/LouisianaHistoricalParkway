import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Container';
import LineBreak from '../../components/LineBreak';
import NormalText from '../../components/NormalText';
import Button from '../../components/Button';
import colors from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/helperFunctions';
import {
  useForgotPasswordMutation,
  useVerifyForgotPassMutation,
} from '../../redux/services';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { ShowToast } from '../../GlobalFunctions';

const OTP_LENGTH = 4;

const maskRecipient = value => {
  if (!value || typeof value !== 'string') return '';
  const atIndex = value.indexOf('@');
  if (atIndex > 1) {
    const name = value.slice(0, atIndex);
    const domain = value.slice(atIndex);
    return `${name[0]}***${name[name.length - 1]}${domain}`;
  }
  if (value.length > 4) {
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
  }
  return value;
};

const Otp = ({ navigation, route }) => {
  const [value, setValue] = useState('');
  const refBlur = useBlurOnFulfill({ value, cellCount: OTP_LENGTH });
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { email } = route?.params || {};
  const [verifyForgotPass, { isLoading }] = useVerifyForgotPassMutation();
  const [forgotPassword, { isLoading: resendLoading }] =
    useForgotPasswordMutation();
  console.log('otp value', value);

  const VerifyPasswordHandler = async () => {
    if(!value){
      return ShowToast('error', 'OTP cannot be empty');
    }else if(value.length < 4){
      return ShowToast('error', 'OTP must be 4 digits');
    }
    verifyForgotPass({ email, otp: value })
      .unwrap()
      .then(res => {
        ShowToast(res.success ? 'success' : 'error', res.message);
        if (res.success) {
          navigation.navigate('ResetPassword', { email });
        }
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
        ShowToast(
          'error',
          err?.data?.message || 'Something went wrong. Please try again.',
        );
      });
  };
  const ResendCodeHandler = async () => {
    forgotPassword({ email })
      .unwrap()
      .then(res => {
        ShowToast(res.success ? 'success' : 'error', res.message);
        // if (res.success) {
        //   navigation.navigate('Otp', { email });
        // }
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
        ShowToast(
          'error',
          err?.data?.message || 'Something went wrong. Please try again.',
        );
      });
  };
  const recipientText = useMemo(() => {
    const recipient = route?.params?.recipient;
    const masked = maskRecipient(recipient);
    return masked
      ? `We sent a code to ${masked}`
      : 'Enter the verification code we sent you';
  }, [route?.params?.recipient]);

  // value and setValue handle the OTP string; library helpers manage focus/paste

  return (
    <Container gap={30} heading={'OTP Verification'} showBack={true}>
      <NormalText color={colors.theme} title={recipientText} />
      <LineBreak val={2.5} />
      <CodeField
        ref={refBlur}
        {...cellProps}
        value={value}
        onChangeText={setValue}
        cellCount={OTP_LENGTH}
        rootStyle={styles.otpRow}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={[styles.otpInput, symbol ? styles.otpInputActive : null]}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <LineBreak val={2.7} />
      <Button
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            'Verify'
          )
        }
        onPress={VerifyPasswordHandler}
      />
      <LineBreak val={1.2} />
      <TouchableOpacity style={{ right: 5 }} onPress={ResendCodeHandler}>
        <NormalText
          color={colors.smallSideTxt}
          align={'right'}
          title={resendLoading ? 'Resending...' : 'Resend code'}
        />
      </TouchableOpacity>
    </Container>
  );
};

export default Otp;

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsiveWidth(3),
  },
  otpInput: {
    width: responsiveWidth(18),
    height: responsiveHeight(8),
    backgroundColor: colors.inputColor,
    borderRadius: 12,
    fontSize: responsiveFontSize(2.5),
    color: colors.black,
    textAlign: 'center',
    lineHeight: responsiveHeight(8),
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  otpInputActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white2,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
