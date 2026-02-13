/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import { responsiveHeight } from '../utils/helperFunctions';
import { useNavigation } from '@react-navigation/native';
import BoldText from './BoldText';
import AddToFavrt from './AddToFavrt';
const Header = ({
  icon,
  children,
  padding = 1,
  containerPadding = 2,
  showRightIcon = true,
  title,
  rightTxt,
  cityId,
  pVertical = 1,
  iconOnly = true,
  isProcessing = false,
  onProcessingChange,
}) => {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          padding: responsiveHeight(containerPadding),
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {iconOnly ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={25} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.white,
              paddingTop: responsiveHeight(padding),
              paddingVertical: responsiveHeight(pVertical),
              paddingHorizontal: responsiveHeight(padding),
              borderRadius: responsiveHeight(2.5),
            }}
          >
            <Ionicons name="chevron-back-outline" size={25} />
          </TouchableOpacity>
        )}
        {children ? (
          children // ✅ just render the children
        ) : showRightIcon ? (
          <AddToFavrt 
            cityId={cityId} 
            isProcessing={isProcessing}
            onProcessingChange={onProcessingChange}
          />
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
          <BoldText
            size={3}
            width={50}
            numberOfLines={2}
            color="#363E44"
            title={title}
          />
          {rightTxt && (
            <BoldText
              size={3}
              title={rightTxt}
              color={colors.placeholderColor}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Header;
