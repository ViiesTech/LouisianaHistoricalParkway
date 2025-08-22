import React, { useState } from 'react'
import Container from '../../components/Container';
import LineBreak from '../../components/LineBreak';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import NormalText from '../../components/NormalText';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import SVGXml from '../../components/SvgIcon';
import { icons } from '../../icons';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';


const Signin = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container gap={8}
      heading={'Welcome back!'}
      showBack={true}>
      <BoldText title="Glad to see you, again" />
      <LineBreak val={2.5} />
      <InputField keyboardType={'email-address'} placeholder={'Enter your email'} />
      <LineBreak val={2.7} />
      <InputField showEye={true} showPassword={showPassword} onEyePress={() => setShowPassword(!showPassword)} placeholder={'Enter your password'} />
      <LineBreak val={2.7} />
      <Button onPress={()=>navigation.navigate('Main')} title={'Sign in'} />
      <LineBreak val={1.5} />
      <TouchableOpacity style={{right:5}} onPress={() => navigation.navigate('ForgotPassword')}>
        <NormalText color={colors.smallSideTxt} align={'right'} title="Forgot Password?" />
      </TouchableOpacity>
      <LineBreak val={2.7} />
      <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
          <View style={{ height: responsiveHeight(0.25), backgroundColor: '#307C71', width: '30%' }} />
          <NormalText title="Or Login with" />
          <View style={{ height: responsiveHeight(0.25), backgroundColor: '#307C71', width: '30%' }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
          <TouchableOpacity style={styles.iconsContainer}>
            <SVGXml icon={icons.facebook} height={25} width={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconsContainer}>
            <SVGXml icon={icons.google} height={25} width={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconsContainer}>
            <SVGXml icon={icons.apple} height={25} width={25} />
          </TouchableOpacity>
        </View>
        <LineBreak val={5} />
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ fontSize: responsiveFontSize(2.2), alignSelf: 'center', color: colors.theme }}>Don’t have an account? <NormalText color={colors.theme2} size={2.2} title="Register Now" /></Text>
        </TouchableOpacity>
      </View>
    </Container>
  )
}

export default Signin;

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
    alignItems: 'center'
  }
})