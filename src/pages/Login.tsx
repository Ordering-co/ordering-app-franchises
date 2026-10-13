import React, { useEffect } from 'react'
import Intercom from '@intercom/intercom-react-native'

import { useApi, useSession } from '@components'
import { LoginForm, NavBar, _setStoreData } from '@ui'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { fetchUserAddressesList, getPostAuthNavigateArgs, resolvePostAuthAddressScreen } from './getPostAuthAddressScreen'

export const Login = (props: any) => {
  const [{ user }] = useSession()
  const [ordering] = useApi()
  const notificationState = props.route?.params?.notification_state ?? props.notificationState

  const loginProps = {
    ...props,
    notificationState,
    useLoginByCellphone: true,
    isGuest: !!user?.guest_id,
    handleSuccessLogin: async (user: any) => {
      const interParams: any = { userId: user?.id?.toString() }
      user?.email && (interParams.email = user?.email)
      Intercom.registerIdentifiedUser(interParams)
      if (props.handleGuestUser) {
        props.handleGuestUser?.()
        return
      }
      const screen = await resolvePostAuthAddressScreen({
        addresses: user?.addresses,
        fetchAddresses: () => fetchUserAddressesList({
          ordering,
          accessToken: user?.session?.access_token,
          userId: user?.id
        })
      })
      const destination = getPostAuthNavigateArgs(screen)
      if ('params' in destination) {
        props.navigation.navigate(destination.name, destination.params)
      } else {
        props.navigation.navigate(destination.name)
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params)
    }
  }

  useEffect(() => {
    _setStoreData('notification_state', notificationState)
  }, [])

  return (
    <>
      <NavBar
        title={props.titleNavbar}
        onActionLeft={props.onActionLeftNavbar}
      />
      <SafeAreaViewWrapper>
        <LoginForm {...loginProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Login
