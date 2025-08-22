/* eslint-disable react-native/no-inline-styles */
import { View, ImageBackground, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import { images } from '../../assets/images'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import colors from '../../assets/colors'
import NormalText from '../../components/NormalText'
import SmallContainer from '../../components/SmallContainer'
import { icons } from '../../icons'
import fonts from '../../assets/fonts'
import BoldText from '../../components/BoldText'
import LineBreak from '../../components/LineBreak'
import Button from '../../components/Button'
import ListHeading from '../../components/ListHeading'
import ToursCard from '../../components/ToursCard'
import Header from '../../components/Header'
const PersonalizedTours = ({ navigation }) => {
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
            <NormalText title="United States, Louisiana" size={2.4} font={fonts.Semi_Bold} />
            <SmallContainer title="Route" icon={icons.navigation} width={26} />
          </View>
          <BoldText color="#363E44" title="Rapides Parish" size={4} />
          <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit." />
          <LineBreak val={1.4} />
          <BoldText color={colors.readmore} title="Read more" size={2.2} />
          <LineBreak val={2} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(2) }}>
            <Button icon={icons.trip} style={{ width: responsiveWidth(44), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="24 tours" />
            <Button icon={icons.loactionPin} style={{ width: responsiveWidth(44), backgroundColor: colors.smallIconsBg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: responsiveHeight(2) }} title="434 places" />
          </View>
          <LineBreak val={2} />
          <ListHeading mrgnTop={0.001} title="Locations you’ll visit"  />
          <LineBreak val={2} />

          <View>
            <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: responsiveHeight(2) }} data={data} renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={{ gap: responsiveHeight(1) }}>
                  <Image source={item.image} />
                  <NormalText title={item.title} />
                </TouchableOpacity>
              )
            }} />
          </View>
          <LineBreak val={1.5} />
          <ListHeading mrgnTop={0.001} title="Tour Route"  />

          <LineBreak val={1.5} />

          <View>
            {/* <FlatList horizontal contentContainerStyle={{ gap: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} data={[1, 2]} renderItem={({ }) => {
              return (
                <ToursCard icon2={true} txtColor={colors.theme} bgColor={'#E6E6DE'} isTxt2={false} />
              )
            }} /> */}
            <TouchableOpacity >
              <Image source={images.map} style={{ width: '100%' }} />
            </TouchableOpacity>
          </View>
          <LineBreak val={4} />
          <Button title="Start Tour" />
        </ScrollView>
      </View>

    </Container>
  )
}

export default PersonalizedTours