/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import { images } from '../../assets/images'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import NormalText from '../../components/NormalText'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import colors from '../../assets/colors'
import BoldText from '../../components/BoldText'
const MapRoutes = ({ navigation }) => {
  return (
    <Container padding={0.001}>
      <Header rightTxt="18 min" showRightIcon={false} title="Rapidesh Parish" />
      <ImageBackground source={images.mapBg2} style={{ width: responsiveWidth(100), marginTop: responsiveHeight(3), flex: 1 }} resizeMode='cover'>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <ImageBackground source={images.themeBg} style={{ height: responsiveHeight(30), }} imageStyle={{ borderTopRightRadius: responsiveHeight(2), borderTopLeftRadius: responsiveHeight(2) }}>
            <TouchableOpacity onPress={() => navigation.navigate('NavigationDetails')}>

              <View style={{ padding: responsiveHeight(2) }}>

                <BoldText color="#FCFCF7" title="Rapides Parish" size={2.5} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1), gap: responsiveHeight(2) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText color="#F1F1E9" title="47 W 13th St, New York, NY 10011, USA" />
                </View>
              </View>
              <View style={{ borderWidth: 1, borderColor: "#78AFC9", width: '100%' }} />
              <View style={{ flexDirection: 'row', gap: responsiveHeight(2), width: '100%', padding: responsiveHeight(2) }}>
                <View style={{
                  alignItems: 'center', justifyContent: 'center',
                  // top: responsiveHeight(1.5)
                }}>
                  <View style={{ backgroundColor: colors.white, height: responsiveHeight(4), width: responsiveWidth(8), justifyContent: 'center', alignItems: 'center', borderRadius: responsiveHeight(2) }}>
                    <NormalText title="1" color={colors.smallIconsBg} />
                  </View>
                  {/* <View style={{ borderWidth: 1, borderColor: '#A9CBDA', height: responsiveHeight(5), width: 3 }} /> */}
                </View>
                <View>
                  <View style={{ flexDirection: 'row', width: responsiveWidth(80), alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{}}>
                      <BoldText color={colors.white} size={3} title="1.2 miles" />
                      <NormalText color="#98C2D4" title="Moab, UT" />
                    </View>
                    <FontAwesome6 size={30} color={colors.white} name="arrow-turn-up" />
                  </View>
                  <View style={{ borderWidth: 1, borderColor: '#78AFC9', top: 5 }} />
                </View>
              </View>
            </TouchableOpacity>

          </ImageBackground>
        </View>
      </ImageBackground>
    </Container>
  )
}

export default MapRoutes