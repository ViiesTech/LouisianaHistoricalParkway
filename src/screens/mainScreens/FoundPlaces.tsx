import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { images } from '../../assets/images'
import { responsiveHeight } from '../../utils/helperFunctions'

const FoundPlaces = () => {
  const data = [
    { id: 1, img: images.westParish },
    { id: 2, img: images.Avoyelles },
    { id: 3, img: images.Rapides },
    { id: 4, img: images.tangipahoaParish },
    { id: 5, img: images.stHelenaParish },
    { id: 6, img: images.tangipahoaParish },
    { id: 7, img: images.westParish },
    { id: 8, img: images.Avoyelles },
    { id: 9, img: images.Rapides },
    { id: 10, img: images.tangipahoaParish },
    { id: 11, img: images.stHelenaParish },
    { id: 12, img: images.tangipahoaParish },
    { id: 13, img: images.westParish },
    { id: 14, img: images.Avoyelles },
    { id: 15, img: images.Rapides },
    { id: 16, img: images.tangipahoaParish },
    { id: 17, img: images.stHelenaParish },
    { id: 18, img: images.tangipahoaParish },
  ]
  return (
    <Container padding={0.001}>
      <Header rightTxt="99" title="Found places" showRightIcon={false} padding={0.1} />
      <View style={{ paddingBottom: responsiveHeight(1), padding: responsiveHeight(0.02) }}>
        <FlatList numColumns={3} contentContainerStyle={{ gap: responsiveHeight(0.6), marginTop: responsiveHeight(1) }} columnWrapperStyle={{ gap: responsiveHeight(0.6) }} data={data} renderItem={({ item }) => {
          return (
            <View style={{ width: '33%', height: responsiveHeight(18) }}>
              <Image source={item.img} style={{ width: '100%', height: '100%' }} />
            </View>
          )
        }} />
      </View>
    </Container>
  )
}

export default FoundPlaces