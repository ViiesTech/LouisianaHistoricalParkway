/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import SVGXml from './SvgIcon';
import { icons } from '../icons';
import colors from '../assets/colors';
import NormalText from './NormalText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/helperFunctions';

const SmallContainer = ({
  icon,
  title,
  width,
  bgColor,
  txtColor,
  handlePress,
  txtSize = 2,
  gap = 1.2,
  paddingVertical = 1.1,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: width ? responsiveWidth(width) : responsiveWidth(30),
        alignItems: 'center',
        backgroundColor: bgColor ? bgColor : colors.smallIconsBg,
        padding: responsiveHeight(0.5),
        paddingHorizontal: responsiveHeight(2),
        paddingVertical: responsiveHeight(paddingVertical),
        gap: responsiveHeight(gap),
        borderRadius: responsiveHeight(2.5),
      }}
    >
      <SVGXml icon={icon} height={20} width={20} />
      <NormalText
        size={txtSize}
        title={title}
        color={txtColor ? txtColor : colors.white}
      />
    </TouchableOpacity>
  );
};

export default SmallContainer;
