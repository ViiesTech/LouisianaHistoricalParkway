/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import { responsiveHeight } from '../utils/helperFunctions';
import { useNavigation } from '@react-navigation/native';
import BoldText from './BoldText';
const Header = ({
  icon,
  children,
  padding,
  showRightIcon = true,
  title,
  rightTxt,
}) => {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          padding: responsiveHeight(2),
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: colors.white,
            padding: padding ? responsiveHeight(padding) : responsiveHeight(1),
            borderRadius: responsiveHeight(2.5),
          }}
        >
          <Ionicons name="chevron-back-outline" size={25} />
        </TouchableOpacity>
        {children ? (
          children // ✅ just render the children
        ) : showRightIcon ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#F7DB44',
              padding: responsiveHeight(0.9),
              borderRadius: responsiveHeight(2.5),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="heart-outline" size={25} color={colors.black} />
          </TouchableOpacity>
        ) : null}
      </View>
      {title && (
        <View
          style={{
            paddingHorizontal: responsiveHeight(2.2),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BoldText color="#363E44" title={title} />
          {rightTxt && (
            <BoldText title={rightTxt} color={colors.placeholderColor} />
          )}
        </View>
      )}
    </View>
  );
};

export default Header;
