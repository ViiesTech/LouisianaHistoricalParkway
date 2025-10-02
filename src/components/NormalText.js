import { Text } from 'react-native';
import React from 'react';
import { responsiveFontSize, responsiveWidth } from '../utils/helperFunctions';
import colors from '../assets/colors';

const NormalText = ({ title, color, size, align, font, width,numberOfLines }) => {
  return (
    <Text
    numberOfLines={numberOfLines}
      style={{
        color: color || colors.black,
        fontSize: responsiveFontSize(size || 2),
        textAlign: align,
        fontFamily: font,
        width: responsiveWidth(width),
      }}
    >
      {title}
    </Text>
  );
};

export default NormalText;
