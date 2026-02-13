/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  getCurrentLocation,
  getDistanceMeters,
  getEstimatedMinutes,
  formatMinutes,
  formatDistance,
} from '../../GlobalFunctions';

const Map = ({ navigation, route }) => {
  const { data } = route.params;

  // Extract coordinates properly - GeoJSON format is [longitude, latitude]
  const coordinates = data?.location?.coordinates || [-122.084, 37.421998];
  const lng = typeof coordinates[0] === 'number' ? coordinates[0] : -122.084;
  const lat = typeof coordinates[1] === 'number' ? coordinates[1] : 37.421998;

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  console.log('distance===', distance);

  // Reset image error state when data changes
  useEffect(() => {
    setImageLoadError(false);
  }, [data]);

  // Handle different data types: business, city, or tour
  const getName = () => {
    return data?.name || 'Location';
  };

  const getAddress = () => {
    // For tours, the address is in city.address
    // For business and cities, the address is directly on data.address
    return (
      data?.address ||
      data?.city?.address ||
      '47 W 13th St, New York, NY 10011, USA'
    );
  };

  const getFirstImage = () => {
    // Try multiple sources for gallery
    const gallery = data?.gallery || [];
    const cityGallery = data?.city?.gallery || [];
    const tourGallery = data?.gallery || [];
    console.log('tourGallery', tourGallery);

    // Combine all possible gallery sources
    const allImages = [...gallery, ...cityGallery, ...tourGallery];

    console.log('All gallery items:', allImages);
    console.log('Data structure:', {
      hasGallery: gallery.length > 0,
      hasCityGallery: cityGallery.length > 0,
      hasTourGallery: tourGallery.length > 0,
    });

    // Filter to get only image files (not videos)
    const imageFiles = allImages.filter((url: string) => {
      if (!url) return false;
      const urlString = String(url).toLowerCase().trim();
      const isImage = urlString.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      return isImage;
    });

    console.log('Filtered image files:', imageFiles);
    const firstImage = imageFiles.length > 0 ? imageFiles[0] : null;
    console.log('First image to display:', firstImage);
    return firstImage;
  };

  console.log('mapData', data);
  console.log('Raw coordinates:', data?.location?.coordinates);
  console.log('Extracted - lng:', lng, 'lat:', lat);
  console.log('Types - lng:', typeof lng, 'lat:', typeof lat);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const response: any = await getCurrentLocation();
      if (response && !response.error) {
        setCurrentLocation({
          latitude: response.latitude,
          longitude: response.longitude,
        });

        // Calculate distance and time
        console.log('User location:', response.latitude, response.longitude);
        console.log('Destination:', 'lat:', lat, 'lng:', lng);

        if (typeof lat === 'number' && typeof lng === 'number') {
          const distanceMeters = getDistanceMeters(
            { latitude: response.latitude, longitude: response.longitude },
            { latitude: lat, longitude: lng },
          );
          console.log('Calculated distance:', distanceMeters);
          setDistance(distanceMeters);

          const estimatedMinutes = getEstimatedMinutes(distanceMeters);
          setDuration(estimatedMinutes);
        } else {
          console.log('Invalid coordinates - lat or lng is not a number');
        }
      }
    } catch (error) {
      console.log('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const businessLocation = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
    }),
    [lat, lng],
  );

  const initialMapRegion = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    [lat, lng],
  );

  return (
    <Container padding={0.001}>
      <Header showRightIcon={false} />
      <View style={{ paddingHorizontal: responsiveHeight(2.2) }}>
        <BoldText title="Louisiana" />
      </View>

      <View
        style={{
          flex: 1,
          marginTop: responsiveHeight(2),
        }}
      >
        <MapView
          userInterfaceStyle="light"
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={initialMapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          moveOnMarkerPress={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          {/* Location Marker */}
          <Marker
            coordinate={businessLocation}
            title={getName()}
            description={getAddress()}
            pinColor={colors.theme2}
          >
            <View
              style={{
                backgroundColor: colors.theme2,
                padding: 8,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: colors.white,
              }}
            >
              <FontAwesome6
                name="location-dot"
                size={24}
                color={colors.white}
              />
            </View>
          </Marker>
        </MapView>
        <View>
          {/* <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              gap: responsiveHeight(2),
              padding: responsiveHeight(2),
            }}
            data={[images.Rapides, images.restaurant2]}
            renderItem={({ item, index }) => {
              return (
               
              );
            }}
          /> */}
          <View
            style={{ gap: responsiveHeight(2), padding: responsiveHeight(2) }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('MapRoutes', { data })}
              // onPress={() => navigation.navigate('LocationDetails')}
              style={{
                backgroundColor: colors.white,
                borderRadius: responsiveHeight(2),
                elevation: 5,
                flexDirection: 'row',
                width: responsiveWidth(92),
                gap: responsiveHeight(2),
                padding: responsiveHeight(1.5),
              }}
            >
              {(() => {
                const firstImage = getFirstImage();
                console.log(
                  'Rendering with image:',
                  firstImage,
                  'Error state:',
                  imageLoadError,
                );
                return firstImage && !imageLoadError ? (
                  <FastImage
                    source={{
                      uri: firstImage,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      width: responsiveWidth(29.5),
                      height: responsiveHeight(16),
                      borderRadius: responsiveHeight(2),
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onError={e => {
                      console.log('Image load error:', e.nativeEvent.error);
                      setImageLoadError(true);
                    }}
                  />
                ) : (
                  <ImageBackground
                    source={images.themeBg}
                    style={{
                      width: responsiveWidth(29.5),
                      height: responsiveHeight(16),
                      borderRadius: responsiveHeight(2),
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    imageStyle={{
                      borderRadius: responsiveHeight(2),
                    }}
                    resizeMode="cover"
                  >
                    <View
                      style={{
                        backgroundColor: 'rgba(74, 144, 226, 0.85)',
                        borderRadius: responsiveHeight(1.5),
                        padding: responsiveHeight(2),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <FontAwesome6
                        name="map-location-dot"
                        size={45}
                        color={colors.white}
                      />
                    </View>
                  </ImageBackground>
                );
              })()}
              <View
                style={{
                  flex: 0.9,
                  marginTop: responsiveHeight(0.5),
                  right: 3,
                }}
              >
                <BoldText numberOfLines={1} size={2.5} title={getName()} />
                <View
                  style={{
                    flexDirection: 'row',
                    right: 5,
                    marginTop: responsiveHeight(0.5),
                    gap: responsiveHeight(2),
                  }}
                >
                  <View style={{ marginTop: 5 }}>
                    <FontAwesome6
                      name="location-dot"
                      size={25}
                      color={colors.theme2}
                    />
                  </View>
                  <NormalText
                    width={45}
                    numberOfLines={3}
                    title={getAddress()}
                  />
                </View>
                <LineBreak val={1} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsiveHeight(1),
                  }}
                >
                  <SmallContainer
                    // handlePress={() =>
                    //   navigation.navigate('MapRoutes', { data })
                    // }
                    width={10}
                    icon={icons.navigation}
                    title={distance !== null ? formatDistance(distance) : 'N/A'}
                  />
                  <SmallContainer
                    width={10}
                    icon={icons.clock}
                    title={duration !== null ? formatMinutes(duration) : 'N/A'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default memo(Map);
