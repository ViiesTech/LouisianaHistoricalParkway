/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import SVGXml from './SvgIcon';
import { icons } from '../icons';
import colors from '../assets/colors';
import NormalText from './NormalText';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';

const SmallContainer = ({ icon, title, width, bgColor,txtColor }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        width: width ? responsiveWidth(width) : responsiveWidth(30),
        alignItems: 'center',
        backgroundColor: bgColor ? bgColor : colors.smallIconsBg,
        padding: responsiveHeight(0.5),
        paddingHorizontal: responsiveHeight(2),
        paddingVertical: responsiveHeight(1.1),
        gap: responsiveHeight(1.2),
        borderRadius: responsiveHeight(2.5),
      }}
    >
      <SVGXml icon={icon} height={20} width={20} />
      <NormalText title={title} color={txtColor ? txtColor : colors.white} />
    </View>
  );
};

export default SmallContainer;
