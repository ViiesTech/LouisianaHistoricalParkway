// Centralized notification configuration
export const NOTIF_NAV_KEY = 'NOTIF_NAV';

// Whitelisted screens that notifications are allowed to navigate to
export const ALLOWED_SCREENS = new Set([
  'Notification',
  'CityDetails',
  'RestaurantDetails',
  'MyItineraries',
  // add other allowed screen names here
]);

export function isValidScreen(name) {
  return typeof name === 'string' && ALLOWED_SCREENS.has(name);
}
