/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { images } from '../../assets/images'
import colors from '../../assets/colors'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import BoldText from '../../components/BoldText'
import NormalText from '../../components/NormalText'
import LineBreak from '../../components/LineBreak'
import SmallContainer from '../../components/SmallContainer'
import { icons } from '../../icons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
const NearbyPlaces = ({ navigation }) => {

  const data = [
    { id: 1, title: 'Louisiana Historical Parkway', img: images.historical },
    { id: 2, title: 'Rapides Parish', img: images.Rapides },
    { id: 3, title: 'Louisiana Historical Parkway', img: images.historical },
    { id: 4, title: 'Rapides Parish', img: images.Rapides },
    { id: 5, title: 'Louisiana Historical Parkway', img: images.historical },
    { id: 6, title: 'Rapides Parish', img: images.Rapides },
  ]
  return (
    <Container padding={0.001}>
      <Header title="Nearby Places" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2) }}>
        <FlatList numColumns={2} contentContainerStyle={{ gap: responsiveHeight(2) }} columnWrapperStyle={{ gap: responsiveHeight(1.5) }} data={data} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('CityDetails')} style={{ backgroundColor: colors.white2, borderRadius: responsiveHeight(2), width: '48%' }}>
              <View style={{}}>
                <Image resizeMode='cover' source={item?.img} style={{ borderTopRightRadius: responsiveHeight(2), height: responsiveHeight(20), borderTopLeftRadius: responsiveHeight(2), width: '100%' }} />
                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, backgroundColor: '#F7DB44', padding: responsiveHeight(0.9), borderRadius: responsiveHeight(2.5), justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="heart-outline" size={20} color={colors.black} />
                </TouchableOpacity>
                <View style={{ position: 'absolute', height: responsiveHeight(22), justifyContent: 'center', alignSelf: 'center' }}>
                  <TouchableOpacity style={{ backgroundColor: colors.videoIconBg, padding: responsiveHeight(1.5), borderRadius: responsiveHeight(3.5), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.smallIconsBg }}>
                    <Ionicons name="play" color={colors.white} size={20} />
                  </TouchableOpacity>
                </View>

              </View>
              <View style={{ padding: responsiveHeight(1) }}>
                <BoldText numberOfLines={1} size={2} title={item?.title} />
                <View style={{ flexDirection: 'row', gap: responsiveHeight(1) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText size={1.7} width={26} numberOfLines={2} title="47 W 13th St, New York, NY 10011, USA" />
                </View>
                <LineBreak val={2} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                  <SmallContainer paddingVertical={0.8} gap={0.7} txtSize={1.5} width={19} icon={icons.navigation} title="300 M" />
                  <SmallContainer paddingVertical={0.8} gap={0.7} txtSize={1.5} width={19} icon={icons.clock} title="20 Min" />
                </View>
              </View>
            </TouchableOpacity>
          )
        }} />
      </View>
    </Container>
  )
}

export default NearbyPlaces