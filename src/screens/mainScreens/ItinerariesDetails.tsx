/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from '../../utils/helperFunctions';
import colors from '../../assets/colors';
import fonts from '../../assets/fonts';
import LineBreak from '../../components/LineBreak';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const ItinerariesDetails = ({ navigation, route }: any) => {
  const { itinerary } = route.params || {};

  // If no itinerary data, show error or go back
  if (!itinerary) {
    navigation.goBack();
    return null;
  }

  const locations = itinerary.places || [];

  return (
    <Container
      padding={2}
      gap={0}
      showBack={false}
      heading={false}
      scrollEnabled={true}
      headerStyle={{}}
    >
      {/* Header with back button and action icons */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>
        {/* <View style={styles.headerIcons}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
          <View style={[styles.iconCircle, { backgroundColor: '#FFD700' }]}>
            <Ionicons name="heart" size={20} color={colors.white} />
          </View>
        </View> */}
      </View>
      <LineBreak val={1.5} />

      {/* Title Card */}
      <View style={styles.titleCard}>
        <Text style={styles.titleText}>{itinerary.title}</Text>
        {itinerary.description && (
          <>
            <LineBreak val={0.8} />
            <Text style={styles.descriptionText}>{itinerary.description}</Text>
          </>
        )}
        <LineBreak val={1} />
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={18} color={colors.black} />
            <Text style={styles.infoText}>
              {moment(itinerary.startDate, 'DD-MM-YYYY').format('MMM DD')} -{' '}
              {moment(itinerary.endDate, 'DD-MM-YYYY').format('MMM DD')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={18} color={colors.black} />
            <Text style={styles.infoText}>{locations.length} Stops</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color={colors.black} />
            <Text style={styles.infoText}>{itinerary.duration}</Text>
          </View>
        </View>
      </View>
      <LineBreak val={2} />
      <View>
        <FlatList
          data={locations}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={{
            gap: responsiveHeight(1.5),
            padding: responsiveHeight(1),
            marginHorizontal: responsiveHeight(0.2),
          }}
          renderItem={({ item, index }) => {
            // Get first image from gallery
            const imageUri =
              item.gallery && item.gallery.length > 0 ? item.gallery[0] : null;

            return (
              <View
                style={styles.locationCard}
                activeOpacity={0.8}
                // onPress={() => {
                //   // Navigate to location details based on category/type
                //   if (item.category) {
                //     navigation.navigate('LocationDetails', { data: item });
                //   } else if (item.type) {
                //     navigation.navigate('CityDetails', { _id: item._id });
                //   }
                // }}
              >
                {imageUri ? (
                  <FastImage
                    source={{
                      uri: imageUri,
                      priority: FastImage.priority.normal,
                    }}
                    style={styles.thumbnail}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <View
                    style={[
                      styles.thumbnail,
                      {
                        backgroundColor: colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                  >
                    <Ionicons
                      name="image-outline"
                      size={30}
                      color={colors.placeholderColor}
                    />
                  </View>
                )}
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle} numberOfLines={2}>
                    {item.name}
                  </Text>
                  {item.address && (
                    <View style={styles.locationDetails}>
                      <Ionicons
                        name="location"
                        size={12}
                        color={colors.theme}
                      />
                      <Text style={styles.distanceText} numberOfLines={2}>
                        {item.address}
                      </Text>
                    </View>
                  )}
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.category || item.type || 'Location'}
                    </Text>
                  </View>
                </View>
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
      {/* <LineBreak val={2} />
      <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
        <Ionicons name="share-social-outline" size={18} color={colors.white} />
        <Text style={styles.shareButtonText}>Share Itinerary</Text>
      </TouchableOpacity> */}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#FCFCF7',
    // backgroundColor:'#000',
    padding: responsiveHeight(1),
    borderRadius: responsiveHeight(3),
  },
  headerIcons: {
    flexDirection: 'row',
    gap: responsiveHeight(1),
  },
  iconCircle: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    backgroundColor: '#5AB3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCard: {
    backgroundColor: colors.white,
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1.5),
    borderWidth: 2,
    borderColor: colors.border,
  },
  titleText: {
    fontSize: responsiveFontSize(2.8),
    fontFamily: fonts.Bold,
    color: colors.black,
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: fonts.Regular,
    color: colors.placeholderColor,
    lineHeight: responsiveHeight(2.5),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(0.8),
  },
  infoText: {
    fontSize: responsiveFontSize(1.7),
    fontFamily: fonts.Regular,
    color: colors.black,
  },
  locationCard: {
    backgroundColor: colors.white,
    padding: responsiveHeight(1.5),
    borderRadius: responsiveHeight(2.5),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  thumbnail: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveHeight(1),
  },
  locationInfo: {
    flex: 1,
    marginLeft: responsiveHeight(1.5),
    marginRight: responsiveHeight(1),
    gap: responsiveHeight(0.5),
  },
  locationTitle: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: fonts.Semi_Bold,
    color: colors.black,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(0.3),
  },
  distanceText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: fonts.Regular,
    color: colors.theme,
    maxWidth: responsiveWidth(40),
  },
  badge: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    paddingHorizontal: responsiveHeight(1),
    height: responsiveHeight(3),
    borderRadius: responsiveHeight(1.3),
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: fonts.Regular,
    color: colors.black,
  },
  numberCircle: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    backgroundColor: colors.theme2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  shareButton: {
    backgroundColor: colors.theme2,
    paddingVertical: responsiveHeight(1.8),
    borderRadius: responsiveHeight(1.2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(1),
  },
  shareButtonText: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
    fontFamily: fonts.Semi_Bold,
  },
});

export default ItinerariesDetails;
