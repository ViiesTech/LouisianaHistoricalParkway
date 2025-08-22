/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import colors from '../../assets/colors'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SVGXml from '../../components/SvgIcon'
import { icons } from '../../icons'
import BoldText from '../../components/BoldText'
import Button from '../../components/Button'
import { images } from '../../assets/images'
import ListHeading from '../../components/ListHeading'
import LineBreak from '../../components/LineBreak'
import NormalText from '../../components/NormalText'
const UserProfile = ({ navigation }) => {
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
  ]
  const listData = [
    { id: 1, title: 'Visited Places', icon: icons.locationCityBlack },
    { id: 2, title: 'Favorite Places', icon: icons.locationPinBlack },
    { id: 3, title: 'Personalized Tours', icon: icons.routesBlack },
  ]
  return (
    <Container padding={0.01}>
      <Header >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.theme2,
              padding: responsiveHeight(1),
              paddingHorizontal: responsiveHeight(1.4),
              borderRadius: responsiveHeight(2.5),
              flexDirection: 'row',
              alignItems: 'center', gap: responsiveHeight(1.5),
            }}
          >
            <SVGXml icon={icons.ticket} height={responsiveHeight(3)} width={responsiveWidth(7)} />
            <BoldText title="PRO" size={2} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons size={30} name="settings-sharp" color={colors.settings} />
          </TouchableOpacity>
        </View>
      </Header>
      <View style={{ padding: responsiveHeight(2) }}>
        <View style={{ alignItems: 'center', gap: responsiveHeight(2) }}>

          <View style={{ backgroundColor: colors.smallIconsBg, width: responsiveWidth(35), height: responsiveHeight(17), borderRadius: responsiveHeight(10), justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.white, height: responsiveHeight(5.8), width: responsiveWidth(12), borderRadius: responsiveHeight(3), justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesome name="user" color={colors.smallIconsBg} size={30} />
            </View>
          </View>
          <BoldText color={colors.settings} size={3} title="May Raymond" />
        </View>
        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(3), alignItems: 'center', gap: responsiveHeight(2), alignSelf: 'center' }}>
          <Button icon={icons.locationCity} style={{ width: '30%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="12" />
          <Button icon={icons.loactionPin} style={{ width: '30%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="434" />
          <Button icon={icons.trip} style={{ width: '30%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="3" />
        </View>
        <LineBreak val={2} />

        <View>
          <FlatList contentContainerStyle={{ gap: responsiveHeight(2.5), marginVertical: responsiveHeight(4) }} data={listData} renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: responsiveHeight(1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
                  <SVGXml icon={item.icon} />
                  <BoldText size={2.6} title={item.title} />
                </View>
                <TouchableOpacity style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(0.7), borderRadius: responsiveHeight(2) }}>
                  <Ionicons name="chevron-forward" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            )
          }} />
        </View>

        <ListHeading mrgnTop={0.0001} title="Found Places" />
      </View>
      <View style={{ paddingBottom: responsiveHeight(0.3), padding: responsiveHeight(0.02) }}>
        <FlatList numColumns={3} contentContainerStyle={{ gap: responsiveHeight(0.6) }} columnWrapperStyle={{ gap: responsiveHeight(0.6) }} data={data} renderItem={({ item }) => {
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

export default UserProfile