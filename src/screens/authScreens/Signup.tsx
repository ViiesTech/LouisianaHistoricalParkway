import React from 'react'
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


const Signup = ({ navigation }) => {
  return (
    <Container gap={8} heading={'Registration'} showBack={true}>
      <LineBreak val={2.5} />
      <InputField placeholder={'Username'} />
      <LineBreak val={2.7} />
      <InputField keyboardType={'email-address'} placeholder={'Email'} />
      <LineBreak val={2.7} />
      <InputField placeholder={'Password'} />
      <LineBreak val={2.7} />
      <InputField placeholder={'Confirm Password'} />
      <LineBreak val={2.7} />
      <Button onPress={()=>navigation.navigate('Main')} title={'Sign up'} />
      <LineBreak val={2.7} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
        <View style={{ height: responsiveHeight(0.25), backgroundColor: '#307C71', width: '30%' }} />
        <NormalText title="Or Sign up with" />
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
      <LineBreak val={2} />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={{ fontSize: responsiveFontSize(2.2), alignSelf: 'center', color: colors.theme }}>Already have an account? <NormalText color={colors.theme2} size={2.2} title="Sign In" /></Text>
      </TouchableOpacity>
    </Container>
  )
}

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
    alignItems: 'center'
  }
})