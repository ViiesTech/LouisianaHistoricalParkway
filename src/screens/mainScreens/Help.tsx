import { View, Text } from 'react-native'
import React from 'react'
import Container from '../../components/Container'
import Header from '../../components/Header'
import NormalText from '../../components/NormalText'
import { responsiveHeight } from '../../utils/helperFunctions'
import colors from '../../assets/colors'

const Help = () => {
  return (
    <Container padding={0.001}>
      <Header title="Help and Support" showRightIcon={false} padding={0.1} />
      <View style={{ padding: responsiveHeight(2), gap: responsiveHeight(1.5) }}>
        <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit." />
        <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit. Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur. " />
        <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit." />
        <NormalText color={colors.theme} title="Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Occaecati sapiente quis velit. Impedit amet similique enim hic vel soluta excepturi. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur quo delectus. Qui porro repellat beatae qui. Eaque voluptas aliquam exercitationem consectetur. " />
      </View>
    </Container>
  )
}

export default Help