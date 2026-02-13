/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Modal,
  Dimensions,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import Container from '../../components/Container';
import { images } from '../../assets/images';
import Video from 'react-native-video';
import {
  ShowToast,
  getCurrentLocation,
  getDistanceMeters,
} from '../../GlobalFunctions';
import { fetchNearbyPlaces } from '../../GlobalFunctions/places';
import { createThumbnail } from 'react-native-create-thumbnail';
import ImageView from 'react-native-image-viewing';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../utils/helperFunctions';
import colors from '../../assets/colors';
import NormalText from '../../components/NormalText';
import SmallContainer from '../../components/SmallContainer';
import { icons } from '../../icons';
import fonts from '../../assets/fonts';
import BoldText from '../../components/BoldText';
import LineBreak from '../../components/LineBreak';
import Button from '../../components/Button';
import ListHeading from '../../components/ListHeading';
import PopularPlacesList from '../../components/PopularPlacesList';
import ToursCard from '../../components/ToursCard';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useAddCityReviewMutation,
  useLazyGetAllCitiesQuery,
  useLazyGetSingleCityQuery,
  useMarkAsVisitedMutation,
} from '../../redux/services/Main';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices';
import { APIKEY } from '../../redux/constant';

const CityDetails = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('About');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [addCityReview, { isLoading }] = useAddCityReviewMutation();
  const [markAsVisited, { isLoading: isMarkingAsVisited }] =
    useMarkAsVisitedMutation();
  const dispatch = useDispatch();
  const [getAllCities] = useLazyGetAllCitiesQuery();
  const [getSingleCity] = useLazyGetSingleCityQuery();
  const { isGuest, user } = useSelector(state => state.persistedData);

  const { cityData } = route.params || {};
  console.log('cityData', cityData._id);
  console.log('user?.visitedCities', user?.visitedCities);

  const [userLocation, setUserLocation] = useState(null);
  const [distanceText, setDistanceText] = useState('');
  const visitedCities = user?.visitedCities || [];
  const isVisited = !!visitedCities.find(v => {
    try {
      if (v && typeof v === 'object' && v._id)
        return String(v._id) === String(cityData?._id);
      return String(v) === String(cityData?._id);
    } catch (e) {
      return false;
    }
  });
  console.log('isVisited', isVisited);
  const [localVisited, setLocalVisited] = useState(isVisited);
  const [marking, setMarking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshingReviews, setIsRefreshingReviews] = useState(false);

  useEffect(() => {
    const gallery = cityData?.gallery || [];
    gallery.forEach(item => {
      const url = String(item || '');
      const isVideo = /\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(url);
      if (isVideo && !thumbnails[url]) {
        createThumbnail({ url })
          .then(response => {
            setThumbnails(prev => ({ ...prev, [url]: response.path }));
          })
          .catch(err => {
            console.log('Thumbnail generation failed for', url, err);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityData]);

  const getCurrentLocationHandler = async () => {
    try {
      const response = await getCurrentLocation();
      if (response && !response.error) {
        setUserLocation(response);
        const coords = cityData?.location?.coordinates || [];
        const [lng, lat] = coords;
        if (lat != null && lng != null) {
          const meters = getDistanceMeters(response, {
            latitude: lat,
            longitude: lng,
          });
          if (typeof meters === 'number') {
            const miles = meters / 1609.344;
            setDistanceText(`${miles.toFixed(1)} miles away`);
          }
        }
      }
    } catch (e) {
      console.log('Error getting current location in CityDetails', e);
    }
  };

  const openWebsite = async () => {
    let url = cityData?.website;
    if (!url) return ShowToast('error', 'Website not available');
    try {
      url = String(url).trim();
      // ensure scheme
      if (!/^https?:\/\//i.test(url)) {
        url = `http://${url}`;
      }
      // encode unsafe chars
      url = encodeURI(url);

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        // try anyway; on some Android versions canOpenURL may be unreliable for http(s)
        await Linking.openURL(url);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      console.log('openWebsite error', e);
      ShowToast('error', 'Could not open the link');
    }
  };

  useEffect(() => {
    getCurrentLocationHandler();
  }, [cityData]);

  useEffect(() => {
    const visited = !!visitedCities.find(v => {
      try {
        if (v && typeof v === 'object' && v._id)
          return String(v._id) === String(cityData?._id);
        return String(v) === String(cityData?._id);
      } catch (e) {
        return false;
      }
    });
    console.log('Visited debug:', {
      visitedCities,
      cityId: cityData?._id,
      visited,
      localVisited,
    });
    setLocalVisited(visited);
  }, [visitedCities, cityData?._id]);

  const avgRating = useMemo(() => {
    const rev = cityData?.review || [];
    if (!rev || rev.length === 0) return 0;
    const sum = rev.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return sum / rev.length;
  }, [cityData]);
  const totalReviews = (cityData?.review || []).length;

  const imageItems = useMemo(() => {
    const imgs = (cityData?.gallery || []).filter(u =>
      /\.(jpe?g|png|gif|webp|jpeg)$/i.test(String(u || '')),
    );
    return imgs.map(u => ({ uri: String(u) }));
  }, [cityData]);
  console.log('imageitems', imageItems);

  // Google Places: read from environment - DO NOT commit your API key.
  // Configure via react-native-config or your build environment and rebuild the app.
  const GOOGLE_PLACES_API_KEY =
    (process && process.env && process.env.GOOGLE_PLACES_API_KEY) || APIKEY;
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [googlePlacesLoading, setGooglePlacesLoading] = useState(false);

  const fetchGooglePlaces = async () => {
    if (!cityData?.location?.coordinates) return setGooglePlaces([]);
    const [lng, lat] = cityData.location.coordinates;
    setGooglePlacesLoading(true);
    try {
      const results = await fetchNearbyPlaces({
        latitude: lat,
        longitude: lng,
        apiKey: GOOGLE_PLACES_API_KEY,
        radius: 3000,
        type: 'tourist_attraction',
      });
      setGooglePlaces(results || []);
    } catch (e) {
      console.log('Error fetching nearby places', e);
      setGooglePlaces([]);
    } finally {
      setGooglePlacesLoading(false);
    }
  };

  useEffect(() => {
    fetchGooglePlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityData]);

  const popularPlaces = [
    { id: 1, image: images.Rapides, title: 'Rapides Parish' },
    { id: 2, image: images.Avoyelles, title: 'Avoyelles Parish' },
    { id: 3, image: images.Rapides, title: 'Washington Parish' },
  ];

  const photos = [
    { id: 1, image: images.Rapides },
    { id: 2, image: images.Avoyelles },
    { id: 3, image: images.Rapides },
  ];

  const renderAboutTab = () => (
    <View>
      <BoldText color={colors.black} title="Description" size={2.4} />
      <LineBreak val={1} />
      <NormalText
        color={colors.theme}
        title={cityData?.description || 'Description not available.'}
      />
      <LineBreak val={2} />

      <BoldText color={colors.black} title="History" size={2.4} />
      <LineBreak val={1} />
      <NormalText
        color={colors.theme}
        title={cityData?.history || 'History not available.'}
      />
      <LineBreak val={2} />

      <BoldText
        color={colors.black}
        title="Photo Gallery & Videos"
        size={2.4}
      />
      <LineBreak val={1.5} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: responsiveHeight(1) }}
        data={(cityData?.gallery || []).filter(Boolean)}
        keyExtractor={(item, index) => String(index) + '-' + String(item)}
        renderItem={({ item }) => {
          const url = String(item || '');
          const isVideo = /\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(url);
          if (isVideo) {
            const thumb = thumbnails[url];
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedVideo(url);
                  setVideoLoading(true);
                  setVideoModalVisible(true);
                }}
                style={{ marginRight: responsiveHeight(1) }}
              >
                {thumb ? (
                  <FastImage
                    source={{ uri: thumb, priority: FastImage.priority.normal }}
                    style={styles.photoThumb}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View
                    style={[styles.photoThumb, { backgroundColor: '#000' }]}
                  />
                )}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  pointerEvents="none"
                >
                  <Ionicons name="play-circle" color={colors.white} size={36} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => {
                const idx = imageItems.findIndex(i => i.uri === url);
                setImageViewerIndex(idx >= 0 ? idx : 0);
                setImageViewerVisible(true);
              }}
            >
              <FastImage
                source={{ uri: url, priority: FastImage.priority.normal }}
                style={styles.photoThumb}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          );
        }}
      />
      <LineBreak val={2} />

      <ListHeading
        title="Popular Places"
        onSeeAllPress={() =>
          navigation.navigate('PopularPlaces', {
            location: cityData.location.coordinates,
          })
        }
      />
      <LineBreak val={1.5} />
      {/* {googlePlacesLoading ? (
        <View
          style={{ paddingVertical: responsiveHeight(3), alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.theme2} />
          <LineBreak val={1} />
          <NormalText
            title="Loading popular places..."
            color={colors.placeholderColor}
          />
        </View>
      ) : googlePlaces.length === 0 ? (
        <View
          style={{ paddingVertical: responsiveHeight(3), alignItems: 'center' }}
        >
          <Ionicons
            name="location-outline"
            size={60}
            color={colors.placeholderColor}
          />
          <LineBreak val={1} />
          <NormalText
            title="No popular places found"
            color={colors.placeholderColor}
            align="center"
          />
        </View>
      ) : (
        <PopularPlacesList
          googlePlaces={googlePlaces}
          fallback={[]}
          navigation={navigation}
          apiKey={GOOGLE_PLACES_API_KEY}
          maxItems={5}
        />
      )} */}
      <View
        style={{ paddingVertical: responsiveHeight(3), alignItems: 'center' }}
      >
        <Ionicons
          name="location-outline"
          size={60}
          color={colors.placeholderColor}
        />
        <LineBreak val={1} />
        <NormalText
          title="No popular places found"
          color={colors.placeholderColor}
          align="center"
        />
      </View>
    </View>
  );

  const renderInfoTab = () => (
    <View>
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={20} color={colors.labelColor} />
        <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
          <NormalText color={colors.labelColor} title="Address" size={1.8} />
          <NormalText
            color={colors.black}
            title={cityData?.address || 'Address not available'}
            size={2}
            font={fonts.Semi_Bold}
          />
        </View>
      </View>
      <LineBreak val={2} />

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color={colors.labelColor} />
        <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
          <NormalText color={colors.labelColor} title="Hours" size={1.8} />
          <NormalText
            color={colors.black}
            title={cityData?.hours || 'Hours not available'}
            size={2}
            font={fonts.Semi_Bold}
          />
        </View>
      </View>
      <LineBreak val={2} />

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={20} color={colors.labelColor} />
        <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
          <NormalText color={colors.labelColor} title="Phone" size={1.8} />
          <NormalText
            color={colors.theme2}
            title={
              cityData?.phone ? String(cityData.phone) : 'Phone not available'
            }
            size={2}
            font={fonts.Semi_Bold}
          />
        </View>
      </View>
      <LineBreak val={2} />

      <View style={styles.infoRow}>
        <Ionicons name="globe-outline" size={20} color={colors.labelColor} />
        <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
          <NormalText color={colors.labelColor} title="Website" size={1.8} />
          <TouchableOpacity
            onPress={openWebsite}
            disabled={!cityData?.website}
            accessibilityRole="link"
          >
            <NormalText
              color={
                cityData?.website ? colors.theme2 : colors.placeholderColor
              }
              title={cityData?.website || 'Website not available'}
              size={2}
              font={fonts.Semi_Bold}
            />
          </TouchableOpacity>
        </View>
      </View>
      <LineBreak val={3} />

      <ListHeading
        title="Popular Places"
        onSeeAllPress={() =>
          navigation.navigate('PopularPlaces', {
            location: cityData.location.coordinates,
          })
        }
      />
      <LineBreak val={1.5} />
      {googlePlacesLoading ? (
        <View
          style={{ paddingVertical: responsiveHeight(3), alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.theme2} />
          <LineBreak val={1} />
          <NormalText
            title="Loading popular places..."
            color={colors.placeholderColor}
          />
        </View>
      ) : googlePlaces.length === 0 ? (
        <View
          style={{ paddingVertical: responsiveHeight(3), alignItems: 'center' }}
        >
          <Ionicons
            name="location-outline"
            size={60}
            color={colors.placeholderColor}
          />
          <LineBreak val={1} />
          <NormalText
            title="No popular places found"
            color={colors.placeholderColor}
            align="center"
          />
        </View>
      ) : (
        <PopularPlacesList
          googlePlaces={googlePlaces}
          fallback={popularPlaces}
          navigation={navigation}
          apiKey={GOOGLE_PLACES_API_KEY}
          maxItems={5}
        />
      )}
    </View>
  );

  const renderReviewTab = () => (
    <View>
      {isGuest ? null : (
        <View
          style={{
            borderWidth: 1.5,
            borderColor: colors.border,
            padding: responsiveHeight(2),
            borderRadius: responsiveHeight(1.5),
          }}
        >
          <BoldText color={colors.black} title="Write a Review" size={2.4} />
          <LineBreak val={1.5} />

          <NormalText color={colors.black} title="Your Rating" size={1.8} />
          <LineBreak val={0.5} />
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <AntDesign
                  name={star <= rating ? 'star' : 'staro'}
                  size={28}
                  color={star <= rating ? '#FDBA0F' : '#D1D5DC'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <LineBreak val={2} />

          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience..."
            placeholderTextColor={colors.placeholderColor2}
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />
          <LineBreak val={2} />

          <Button
            disabled={isLoading || !reviewText || rating === 0}
            onPress={handleSubmitReview}
            title={
              isLoading ? (
                <ActivityIndicator size={30} color={colors.white} />
              ) : (
                'Submit Review'
              )
            }
            buttonWidth={81}
            style={{
              backgroundColor: colors.theme2,
              height: responsiveHeight(6),
              alignItems: 'center',
              justifyContent: 'center',
              opacity: (isLoading || !reviewText || rating === 0) ? 0.5 : 1,
            }}
          />
        </View>
      )}
      <LineBreak val={3} />

      {/* Beautiful loading indicator while refreshing reviews */}
      {isRefreshingReviews && (
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: responsiveHeight(3),
            borderRadius: responsiveHeight(2),
            alignItems: 'center',
            marginBottom: responsiveHeight(2),
            borderWidth: 1,
            borderColor: colors.theme2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <ActivityIndicator size="large" color={colors.theme2} />
          <LineBreak val={1} />
          <BoldText
            title="Updating reviews..."
            color={colors.theme2}
            size={2}
          />
          <NormalText
            title="Just a moment"
            color={colors.labelColor}
            size={1.6}
          />
        </View>
      )}

      {(cityData.review || [])
        .slice()
        .reverse()
        .map(review => (
          <View key={review._id || review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              {review.user?.profile ? (
                <FastImage
                  source={{
                    uri: review.user.profile,
                    priority: FastImage.priority.low,
                  }}
                  style={styles.avatar}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(review.user?.email || 'U').charAt(0)}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: responsiveHeight(1.5) }}>
                <BoldText
                  color={colors.black}
                  title={review.user?.email || 'Anonymous'}
                  size={2}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsiveHeight(0.5),
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AntDesign
                        key={i}
                        name={i < (review.rating || 0) ? 'star' : 'staro'}
                        size={14}
                        color="#FDBA0F"
                      />
                    ))}
                  </View>
                  <NormalText
                    color={colors.labelColor}
                    title={moment(review.createdAt).format('MMM D, YYYY')}
                    size={1.6}
                  />
                </View>
              </View>
            </View>
            <LineBreak val={1} />
            <NormalText
              color="#4A5565"
              title={review.comment || review.text || ''}
              size={1.8}
            />
            <LineBreak val={2} />
          </View>
        ))}
    </View>
  );

  const handleSubmitReview = () => {
    if (rating === 0) {
      ShowToast('error', 'Please provide a rating.');
      return;
    }
    if (reviewText.trim() === '') {
      ShowToast('error', 'Please write a review.');
      return;
    }
    addCityReview({
      _id: cityData?._id,
      reviewData: { rating, comment: reviewText },
    })
      .unwrap()
      .then(response => {
        if (response?.success) {
          ShowToast('success', 'Review submitted successfully.');
          setReviewText('');
          setRating(0);
          // Show loading indicator while fetching updated reviews
          setIsRefreshingReviews(true);
          getSingleCity(cityData?._id)
            .unwrap()
            .then(res => {
              navigation.setParams({ cityData: res?.city });
            })
            .catch(err => console.log('Error refetching reviews:', err))
            .finally(() => {
              // Add a small delay for smooth UX
              setTimeout(() => setIsRefreshingReviews(false), 300);
            });
        } else {
          ShowToast('error', response?.message || 'Failed to submit review.');
        }
      })
      .catch(err => {
        ShowToast('error', err?.data?.message || 'Failed to submit review.');
      });
  };

  const handleMarkVisited = async () => {
    if (isGuest) {
      ShowToast('error', 'Please sign in to mark places as visited');
      return;
    }

    if (!cityData?._id || marking) return;

    setMarking(true);

    try {
      await markAsVisited(cityData._id).unwrap();

      let updatedVisited = Array.isArray(user?.visitedCities)
        ? [...user.visitedCities]
        : [];

      const alreadyVisited = updatedVisited.some(
        item => String(item._id) === String(cityData._id),
      );

      if (alreadyVisited) {
        // REMOVE
        updatedVisited = updatedVisited.filter(
          item => String(item._id) !== String(cityData._id),
        );
      } else {
        // ADD FULL OBJECT
        updatedVisited.push(cityData);
      }

      dispatch(
        setUserData({
          ...user,
          visitedCities: updatedVisited,
        }),
      );
    } catch (error) {
      console.log('markAsVisited error', error);
      ShowToast('error', 'Could not update visited status.');
    } finally {
      setMarking(false);
    }
  };

  // Get first image from gallery for background
  const getBackgroundImage = () => {
    const gallery = cityData?.gallery || [];
    if (gallery.length > 0) {
      const firstItem = gallery[0];
      const url = String(firstItem || '');
      // Check if it's not a video
      const isVideo = /\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(url);
      if (!isVideo) {
        return { uri: url };
      }
      // If first item is video, try to find first image
      const firstImage = gallery.find(item => {
        const itemUrl = String(item || '');
        return !/\.(mp4|mov|m4v|webm|ogg|mpeg)$/i.test(itemUrl);
      });
      if (firstImage) {
        return { uri: String(firstImage) };
      }
    }
    // Fallback to default background
    return images.welcomeBg;
  };

  return (
    <Container enableKeyboardAvoidingView padding={0.01}>
      <ImageBackground
        source={getBackgroundImage()}
        style={{ width: '100%', height: responsiveHeight(27) }}
      >
        <Header
          iconOnly={false}
          pVertical={1}
          padding={1}
          cityId={cityData?._id}
          isProcessing={isProcessing}
          onProcessingChange={setIsProcessing}
        />
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.tagText}>United States</Text>
            <SmallContainer
              handlePress={() => navigation.navigate('Map', { data: cityData })}
              title="Route"
              disabled={false}
              icon={icons.navigation}
              width={10}
            />
          </View>
          <LineBreak val={1} />
          <BoldText color="#363E44" title="Louisiana" size={4} />
          <View
            style={{
              backgroundColor: colors.black,
              padding: responsiveHeight(0.5),
              width: responsiveWidth(27),
              alignItems: 'center',
              borderRadius: responsiveHeight(1.4),
            }}
          >
            <NormalText
              title={cityData?.type}
              size={1.8}
              color={colors.white}
            />
          </View>
          <LineBreak val={0.5} />
          <NormalText
            color={colors.theme}
            title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam..."
          />
          <LineBreak val={1.5} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: responsiveHeight(2),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(0.5),
              }}
            >
              <AntDesign name="star" size={16} color="#FDBA0F" />
              <NormalText
                color={colors.theme}
                title={`${avgRating.toFixed(1)} (${totalReviews} reviews)`}
                size={1.8}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: responsiveHeight(0.5),
              }}
            >
              <Ionicons name="location-sharp" size={16} color={colors.theme} />
              <NormalText
                color={colors.theme}
                title={distanceText || 'Distance not available'}
                size={1.8}
              />
            </View>
          </View>
          <LineBreak val={2} />

          <View style={{ flexDirection: 'row', gap: responsiveHeight(1.5) }}>
            <Button
              onPress={() => navigation.navigate('Map', { data: cityData })}
              icon={icons.routes}
              style={styles.primaryButton}
              title="Get Directions"
            />
            <Button
              disabled={isProcessing || isMarkingAsVisited}
              onPress={handleMarkVisited}
              icon={isMarkingAsVisited ? null : icons.calendar2}
              style={[
                styles.secondaryButton,
                (isProcessing || isMarkingAsVisited) && { opacity: 0.7 },
              ]}
              title={
                isMarkingAsVisited ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveHeight(1) }}>
                    <ActivityIndicator size="small" color={colors.theme2} />
                    <Text style={{ color: colors.theme2 }}>Please wait...</Text>
                  </View>
                ) : (
                  localVisited ? 'Visited' : 'Mark Visited'
                )
              }
              buttonTextColor={colors.theme2}
            />
          </View>
          <LineBreak val={2} />

          <View style={styles.tabContainer}>
            {['About', 'Info', 'Review'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: responsiveHeight(2),
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {activeTab === 'About' && renderAboutTab()}
            {activeTab === 'Info' && renderInfoTab()}
            {activeTab === 'Review' && renderReviewTab()}
          </ScrollView>
        </KeyboardAvoidingView>
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
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {videoLoading && (
                  <ActivityIndicator
                    size="large"
                    color={colors.white}
                    style={{ position: 'absolute', zIndex: 5 }}
                  />
                )}
                <Video
                  source={{ uri: selectedVideo }}
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                  }}
                  controls
                  resizeMode="contain"
                  paused={false}
                  repeat={false}
                  playWhenInactive={false}
                  playInBackground={false}
                  ignoreSilentSwitch="ignore"
                  progressUpdateInterval={250}
                  maxBitRate={2000000}
                  bufferConfig={{
                    minBufferMs: 2000,
                    maxBufferMs: 10000,
                    bufferForPlaybackMs: 1500,
                    bufferForPlaybackAfterRebufferMs: 2000,
                  }}
                  onLoad={() => {
                    console.log('Video loaded:', selectedVideo);
                    setVideoLoading(false);
                  }}
                  onEnd={() => setVideoModalVisible(false)}
                  onError={err => {
                    console.log('Video playback error:', err);
                    setVideoLoading(false);
                    ShowToast(
                      'error',
                      'Video playback failed — opening external player',
                    );
                    if (selectedVideo) {
                      Linking.openURL(selectedVideo).catch(e => {
                        console.log('Failed to open external player', e);
                        ShowToast('error', 'Could not open external player');
                      });
                    }
                  }}
                  onBuffer={buf => {
                    console.log('Video buffering:', buf);
                  }}
                  onLoadStart={() => {
                    console.log('Video load started for', selectedVideo);
                    setVideoLoading(true);
                  }}
                />
              </View>
            )}
          </View>
        </Modal>
        <ImageView
          images={imageItems}
          imageIndex={imageViewerIndex}
          visible={imageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: responsiveHeight(2),
    borderTopRightRadius: responsiveHeight(2),
    bottom: 10,
  },
  headerSection: {
    padding: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  tagText: {
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Semi_Bold,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.smallIconsBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(1),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(1),
    backgroundColor: colors.white,
    borderWidth: 2,
    height: responsiveHeight(6.8),
    borderColor: colors.theme2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: responsiveHeight(3.5),
    padding: responsiveHeight(0.4),
    gap: responsiveHeight(0.5),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveHeight(3),
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontSize: responsiveFontSize(2),
    color: '#8E8E93',
    fontFamily: fonts.Regular,
  },
  activeTabText: {
    color: colors.theme2,
    fontFamily: fonts.Semi_Bold,
  },
  photoThumb: {
    width: responsiveWidth(28),
    height: responsiveHeight(12),
    borderRadius: responsiveHeight(1.5),
  },
  placeImage: {
    width: responsiveWidth(35),
    height: responsiveHeight(15),
    borderRadius: responsiveHeight(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(0.5),
    gap: responsiveHeight(1),
  },
  reviewInput: {
    backgroundColor: colors.white3,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.3),
    fontSize: responsiveFontSize(2),
    color: colors.black,
    fontFamily: fonts.Regular,
    minHeight: responsiveHeight(9),
  },
  reviewCard: {
    marginBottom: responsiveHeight(1),
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: '#ececf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.black,
    fontSize: responsiveFontSize(2.4),
    fontFamily: fonts.Bold,
  },
});

export default CityDetails;
