import { View } from 'react-native'
import React from 'react'
import { responsiveHeight } from '../utils/helperFunctions'

const LineBreak = ({val}) => {
  return (
    <View style={{
        height: responsiveHeight(val)
    }}
     />

  )
}

export default LineBreak
