import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import Back from 'react-native-vector-icons/Ionicons'
import { responsiveHeight, useCustomNavigation } from '../utils/helperFunctions';
import BoldText from './BoldText';
import LineBreak from './LineBreak';

const Container = ({ gap,showBack,heading, children, showVerticalHorizontal, scrollEnabled }) => {

  const {goBack} = useCustomNavigation()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={styles.containerStyle}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={showVerticalHorizontal}
    >
     {showBack && 
     <TouchableOpacity onPress={() => goBack()}>
      <Back name={'chevron-back'} color={colors.black} size={30} />
      </TouchableOpacity>
      }
      <LineBreak val={gap} />
      <BoldText title={heading} />
      {children}
    </ScrollView>
  );
};

export default Container;

const styles = StyleSheet.create({
  containerStyle:{
    padding: responsiveHeight(2)
  }
});
