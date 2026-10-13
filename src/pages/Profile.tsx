import * as React from 'react'
import { TouchableOpacity, Vibration } from 'react-native'
import { useTheme } from 'styled-components/native'
import Intercom from '@intercom/intercom-react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useConfig, useSession } from '@components'
import { UserProfile as ProfileController, NavBar } from '@ui'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

interface Props {
  navigation: any;
  route: any;
  notificationState?: any
}

const Profile = (props: Props) => {
  const [{ configs }] = useConfig()
  const [{ auth }] = useSession()

  const theme = useTheme()
  const isIntercomEnabled = configs?.intercom_enabled?.value === '1'
  const pkg = require('../../package.json')

  const profileProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    refreshSessionUser: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
    handleRemoveAccount: props?.route?.params?.handleRemoveAccount,
    appVersion: pkg.version
  };

  const handleOpenIntercomChat = () => {
    Vibration.vibrate(50)
    Intercom.displayMessenger()
  }

  React.useEffect(() => {
    return (() => {
      Intercom.hideIntercom()
    })
  }, [])

  React.useEffect(() => {
    if (!auth) {
      props.navigation.navigate('Login', { notificationState: props.notificationState })
    }
  }, [])

  return (
    auth
      ? <>
        <NavBar />
        <SafeAreaViewWrapper>
          <ProfileController {...profileProps} />
          {isIntercomEnabled && (
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: theme.colors.primary,
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => handleOpenIntercomChat()}
            >
              <Ionicons name='chatbox' size={30} color={theme.colors.white} />
            </TouchableOpacity>
          )}
        </SafeAreaViewWrapper>
      </>
      : null
  )
}

export default Profile
