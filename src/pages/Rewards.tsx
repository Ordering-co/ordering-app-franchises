import React from 'react';
import settings from '../config.js'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';
import { NavBar, Rewards as RewardsUI, useBusinessSelected } from '@ui';

const Rewards = (props: any) => {
  const [, { onChangeBusinessSelected }] = useBusinessSelected()

  const homeProps = {
    ...props,
    franchiseId: settings?.franchiseSlug,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params)
    },
    handleBusinessClick: async (business: any) => {
      await onChangeBusinessSelected(business)
      props.navigation.navigate('BottomTab', { screen: 'Business', store: business?.slug })
    }
  }

  return (
    <>
      <NavBar />
      <SafeAreaViewWrapper disableScrollView>
        <RewardsUI {...homeProps} />
      </SafeAreaViewWrapper>
    </>
  );
}

export default Rewards;

