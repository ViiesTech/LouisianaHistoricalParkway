import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes'
import { SafeAreaView } from 'react-native'

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
    </SafeAreaView>
  )
}

export default App