/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Container from '../../components/Container';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BoldText from '../../components/BoldText';
import LineBreak from '../../components/LineBreak';
import colors from '../../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/helperFunctions';
import NormalText from '../../components/NormalText';
import InputField from '../../components/InputField';
import SVGXml from '../../components/SvgIcon';
import { icons } from '../../icons';
import { useGetAllBusinessesQuery } from '../../redux/services/Main';
import { getDistanceInMiles } from '../../GlobalFunctions';
import Header from '../../components/Header';

const RestaurantList = ({ navigation }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [distances, setDistances] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 🔹 Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = search.trim();
      // Only set debounced search if empty or has at least 3 characters
      setDebouncedSearch(trimmed.length >= 3 || trimmed.length === 0 ? trimmed : '');
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // 🔹 Map filter to category value
  const categoryValue =
    filter === 'All'
      ? ''
      : filter === 'Restaurants'
      ? 'Restaurant'
      : filter === 'Cafes'
      ? 'Cafe'
      : filter === 'Shops'
      ? 'Shop'
      : '';

  // 🔹 Memoize params so RTK Query detects changes properly
  const params = useMemo(() => {
    const p = {};
    if (debouncedSearch) p.search = debouncedSearch;
    if (categoryValue) p.category = categoryValue;
    return p;
  }, [debouncedSearch, categoryValue]);

  // 🔹 Fetch businesses using non-lazy query
  const { data, isLoading, isFetching, error } =
    useGetAllBusinessesQuery(params);
  console.log('isFetching', isFetching);

  // 🔹 Calculate distances for all businesses
  useEffect(() => {
    if (data?.businesses?.length > 0) {
      const calculateDistances = async () => {
        const distanceMap = {};
        for (const business of data.businesses) {
          if (business.location?.coordinates) {
            const distance = await getDistanceInMiles({
              latitude: business.location.coordinates[1],
              longitude: business.location.coordinates[0],
            });
            distanceMap[business._id] = distance;
          }
        }
        setDistances(distanceMap);
      };
      calculateDistances();
    } else {
      setDistances({});
    }
  }, [data]);

  const categoryMap = {
    All: 'All',
    Restaurants: 'Restaurant',
    Cafes: 'Cafe',
    Shops: 'Shop',
  };

  const displayedBusinesses =
    filter === 'All'
      ? data?.businesses || []
      : (data?.businesses || []).filter(
          business => business.category === categoryMap[filter],
        );

  const chips = ['All', 'Restaurants', 'Cafes', 'Shops'];

  const colorizeIcon = (xmlString, color) => {
    if (!xmlString) return '';
    if (/(stroke)="[^"]*"/i.test(xmlString)) {
      return xmlString.replace(/(stroke)="[^"]*"/gi, `stroke="${color}"`);
    }
    return xmlString;
  };

  return (
    <Container padding={0.001} hasTabBar={true}>
      <Header title="Local Business" showRightIcon={false} />
      <LineBreak val={2} />

      {/* Search Row */}
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
      <View style={{ flexDirection: 'row', gap: responsiveHeight(1.4) }}>
        <InputField
          placeHolderColor={colors.placeholderColor}
          width={90}
          showSearch
          mrgnLeft={4}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
        {/* <TouchableOpacity style={styles.mapBtn} activeOpacity={0.8}>
          <MaterialIcons name="control-camera" color={colors.white} size={24} />
        </TouchableOpacity> */}
      </View>

      <LineBreak val={1.5} />

      {/* Chips */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsWrap}
        >
          {chips.map(c => {
            const active = filter === c;
            const iconMap = {
              All: icons.all,
              Restaurants: icons.restaurant,
              Cafes: icons.cafes,
              Shops: icons.shops,
            };
            const raw = iconMap[c] || '';
            const colored = colorizeIcon(raw, active ? '#FFFFFF' : '#000000');

            return (
              <TouchableOpacity
                key={c}
                onPress={() => setFilter(c)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}
              >
                {raw ? <SVGXml icon={colored} width={16} height={16} /> : null}
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                    { marginLeft: responsiveHeight(0.6) },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <LineBreak val={1.5} />

      {/* List */}
      <FlatList
        contentContainerStyle={{
          padding: responsiveHeight(0.5),
          paddingVertical: responsiveHeight(1),
          paddingBottom: responsiveHeight(2),
          gap: responsiveHeight(2),
          flexGrow: 1,
        }}
        data={displayedBusinesses}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <View style={{ marginTop: 40 }}>
                <ActivityIndicator size="large" color={colors.theme2} />
              </View>
            );
          }

          return (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={{ marginTop: 10, color: '#999' }}>
                No business found
              </Text>
            </View>
          );
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RestaurantDetails', {
                businessId: item._id,
              })
            }
            style={styles.card}
            activeOpacity={0.9}
          >
            <Image
              source={{
                uri: item?.gallery?.find(url =>
                  url?.toLowerCase().match(/\.(jpg|jpeg|png)$/i),
                ),
              }}
              style={styles.cardImage}
            />

            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <BoldText
                  numberOfLines={2}
                  width={30}
                  size={2.4}
                  title={item.name}
                />
                <View style={styles.tagPill}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.5),
                      color: '#030213',
                    }}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>

              <NormalText
                numberOfLines={2}
                width={55}
                title={item.description}
              />

              <View style={styles.cardFooter}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <AntDesign name="star" color={'#FDBA0F'} size={16} />
                  <Text style={{ color: colors.theme }}>
                    {item.review?.length > 0
                      ? (
                          item.review.reduce((sum, r) => sum + r.rating, 0) /
                          item.review.length
                        ).toFixed(1)
                      : '0.0'}
                  </Text>
                </View>

                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                >
                  <Ionicons name="location" color={colors.theme2} size={20} />
                  <Text style={{ color: colors.theme }} numberOfLines={1}>
                    {distances[item._id] || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>

      {/* Beautiful loading overlay when fetching/searching */}
      {isFetching && !isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              padding: responsiveHeight(3),
              borderRadius: responsiveHeight(2),
              alignItems: 'center',
              minWidth: responsiveWidth(50),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <ActivityIndicator size="large" color={colors.theme2} />
            <LineBreak val={1.5} />
            <BoldText
              title="Searching..."
              color={colors.theme2}
              size={2.2}
              align="center"
            />
            <LineBreak val={0.3} />
            <NormalText
              title="Please wait"
              color={colors.placeholderColor}
              size={1.6}
              align="center"
            />
          </View>
        </View>
      )}
    </Container>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  mapBtn: {
    backgroundColor: colors.smallIconsBg,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(1.5),
  },
  chipsWrap: {
    gap: responsiveHeight(1.2),
    paddingHorizontal: responsiveHeight(0.2),
    alignItems: 'center',
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.theme2,
    paddingHorizontal: responsiveHeight(1.8),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveHeight(1.4),
    marginRight: responsiveHeight(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  chipActive: {
    backgroundColor: colors.theme2,
  },
  chipText: {
    color: colors.theme,
  },
  chipTextActive: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: responsiveHeight(2.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    width: '100%',
    gap: responsiveHeight(1),
    padding: responsiveHeight(1.5),
    alignItems: 'center',
  },
  cardImage: {
    width: responsiveWidth(26),
    height: responsiveHeight(12.5),
    borderRadius: responsiveHeight(2),
  },
  cardBody: {
    flex: 1,
    marginLeft: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagPill: {
    backgroundColor: '#ECEEF2',
    paddingHorizontal: responsiveHeight(1.2),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: responsiveHeight(1),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardFooter: {
    marginTop: responsiveHeight(1.2),
    flexDirection: 'row',
    gap: responsiveHeight(1.5),
    alignItems: 'center',
  },
});
