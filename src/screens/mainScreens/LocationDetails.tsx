/* eslint-disable react-native/no-inline-styles */
import { View, ImageBackground, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import FastImage from 'react-native-fast-image';
import React from 'react'
import Container from '../../components/Container'
import { images } from '../../assets/images'
import { responsiveHeight } from '../../utils/helperFunctions'
import colors from '../../assets/colors'
import NormalText from '../../components/NormalText'
import fonts from '../../assets/fonts'
import BoldText from '../../components/BoldText'
import LineBreak from '../../components/LineBreak'
import Header from '../../components/Header'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import SmallContainer from '../../components/SmallContainer'
import { icons } from '../../icons'

const LocationDetails = ({ navigation }) => {
  const data = [
    { id: 1, image: images.Rapides, title: 'Rapides Parish' },
    { id: 2, image: images.Avoyelles, title: 'Avoyelles Parish' },
    { id: 3, image: images.Rapides, title: 'Rapides Parish' },
  ]
  return (
    <Container padding={0.01}>
      <ImageBackground source={images.rapideshBg} style={{ width: '100%', height: responsiveHeight(27) }}>
        <Header />
      </ImageBackground>
      <View style={{ backgroundColor: colors.white, flex: 1, borderTopLeftRadius: responsiveHeight(2), borderTopRightRadius: responsiveHeight(2), bottom: 10, }}>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: responsiveHeight(2) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <NormalText title="USA, Louisiana" size={2.4} font={fonts.Semi_Bold} />
            <SmallContainer handlePress={()=>navigation.navigate('MapRoutes')} title="Route" icon={icons.navigation} width={26} />
          </View>
          <BoldText color="#363E44" title="Rapides Parish" size={4} />
          <NormalText color={colors.theme} title="mpedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit." />
          <LineBreak val={2} />
          <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. 
Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit. Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur. " />
          <LineBreak val={1.4} />
          <BoldText color="#363E44" title="Location" size={3} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1), gap: responsiveHeight(2) }}>
            <View style={{ marginTop: 5 }}>
              <FontAwesome6 name="location-dot" size={25} color={colors.theme2} />
            </View>
            <NormalText title="47 W 13th St, New York, NY 10011, USA" />
          </View>
          <LineBreak val={2} />
          <TouchableOpacity onPress={() => navigation.navigate('MapRoutes')}>
            <FastImage source={images.map} style={{ width: '100%', height: 200 }} resizeMode={FastImage.resizeMode.contain} />
          </TouchableOpacity>
        </ScrollView>
      </View>

    </Container>
  )
}

export default LocationDetails