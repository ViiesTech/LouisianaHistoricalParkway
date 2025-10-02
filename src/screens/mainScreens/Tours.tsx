import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ToursCard from '../../components/ToursCard'
import { responsiveHeight } from '../../utils/helperFunctions'
import Container from '../../components/Container'
import Header from '../../components/Header'

const Tours = () => {
  return (
    <Container padding={0.001}>
      <Header title="Tours in Louisiana" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2) }}>
        <FlatList contentContainerStyle={{ gap: responsiveHeight(2) }} showsHorizontalScrollIndicator={false} data={[1, 2, 3, 4, 5, 6]} renderItem={({ }) => {
          return (
            <ToursCard width={92} />
          )
        }} />
      </View>
    </Container>
  )
}

export default Tours