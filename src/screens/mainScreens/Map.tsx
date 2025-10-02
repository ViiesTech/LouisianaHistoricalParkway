/* eslint-disable react-native/no-inline-styles */
import { View, Text, ImageBackground, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import { images } from '../../assets/images';
import NormalText from '../../components/NormalText';
import LineBreak from '../../components/LineBreak';
import SmallContainer from '../../components/SmallContainer';
import { icons } from '../../icons';
const Map = ({ navigation }) => {
  return (
    <Container padding={0.001}>
      <Header padding={0.1}>
        <Ionicons name="list" color={colors.black} size={28} />
      </Header>
      <View style={{ paddingHorizontal: responsiveHeight(2.2) }}>
        <BoldText title="Louisiana" />
      </View>
      <ImageBackground style={{ flex: 1, justifyContent: 'flex-end', marginTop: responsiveHeight(2) }} source={images.mapBg}>
        <View>
          <FlatList showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: responsiveHeight(2), padding: responsiveHeight(2) }} data={[images.Rapides, images.restaurant2]} renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={()=>navigation.navigate('LocationDetails')} style={{ backgroundColor: colors.white, borderRadius: responsiveHeight(2), elevation: 5, flexDirection: 'row', width: responsiveWidth(92), gap: responsiveHeight(2), padding: responsiveHeight(1.5) }}>
                <Image source={item} style={{ width: responsiveWidth(29.5), height: responsiveHeight(16), borderRadius: responsiveHeight(2) }} />
                <View style={{ flex: 0.9, marginTop: responsiveHeight(0.5), right: 3 }}>
                  <BoldText size={2.5} title="Rapides Parish" />
                  <View style={{ flexDirection: 'row', right: 5, marginTop: responsiveHeight(0.5), gap: responsiveHeight(2) }}>
                    <View style={{ marginTop: 5 }}>
                      <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                    </View>
                    <NormalText width={45} title="Champs de Mars at 5 Avenue Anatole France" />
                  </View>
                  <LineBreak val={1} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                    <SmallContainer handlePress={()=>navigation.navigate('NavigationDetails')} width={23.5} icon={icons.navigation} title="300 M" />
                    <SmallContainer width={29} icon={icons.clock} title="20 Minute" />
                  </View>
                </View>
              </TouchableOpacity>
            )
          }} />
        </View>
      </ImageBackground>

    </Container>
  )
}

export default Map