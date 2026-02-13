/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { use, useEffect } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import colors from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SVGXml from '../../components/SvgIcon';
import { icons } from '../../icons';
import BoldText from '../../components/BoldText';
import Button from '../../components/Button';
import { images } from '../../assets/images';
import ListHeading from '../../components/ListHeading';
import LineBreak from '../../components/LineBreak';
import NormalText from '../../components/NormalText';
import { useSelector } from 'react-redux';
import { useLazyGetUserDetailsQuery } from '../../redux/services/Main';
import { useIsFocused } from '@react-navigation/native';
const UserProfile = ({ navigation }) => {
  const data2 = [
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
  ];
  const { user, isGuest, guest } = useSelector(state => state.persistedData);
  const focus = useIsFocused();
  const [getUserDetails, { isFetching, isLoading, data }] =
    useLazyGetUserDetailsQuery();
  const { favouriteCities, visitedCities, itineraries } = data?.user || {};
  console.log(' guest data===', data);
  const listData = isGuest
    ? []
    : [
        {
          id: 1,
          title: 'Visited Places',
          navigateTo: 'MyCities',
          icon: icons.locationCityBlack,
          data: visitedCities,
        },
        {
          id: 2,
          title: 'Favorite Places',
          navigateTo: 'Favourites',
          icon: icons.locationPinBlack,
          data: favouriteCities,
        },
        {
          id: 3,
          title: 'My Itineraries',
          navigateTo: 'MyItineraries',
          icon: icons.routesBlack,
          data: itineraries,
        },
      ];
  console.log('favoritecities', favouriteCities);
  console.log('visitedCities', visitedCities);
  console.log('itineraries', itineraries);

  useEffect(() => {
    if (focus && !isGuest) {
      getUserDetails({}, true)
        .unwrap()
        .then(res => {
          console.log('res of user details', res);
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  }, [focus, isGuest]);

  // Simple pulsing skeleton animation value
  const pulse = React.useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.6,
            duration: 700,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [isLoading, pulse]);

  const renderLoadingSkeleton = () => (
    <View style={{ marginTop: responsiveHeight(2) }}>
      <View style={{ alignItems: 'center', gap: responsiveHeight(2) }}>
        <Animated.View
          style={{
            backgroundColor: '#E6E6E6',
            width: responsiveWidth(39),
            height: responsiveHeight(17),
            borderRadius: responsiveHeight(10),
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pulse,
          }}
        />
        <Animated.View
          style={{
            width: responsiveWidth(40),
            height: 18,
            backgroundColor: '#E6E6E6',
            borderRadius: 6,
            opacity: pulse,
          }}
        />
      </View>
      <Animated.View
        style={{
          flexDirection: 'row',
          marginTop: responsiveHeight(3),
          alignItems: 'center',
          gap: responsiveHeight(2),
          alignSelf: 'center',
          opacity: pulse,
        }}
      >
        <View
          style={{
            backgroundColor: '#E6E6E6',
            width: responsiveWidth(25),
            height: responsiveHeight(6),
            borderRadius: 8,
          }}
        />
        <View
          style={{
            backgroundColor: '#E6E6E6',
            width: responsiveWidth(25),
            height: responsiveHeight(6),
            borderRadius: 8,
          }}
        />
        <View
          style={{
            backgroundColor: '#E6E6E6',
            width: responsiveWidth(25),
            height: responsiveHeight(6),
            borderRadius: 8,
          }}
        />
      </Animated.View>

      <View style={{ marginTop: responsiveHeight(4) }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Animated.View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: responsiveHeight(2),
              opacity: pulse,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(1.5),
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: '#E6E6E6',
                }}
              />
              <View
                style={{
                  width: responsiveWidth(50),
                  height: 14,
                  borderRadius: 6,
                  backgroundColor: '#E6E6E6',
                }}
              />
            </View>
            <View
              style={{
                width: 60,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#E6E6E6',
              }}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );

  return (
    <Container padding={0.001} hasTabBar={true}>
      <Header>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(2),
            // padding:responsiveHeight(2)
          }}
        >
          {/* <TouchableOpacity
            // onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.theme2,
              padding: responsiveHeight(1),
              paddingHorizontal: responsiveHeight(1.4),
              borderRadius: responsiveHeight(2.5),
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveHeight(1.5),
            }}
          >
            <SVGXml
              icon={icons.ticket}
              height={responsiveHeight(3)}
              width={responsiveWidth(7)}
            />
            <BoldText title="PRO" size={2} color={colors.white} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons size={25} name="settings-sharp" color={colors.settings} />
          </TouchableOpacity>
        </View>
      </Header>
      <View style={{ padding: responsiveHeight(2) }}>
        {isFetching ? (
          renderLoadingSkeleton()
        ) : (
          <>
            <View style={{ alignItems: 'center', gap: responsiveHeight(2) }}>
              <View
                style={{
                  backgroundColor: colors.smallIconsBg,
                  width: responsiveWidth(39),
                  height: responsiveHeight(17),
                  borderRadius: responsiveHeight(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.white,
                    height: responsiveHeight(5.8),
                    width: responsiveWidth(12),
                    borderRadius: responsiveHeight(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FontAwesome
                    name="user"
                    color={colors.smallIconsBg}
                    size={30}
                  />
                </View>
              </View>
              <BoldText
                color={colors.settings}
                size={3}
                title={isGuest ? guest.email : user.username}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: responsiveHeight(3),
                alignItems: 'center',
                gap: responsiveHeight(2),
                alignSelf: 'center',
              }}
            >
              <Button
                disabled
                icon={icons.locationCity}
                style={{
                  width: '30%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: responsiveHeight(2),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 5,
                }}
                title={isGuest ? 0 : visitedCities?.length || 0}
              />
              <Button
                disabled
                icon={icons.loactionPin}
                style={{
                  width: '30%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: responsiveHeight(2),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 5,
                }}
                title={isGuest ? 0 : favouriteCities?.length || 0}
              />
              <Button
                disabled
                icon={icons.trip}
                style={{
                  width: '30%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: responsiveHeight(2),
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 5,
                }}
                title={itineraries?.length || 0}
              />
            </View>
            <LineBreak val={2} />

            <View>
              <FlatList
                contentContainerStyle={{
                  gap: responsiveHeight(2.5),
                  marginVertical: responsiveHeight(4),
                }}
                data={listData}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(item.navigateTo, {
                          data: item.data,
                        })
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: responsiveHeight(1),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: responsiveHeight(1.5),
                        }}
                      >
                        <SVGXml icon={item.icon} />
                        <BoldText size={2.6} title={item.title} />
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(item.navigateTo, {
                            data: item.data,
                          })
                        }
                        style={{
                          backgroundColor: colors.smallIconsBg,
                          padding: responsiveHeight(0.7),
                          borderRadius: responsiveHeight(2),
                        }}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </>
        )}

        {/* <ListHeading
          onSeeAllPress={() => navigation.navigate('FoundPlaces')}
          mrgnTop={0.0001}
          title="Found Places"
        /> */}
      </View>
      {/* <View
        style={{
          paddingBottom: responsiveHeight(0.3),
          padding: responsiveHeight(0.02),
        }}
      >
        <FlatList
          numColumns={3}
          contentContainerStyle={{ gap: responsiveHeight(0.6) }}
          columnWrapperStyle={{ gap: responsiveHeight(0.6) }}
          data={data}
          renderItem={({ item }) => {
            return (
              <View style={{ width: '33%', height: responsiveHeight(18) }}>
                <FastImage
                  source={item.img}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            );
          }}
        />
      </View> */}
    </Container>
  );
};

export default UserProfile;
