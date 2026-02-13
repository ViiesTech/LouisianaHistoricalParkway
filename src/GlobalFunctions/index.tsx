import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIKEY } from '../redux/constant';

export const ShowToast = (type: string, text: string) => {
  return Toast.show({
    type: type,
    text1: text,
  });
};

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationError {
  error: string;
  code?: number;
}

// Function to request location permission on Android
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS permissions are handled via Info.plist
};

// Function to get address from coordinates using reverse geocoding
const CACHE_PREFIX = 'revgeo:';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const googleReverseGeocode = async (lat: number, lon: number, attempt = 1) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${APIKEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      // Retry on server errors or rate limits
      if ((res.status === 429 || res.status >= 500) && attempt < 3) {
        await delay(1000 * attempt);
        return googleReverseGeocode(lat, lon, attempt + 1);
      }
      console.error(
        'Google reverse geocode failed:',
        res.status,
        res.statusText,
      );
      return null;
    }

    const json = await res.json().catch(() => null);
    if (!json || json.status !== 'OK' || !json.results || !json.results[0]) {
      console.error(
        'Google API response error:',
        json?.status || 'Invalid response',
      );
      return null;
    }

    const first = json.results[0];
    return {
      display_name: first.formatted_address,
      address: first.address_components,
    };
  } catch (e) {
    if (attempt < 3) {
      await delay(1000 * attempt);
      return googleReverseGeocode(lat, lon, attempt + 1);
    }
    console.error('Google reverse geocode error:', e);
    return null;
  }
};

const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<{ display_name?: string; address?: any }> => {
  try {
    const key = `${CACHE_PREFIX}${latitude.toFixed(6)},${longitude.toFixed(6)}`;
    // Try cache first
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          return parsed.value;
        }
      }
    } catch (e) {
      // ignore cache errors
      console.warn('Revgeocache read error:', e);
    }

    // Use Google Geocoding API with retry/backoff
    const googleResult = await googleReverseGeocode(latitude, longitude);
    if (googleResult) {
      try {
        await AsyncStorage.setItem(
          key,
          JSON.stringify({ timestamp: Date.now(), value: googleResult }),
        );
      } catch (e) {
        console.warn('Revgeocache write error:', e);
      }
      return googleResult;
    }

    // If Google failed, return safe default
    return { display_name: 'Louisiana,USA', address: null };
  } catch (error) {
    console.error('Error in getAddressFromCoordinates:', error);
    return { display_name: 'Louisiana,USA', address: null };
  }
};

// Main function to get current location
export const getCurrentLocation = async (
  includeAddress: boolean = true,
): Promise<LocationData | LocationError> => {
  try {
    // Request permission first
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return { error: 'Location permission denied' };
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          if (includeAddress) {
            // Get address from coordinates (includes parsed address details)
            const addressResult = await getAddressFromCoordinates(
              latitude,
              longitude,
            );

            resolve({
              latitude,
              longitude,
              address: addressResult.display_name,
              addressDetails: addressResult.address,
            });
          } else {
            resolve({ latitude, longitude });
          }
        },
        error => {
          console.error('Error getting location:', error);
          reject({
            error: error.message || 'Unable to get current location',
            code: error.code,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  } catch (error: any) {
    return { error: error.message || 'An unexpected error occurred' };
  }
};

// Distance/time helpers
const EARTH_RADIUS_METERS = 6371000;
const AVERAGE_SPEED_KMH = 40; // default average speed used for ETA

const toRadians = (value: number) => (value * Math.PI) / 180;

export const getDistanceMeters = (
  from: { latitude: number; longitude: number } | any,
  to: { latitude: number; longitude: number } | any,
): number | null => {
  if (!from || !to) return null;
  const fromLat = Number(from.latitude);
  const fromLng = Number(from.longitude);
  const toLat = Number(to.latitude);
  const toLng = Number(to.longitude);
  if (
    Number.isNaN(fromLat) ||
    Number.isNaN(fromLng) ||
    Number.isNaN(toLat) ||
    Number.isNaN(toLng)
  ) {
    return null;
  }

  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
};

export const formatDistance = (meters: number | null) => {
  if (typeof meters !== 'number' || Number.isNaN(meters) || meters === null)
    return 'N/A';
  if (meters < 1000) return `${Math.round(meters)} M`;
  return `${(meters / 1000).toFixed(1)} KM`;
};

export const getEstimatedMinutes = (meters: number | null) => {
  if (typeof meters !== 'number' || Number.isNaN(meters) || meters === null)
    return null;
  const speedMetersPerMinute = (AVERAGE_SPEED_KMH * 1000) / 60;
  return Math.max(1, Math.round(meters / speedMetersPerMinute));
};

export const formatMinutes = (minutes: number | null) => {
  if (typeof minutes !== 'number' || Number.isNaN(minutes) || minutes === null)
    return 'N/A';
  return `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`;
};

// Get distance in miles from current location to destination
export const getDistanceInMiles = async (destination: {
  latitude: number;
  longitude: number;
}): Promise<string> => {
  try {
    const currentLocation: any = await getCurrentLocation();

    if (currentLocation.error || !destination) {
      return 'N/A';
    }

    const distanceMeters = getDistanceMeters(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      destination,
    );

    if (distanceMeters === null) {
      return 'N/A';
    }

    // Convert meters to miles (1 mile = 1609.34 meters)
    const distanceMiles = distanceMeters / 1609.34;
    return `${distanceMiles.toFixed(1)} mi`;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 'N/A';
  }
};
