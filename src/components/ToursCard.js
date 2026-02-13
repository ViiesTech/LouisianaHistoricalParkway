/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';
import BoldText from './BoldText';
import LineBreak from './LineBreak';
import SmallContainer from './SmallContainer';
import { icons } from '../icons';
import colors from '../assets/colors';

const ToursCard = ({
  isTxt2 = true,
  bgColor,
  txtColor,
  icon2,
  width = 83,
  title = 'Bateaux Parisiens',
  subtitle = null,
  durationTitle = '3 hours',
  placesTitle = '25 places',
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: responsiveWidth(width),
        backgroundColor: colors.white,
        padding: responsiveHeight(2.5),
        paddingVertical: responsiveHeight(2.5),
        borderRadius: responsiveHeight(2.5),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <BoldText color="#363E44" size={2.7} title={title} />
      {isTxt2 && subtitle && (
        <BoldText color="#363E44" size={2.7} title={subtitle} />
      )}
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
          width={10}
          icon={icon2 ? icons.clock2 : icons.clock}
          title={durationTitle}
        />
        <SmallContainer
          txtColor={txtColor && txtColor}
          bgColor={bgColor && bgColor}
          width={10}
          icon={icon2 ? icons.locationPin2 : icons.loactionPin}
          title={placesTitle}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ToursCard;
