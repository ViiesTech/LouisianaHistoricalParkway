import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import SVGXml from '../components/SvgIcon';
import { icons } from '../icons';
import colors from '../assets/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../utils/helperFunctions';
import CityDetails from '../screens/mainScreens/CityDetails';
import Favourites from '../screens/mainScreens/Favourites';
import FoundPlaces from '../screens/mainScreens/FoundPlaces';
import Home from '../screens/mainScreens/Home';
import LocationDetails from '../screens/mainScreens/LocationDetails';
import Map from '../screens/mainScreens/Map';
import MapRoutes from '../screens/mainScreens/MapRoutes';
import MyCities from '../screens/mainScreens/MyCities';
import PaidCities from '../screens/mainScreens/PaidCities';
import PaidContinents from '../screens/mainScreens/PaidContinents';
import PersonalizedTours from '../screens/mainScreens/PersonalizedTours';
import PriceDetails from '../screens/mainScreens/PriceDetails';
import RestaurantList from '../screens/mainScreens/RestaurantList';
import Search from '../screens/mainScreens/Search';
import Settings from '../screens/mainScreens/Settings';
import UserProfile from '../screens/mainScreens/UserProfile';
import RestaurantDetails from '../screens/mainScreens/RestaurantDetails';
import NavigationDetails from '../screens/mainScreens/NavigationDetails';
import Help from '../screens/mainScreens/Help';
import NearbyPlaces from '../screens/mainScreens/NearbyPlaces';
import Tours from '../screens/mainScreens/Tours';
import PopularPlaces from '../screens/mainScreens/PopularPlaces';
import ZacharyBio from '../screens/mainScreens/ZacharyBio';
import Notification from '../screens/mainScreens/Notification';
import ItinerariesDetails from '../screens/mainScreens/ItinerariesDetails';
import MyItineraries from '../screens/mainScreens/MyItineraries';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconMap = {
          Explore: icons.explore,
          NearMe: icons.nearMe,
          Business: icons.business,
          Profile: icons.profile,
        };

        const icon = iconMap[route.name] || icons.explore;

        // recolor stroke and non-empty fill attributes in the SVG to match active/inactive state
        // active -> white, inactive -> black
        const fillColor = isFocused ? '#FFFFFF' : '#000000';
        // Keep `fill="none"` untouched so outlined SVGs remain outlined.
        const coloredIcon = icon
          .replace(/fill="(?!none).*?"/g, `fill="${fillColor}"`)
          .replace(/stroke=".*?"/g, `stroke="${fillColor}"`);

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
          >
            {isFocused ? (
              <View style={styles.activePill}>
                <SVGXml icon={coloredIcon} width={20} height={20} />
                <Text style={styles.activeLabel}>{label}</Text>
              </View>
            ) : (
              <View style={styles.inactiveItem}>
                <SVGXml icon={coloredIcon} width={20} height={20} />
                <Text style={styles.inactiveLabel}>{label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Explore" component={Home} />
    <Tab.Screen name="NearMe" component={NearbyPlaces} />
    <Tab.Screen name="Business" component={RestaurantList} />
    <Tab.Screen name="Profile" component={UserProfile} />
  </Tab.Navigator>
);

const Main = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="CityDetails" component={CityDetails} />
      <Stack.Screen name="Favourites" component={Favourites} />
      <Stack.Screen name="FoundPlaces" component={FoundPlaces} />
      <Stack.Screen name="LocationDetails" component={LocationDetails} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="ZacharyBio" component={ZacharyBio} />
      <Stack.Screen name="MapRoutes" component={MapRoutes} />
      <Stack.Screen name="MyCities" component={MyCities} />
      <Stack.Screen name="PaidCities" component={PaidCities} />
      <Stack.Screen name="PaidContinents" component={PaidContinents} />
      <Stack.Screen name="PersonalizedTours" component={PersonalizedTours} />
      <Stack.Screen name="PriceDetails" component={PriceDetails} />
      <Stack.Screen name="RestaurantList" component={RestaurantList} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Stack.Screen name="NavigationDetails" component={NavigationDetails} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="HelpAndSupport" component={Help} />
      <Stack.Screen name="NearbyPlaces" component={NearbyPlaces} />
      <Stack.Screen name="Tours" component={Tours} />
      <Stack.Screen name="PopularPlaces" component={PopularPlaces} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="MyItineraries" component={MyItineraries} />
      <Stack.Screen name="ItinerariesDetails" component={ItinerariesDetails} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical:
      Platform.OS === 'ios' ? responsiveHeight(2) : responsiveHeight(1.2),
    backgroundColor: 'white',
    borderTopWidth: 4,
    borderTopColor: colors.smallSideTxt,
    // full-width tab bar anchored to screen edges
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.2),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: responsiveWidth(20),
  },
  activeLabel: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    marginTop: 4,
  },
  inactiveItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveLabel: {
    color: colors.theme,
    fontSize: responsiveFontSize(1.4),
    marginTop: 4,
  },
});

export default Main;
