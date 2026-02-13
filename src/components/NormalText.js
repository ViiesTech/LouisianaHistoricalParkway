import { Text } from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/helperFunctions';
import colors from '../assets/colors';

const NormalText = ({
  title,
  color,
  size,
  align,
  font,
  width,
  numberOfLines,
  mrgnTop,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        color: color || colors.black,
        fontSize: responsiveFontSize(size || 2),
        textAlign: align,
        fontFamily: font,
        width: responsiveWidth(width),
        marginTop: responsiveHeight(mrgnTop),
      }}
    >
      {title}
    </Text>
  );
};

export default NormalText;
