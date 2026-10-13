import React from 'react';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components'
import { NavBar, ReviewOrder as ReviewOrderComponent } from '@ui';

const ReviewOrder = (props: any) => {
  const [, t] = useLanguage()

  const reviewOrderProps = {
    ...props,
    ...props?.route?.params,
    type: 'order',
    onGoBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('REVIEWS', 'Reviews')}
        onActionLeft={() => reviewOrderProps.onGoBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ReviewOrderComponent {...reviewOrderProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ReviewOrder;
