import React, { useEffect } from 'react';
import Intercom from '@intercom/intercom-react-native';

import { useApi, useConfig, useSession } from '@components';
import { SignupForm, _setStoreData, _removeStoreData, NavBar } from '@ui';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { fetchUserAddressesList, getPostAuthNavigateArgs, resolvePostAuthAddressScreen } from './getPostAuthAddressScreen'

export const Signup = (props: any) => {
  const [{ user }, { login }] = useSession()
  const [{ configs }] = useConfig()
  const [ordering] = useApi()

  const notificationState = props.route?.params?.notification_state ?? props.notificationState

  const signupProps = {
    ...props,
    useChekoutFileds: true,
    useSignupByEmail: true,
    isGuest: !!user?.guest_id,
    notificationState,
    onNavigationRedirect: (page: string) => {
      if (!page) {
        return;
      }
      props.navigation.navigate(page);
    },
    handleSuccessSignup: async (user: any) => {
      _removeStoreData('isGuestUser')
      if (user?.id) {
        await login({
          user,
          token: user.session.access_token,
        });
      }
      const interParams: any = { userId: user?.id?.toString() }
      user?.email && (interParams.email = user?.email)
      Intercom.registerIdentifiedUser(interParams)
      if (props.handleGuestUser) {
        props.handleGuestUser?.()
        return
      }
      const needsVerification =
        (configs?.verification_email_required?.value === '1' && !user?.email_verified) ||
        (configs?.verification_phone_required?.value === '1' && !user?.phone_verified)
      if (needsVerification) return
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
  };

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
        <SignupForm {...signupProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Signup;
