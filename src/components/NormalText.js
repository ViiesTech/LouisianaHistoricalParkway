import { Text } from 'react-native'
import React from 'react'
import { responsiveFontSize } from '../utils/helperFunctions'
import colors from '../assets/colors'

const NormalText = ({title,color,size,align,font}) => {
  return (
      <Text style={{
        color: color || colors.black,
        fontSize: responsiveFontSize(size || 2),
        textAlign: align,
        fontFamily: font
      }}>
        {title}
        </Text>
  )
}

export default NormalText
