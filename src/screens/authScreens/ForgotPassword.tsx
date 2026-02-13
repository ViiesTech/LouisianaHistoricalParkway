import React, { useState } from 'react';
import Container from '../../components/Container';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import LineBreak from '../../components/LineBreak';
import NormalText from '../../components/NormalText';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import colors from '../../assets/colors';
import { useForgotPasswordMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const ForgotPasswordHandler = async () => {
    if (!email) {
      return ShowToast('error', 'Email cannot be empty');
    }
    forgotPassword({ email })
      .unwrap()
      .then(res => {
        ShowToast(res.success ? 'success' : 'error', res.message);
        if (res.success) {
          navigation.navigate('Otp', { email });
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
  return (
    <Container gap={30} heading={'Forgot password?'} showBack={true}>
      <LineBreak val={0.5} />
      <NormalText
        color={colors.theme}
        title="We will send you a recovery link"
      />
      <LineBreak val={2.5} />
      <InputField
        keyboardType={'email-address'}
        placeholder={'Enter your email'}
        value={email}
        onChangeText={setEmail}
      />
      <LineBreak val={2.7} />
      <Button
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            'Send email'
          )
        }
        onPress={ForgotPasswordHandler}
      />
      <LineBreak val={1.2} />

      <TouchableOpacity style={{ right: 5 }}>
        <NormalText
          color={colors.smallSideTxt}
          align={'right'}
          title="Resend: 59 seconds left"
        />
      </TouchableOpacity>
    </Container>
  );
};

export default ForgotPassword;
