import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import Back from 'react-native-vector-icons/Ionicons';
import {
  responsiveHeight,
  useCustomNavigation,
} from '../utils/helperFunctions';
import BoldText from './BoldText';
import LineBreak from './LineBreak';

const Container = ({
  gap,
  showBack,
  heading,
  children,
  showVerticalHorizontal = false,
  scrollEnabled,
  padding,
}) => {
  const { goBack } = useCustomNavigation();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={[
        styles.containerStyle,
        { padding: padding ? responsiveHeight(padding) : responsiveHeight(2) },
      ]}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={showVerticalHorizontal}
    >
      {showBack && (
        <TouchableOpacity onPress={() => goBack()}>
          <Back name={'chevron-back'} color={colors.black} size={30} />
        </TouchableOpacity>
      )}
      {gap && <LineBreak val={gap} />}
      {heading && <BoldText title={heading} />}
      {children}
    </ScrollView>
  );
};

export default Container;

const styles = StyleSheet.create({
  containerStyle: {
    flexGrow: 1,
  },
});
