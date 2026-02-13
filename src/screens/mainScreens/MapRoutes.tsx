/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { images } from '../../assets/images';
import { responsiveHeight, responsiveWidth } from '../../utils/helperFunctions';
import NormalText from '../../components/NormalText';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import colors from '../../assets/colors';
import BoldText from '../../components/BoldText';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import {
  getCurrentLocation,
  getDistanceMeters,
  formatDistance,
} from '../../GlobalFunctions';

const MapRoutes = ({ navigation, route }) => {
  const { data } = route.params || {};
  const [lng, lat] = data?.location?.coordinates || [-122.084, 37.421998];

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [routeCoordinates, setRouteCoordinates] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);

  /* ================= LOCATION ================= */

  const getUserLocation = async () => {
    try {
      const response: any = await getCurrentLocation();
      if (response && !response.error) {
        const { latitude, longitude } = response;

        setCurrentLocation({ latitude, longitude });

        // Calculate distance
        const distanceMeters = getDistanceMeters(
          { latitude, longitude },
          { latitude: lat, longitude: lng },
        );
        setDistance(distanceMeters);

        // Fetch route polyline
        await fetchDirections(latitude, longitude);
      }
    } catch (e) {
      console.log('Location error:', e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ROUTE ================= */

  const fetchDirections = async (fromLat: number, fromLng: number) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${lng},${lat}?overview=full&geometries=geojson`,
      );

      const json = await res.json();

      if (json.routes?.length) {
        const coords = json.routes[0].geometry.coordinates;

        const points = coords.map((c: [number, number]) => ({
          longitude: c[0],
          latitude: c[1],
        }));

        setRouteCoordinates(points);
      }
    } catch (e) {
      console.log('Route error:', e);
    }
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getUserLocation();
  }, []);

  /* ================= DESTINATION ================= */

  const businessLocation = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
    }),
    [lat, lng],
  );

  const initialMapRegion = useMemo(
    () => ({
      latitude: currentLocation?.latitude || lat,
      longitude: currentLocation?.longitude || lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }),
    [currentLocation?.latitude, currentLocation?.longitude, lat, lng],
  );

  return (
    <Container padding={0.001}>
      <Header
        rightTxt={distance ? formatDistance(distance) : '...'}
        showRightIcon={false}
        title={data?.name || 'Location'}
      />
      <View
        style={{
          width: responsiveWidth(100),
          marginTop: responsiveHeight(3),
          flex: 1,
          position: 'relative',
        }}
      >
        {/* Show loading until we have user location */}
        {loading || !currentLocation ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
            }}
          >
            <ActivityIndicator size="large" color={colors.theme2} />
            <Text style={{ marginTop: 10, color: colors.black }}>
              Getting your location...
            </Text>
          </View>
        ) : (
          <>
            {/* Map occupies full space */}
            <MapView
              userInterfaceStyle="light" 
              provider={PROVIDER_GOOGLE}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              initialRegion={initialMapRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
              loadingEnabled={true}
            >
              {/* Draw route polyline */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor={colors.theme2}
                  strokeWidth={4}
                  lineCap="round"
                  lineJoin="round"
                  geodesic={true}
                />
              )}

              {/* Business Location Marker */}
              <Marker
                coordinate={businessLocation}
                title={data?.name}
                description={data?.address}
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
          </>
        )}

        {/* Bottom sheet positioned absolutely over the map */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: responsiveHeight(45),
          }}
        >
          <ImageBackground
            source={images.themeBg}
            style={{ minHeight: responsiveHeight(30) }}
            imageStyle={{
              borderTopRightRadius: responsiveHeight(2),
              borderTopLeftRadius: responsiveHeight(2),
            }}
          >
            <View style={{ padding: responsiveHeight(2) }}>
              <BoldText
                color="#FCFCF7"
                title={data?.name || 'Location'}
                size={2.5}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: responsiveHeight(1),
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
                  color="#F1F1E9"
                  width={70}
                  title={
                    data?.address || '47 W 13th St, New York, NY 10011, USA'
                  }
                />
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#78AFC9',
                width: '100%',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                gap: responsiveHeight(2),
                width: '100%',
                padding: responsiveHeight(2),
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.white,
                    height: responsiveHeight(4),
                    width: responsiveWidth(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: responsiveHeight(2),
                  }}
                >
                  <FontAwesome6
                    name="route"
                    size={16}
                    color={colors.smallIconsBg}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <BoldText
                  color={colors.white}
                  size={3}
                  title={
                    distance
                      ? formatDistance(distance)
                      : 'Calculating...'
                  }
                />
                <NormalText
                  color="#98C2D4"
                  title={`Distance to ${data?.name || 'destination'}`}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Container>
  );
};

export default MapRoutes;
