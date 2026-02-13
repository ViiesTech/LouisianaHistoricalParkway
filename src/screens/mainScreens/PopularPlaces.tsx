import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { images } from '../../assets/images';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BoldText from '../../components/BoldText';
import colors from '../../assets/colors';
import PopularPlacesList from '../../components/PopularPlacesList';
import { useEffect, useState } from 'react';
import { fetchNearbyPlaces } from '../../GlobalFunctions/places';
import { getCurrentLocation, ShowToast } from '../../GlobalFunctions';
import { APIKEY } from '../../redux/constant';

const PopularPlaces = ({ navigation, route }) => {
  const [googlePlaces, setGooglePlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lng, lat] = route?.params?.location || {};
  console.log('route', lng, lat);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchNearbyPlaces({
          latitude: lat,
          longitude: lng,
          apiKey: APIKEY,
        });
        setGooglePlaces(res || []);
      } catch (e) {
        console.log('Error fetching popular places', e);
        ShowToast('error', 'Could not fetch popular places');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container padding={0.001}>
      <Header title="Popular Places" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2), flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color={colors.theme2} />
            <Text
              style={{
                marginTop: responsiveHeight(2),
                color: colors.placeholderColor,
              }}
            >
              Loading popular places...
            </Text>
          </View>
        ) : googlePlaces.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: responsiveWidth(10),
            }}
          >
            <Ionicons
              name="location-outline"
              size={80}
              color={colors.placeholderColor}
            />
            <BoldText
              size={2.4}
              title="No Popular Places Found"
              style={{ textAlign: 'center', marginTop: responsiveHeight(2) }}
            />
            <Text
              style={{
                textAlign: 'center',
                marginTop: responsiveHeight(1),
                color: colors.placeholderColor,
              }}
            >
              We couldn't find any popular places.
            </Text>
          </View>
        ) : (
          <PopularPlacesList
            googlePlaces={googlePlaces}
            navigation={navigation}
            layout="grid"
            numColumns={2}
            apiKey={APIKEY}
          />
        )}
      </View>
    </Container>
  );
};

export default PopularPlaces;
