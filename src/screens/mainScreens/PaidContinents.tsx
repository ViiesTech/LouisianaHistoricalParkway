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
const PaidContinents = ({ navigation }) => {
  const data = [
    { id: 1, title: 'West Feliciana Parish', image: images.westParish },
    { id: 2, title: 'East Feliciana Parish', image: images.westParish },
    { id: 3, title: 'St. helena Parish', image: images.stHelenaParish },
    { id: 4, title: 'Tangipahoa Parish', image: images.tangipahoaParish },
    { id: 5, title: 'East Feliciana Parish', image: images.westParish },
    { id: 6, title: 'St. helena Parish', image: images.stHelenaParish },
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
          <FlatList data={data} numColumns={2} contentContainerStyle={{ justifyContent: 'space-between', gap: responsiveHeight(2) }} columnWrapperStyle={{ gap: responsiveHeight(1.5), justifyContent: 'space-between' }} renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('PriceDetails')} style={{ width: responsiveWidth(44) }}>
                <Image source={item.image} style={{ width: responsiveWidth(43), marginBottom: responsiveHeight(0.7), borderRadius: responsiveHeight(1) }} />
                <BoldText size={2.3} title={item.title} />
              </TouchableOpacity>
            )
          }} />
        </View>
      </View>
    </Container>
  )
}

export default PaidContinents