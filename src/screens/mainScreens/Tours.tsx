import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ToursCard from '../../components/ToursCard';
import { responsiveHeight } from '../../utils/helperFunctions';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {
  getCurrentLocation,
  ShowToast,
  getDistanceMeters,
  formatDistance,
  getEstimatedMinutes,
  formatMinutes,
} from '../../GlobalFunctions';
import { useLazyGetTouristSpotsQuery } from '../../redux/services/Main';

const Tours = ({ navigation }) => {
  const [latLng, setLatLng] = useState({
    latitude: 37.421998,
    longitude: -122.084,
  });

  const [getTouristSpots, { isLoading, data: toursData }] =
    useLazyGetTouristSpotsQuery();

  const getCurrentLocationHandler = async () => {
    const response = await getCurrentLocation();
    if (response && !response.error) setLatLng(response);
  };

  useEffect(() => {
    getCurrentLocationHandler();
  }, []);

  useEffect(() => {
    getTouristSpots()
      .unwrap()
      .then(res => {})
      .catch(err => {
        ShowToast('error', err?.data?.message || 'Error fetching tours');
      });
  }, []);

  return (
    <Container padding={0.001}>
      <Header title="Tours in Louisiana" showRightIcon={false} />
      <View style={{ padding: responsiveHeight(2) }}>
        {isLoading ? (
          <View style={{ padding: responsiveHeight(6), alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#363E44" />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              gap: responsiveHeight(2),
              padding: responsiveHeight(1),
              paddingBottom: responsiveHeight(1.5),
            }}
            showsHorizontalScrollIndicator={false}
            data={toursData?.touristSpots || []}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              const [lng, lat] = item?.location?.coordinates || [];
              const distanceMeters = getDistanceMeters(latLng, {
                latitude: lat,
                longitude: lng,
              });
              const estimatedMinutes = getEstimatedMinutes(distanceMeters);
              return (
                <ToursCard
                  onPress={() => navigation.navigate('Map', { data: item })}
                  width={85}
                  title={item.name}
                  subtitle={item.city?.name}
                  durationTitle={formatMinutes(estimatedMinutes)}
                  placesTitle="0 places"
                />
              );
            }}
          />
        )}
      </View>
    </Container>
  );
};

export default Tours;
