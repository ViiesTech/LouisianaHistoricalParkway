/* eslint-disable react-native/no-inline-styles */
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import colors from '../../assets/colors'
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions'
import BoldText from '../../components/BoldText'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { images } from '../../assets/images'
import NormalText from '../../components/NormalText'
import LineBreak from '../../components/LineBreak'
import SettingsList from '../../components/SettingsList'
import Button from '../../components/Button'
const Settings = () => {
  return (
    <Container padding={0.001}>
      <Header title="Settings" showRightIcon={false} padding={0.1} />

      <View style={{ padding: responsiveHeight(2), flex: 1 }}>
        <TouchableOpacity style={{ backgroundColor: colors.white2, borderRadius: responsiveHeight(1.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: responsiveHeight(1.5), paddingVertical: responsiveHeight(2) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1.5) }}>
            <Image source={images.subscription} />
            <View>
              <BoldText size={2.5} title="Pro subscription" />
              <NormalText title="Until 19 Sep 2023" />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={25} />
        </TouchableOpacity>
        <LineBreak val={2} />
        <View style={{ gap: responsiveHeight(2) }}>
          <NormalText color={colors.title} title="ACCOUNT" />
          <SettingsList iconName="user" Icon={FontAwesome} rightTxt="May Raymond" leftTxt="Name" />
          <SettingsList iconName="email" Icon={Entypo} rightTxt="MRaymond@hotmail.com" leftTxt="Email" />
        </View>
        <View style={{ marginTop: responsiveHeight(6), gap: responsiveHeight(2) }}>
          <NormalText color={colors.title} title="PREFERENCES" />
          <SettingsList iconName="notifications" Icon={Ionicons} rightTxt="Enabled" leftTxt="Notifications" />
          <SettingsList iconName="information-sharp" Icon={Ionicons} leftTxt="Help" />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Button buttonTextColor={colors.smallIconsBg} backgroundColor={colors.white} borderWidth={1.5} borderColor={colors.smallIconsBg} title="Log out" />
        </View>
      </View>
    </Container>
  )
}

export default Settings