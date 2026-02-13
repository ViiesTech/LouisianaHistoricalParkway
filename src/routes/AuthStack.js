import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GetStarted from '../screens/authScreens/GetStarted';
import LoginAsGuest from '../screens/authScreens/LoginAsGuest';
import Signin from '../screens/authScreens/Signin';
import Signup from '../screens/authScreens/Signup';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import ResetPassword from '../screens/authScreens/ResetPassword';
import Otp from '../screens/authScreens/Otp';
import ChooseInterest from '../screens/authScreens/ChooseInterest';

const Stack = createStackNavigator();
const Auth = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GetStarted"
    >
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="LoginAsGuest" component={LoginAsGuest} />
      <Stack.Screen name="ChooseInterest" component={ChooseInterest} />
      <Stack.Screen name="SignIn" component={Signin} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="SignUp" component={Signup} />
    </Stack.Navigator>
  );
};

export default Auth;
