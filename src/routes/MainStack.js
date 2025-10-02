import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();
const Main = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="CityDetails" component={CityDetails} />
      <Stack.Screen name="Favourites" component={Favourites} />
      <Stack.Screen name="FoundPlaces" component={FoundPlaces} />
      <Stack.Screen name="Home" component={Home} />
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
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Stack.Screen name="NavigationDetails" component={NavigationDetails} />
      <Stack.Screen name="HelpAndSupport" component={Help} />
      <Stack.Screen name="NearbyPlaces" component={NearbyPlaces} />
      <Stack.Screen name="Tours" component={Tours} />
      <Stack.Screen name="PopularPlaces" component={PopularPlaces} />
    </Stack.Navigator>
  );
};

export default Main;
