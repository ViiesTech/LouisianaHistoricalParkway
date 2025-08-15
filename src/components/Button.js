import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import BoldText from './BoldText';
import colors from '../assets/colors';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';

const Button = ({
  title,
  style,
  backgroundColor,
  buttonWidth,
  borderRadius,
  borderWidth,
  borderColor,
  align,
  buttonTextColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonStyle,
        {
          borderRadius: borderRadius || 10,
          width: responsiveWidth(buttonWidth || 90),
          borderWidth: borderWidth,
          borderColor: borderColor,
          alignSelf: align || 'center',
          backgroundColor: backgroundColor || colors.primary
        },
        style,
      ]}
    >
      <BoldText size={2} color={buttonTextColor || colors.white} title={title} />
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonStyle: {
    padding: responsiveHeight(2),
    alignItems: 'center',
  },
});
