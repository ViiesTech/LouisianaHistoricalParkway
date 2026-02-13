import React, { useState } from 'react';
import Container from '../../components/Container';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import LineBreak from '../../components/LineBreak';
import { useLoginAsGuestMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';
import { ActivityIndicator } from 'react-native';
import colors from '../../assets/colors';

const LoginAsGuest = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loginAsGuest, { isLoading }] = useLoginAsGuestMutation();
  console.log('email', email);
  const LoginAsGuestHandler = async () => {
    if(!email){
      return ShowToast('error', 'Email cannot be empty');
    }
    loginAsGuest({email})
      .unwrap()
      .then(res => {
        console.log('res', res);
        ShowToast(res.success ? 'success' : 'error', res.message);
      })
      .catch(err => {
        ShowToast('error', err?.error || 'Login failed. Please try again.');
        console.log('err', err);
      });
    // Implement guest login logic here
  };
  return (
    <Container gap={30} heading={'Login As Guest'} showBack={true}>
      <LineBreak val={2.5} />
      <InputField
        value={email}
        onChangeText={val => setEmail(val)}
        keyboardType={'email-address'}
        placeholder={'Enter your email'}
      />
      <LineBreak val={2.7} />
      <Button
        onPress={LoginAsGuestHandler}
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            'Login'
          )
        }
      />
    </Container>
  );
};

export default LoginAsGuest;
