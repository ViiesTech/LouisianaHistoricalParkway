/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Container from '../../components/Container';
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
import ListHeading from '../../components/ListHeading';
import ToursCard from '../../components/ToursCard';
import Button from '../../components/Button';
import ImageView from 'react-native-image-viewing';
import {
  getCurrentLocation,
  ShowToast,
  getDistanceMeters,
  getEstimatedMinutes,
  formatMinutes,
} from '../../GlobalFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NearestCities from '../../components/NearestCities';
import {
  useLazyGetAllCitiesQuery,
  useLazyGetTouristSpotsQuery,
} from '../../redux/services/Main';
import Video from 'react-native-video';

const Home = ({ navigation }) => {
  const [visible, setIsVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [getAllCities, { isLoading, data, isFetching }] =
    useLazyGetAllCitiesQuery();
  const [getTouristSpots, { isLoading: isLoadingTours, data: toursData }] =
    useLazyGetTouristSpotsQuery();
  const [latLng, setLatLng] = useState({
    latitude: 37.421998,
    longitude: -122.084,
    address:
      'Amphitheatre, Mountain View, Santa Clara County, California, 94043, United States',
  });
  const [locationLabel, setLocationLabel] = useState('Fetching.... ');
  console.log('latLng', latLng);
  console.log('cities data', data);

  const getCurrentLocationHandler = async () => {
    const response: any = await getCurrentLocation();
    if (response && !response.error) {
      setLatLng(response);
      // const addr = response.addressDetails || null;

      // Extract state and country from Google's address_components
      // let state = '';
      // let country = '';
      // let city = '';

      // if (addr && Array.isArray(addr)) {
      //   // Google API returns address_components as array
      //   for (const component of addr) {
      //     if (component.types?.includes('administrative_area_level_1')) {
      //       state = component.long_name;
      //     }
      //     if (component.types?.includes('country')) {
      //       country = component.long_name;
      //     }
      //     if (component.types?.includes('locality')) {
      //       city = component.long_name;
      //     }
      //   }
      // }

      // Set location label with priority: state+country > city+country > address > static fallback
      // if (state && country) {
      //   setLocationLabel(`${state}, ${country}`);
      // } else if (city && country) {
      //   setLocationLabel(`${city}, ${country}`);
      // } else if (country) {
      //   setLocationLabel(country);
      // } else if (response.address) {
      //   // Use the formatted address if available
      //   setLocationLabel(response.address);
      // } else {
      //   // Fallback to static location when API key issue or no address available
      //   setLocationLabel('Louisiana, USA');
      // }

      // For now, just show Louisiana, USA without fetching address
      setLocationLabel('Louisiana, USA');
    }
  };

  useEffect(() => {
    getCurrentLocationHandler();
  }, []);

  useEffect(() => {
    getAllCities({
      latitude: latLng.latitude,
      longitude: latLng.longitude,
      maxDistance: 50000000,
    })
      .unwrap()
      .then(res => {
        console.log('res of cities', res);
        setCitiesList(res?.cities || []);
      })
      .catch(err => {
        ShowToast('error', err?.data?.message || 'Error fetching cities');
        console.log('err', err);
      });
  }, []);

  // Search handler with debounce
  useEffect(() => {
    let isCancelled = false;
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.trim().length >= 3) {
        // clear current list immediately to avoid showing stale results
        setCitiesList([]);
        getAllCities({
          latitude: latLng.latitude,
          longitude: latLng.longitude,
          maxDistance: 50000000,
          search: searchQuery.trim(),
        })
          .unwrap()
          .then(res => {
            if (!isCancelled) {
              setCitiesList(res?.cities || []);
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      } else {
        // If search is empty or less than 3 characters, fetch all cities
        getAllCities({
          latitude: latLng.latitude,
          longitude: latLng.longitude,
          maxDistance: 50000000,
        })
          .unwrap()
          .then(res => {
            if (!isCancelled) {
              console.log('res of cities', res);
              setCitiesList(res?.cities || []);
            }
          })
          .catch(err => {
            if (!isCancelled) {
              ShowToast('error', err?.data?.message || 'Error fetching cities');
              console.log('err', err);
            }
          });
      }
    }, 500); // 500ms debounce

    return () => {
      isCancelled = true;
      clearTimeout(delaySearch);
    };
  }, [searchQuery, latLng.latitude, latLng.longitude]);

  useEffect(() => {
    getTouristSpots()
      .unwrap()
      .then(res => {
        console.log('res of cities', res);
      })
      .catch(err => {
        ShowToast('error', err?.data?.message || 'Error fetching cities');
        console.log('err', err);
      });
  }, []);

  // Silently refetch cities when screen comes into focus (after adding review)
  useFocusEffect(
    useCallback(() => {
      if (latLng.latitude && latLng.longitude && !searchQuery.trim()) {
        getAllCities({
          latitude: latLng.latitude,
          longitude: latLng.longitude,
          maxDistance: 50000000,
        })
          .unwrap()
          .then(res => {
            setCitiesList(res?.cities || []);
          })
          .catch(err => {
            console.log('Error refetching cities on focus:', err);
          });
      }
    }, [latLng.latitude, latLng.longitude, searchQuery]),
  );

  const handleVideoPress = videoUrl => {
    setSelectedVideo(videoUrl);
    setVideoModalVisible(true);
  };

  return (
    <Container gap={1} hasTabBar={true}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(2),
          }}
        >
          <View style={styles.iconContainer}>
            <FontAwesome6 name="location-dot" size={25} color={colors.white} />
          </View>
          <View>
            <NormalText title="Your Location" />
            <BoldText
              numberOfLines={2}
              width={40}
              title="Louisiana,USA"
              size={2.5}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: responsiveHeight(1.5),
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.iconContainer}
          >
            <Ionicons name="notifications" size={26} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
            style={styles.iconContainer}
          >
            <FontAwesome5 name="user-alt" size={23} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <LineBreak val={3} />
      <BoldText title="Where are you going today?" size={3.4} />
      <LineBreak val={1.5} />
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1.4) }}>
        <InputField
          onChangeText={val => setSearchQuery(val)}
          placeHolderColor={colors.placeholderColor}
          width={90}
          value={searchQuery}
          showSearch
          mrgnLeft={4}
          placeholder="Search"
        />
        {/* <TouchableOpacity
          style={{
            backgroundColor: '#569BBD',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: responsiveHeight(1.5),
          }}
        >
          <MaterialIcons name="control-camera" color={colors.white} size={30} />
        </TouchableOpacity> */}
      </View>
      {/* <LineBreak val={3} /> */}
      {/* <ImageBackground
        source={images.banner}
        style={{
          height: responsiveHeight(20),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        imageStyle={{ borderRadius: responsiveHeight(2) }}
      >
        <LineBreak val={4} />
        <BoldText
          title="Special
Announcement
"
          color={colors.white}
          align="center"
        />
      </ImageBackground> */}
      <LineBreak val={2} />
      <ListHeading title="Ride the parkway" showSeeAll={false} />
      <TouchableOpacity style={{}} onPress={() => setIsVisible(!visible)}>
        <Image
          source={images.rideParkway}
          style={{
            width: '100%',
            height: responsiveHeight(26),
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      {visible && (
        <ImageView
          images={[images.rideParkway]} // 👈 correct way
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}

      <ListHeading
        title="Nearest Places"
        onSeeAllPress={() => navigation.navigate('NearbyPlaces')}
      />
      <LineBreak val={2} />
      {isLoading ? (
        <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.theme2} />
        </View>
      ) : (
        <NearestCities
          cities={citiesList}
          latLng={latLng}
          isLoading={isLoading}
          isFetching={isFetching}
          navigation={navigation}
          handleVideoPress={handleVideoPress}
        />
      )}
      <View
        style={{
          padding: responsiveHeight(2),
          borderColor: '#E2E2E2',
          borderWidth: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: responsiveHeight(2),
          marginTop: responsiveHeight(2),
        }}
      >
        <View style={{ gap: responsiveHeight(1) }}>
          <BoldText size={2.3} title="Who was Zachary Taylor?" />
          <Button
            onPress={() => navigation.navigate('ZacharyBio')}
            align="flex-start"
            title="Learn More"
            style={{
              width: responsiveWidth(31),
              paddingVertical: responsiveHeight(1.3),
            }}
          />
        </View>
        <Image resizeMode="contain" source={images.zacharyTaylor} />
      </View>
      <LineBreak val={2} />
      <ListHeading
        onSeeAllPress={() => navigation.navigate('Tours')}
        title="Tours in Louisiana"
      />
      <LineBreak val={2} />

      <View>
        {isLoadingTours ? (
          <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.theme2} />
          </View>
        ) : (
          <FlatList
            horizontal
            contentContainerStyle={{ gap: responsiveHeight(2),padding:responsiveHeight(1),paddingBottom:responsiveHeight(1.5) }}
            showsHorizontalScrollIndicator={false}
            data={toursData?.touristSpots || []}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              const [lng, lat] = item?.location?.coordinates || [];
              const distanceMetersTour = getDistanceMeters(latLng, {
                latitude: lat,
                longitude: lng,
              });
              const estimatedMinutesTour =
                getEstimatedMinutes(distanceMetersTour);
              return (
                <ToursCard
                  onPress={() => navigation.navigate('Map', { data: item })}
                  title={item.name}
                  subtitle={item.city?.name}
                  durationTitle={formatMinutes(estimatedMinutesTour)}
                  placesTitle="0 places"
                />
              );
            }}
          />
        )}
      </View>
      {/* <ListHeading mrgnTop={2} title="Videos" showSeeAll={false} />
      <View>
        <FlatList
          horizontal
          contentContainerStyle={{
            gap: responsiveHeight(2),
            marginTop: responsiveHeight(1),
          }}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={({}) => {
            return (
              <View>
                <Image
                  style={{
                    borderRadius: responsiveHeight(1.5),
                    height: responsiveHeight(16),
                    width: responsiveWidth(32),
                  }}
                  source={images.videos}
                />
                <View
                  style={{
                    height: '100%',
                    position: 'absolute',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.videoIconBg,
                      borderWidth: 2,
                      borderColor: colors.smallIconsBg,
                      padding: responsiveHeight(1.2),
                      borderRadius: responsiveHeight(3),
                    }}
                  >
                    <Ionicons name="play" color={colors.white} size={25} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View> */}

      {/* Full Screen Video Modal */}
      <Modal
        visible={videoModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.black }}>
          <TouchableOpacity
            onPress={() => setVideoModalVisible(false)}
            style={{
              position: 'absolute',
              top: responsiveHeight(5),
              right: responsiveWidth(5),
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: responsiveHeight(1),
              borderRadius: responsiveHeight(3),
            }}
          >
            <Ionicons name="close" color={colors.white} size={30} />
          </TouchableOpacity>

          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo }}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
              controls={true}
              resizeMode="contain"
              paused={false}
              onEnd={() => setVideoModalVisible(false)}
            />
          )}
        </View>
      </Modal>
    </Container>
  );
};

export default Home;
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.smallSideTxt,
    padding: responsiveHeight(1.45),
    width: responsiveWidth(13),
    borderRadius: responsiveHeight(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
