/* eslint-disable react-native/no-inline-styles */
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import Container from '../../components/Container'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import colors from '../../assets/colors'
import BoldText from '../../components/BoldText'
import NormalText from '../../components/NormalText'
import LineBreak from '../../components/LineBreak'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { images } from '../../assets/images'
const Favourites = ({ navigation }) => {
  const data = [
    { id: 1, title: 'Rapides Parish', image: images.Rapides },
    { id: 2, title: 'Avoyelles Parish', image: images.Avoyelles },
    { id: 3, title: 'Washington', image: images.westParish },
  ]
  return (
    <Container padding={0.001}>
      <Header title="My Parishes" showRightIcon={false} padding={0.1} />
      <View>
        <FlatList contentContainerStyle={{ gap: responsiveHeight(2), padding: responsiveHeight(2) }} data={data} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={{ backgroundColor: colors.white2, borderRadius: responsiveHeight(2), elevation: 5, flexDirection: 'row', gap: responsiveHeight(2), padding: responsiveHeight(1.5) }}>
              <Image source={item.image} style={{ width: responsiveWidth(28), height: responsiveHeight(13.3), borderRadius: responsiveHeight(2) }} />
              <View style={{ width: responsiveWidth(55), gap: responsiveHeight(1.4), marginTop: responsiveHeight(0.5), right: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: responsiveWidth(55), gap: responsiveHeight(1), justifyContent: 'space-between' }}>
                  <BoldText size={2.5} title={item.title} />
                  <FontAwesome name="heart" size={25} />
                </View>
                <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText width={43} title="47 W 13th St, New York, NY 10011, USA" />
                </View>
              </View>
            </TouchableOpacity>
          )
        }} />
      </View>
    </Container>
  )
}

export default Favourites