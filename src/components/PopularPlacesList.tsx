/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { responsiveHeight, responsiveWidth } from '../utils/helperFunctions';
import NormalText from './NormalText';
import BoldText from './BoldText';
import colors from '../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { images } from '../assets/images';

type Props = {
  googlePlaces?: any[];
  fallback?: any[];
  navigation?: any;
  apiKey?: string;
  layout?: 'horizontal' | 'grid';
  numColumns?: number;
  maxItems?: number;
};

const PopularPlacesList = ({
  googlePlaces = [],
  fallback = [],
  navigation,
  apiKey,
  layout = 'horizontal',
  numColumns = 1,
  maxItems,
}: Props) => {
  console.log('apiKey', apiKey);
  const rawData = googlePlaces && googlePlaces.length ? googlePlaces : fallback;
  const data = typeof maxItems === 'number' ? rawData.slice(0, maxItems) : rawData;

  // Empty state component
  const EmptyState = () => (
    <View style={{ alignItems: 'center', paddingVertical: responsiveHeight(5) }}>
      <Ionicons name="location-outline" size={60} color={colors.placeholderColor} />
      <Text style={{ marginTop: responsiveHeight(2), color: colors.placeholderColor, fontSize: 16 }}>
        No places to display
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isGoogle = !!item.place_id;
    const title = isGoogle
      ? item.name
      : item.title || item?.title || item?.name;
    const photoRef = isGoogle && item.photos?.[0]?.photo_reference;

    const imageSource = photoRef
      ? {
          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`,
        }
      : isGoogle
      ? images.welcomeBg
      : item.image || item.img || item.imageUrl;

    const itemStyle =
      layout === 'grid'
        ? { width: '48%', gap: responsiveHeight(1) }
        : { gap: responsiveHeight(1) };

    const imageStyle =
      layout === 'grid'
        ? {
            width: '100%',
            borderRadius: responsiveHeight(1.5),
            height: responsiveHeight(20),
          }
        : {
            width: responsiveWidth(35),
            height: responsiveHeight(15),
            borderRadius: responsiveHeight(1.5),
          };

    return (
      <View
        // onPress={() => navigation && navigation.navigate('LocationDetails')}
        style={itemStyle}
      >
        <FastImage source={imageSource} style={imageStyle} resizeMode={FastImage.resizeMode.cover} />
        <NormalText title={title} numberOfLines={2} width={33} />
      </View>
    );
  };

  if (layout === 'grid') {
    return (
      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item, index) => String(item._id || item.id || index)}
        contentContainerStyle={{
          gap: responsiveHeight(2),
          marginTop: responsiveHeight(1),
        }}
        columnWrapperStyle={data.length > 0 ? {
          gap: responsiveHeight(1),
          justifyContent: 'space-between',
        } : undefined}
        renderItem={renderItem}
        ListEmptyComponent={EmptyState}
      />
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: responsiveHeight(2) }}
      data={data}
      keyExtractor={(item, index) => String(item._id || item.id || index)}
      renderItem={renderItem}
      ListEmptyComponent={EmptyState}
    />
  );
};

export default PopularPlacesList;
