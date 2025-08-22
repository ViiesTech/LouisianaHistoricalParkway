/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import BoldText from '../../components/BoldText';
import LineBreak from '../../components/LineBreak';
import colors from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import { images } from '../../assets/images';
import NormalText from '../../components/NormalText';
const RestaurantList = ({ navigation }) => {
  return (
    <Container padding={0.001}>
      <View style={{ padding: responsiveHeight(2) }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={30} />
        </TouchableOpacity>
        <LineBreak val={2} />
        <BoldText title="Louisiana" />
      </View>
      {/* <LineBreak val={2} /> */}
      <View>
        <FlatList contentContainerStyle={{ gap: responsiveHeight(2), padding: responsiveHeight(2) }} data={[images.restaurant1, images.restaurant2, images.restaurant1, images.restaurant2, images.restaurant1]} renderItem={({ item, index }) => {
          return (
            <View style={{ backgroundColor: colors.white, borderRadius: responsiveHeight(2), elevation: 5, flexDirection: 'row', width: '100%', gap: responsiveHeight(2), padding: responsiveHeight(1.5) }}>
              <Image source={item} style={{ width: responsiveWidth(35), height: responsiveHeight(18.5), borderRadius: responsiveHeight(2) }} />
              <View style={{ flex: 0.9, marginTop: responsiveHeight(0.5), right: 5 }}>
                <BoldText size={2.5} title="Restaurant Name" />
                <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1), gap: responsiveHeight(2) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText width={45} title="Champs de Mars at 5 Avenue Anatole France" />
                </View>
                <LineBreak val={2} />
                <TouchableOpacity onPress={() => navigation.navigate('RestaurantDetails')} style={{ backgroundColor: colors.smallIconsBg, borderRadius: responsiveHeight(2.5), padding: responsiveHeight(1), width: responsiveWidth(30), justifyContent: 'center', alignItems: 'center' }}>
                  {/* <Text style={{color:colors.white}}>View Details</Text> */}
                  <NormalText title="View Details" color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          )
        }} />
      </View>
    </Container>
  )
}

export default RestaurantList