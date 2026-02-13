import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Container from '../../components/Container';
import LineBreak from '../../components/LineBreak';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import NormalText from '../../components/NormalText';
import colors from '../../assets/colors';
import { responsiveHeight } from '../../utils/helperFunctions';
import { useResetPasswordMutation } from '../../redux/services';
import { ShowToast } from '../../GlobalFunctions';

const ResetPassword = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { email } = route?.params || {};
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const passwordsMatch = password === confirm;
  const canSubmit = passwordsMatch;

  const handleSubmit = () => {
    if (!password) {
      return ShowToast('error', 'Password cannot be empty');
    } else if (!confirm) {
      ShowToast('error', 'Passwords must be same');
    } else if (!passwordsMatch) {
      return ShowToast('error', 'Passwords do not match');
    }
    resetPassword({ email, password, confirmPassword: confirm })
      .unwrap()
      .then(res => {
        ShowToast(res.success ? 'success' : 'error', res.message);
        if (res.success) {
          navigation.navigate('SignIn');
        }
      })
      .catch(err => {
        ShowToast('error', err?.data?.message || 'An error occurred');
        // handle error, show message
      });
  };

  return (
    <Container gap={25} heading={'Reset password'} showBack={true}>
      <LineBreak val={0.5} />
      <NormalText color={colors.theme} title="Enter your new password" />
      <LineBreak val={2.5} />

      <InputField
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
        showEye={true}
        showPassword={showPassword}
        onEyePress={() => setShowPassword(s => !s)}
      />
      <LineBreak val={2.7} />
      <InputField
        placeholder={'Confirm Password'}
        value={confirm}
        onChangeText={setConfirm}
        showEye={true}
        showPassword={showConfirm}
        onEyePress={() => setShowConfirm(s => !s)}
      />

      <LineBreak val={2.7} />
      <Button
        title={
          isLoading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            'Reset Password'
          )
        }
        onPress={handleSubmit}
      />
    </Container>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.6,
  },
});
