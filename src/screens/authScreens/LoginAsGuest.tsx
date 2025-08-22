import React from 'react'
import Container from '../../components/Container'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import LineBreak from '../../components/LineBreak'

const LoginAsGuest = ({ navigation }) => {
      return (
            <Container gap={30} heading={'Login As Guest'} showBack={true}>
                  <LineBreak val={2.5} />
                  <InputField keyboardType={'email-address'} placeholder={'Enter your email'} />
                  <LineBreak val={2.7} />
                  <Button onPress={() => navigation.navigate('Main')} title={'Login'} />
            </Container>
      )
}

export default LoginAsGuest;