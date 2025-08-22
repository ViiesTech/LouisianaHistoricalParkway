import React from 'react'
import Container from '../../components/Container'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import LineBreak from '../../components/LineBreak'
import NormalText from '../../components/NormalText'
import { TouchableOpacity } from 'react-native'
import colors from '../../assets/colors'

const ForgotPassword = ({ navigation }) => {
  return (
    <Container gap={30} heading={'Forgot password?'} showBack={true}>
      <LineBreak val={0.5} />
      <NormalText color={colors.theme} title="We will send you a recovery link" />
      <LineBreak val={2.5} />
      <InputField keyboardType={'email-address'} placeholder={'Enter your email'} />
      <LineBreak val={2.7} />
      <Button title={'Send email'} onPress={()=>navigation.navigate('SignIn')}/>
      <LineBreak val={1.2} />

      <TouchableOpacity style={{ right: 5 }}>
        <NormalText color={colors.smallSideTxt} align={'right'} title="Resend: 59 seconds left" />
      </TouchableOpacity>
    </Container>
  )
}

export default ForgotPassword;