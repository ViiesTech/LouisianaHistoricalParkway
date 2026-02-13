/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { images } from '../../assets/images';
import colors from '../../assets/colors';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import BoldText from '../../components/BoldText';
import NormalText from '../../components/NormalText';
import LineBreak from '../../components/LineBreak';
import SmallContainer from '../../components/SmallContainer';
import { icons } from '../../icons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddToFavrt from '../../components/AddToFavrt';
import { createThumbnail } from 'react-native-create-thumbnail';
import Video from 'react-native-video';
import { useLazyGetAllCitiesQuery } from '../../redux/services/Main';
import {
  getCurrentLocation,
  getDistanceMeters,
  formatDistance,
  getEstimatedMinutes,
  formatMinutes,
} from '../../GlobalFunctions';
const NearbyPlaces = ({ navigation }) => {
  const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'distance'
  const [latLng, setLatLng] = useState({
    latitude: 37.421998,
    longitude: -122.084,
  });
  const [thumbnails, setThumbnails] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [cities, setCities] = useState([]);

  const [getAllCities, { isLoading, data, isFetching }] =
    useLazyGetAllCitiesQuery();

  // get current location on mount
  useEffect(() => {
    const init = async () => {
      const res: any = await getCurrentLocation();
      if (res && !res.error) setLatLng(res);
    };
    init();
  }, []);

  // fetch cities when sort or location changes
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCities([]); // clear before fetching
        if (sortBy === 'rating') {
          const res: any = await getAllCities({ byRating: true }).unwrap();
          setCities(res?.cities || []);
        } else {
          const params = {
            latitude: latLng.latitude,
            longitude: latLng.longitude,
            maxDistance:50000000
          };
          const res: any = await getAllCities(params).unwrap();
          setCities(res?.cities || []);
        }
      } catch (err) {
        setCities([]);
      }
    };

    if (
      sortBy === 'rating' ||
      (latLng && latLng.latitude && latLng.longitude)
    ) {
      fetchCities();
    }
  }, [sortBy, latLng]);

  // generate thumbnails for video galleries
  useEffect(() => {
    if (!cities || cities.length === 0) return;

    // Limit thumbnail cache size to prevent memory issues
    const MAX_THUMBNAILS = 50;

    cities.slice(0, 20).forEach(city => {
      const gallery = city.gallery || [];
      const video = gallery.find(
        u => u && (u.includes('.mp4') || u.includes('.mov')),
      );
      if (video && !thumbnails[video]) {
        createThumbnail({ url: video })
          .then(res => {
            setThumbnails(prev => {
              const keys = Object.keys(prev);
              if (keys.length >= MAX_THUMBNAILS) {
                // Remove oldest thumbnail
                const { [keys[0]]: removed, ...rest } = prev;
                return { ...rest, [video]: res.path };
              }
              return { ...prev, [video]: res.path };
            });
          })
          .catch(e => {
            // Silently fail to avoid console spam
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const markLoaded = key => {
    setLoadedImages(prev => {
      const keys = Object.keys(prev);
      // Limit loaded images cache to 100 items
      if (keys.length >= 100) {
        // Keep only recent 50
        const recentKeys = keys.slice(-50);
        const recentObj = {};
        recentKeys.forEach(k => {
          recentObj[k] = prev[k];
        });
        return { ...recentObj, [key]: true };
      }
      return { ...prev, [key]: true };
    });
  };
  return (
    <Container padding={0.001} hasTabBar={true}>
      <Header title="Nearby Places" showRightIcon={false} />
      <View style={{ padding: responsiveHeight(2) }}>
        {/* Top toggles: By Rating / By Distance */}
        <View
          style={{
            flexDirection: 'row',
            gap: responsiveHeight(1),
            marginBottom: responsiveHeight(1),
          }}
        >
          <TouchableOpacity
            onPress={() => setSortBy('rating')}
            style={{
              flex: 1,
              backgroundColor:
                sortBy === 'rating' ? colors.smallIconsBg : 'transparent',
              borderRadius: responsiveHeight(1.5),
              paddingVertical: responsiveHeight(1.8),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: sortBy === 'rating' ? 0 : 2,
              borderColor: colors.theme2,
            }}
          >
            <NormalText
              title="By Rating"
              color={sortBy === 'rating' ? '#fff' : colors.theme2}
              size={1.8}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('distance')}
            style={{
              flex: 1,
              backgroundColor:
                sortBy === 'distance' ? colors.smallIconsBg : 'transparent',
              borderRadius: responsiveHeight(1.5),
              paddingVertical: responsiveHeight(1.2),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: sortBy === 'distance' ? 0 : 2,
              borderColor: colors.theme2,
            }}
          >
            <NormalText
              title="By Distance"
              color={sortBy === 'distance' ? '#fff' : colors.theme2}
              size={1.8}
            />
          </TouchableOpacity>
        </View>
        <LineBreak val={2} />
        {isLoading ? (
          <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.theme2} />
          </View>
        ) : (
          <View style={{ position: 'relative' }}>
            <FlatList
              numColumns={2}
              data={cities}
              keyExtractor={item => item._id}
              contentContainerStyle={{
                paddingHorizontal: responsiveWidth(3),
                paddingBottom: responsiveHeight(4),
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: responsiveHeight(2),
              }}
              renderItem={({ item }) => {
                const gallery = item.gallery || [];
                const videoUrl = gallery.find(
                  u => u && (u.includes('.mp4') || u.includes('.mov')),
                );
                const imageUrl = gallery.find(
                  u => u && /\.(jpe?g|png)$/i.test(u),
                );
                const [cityLongitude, cityLatitude] =
                  item?.location?.coordinates || [];
                const distanceMeters = getDistanceMeters(latLng, {
                  latitude: cityLatitude,
                  longitude: cityLongitude,
                });
                const estimatedMinutes = getEstimatedMinutes(distanceMeters);

                const thumb = videoUrl ? thumbnails[videoUrl] : null;
                const loadKey = thumb || imageUrl || item._id;
                const isLoaded = !!loadedImages[loadKey];
                const reviews = item.review || [];
                const avgRating = reviews.length
                  ? (
                      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                      reviews.length
                    ).toFixed(1)
                  : null;

                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CityDetails', { cityData: item })
                    }
                    style={{
                      backgroundColor: colors.white,
                      borderRadius: responsiveHeight(2.5),
                      width: '48%',
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
                      {/* thumbnail or image */}
                      <View
                        style={{
                          borderTopRightRadius: responsiveHeight(2),
                          borderTopLeftRadius: responsiveHeight(2),
                          width: '100%',
                          height: responsiveHeight(20),
                          backgroundColor: colors.black,
                          overflow: 'hidden',
                        }}
                      >
                        {!isLoaded && (
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

                        {videoUrl ? (
                          thumb ? (
                            <Image
                              source={{ uri: thumb }}
                              style={{
                                width: '100%',
                                height: responsiveHeight(20),
                                opacity: isLoaded ? 1 : 0,
                                borderTopLeftRadius: responsiveHeight(2),
                                borderTopRightRadius: responsiveHeight(2),
                              }}
                              resizeMode="cover"
                              onLoad={() => markLoaded(loadKey)}
                              onError={() => markLoaded(loadKey)}
                            />
                          ) : null
                        ) : (
                          <Image
                            source={
                              imageUrl ? { uri: imageUrl } : images.historical
                            }
                            style={{
                              width: '100%',
                              height: responsiveHeight(20),
                              borderTopLeftRadius: responsiveHeight(2),
                              borderTopRightRadius: responsiveHeight(2),
                            }}
                            resizeMode="cover"
                            onLoad={() => markLoaded(loadKey)}
                            onError={() => markLoaded(loadKey)}
                          />
                        )}
                      </View>

                      <AddToFavrt
                        cityId={item._id}
                        style={{
                          position: 'absolute',
                          right: responsiveWidth(3),
                          top: responsiveHeight(1.2),
                          backgroundColor: '#F7DB44',
                          padding: responsiveHeight(0.8),
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

                      {sortBy === 'rating' && avgRating && (
                        <View
                          style={{
                            position: 'absolute',
                            top: responsiveHeight(2),
                            left: responsiveWidth(2),
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.black,
                            gap: responsiveHeight(0.5),
                            paddingVertical: responsiveHeight(0.4),
                            paddingHorizontal: responsiveWidth(1.5),
                            borderRadius: responsiveHeight(2.2),
                          }}
                        >
                          <FontAwesome6
                            name="star"
                            size={12}
                            color={colors.white}
                          />
                          <NormalText
                            title={String(avgRating)}
                            size={1.4}
                            color={colors.white}
                            style={{ marginLeft: responsiveWidth(1) }}
                          />
                        </View>
                      )}

                      {videoUrl && (
                        <View
                          style={{
                            position: 'absolute',
                            height: responsiveHeight(20),
                            justifyContent: 'center',
                            alignSelf: 'center',
                            width: '100%',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedVideo(videoUrl);
                              setVideoModalVisible(true);
                            }}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              padding: responsiveHeight(1.4),
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
                              alignSelf: 'center',
                            }}
                          >
                            <Ionicons
                              name="play"
                              color={colors.theme2}
                              size={22}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View style={{ padding: responsiveHeight(1.5) }}>
                      <BoldText numberOfLines={1} size={2.2} title={item?.name} />
                      <LineBreak val={0.8} />
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: responsiveHeight(0.8),
                          alignItems: 'flex-start',
                        }}
                      >
                        <FontAwesome6
                          name="location-dot"
                          size={16}
                          color={colors.theme2}
                          style={{ marginTop: 2 }}
                        />
                        <NormalText
                          size={1.5}
                          numberOfLines={2}
                          title={item?.address}
                          color={colors.labelColor}
                          style={{ flexShrink: 1 }}
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
                          width={9}
                          iconSize={16}
                          icon={icons.navigation}
                        />

                        <SmallContainer
                          width={9}
                          iconSize={16}
                          icon={icons.clock}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => {
                if (isFetching) return null; // while fetching, show overlay loader only

                return (
                  <View
                    style={{
                      padding: responsiveHeight(8),
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: responsiveHeight(14),
                        height: responsiveHeight(14),
                        borderRadius: responsiveHeight(7),
                        backgroundColor: '#111111',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: responsiveHeight(2),
                      }}
                    >
                      <FontAwesome6
                        name="map-pin"
                        size={32}
                        color={colors.white}
                      />
                    </View>
                    <BoldText
                      title={isLoading ? 'Loading...' : 'No cities nearby'}
                      size={2.2}
                    />
                    <NormalText
                      title={
                        isLoading
                          ? 'Fetching results'
                          : "We couldn't find nearby cities."
                      }
                      width={70}
                      size={1.6}
                      align="center"
                    />
                  </View>
                );
              }}
            />

            {isFetching && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                }}
              >
                <ActivityIndicator size="large" color={colors.theme2} />
              </View>
            )}

            {/* Video Modal */}
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
          </View>
        )}
      </View>
    </Container>
  );
};

export default NearbyPlaces;
