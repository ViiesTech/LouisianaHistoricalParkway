/* eslint-disable react-native/no-inline-styles */
import {
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Linking,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
} from 'react';
import Container from '../../components/Container';
import { getDistanceInMiles, ShowToast } from '../../GlobalFunctions';
import PhotoGalleryVideos from '../../components/PhotoGalleryVideos';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { images } from '../../assets/images';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../utils/helperFunctions';
import colors from '../../assets/colors';
import NormalText from '../../components/NormalText';
import fonts from '../../assets/fonts';
import BoldText from '../../components/BoldText';
import LineBreak from '../../components/LineBreak';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../../components/Button';
import { icons } from '../../icons';
import {
  useAddBusinessReviewMutation,
  useLazyGetBusinessDetailsQuery,
} from '../../redux/services/Main';
import moment from 'moment';
import { Animated } from 'react-native';
import { useSelector } from 'react-redux';

const RestaurantDetails = ({ navigation, route }) => {
  const { businessId } = route.params || {};
  const { isGuest } = useSelector(state => state.persistedData);
  const [distance, setDistance] = useState('N/A');
  const [getBusinessDetails, { isLoading, data }] =
    useLazyGetBusinessDetailsQuery();
  const [addBusinessReview, { isLoading: isAddingReview }] =
    useAddBusinessReviewMutation();
  const [isRefreshingReviews, setIsRefreshingReviews] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  console.log('businessId', businessId);

  // Pulse animation for loading skeleton
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [isLoading]);

  // Fetch business details
  useEffect(() => {
    if (businessId) {
      getBusinessDetails(businessId)
        .unwrap()
        .then(res => {
          console.log('Business details fetched successfully', res);
        })
        .catch(err => {
          console.error('Error fetching business details', err);
        });
    }
  }, [businessId]);

  // Use fetched business data
  const businessData = data?.business;
  console.log('businessData===', businessData);

  // Calculate distance
  useEffect(() => {
    if (businessData?.location?.coordinates) {
      getDistanceInMiles({
        latitude: businessData.location.coordinates[1],
        longitude: businessData.location.coordinates[0],
      }).then(setDistance);
    }
  }, [businessData]);

  // Get first image from gallery for background
  const backgroundImage = useMemo(() => {
    // Don't show image during loading
    if (isLoading || !businessData) {
      return null;
    }
    const firstImage = (businessData?.gallery || []).find(url =>
      url?.toLowerCase().match(/\.(jpg|jpeg|png)$/i),
    );
    return firstImage ? { uri: firstImage } : images.restaurantBg;
  }, [businessData, isLoading]);

  // Get current day hours
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = businessData?.hours?.find(h => h.day === today);
  const hoursText = todayHours?.isClosed
    ? 'Closed'
    : todayHours
    ? `${todayHours.open} - ${todayHours.close}`
    : 'N/A';

  // Calculate average rating
  const avgRating =
    businessData?.review?.length > 0
      ? (
          businessData.review.reduce((sum, r) => sum + (r.rating || 0), 0) /
          businessData.review.length
        ).toFixed(1)
      : '0.0';

  // Use actual reviews from API and render in reverse order (newest first)
  const reviews = (businessData?.review || []).slice().reverse();

  // Local state for adding a review
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  console.log('newrating', newRating);
  console.log('new comment', newComment);

  const submitReview = async () => {
    if (isGuest) {
      ShowToast('error', 'Please sign in to add reviews');
      return;
    }
    if (!businessId) return;
    if (!newRating || newRating < 1) {
      // simple client-side validation
      return ShowToast('error', 'Please choose rating');
    }
    if (!newComment) {
      return ShowToast('error', 'Please enter a comment');
    }
    try {
      await addBusinessReview({
        _id: businessId,
        reviewData: { rating: newRating, comment: newComment },
      }).unwrap();
      ShowToast('success', 'Review submitted successfully!');
      // Show loading indicator while refreshing
      setIsRefreshingReviews(true);
      // refresh details
      await getBusinessDetails(businessId).unwrap();
      // clear form
      setNewRating(0);
      setNewComment('');
      // Smooth transition
      setTimeout(() => setIsRefreshingReviews(false), 300);
    } catch (err) {
      console.error('Error submitting review', err);
      ShowToast('error', 'Failed to submit review');
      setIsRefreshingReviews(false);
    }
  };

  const renderLoadingSkeleton = () => (
    <View style={{ padding: responsiveHeight(2) }}>
      {/* Tag and Category */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            opacity: pulseAnim,
            width: responsiveWidth(30),
            height: responsiveHeight(2),
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
          }}
        />
        <Animated.View
          style={{
            opacity: pulseAnim,
            width: responsiveWidth(25),
            height: responsiveHeight(3),
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
          }}
        />
      </View>
      <LineBreak val={1} />

      {/* Title */}
      <Animated.View
        style={{
          opacity: pulseAnim,
          width: responsiveWidth(70),
          height: responsiveHeight(3.5),
          backgroundColor: '#E0E0E0',
          borderRadius: 4,
        }}
      />
      <LineBreak val={1} />

      {/* Rating and Distance */}
      <View style={{ flexDirection: 'row', gap: responsiveHeight(2) }}>
        <Animated.View
          style={{
            opacity: pulseAnim,
            width: responsiveWidth(30),
            height: responsiveHeight(2),
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
          }}
        />
        <Animated.View
          style={{
            opacity: pulseAnim,
            width: responsiveWidth(25),
            height: responsiveHeight(2),
            backgroundColor: '#E0E0E0',
            borderRadius: 4,
          }}
        />
      </View>
      <LineBreak val={2} />

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1.5) }}>
        <Animated.View
          style={{
            opacity: pulseAnim,
            flex: 1,
            height: responsiveHeight(6),
            backgroundColor: '#E0E0E0',
            borderRadius: 8,
          }}
        />
        <Animated.View
          style={{
            opacity: pulseAnim,
            flex: 1,
            height: responsiveHeight(6),
            backgroundColor: '#E0E0E0',
            borderRadius: 8,
          }}
        />
      </View>
      <LineBreak val={2} />

      {/* About Section */}
      <Animated.View
        style={{
          opacity: pulseAnim,
          width: responsiveWidth(20),
          height: responsiveHeight(2.5),
          backgroundColor: '#E0E0E0',
          borderRadius: 4,
        }}
      />
      <LineBreak val={1} />
      <Animated.View
        style={{
          opacity: pulseAnim,
          width: '100%',
          height: responsiveHeight(8),
          backgroundColor: '#E0E0E0',
          borderRadius: 4,
        }}
      />
      <LineBreak val={2} />

      {/* Info Rows */}
      {[1, 2, 3].map(i => (
        <View key={i}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Animated.View
              style={{
                opacity: pulseAnim,
                width: 20,
                height: 20,
                backgroundColor: '#E0E0E0',
                borderRadius: 10,
              }}
            />
            <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
              <Animated.View
                style={{
                  opacity: pulseAnim,
                  width: responsiveWidth(20),
                  height: responsiveHeight(1.8),
                  backgroundColor: '#E0E0E0',
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              />
              <Animated.View
                style={{
                  opacity: pulseAnim,
                  width: responsiveWidth(60),
                  height: responsiveHeight(2),
                  backgroundColor: '#E0E0E0',
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
          <LineBreak val={2} />
        </View>
      ))}

      {/* Map placeholder */}
      <Animated.View
        style={{
          opacity: pulseAnim,
          width: '100%',
          height: responsiveHeight(25),
          backgroundColor: '#E0E0E0',
          borderRadius: responsiveHeight(1.5),
        }}
      />
    </View>
  );

  return (
    <Container enableKeyboardAvoidingView padding={0.01}>
      {isLoading || !businessData ? (
        <View
          style={{
            width: '100%',
            height: responsiveHeight(27),
            backgroundColor: '#2C3E50',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text
            style={{
              color: '#fff',
              marginTop: 12,
              fontSize: responsiveFontSize(1.8),
              fontFamily: fonts.Regular,
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <ImageBackground
          source={backgroundImage}
          style={{ width: '100%', height: responsiveHeight(27) }}
        >
          <Header
            iconOnly={false}
            showRightIcon={false}
            pVertical={1}
            padding={1}
          />
        </ImageBackground>
      )}
      <View style={styles.contentContainer}>
        {isLoading || !businessData ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {renderLoadingSkeleton()}
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: responsiveHeight(2),
              paddingBottom: responsiveHeight(4),
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.tagText}>USA, Louisiana</Text>
              <View style={styles.tagContainer}>
                <Text style={styles.badgeText}>
                  {businessData?.category || 'N/A'}
                </Text>
              </View>
            </View>
            <LineBreak val={1} />
            <BoldText
              color="#363E44"
              title={businessData?.name || 'N/A'}
              size={4}
            />
            <LineBreak val={1} />

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
                <Text style={styles.infoText}>
                  {avgRating} ({businessData?.review?.length || 0} reviews)
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: responsiveHeight(0.5),
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.theme}
                />
                <Text style={styles.infoText}>{distance}</Text>
              </View>
            </View>
            <LineBreak val={2} />

            <View style={{ flexDirection: 'row', gap: responsiveHeight(1.5) }}>
              <Button
                onPress={() =>
                  navigation.navigate('Map', { data: businessData })
                }
                icon={icons.routes}
                style={styles.primaryButton}
                title="Directions"
              />
              <Button
                onPress={() => {
                  const phoneNumber = businessData?.phone
                    ? String(businessData.phone).replace(/[^0-9]/g, '')
                    : null;
                  if (phoneNumber) {
                    Linking.openURL(`tel:${phoneNumber}`);
                  }
                }}
                icon={icons.call}
                style={styles.secondaryButton}
                title="Call"
                buttonTextColor={colors.theme2}
              />
            </View>
            <LineBreak val={2} />

            <BoldText color={colors.black} title="About" size={2.4} />
            <LineBreak val={1} />
            <NormalText
              color={colors.theme}
              title={businessData?.description || 'No description available.'}
            />
            <LineBreak val={2} />

            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.labelColor}
              />
              <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
                <NormalText
                  color={colors.labelColor}
                  title="Address"
                  size={1.8}
                />
                <NormalText
                  color={colors.black}
                  title={businessData?.address || 'N/A'}
                  size={2}
                  font={fonts.Semi_Bold}
                />
              </View>
            </View>
            <LineBreak val={2} />

            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.labelColor}
              />
              <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
                <NormalText
                  color={colors.labelColor}
                  title="Hours"
                  size={1.8}
                />
                <NormalText
                  color={colors.black}
                  title={hoursText}
                  size={2}
                  font={fonts.Semi_Bold}
                />
              </View>
            </View>
            <LineBreak val={2} />

            <View style={styles.infoRow}>
              <Ionicons
                name="call-outline"
                size={20}
                color={colors.labelColor}
              />
              <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
                <NormalText
                  color={colors.labelColor}
                  title="Phone"
                  size={1.8}
                />
                <TouchableOpacity
                  onPress={() => {
                    const phoneNumber = businessData?.phone
                      ? String(businessData.phone)
                      : null;
                    if (phoneNumber) {
                      Linking.openURL(`tel:${phoneNumber}`);
                    }
                  }}
                >
                  <NormalText
                    color={colors.theme2}
                    title={
                      businessData?.phone ? String(businessData.phone) : 'N/A'
                    }
                    size={2}
                    font={fonts.Semi_Bold}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <LineBreak val={2} />

            <BoldText color={colors.black} title="Location" size={2.4} />
            <LineBreak val={0.5} />
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.theme}
              />
              <View style={{ marginLeft: responsiveHeight(1.5), flex: 1 }}>
                <NormalText
                  color={colors.black}
                  title={businessData?.address || 'N/A'}
                  size={1.8}
                />
              </View>
            </View>
            <LineBreak val={2} />

            {businessData?.location?.coordinates &&
              (() => {
                const markerCoordinate = {
                  latitude: businessData.location.coordinates[1],
                  longitude: businessData.location.coordinates[0],
                };
                const mapRegion = {
                  ...markerCoordinate,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                return (
                  <View
                    style={{
                      height: responsiveHeight(25),
                      borderRadius: responsiveHeight(1.5),
                      overflow: 'hidden',
                    }}
                  >
                    <MapView
                      userInterfaceStyle="light"
                      provider={PROVIDER_GOOGLE}
                      style={{ flex: 1 }}
                      initialRegion={mapRegion}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      onPress={() =>
                        navigation.navigate('Map', {
                          location: businessData.location.coordinates,
                        })
                      }
                    >
                      <Marker
                        coordinate={markerCoordinate}
                        title={businessData?.name}
                        description={businessData?.address}
                      />
                    </MapView>
                  </View>
                );
              })()}
            <LineBreak val={2} />

            <BoldText
              color={colors.black}
              title="Photo Gallery & Videos"
              size={2.4}
            />
            <LineBreak val={1.5} />
            <PhotoGalleryVideos gallery={businessData?.gallery || []} />
            <LineBreak val={3} />
            <View
              style={[
                styles.reviewCard,
                { paddingBottom: responsiveHeight(2) },
              ]}
            >
              <BoldText color={colors.black} title="Add Your Review" size={2} />
              <LineBreak val={1} />
              <View
                style={{
                  flexDirection: 'row',
                  gap: responsiveHeight(1),
                  alignItems: 'center',
                }}
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewRating(star)}
                  >
                    <AntDesign
                      name="star"
                      size={22}
                      color={star <= newRating ? '#FDBA0F' : '#D1D5DC'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <LineBreak val={1} />
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write your review..."
                placeholderTextColor="#9AA4B2"
                multiline
                style={{
                  minHeight: responsiveHeight(8),
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: responsiveHeight(1),
                  padding: responsiveHeight(1),
                  color: colors.black,
                  marginTop: responsiveHeight(1),
                }}
              />
              <LineBreak val={1} />
              <View style={{}}>
                <Button
                  buttonWidth={85}
                  disabled={
                    isAddingReview || !newComment.trim() || newRating === 0
                  }
                  title={
                    isAddingReview ? (
                      <ActivityIndicator size={22} color={colors.white} />
                    ) : (
                      'Submit Review'
                    )
                  }
                  onPress={submitReview}
                  style={{
                    opacity:
                      isAddingReview || !newComment.trim() || newRating === 0
                        ? 0.5
                        : 1,
                  }}
                />
              </View>
            </View>
            <LineBreak val={2} />

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

            {reviews.map(review => (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.user.username.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: responsiveHeight(1.5) }}>
                    <BoldText
                      color={colors.black}
                      title={review.user.username}
                      size={2}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: responsiveHeight(0.5),
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <AntDesign
                            key={star}
                            name="star"
                            size={12}
                            color={
                              star <= review.rating ? '#FDBA0F' : '#D1D5DC'
                            }
                          />
                        ))}
                      </View>
                      <NormalText
                        color={colors.labelColor}
                        title={moment(review.createdAt).format('MMM DD, YYYY')}
                        size={1.6}
                      />
                    </View>
                  </View>
                </View>
                <LineBreak val={1} />
                <NormalText color="#4A5565" title={review.comment} size={1.8} />
                <LineBreak val={2} />
              </View>
            ))}

            {/* Add Review UI */}
          </ScrollView>
        )}
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
  tagContainer: {
    backgroundColor: colors.black,
    paddingHorizontal: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveHeight(1.5),
  },
  tagText: {
    color: colors.black,
    fontSize: responsiveFontSize(1.9),
    fontFamily: fonts.Bold,
  },
  badge: {
    backgroundColor: colors.theme2,
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Bold,
  },
  infoText: {
    color: colors.theme,
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Regular,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: '#ECECF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.black,
    fontSize: responsiveFontSize(2.4),
    fontFamily: fonts.Bold,
  },
});

export default RestaurantDetails;
