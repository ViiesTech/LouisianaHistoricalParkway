/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createThumbnail } from 'react-native-create-thumbnail';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';
import NormalText from './NormalText';
import BoldText from './BoldText';
import LineBreak from './LineBreak';
import SmallContainer from './SmallContainer';
import { icons } from '../icons';
import colors from '../assets/colors';
import { images } from '../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getDistanceMeters,
  formatDistance,
  getEstimatedMinutes,
  formatMinutes,
} from '../GlobalFunctions';
import AddToFavrt from './AddToFavrt';

const getFirstVideoFromGallery = gallery => {
  if (!gallery || gallery.length === 0) return null;
  return gallery.find(item => item.includes('.mp4') || item.includes('.mov'));
};

const NearestCities = ({
  cities = [],
  latLng,
  isLoading,
  isFetching,
  navigation,
  handleVideoPress,
}) => {
  const [thumbnails, setThumbnails] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  console.log('cities', cities);

  const markLoaded = key => {
    setLoadedImages(prev => ({ ...prev, [key]: true }));
  };

  useEffect(() => {
    if (!cities || cities.length === 0) return;

    cities.forEach(city => {
      const videoUrl = getFirstVideoFromGallery(city.gallery);
      if (videoUrl && !thumbnails[videoUrl]) {
        createThumbnail({ url: videoUrl })
          .then(response => {
            setThumbnails(prev => ({ ...prev, [videoUrl]: response.path }));
          })
          .catch(err => {
            console.log('Thumbnail generation failed for', videoUrl, err);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);
  return (
    <View style={{}}>
      <FlatList
        horizontal
        contentContainerStyle={{
          gap: responsiveHeight(2),
          padding: responsiveHeight(1),
        }}
        data={cities}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          const videoUrl = getFirstVideoFromGallery(item.gallery);
          const imageUrl = item.gallery?.find(
            url =>
              url.includes('.jpeg') ||
              url.includes('.jpg') ||
              url.includes('.png'),
          );
          const [cityLongitude, cityLatitude] =
            item?.location?.coordinates || [];
          const distanceMeters = getDistanceMeters(latLng, {
            latitude: cityLatitude,
            longitude: cityLongitude,
          });
          const estimatedMinutes = getEstimatedMinutes(distanceMeters);

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CityDetails', { cityData: item })
              }
              style={{
                backgroundColor: colors.white,
                borderRadius: responsiveHeight(2.5),
                width: responsiveWidth(70),
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 5,
                overflow: 'hidden',
              }}
            >
              <View>
                {/* Display video thumbnail or image */}
                {videoUrl ? (
                  <View>
                    {thumbnails[videoUrl] ? (
                      <View
                        style={{
                          borderTopRightRadius: responsiveHeight(2),
                          borderTopLeftRadius: responsiveHeight(2),
                          width: '100%',
                          height: responsiveHeight(22),
                          backgroundColor: colors.black,
                        }}
                      >
                        {!loadedImages[thumbnails[videoUrl]] && (
                          <View
                            style={{
                              ...StyleSheet.absoluteFillObject,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <ActivityIndicator
                              size="large"
                              color={colors.white}
                            />
                          </View>
                        )}
                        <FastImage
                          source={{
                            uri: thumbnails[videoUrl],
                            priority: FastImage.priority.normal,
                          }}
                          style={{
                            borderTopRightRadius: responsiveHeight(2),
                            borderTopLeftRadius: responsiveHeight(2),
                            width: '100%',
                            height: responsiveHeight(22),
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          onLoad={() => markLoaded(thumbnails[videoUrl])}
                          onError={() => markLoaded(thumbnails[videoUrl])}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          borderTopRightRadius: responsiveHeight(2),
                          borderTopLeftRadius: responsiveHeight(2),
                          width: '100%',
                          height: responsiveHeight(22),
                          backgroundColor: colors.black,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ActivityIndicator size="large" color={colors.white} />
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      borderTopRightRadius: responsiveHeight(2),
                      borderTopLeftRadius: responsiveHeight(2),
                      width: '100%',
                      height: responsiveHeight(22),
                      backgroundColor: colors.black,
                    }}
                  >
                    {!loadedImages[imageUrl || item._id] && (
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ActivityIndicator size="large" color={colors.white} />
                      </View>
                    )}
                    <FastImage
                      source={
                        imageUrl
                          ? {
                              uri: imageUrl,
                              priority: FastImage.priority.normal,
                            }
                          : images.historical
                      }
                      style={{
                        borderTopRightRadius: responsiveHeight(2),
                        borderTopLeftRadius: responsiveHeight(2),
                        width: '100%',
                        height: responsiveHeight(22),
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      onLoad={() => markLoaded(imageUrl || item._id)}
                      onError={() => markLoaded(imageUrl || item._id)}
                    />
                  </View>
                )}

                {/* <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={25}
                    color={colors.black}
                  />
                </TouchableOpacity> */}
                <AddToFavrt
                  cityId={item._id}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    backgroundColor: '#F7DB44',
                    padding: responsiveHeight(1),
                    borderRadius: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.5,
                    elevation: 5,
                  }}
                />

                {/* Play button - only show if video exists */}
                {videoUrl && (
                  <View
                    style={{
                      position: 'absolute',
                      height: responsiveHeight(22),
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleVideoPress && handleVideoPress(videoUrl)
                      }
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: responsiveHeight(1.8),
                        borderRadius: 999,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}
                    >
                      <Ionicons name="play" color={colors.theme2} size={28} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={{ padding: responsiveHeight(2.5) }}>
                <BoldText size={2.5} title={item.name} />
                <LineBreak val={1} />
                <View
                  style={{
                    flexDirection: 'row',
                    gap: responsiveHeight(1),
                    alignItems: 'flex-start',
                  }}
                >
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color={colors.theme2}
                    style={{ marginTop: 2 }}
                  />
                  <NormalText
                    width={53}
                    title={item.address}
                    size={1.8}
                    color={colors.labelColor}
                  />
                </View>
                <LineBreak val={2} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsiveHeight(1.5),
                  }}
                >
                  <SmallContainer
                    iconSize={18}
                    width={10}
                    icon={icons.navigation}
                  />
                  <SmallContainer iconSize={18} width={10} icon={icons.clock} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <NormalText
            title={
              isLoading || isFetching
                ? 'Loading cities...'
                : 'No cities found nearby'
            }
          />
        )}
      />
    </View>
  );
};

export default NearestCities;
