export const fetchNearbyPlaces = async ({
  latitude,
  longitude,
  apiKey,
  radius = 3000,
  type = 'tourist_attraction',
}: {
  latitude: number;
  longitude: number;
  apiKey?: string;
  radius?: number;
  type?: string;
}) => {
  const key =
    apiKey ||
    (process && process.env && process.env.GOOGLE_PLACES_API_KEY) ||
    '';
  if (!key) {
    console.log('fetchNearbyPlaces: no API key provided');
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${key}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status === 'OK' && Array.isArray(json.results))
      return json.results;
    console.log(
      'fetchNearbyPlaces: Places API response',
      json.status,
      json.error_message || '',
    );
    return [];
  } catch (e) {
    console.log('fetchNearbyPlaces error', e);
    return [];
  }
};
