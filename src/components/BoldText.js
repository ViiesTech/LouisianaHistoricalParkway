import { Text } from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import fonts from '../assets/fonts';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../utils/helperFunctions';

const BoldText = ({ color, size, font, align, title, mrgnTop }) => {
  return (
    <Text
      style={{
        color: color || colors.black,
        // fontWeight: 'bold',
        marginTop: responsiveHeight(mrgnTop),
        fontFamily: font || fonts.Bold,
        fontSize: responsiveFontSize(size || 4),
        textAlign: align,
      }}
    >
      {title}
    </Text>
  );
};

export default BoldText;
