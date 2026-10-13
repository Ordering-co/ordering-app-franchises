import React from 'react';
import settings from '../config.js'
import { useBusiness, useLanguage } from '@components'
import { Help as HelpPage, NavBar } from '@ui';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

const Help = (props: any) => {
  const [businessState] = useBusiness();
  const [, t] = useLanguage()

  const helpProps = {
    ...props,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
    onRedirect: (route: string, params?: any) => props.navigation.navigate(route, params),
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }
  return (
    <>
      <NavBar
        title={t('HELP', 'Help')}
        onActionLeft={() => helpProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <HelpPage {...helpProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default Help;
