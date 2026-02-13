/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import colors from '../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/helperFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
const InputField = ({
  value,
  placeholder,
  onChangeText,
  keyboardType,
  onEyePress,
  showPassword = true,
  showEye = false,
  mrgnLeft,
  showSearch = false,
  width,
  placeHolderColor,
}) => {
  return (
    <View style={[styles.inputStyle, { width: responsiveWidth(width) }]}>
      <TextInput
        secureTextEntry={!showPassword}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={[styles.input, { marginLeft: responsiveHeight(mrgnLeft) }]}
        placeholderTextColor={
          placeHolderColor ? placeHolderColor : colors.black
        }
        placeholder={placeholder}
      />
      {showEye ? (
        <TouchableOpacity
          onPress={onEyePress}
          style={{
            position: 'absolute',
            right: 5,
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={25}
            color={colors.placeholderColor}
          />
        </TouchableOpacity>
      ) : null}
      {showSearch ? (
        <View style={{ position: 'absolute', left: 20 }}>
          <Ionicons name="search" color={colors.placeholderColor} size={25} />
        </View>
      ) : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: colors.inputColor,
    borderRadius: 15,
    paddingHorizontal: responsiveHeight(2),
    height: responsiveHeight(8),
    justifyContent: 'center',
    // paddingVertical: responsiveHeight(1.5),
  },
  input: {
    fontSize: responsiveFontSize(1.9),
    color: colors.black,
  },
});
