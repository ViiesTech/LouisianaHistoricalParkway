import React, { useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, Animated } from 'react-native';
import { images } from '../../assets/images';
import colors from '../../assets/colors';
import { responsiveHeight, useCustomNavigation } from '../../utils/helperFunctions';
import BoldText from '../../components/BoldText';
import NormalText from '../../components/NormalText';
import LineBreak from '../../components/LineBreak';
import Button from '../../components/Button';

const GetStarted = ({ navigation }) => {

  const heightAnim = useRef(new Animated.Value(responsiveHeight(10))).current;
  const paddingAnim = useRef(new Animated.Value(responsiveHeight(1))).current;
  const { navigateToRoute } = useCustomNavigation()

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: responsiveHeight(50),
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(paddingAnim, {
        toValue: responsiveHeight(4),
        duration: 800,
        useNativeDriver: false,
      })
    ]).start();
  }, []);


  return (
    <ImageBackground
      resizeMode='cover'
      style={styles.background}
      source={images.homeBg}
    >
      <Animated.View style={[styles.whiteBackground, { height: heightAnim, paddingVertical: paddingAnim }]}>
        <BoldText title={'Louisiana Historical Parkway'} />
        <LineBreak val={1.5} />
        <NormalText title={'Bookmark, find and love spots from all around the world and create memories to last a lifetime.'} />
        <LineBreak val={4} />
        <Button onPress={() => navigation.navigate('SignUp')} title={'Get Started'} />
        <LineBreak val={1.9} />
        <Button onPress={() => navigateToRoute('LoginAsGuest')} buttonTextColor={colors.primary} backgroundColor={'transparent'} borderWidth={1.5} borderColor={colors.primary} title={'Continue as Guest'} />
      </Animated.View>
    </ImageBackground>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  whiteBackground: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 15,
    paddingHorizontal: responsiveHeight(3),
    paddingVertical: responsiveHeight(4),
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  }
});
