import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GetStarted from '../screens/authScreens/GetStarted';
import LoginAsGuest from '../screens/authScreens/LoginAsGuest';
import Signin from '../screens/authScreens/Signin';
import Signup from '../screens/authScreens/Signup';

const Stack = createStackNavigator();
const Auth = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GetStarted"
    >
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="LoginAsGuest" component={LoginAsGuest} />
      <Stack.Screen name="SignIn" component={Signin} />
      <Stack.Screen name="SignUp" component={Signup} />
    </Stack.Navigator>
  );
};

export default Auth;
