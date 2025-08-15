import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import colors from '../assets/colors'
import { responsiveFontSize, responsiveHeight } from '../utils/helperFunctions'

const InputField = ({value,placeholder,onChangeText,keyboardType}) => {
  return (
   <View style={styles.inputStyle}> 
      <TextInput value={value}  keyboardType={keyboardType} onChangeText={onChangeText} style={styles.input} placeholderTextColor={colors.black} placeholder={placeholder}  />
      </View>
  )
}

export default InputField

const styles = StyleSheet.create({
  inputStyle:{
    backgroundColor: colors.inputColor,
    borderRadius: 15,
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.5),
  },
  input:{
    fontSize: responsiveFontSize(1.9),
    color: colors.placeholderColor
  }
})