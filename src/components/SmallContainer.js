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
  disabled = true,
  iconSize = 20,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePress}
      style={{
        justifyContent: 'center',
        width: width ? responsiveWidth(width) : responsiveHeight(7),
        height: width ? responsiveWidth(width) : responsiveHeight(7),
        alignItems: 'center',
        backgroundColor: bgColor ? bgColor : colors.smallIconsBg,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.5,
        // elevation: 4,
      }}
    >
      <SVGXml icon={icon} height={iconSize} width={iconSize} />
      {/* <NormalText
        numberOfLines={1}
        size={txtSize}
        title={title}
        color={txtColor ? txtColor : colors.white}
      /> */}
    </TouchableOpacity>
  );
};

export default SmallContainer;
