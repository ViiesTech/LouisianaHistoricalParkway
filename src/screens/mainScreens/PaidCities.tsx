import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LineBreak from '../../components/LineBreak'
import BoldText from '../../components/BoldText'
import Container from '../../components/Container'
import InputField from '../../components/InputField'
import colors from '../../assets/colors'
import { images } from '../../assets/images'
import NormalText from '../../components/NormalText'
import SVGXml from '../../components/SvgIcon'
import { icons } from '../../icons'
const PaidContinents = ({ navigation }) => {
  const data = [
    { id: 1, title: 'Avoyelles', image: images.Avoyelles },
    { id: 2, title: 'Rapides Parish', image: images.Rapides },
    { id: 3, title: 'West Feliciana', image: images.westParish },
    { id: 4, title: 'East Feliciana', image: images.Avoyelles },
    { id: 5, title: 'St. Helena', image: images.Rapides },
    { id: 6, title: 'Tangipahoa', image: images.Avoyelles },
    { id: 7, title: 'Pointe Coupe', image: images.Rapides },
    { id: 8, title: 'Washington', image: images.westParish },
    { id: 9, title: 'Rapides Parish', image: images.westParish },
  ]
  return (
    <Container padding={0.001}>
      <View style={{ padding: responsiveHeight(2) }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} />
        </TouchableOpacity>
        <LineBreak val={2} />
        <BoldText title="Explore the Louisiana Historical Parkway" />
        <LineBreak val={2} />

        <InputField placeHolderColor={colors.placeholderColor} showSearch mrgnLeft={4} placeholder="Search" />
        <LineBreak val={4} />
        <View>
          <BoldText title="Popular Places" size={2.8} />
          <FlatList data={data} numColumns={3} contentContainerStyle={{ marginTop: responsiveHeight(1.5), justifyContent: 'space-between', gap: responsiveHeight(2) }} columnWrapperStyle={{ gap: responsiveHeight(1.5), justifyContent: 'space-between' }} renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('PriceDetails')} style={{ width: responsiveWidth(28) }}>
                <View>
                  <Image source={item.image} style={{ width: '100%', height: responsiveHeight(15), marginBottom: responsiveHeight(0.7), borderRadius: responsiveHeight(1) }} />
                  <View style={{ position: 'absolute', right: 5, top: 5 }}>
                    <SVGXml icon={icons.dollar} />
                  </View>
                </View>
                <BoldText numberOfLines={1} size={2.3} title={item.title} />
                <NormalText color={colors.placeholderColor} size={1.8} title="United States" />
              </TouchableOpacity>
            )
          }} />
        </View>
      </View>
    </Container>
  )
}

export default PaidContinents