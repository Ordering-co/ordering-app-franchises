import React from 'react'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components'
import { NavBar, ReviewProducts as ReviewProductsComponent } from '@ui'

const ReviewProducts = (props: any) => {
  const [, t] = useLanguage()

  const reviewProductProps = {
    ...props,
    ...props?.route?.params,
    type: 'product',
    onGoBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <NavBar
        title={t('REVIEWS', 'Reviews')}
        onActionLeft={() => reviewProductProps.onGoBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ReviewProductsComponent {...reviewProductProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default ReviewProducts
