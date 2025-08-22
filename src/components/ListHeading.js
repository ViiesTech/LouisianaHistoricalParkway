/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import BoldText from './BoldText';
import NormalText from './NormalText';
import { responsiveHeight } from '../utils/helperFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ListHeading = ({ title, showSeeAll = true, onSeeAllPress, mrgnTop }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BoldText mrgnTop={mrgnTop ? mrgnTop : 0.6} size={3} title={title} />
      {showSeeAll ? (
        <TouchableOpacity
          onPress={onSeeAllPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(0.7),
          }}
        >
          <NormalText size={2.2} title="See all" />
          <Ionicons name="chevron-forward" size={25} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ListHeading;
