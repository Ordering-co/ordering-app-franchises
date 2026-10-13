import React from 'react'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { NavBar, UserProfileForm } from '@ui'
import { useLanguage } from '@components';

const ProfileForm = (props: any) => {
  const [, t] = useLanguage();
  const profileProps = {
    ...props,
    ...props.route.params,
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
  }

  return (
    <>
      <NavBar
        title={t('ACCOUNT', 'Account')}
        onActionLeft={() => profileProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <UserProfileForm {...profileProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ProfileForm
