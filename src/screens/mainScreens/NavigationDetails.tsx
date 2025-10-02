/* eslint-disable react-native/no-inline-styles */
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import { images } from '../../assets/images'
import { responsiveHeight } from '../../utils/helperFunctions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../assets/colors'
import NormalText from '../../components/NormalText'
import BoldText from '../../components/BoldText'
import LineBreak from '../../components/LineBreak'
const NavigationDetails = ({ navigation }) => {
  const [show, setShow] = useState({
    showDetails: false,
    showDesign: false,
    showEvents: false,
  });
  return (
    <Container padding={0.001}>
      <ImageBackground source={images.rapideshBg2} style={{ flex: 1, padding: show.showDetails ? null : responsiveHeight(2) }}>
        <View style={{ flexDirection: 'row', padding: show.showDetails ? responsiveHeight(2) : null, alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#FCFCF7', padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
            <Ionicons name="chevron-back-outline" color={colors.settings} size={25} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: responsiveHeight(1), paddingHorizontal: responsiveHeight(2), borderRadius: responsiveHeight(3), gap: responsiveHeight(1), backgroundColor: colors.white }}>
            <Feather name="navigation-2" size={20} color={colors.theme2} />
            <NormalText color={colors.settings} title="300 M" />
          </View>
        </View>
        {show.showDetails ? (
          <ScrollView contentContainerStyle={{ marginTop: responsiveHeight(4), borderTopLeftRadius: responsiveHeight(2), borderTopRightRadius: responsiveHeight(2), padding: responsiveHeight(2), flex: 1, backgroundColor: colors.white }}>
            <View style={{ backgroundColor: colors.white2, padding: responsiveHeight(2), borderRadius: responsiveHeight(1.5) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <BoldText size={2.7} title="Construction and design" />
                <TouchableOpacity onPress={() =>
                  setShow(prev => ({
                    ...prev,        // keep previous values
                    showDetails: false,   // update only this key
                  }))
                } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                  <Ionicons name="chevron-up-outline" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
              <NormalText color={colors.theme} title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
              <Image source={images.rapideshBg} style={{ width: '100%', height: responsiveHeight(25), marginTop: responsiveHeight(2), borderRadius: responsiveHeight(2) }} />
            </View>
            {show.showDesign ? (
              <View style={{ backgroundColor: colors.white2, marginTop: responsiveHeight(2), width: '100%', alignSelf: 'center', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <BoldText size={2.7} title="Design" />
                  <TouchableOpacity onPress={() =>
                    setShow(prev => ({
                      ...prev,        // keep previous values
                      showDesign: false,   // update only this key
                    }))
                  } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                    <Ionicons name="chevron-up-outline" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
                <LineBreak val={1.5} />
                <NormalText color={colors.theme} title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
                <Image resizeMode='stretch' source={images.map2} style={{ width: '100%', marginTop: responsiveHeight(2.5) }} />
              </View>
            ) : (
              <View style={{ backgroundColor: colors.white2, marginTop: responsiveHeight(2), width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
                <BoldText size={2.7} title="Design" />
                <TouchableOpacity onPress={() =>
                  setShow(prev => ({
                    ...prev,        // keep previous values
                    showDesign: true,   // update only this key
                  }))
                } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                  <Ionicons name="chevron-down-outline" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
            {show?.showEvents ? (
              <View style={{ backgroundColor: colors.white2, marginTop: responsiveHeight(2), width: '100%', alignSelf: 'center', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <BoldText size={2.7} title="Subsequent events" />
                  <TouchableOpacity onPress={() =>
                    setShow(prev => ({
                      ...prev,        // keep previous values
                      showEvents: false,   // update only this key
                    }))
                  } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                    <Ionicons name="chevron-up-outline" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
                <LineBreak val={1.5} />
                <NormalText color={colors.theme} title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
                <Image resizeMode='stretch' source={images.subsequentEvents} style={{ width: '100%', marginTop: responsiveHeight(2.5) }} />
              </View>
            ) : (
              <View style={{ backgroundColor: colors.white2, marginTop: responsiveHeight(2), width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
                <BoldText size={2.7} title="Subsequent events" />
                <TouchableOpacity onPress={() =>
                  setShow(prev => ({
                    ...prev,        // keep previous values
                    showEvents: true,   // update only this key
                  }))
                } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                  <Ionicons name="chevron-down-outline" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ backgroundColor: colors.white2, marginTop: responsiveHeight(2), width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1), gap: responsiveHeight(2) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText width={60} numberOfLines={1} title="47 W 13th St, New York, NY 10011, USA" />
                </View>
                <LineBreak val={0.5} />
                <BoldText size={2.7} title="Rapides Parish" />
              </View>
              <TouchableOpacity onPress={() => setShow({
                showDetails: false,
                showDesign: false,
                showEvents: false
              })} style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                <Entypo name="cross" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) :
          (
            <View style={{ backgroundColor: colors.white, position: 'absolute', bottom: 10, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: responsiveHeight(2), borderRadius: responsiveHeight(2) }}>
              <View>
                <NormalText size={1.9} title="United States, Louisiana" />
                <LineBreak val={0.5} />
                <BoldText size={2.9} title="Rapides Parish" />
              </View>
              <TouchableOpacity onPress={() =>
                setShow(prev => ({
                  ...prev,        // keep previous values
                  showDetails: true,   // update only this key
                }))
              } style={{ backgroundColor: colors.smallIconsBg, padding: responsiveHeight(1), borderRadius: responsiveHeight(3) }}>
                <Ionicons name="chevron-down-outline" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          )}

      </ImageBackground>
    </Container>
  )
}

export default NavigationDetails