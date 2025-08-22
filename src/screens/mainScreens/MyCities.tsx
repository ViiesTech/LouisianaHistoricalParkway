/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import colors from '../../assets/colors'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import BoldText from '../../components/BoldText'
import NormalText from '../../components/NormalText'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button'
import { icons } from '../../icons'
import LineBreak from '../../components/LineBreak'
const MyCities = () => {
  return (
    <Container padding={0.001}>
      <Header title="My Place" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2) }}>
        <FlatList contentContainerStyle={{ gap: responsiveHeight(3) }} data={[1, 2]} renderItem={({ item }) => {
          return (
            <View style={{ backgroundColor: colors.white2, padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <BoldText size={2.3} title="United States" />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                  <NormalText color="#60605D" title="Download 32 Mb" />
                  <TouchableOpacity style={{ borderWidth: 2.5, borderColor: colors.placeholderColor, padding: responsiveHeight(0.4), borderRadius: responsiveHeight(2) }}>
                    <AntDesign name="download" color={colors.placeholderColor} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <LineBreak val={1} />
              <BoldText title="Louisiana" size={3.5} />
              <LineBreak val={1.5} />
              <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit." />
              <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', gap: responsiveHeight(2) }}>
                <Button icon={icons.trip} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="24 tours" />
                <Button icon={icons.loactionPin} style={{ width: '48%', backgroundColor: colors.smallIconsBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="434 places" />
              </View>
            </View>
          )
        }} />
      </View>
    </Container>
  )
}

export default MyCities