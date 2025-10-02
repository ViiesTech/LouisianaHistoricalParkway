import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { images } from '../../assets/images'
import { responsiveHeight } from '../../utils/helperFunctions'
import BoldText from '../../components/BoldText'
import colors from '../../assets/colors'

const PopularPlaces = ({ navigation }) => {
  const data = [
    { id: 1, title: 'Rapides Parish', img: images.Rapides },
    { id: 2, title: 'Avoyelles Parish', img: images.Avoyelles },
    { id: 3, title: 'Washington Parish', img: images.westParish },
    { id: 4, title: 'Rapides Parish', img: images.Rapides },
    { id: 5, title: 'Avoyelles Parish', img: images.Avoyelles },
    { id: 6, title: 'Washington Parish', img: images.westParish },
  ]
  return (
    <Container padding={0.001}>
      <Header title="Popular Places" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2) }}>
        <FlatList numColumns={2} contentContainerStyle={{ gap: responsiveHeight(2), marginTop: responsiveHeight(1) }} columnWrapperStyle={{ gap: responsiveHeight(1), justifyContent: 'space-between' }} data={data} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('LocationDetails')} style={{ width: '48%', gap: responsiveHeight(1) }}>
              <Image source={item.img} style={{ width: '100%', borderRadius: responsiveHeight(1.5), height: responsiveHeight(20) }} />
              <BoldText numberOfLines={1} color={colors.settings} size={2.35} title={item?.title} />
            </TouchableOpacity>
          )
        }} />
      </View>
    </Container>
  )
}

export default PopularPlaces