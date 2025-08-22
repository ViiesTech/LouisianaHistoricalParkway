/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, FlatList } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import NormalText from '../../components/NormalText';
import BoldText from '../../components/BoldText';
import LineBreak from '../../components/LineBreak';
import { images } from '../../assets/images';
import InputField from '../../components/InputField';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../../assets/fonts';
import ListHeading from '../../components/ListHeading';
import SVGXml from '../../components/SvgIcon';
import { icons } from '../../icons';
import SmallContainer from '../../components/SmallContainer';
import ToursCard from '../../components/ToursCard';
const Home = ({ navigation }) => {
  return (
    <Container gap={1}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="location-dot" size={25} color={colors.white} />
          </View>
          <View>
            <NormalText title="Your Location" />
            <BoldText title="Louisiana, USA" size={2.5} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesome5 name="user-alt" size={25} color={colors.white} />
        </TouchableOpacity>
      </View>
      <LineBreak val={3} />
      <BoldText title="Where are you going today?" size={3.4} />
      <LineBreak val={1.5} />
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1.4) }}>
        <InputField placeHolderColor={colors.placeholderColor} width={75} showSearch mrgnLeft={4} placeholder="Search" />
        <TouchableOpacity style={{ backgroundColor: '#569BBD', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: responsiveHeight(1.5) }}>
          <MaterialIcons name="control-camera" color={colors.white} size={30} />
        </TouchableOpacity>
      </View>
      <LineBreak val={3} />
      <ImageBackground source={images.banner} style={{ height: responsiveHeight(20), alignItems: 'center', justifyContent: 'center' }} imageStyle={{ borderRadius: responsiveHeight(2) }} >
        <LineBreak val={4} />
        <BoldText title="Special
Announcement
" color={colors.white} align="center" />
      </ImageBackground>
      <LineBreak val={2} />
      <ListHeading title="Nearest Places" />
      <LineBreak val={2} />
      <View>
        <FlatList horizontal contentContainerStyle={{ gap: responsiveHeight(2) }} data={[1, 2]} renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate('CityDetails')} style={{ backgroundColor: colors.white2, borderRadius: responsiveHeight(2), width: responsiveWidth(70) }}>
              <View style={{}}>
                <Image source={images.historical} style={{ borderTopRightRadius: responsiveHeight(2), borderTopLeftRadius: responsiveHeight(2), width: '100%' }} />
                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, backgroundColor: '#F7DB44', padding: responsiveHeight(0.9), borderRadius: responsiveHeight(2.5), justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="heart-outline" size={25} color={colors.black} />
                </TouchableOpacity>
                <View style={{ position: 'absolute', height: responsiveHeight(27.5), justifyContent: 'center', alignSelf: 'center' }}>
                  <TouchableOpacity style={{ backgroundColor: colors.videoIconBg, padding: responsiveHeight(1.5), borderRadius: responsiveHeight(3.5), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.smallIconsBg }}>
                    <Ionicons name="play" color={colors.white} size={25} />
                  </TouchableOpacity>
                </View>

              </View>
              <View style={{ padding: responsiveHeight(2) }}>
                <BoldText size={2.3} title="Louisiana Historical Parkway" />
                <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
                  </View>
                  <NormalText width={45} title="47 W 13th St, New York, NY 10011, USA" />
                </View>
                <LineBreak val={2} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
                  <SmallContainer width={25} icon={icons.navigation} title="300 M" />
                  <SmallContainer width={30} icon={icons.clock} title="20 Minute" />
                </View>
              </View>
            </TouchableOpacity>
          )
        }} />
      </View>
      <LineBreak val={2} />
      <ListHeading title="Tours in Louisiana" />
      <LineBreak val={2} />

      <View>
        <FlatList horizontal contentContainerStyle={{ gap: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} data={[1, 2]} renderItem={({  }) => {
          return (
           <ToursCard />
          )
        }} />
      </View>
    </Container>
  )
}

export default Home;
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.smallSideTxt,
    padding: responsiveHeight(1.4),
    width: responsiveWidth(12),
    borderRadius: responsiveHeight(4),
    justifyContent: 'center',
    alignItems: 'center'
  }
})