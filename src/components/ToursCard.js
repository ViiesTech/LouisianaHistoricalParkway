/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';
import BoldText from './BoldText';
import LineBreak from './LineBreak';
import SmallContainer from './SmallContainer';
import { icons } from '../icons';
import colors from '../assets/colors';

const ToursCard = ({ isTxt2 = true, bgColor, txtColor, icon2,width = 83 }) => {
  return (
    <TouchableOpacity
      style={{
        width: responsiveWidth(width),
        backgroundColor: colors.white2,
        padding: responsiveHeight(2),
        paddingVertical: responsiveHeight(2.5),
        borderRadius: responsiveHeight(2),
      }}
    >
      <BoldText color="#363E44" size={2.7} title="Bateaux Parisiens" />
      {isTxt2 && <BoldText color="#363E44" size={2.7} title="Seine River" />}
      <LineBreak val={2} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: responsiveHeight(0.8),
        }}
      >
        <SmallContainer
          txtColor={txtColor && txtColor}
          bgColor={bgColor && bgColor}
          width={25}
          icon={icon2 ? icons.clock2 : icons.clock}
          title="3 hours"
        />
        <SmallContainer
          txtColor={txtColor && txtColor}
          bgColor={bgColor && bgColor}
          width={30}
          icon={icon2 ? icons.locationPin2 : icons.loactionPin}
          title="25 places"
        />
        <SmallContainer
          txtColor={txtColor && txtColor}
          bgColor={bgColor && bgColor}
          width={17}
          icon={icon2 ? icons.dollar2 : icons.dollar}
          title="25"
        />
      </View>
    </TouchableOpacity>
  );
};

export default ToursCard;
