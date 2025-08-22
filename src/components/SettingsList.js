/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import BoldText from './BoldText';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SettingsList = ({ leftTxt, rightTxt, iconName, Icon,showBorder=true }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveHeight(1),
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: colors.theme2,
          width: responsiveWidth(10),
          height: responsiveHeight(5),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: responsiveHeight(3),
        }}
      >
        <Icon color={colors.white} size={25} name={iconName} />
      </View>

      {/* 👇 Changed width:'100%' to flex:1 */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BoldText size={2.1} title={leftTxt} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {rightTxt ? (
              <BoldText size={2.2} title={rightTxt} />
            ) : null}
            <Ionicons name="chevron-forward" size={25} />
          </View>
        </View>
        {showBorder && (

          <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            top: 10,
            width: '100%',
          }}
          />
        )}
      </View>
    </View>
  );
};

export default SettingsList;
