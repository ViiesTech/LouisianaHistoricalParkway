import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes'
import { SafeAreaView } from 'react-native'
import PaidContinents from './src/screens/mainScreens/PaidContinents'
import Settings from './src/screens/mainScreens/Settings'
import PersonalizedTours from './src/screens/mainScreens/PersonalizedTours'
import Favourites from './src/screens/mainScreens/Favourites'
import MyCities from './src/screens/mainScreens/MyCities'
import FoundPlaces from './src/screens/mainScreens/FoundPlaces'
import UserProfile from './src/screens/mainScreens/UserProfile'
import PaidCities from './src/screens/mainScreens/PaidCities'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <PaidCities />
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App