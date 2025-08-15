import { Text } from 'react-native'
import React from 'react'
import colors from '../assets/colors'
import fonts from '../assets/fonts'
import { responsiveFontSize } from '../utils/helperFunctions'

const BoldText = ({color,size,font,align,title}) => {
  return (
        <Text style={{
          color: color || colors.black,
          // fontWeight: 'bold',
          fontFamily: font || fonts.Bold,
          fontSize: responsiveFontSize(size || 4),
          textAlign: align
        }}>
             {title}
        </Text>
  )
}

export default BoldText;
