import React from 'react'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { BusinessReviews as BusinessReviewsController, NavBar } from '@ui'
import { useLanguage } from '@components'

const BusinessReviews = (props: any) => {
  const [, t] = useLanguage()
  const reviewsProps = {
    ...props,
    ...props.route.params,
    onRedirect: (route: string, params?: any) => props.navigation.navigate(route, params),
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack()
  }

  return (
    <>
      <NavBar
        title={t('REVIEWS', 'Reviews')}
        onActionLeft={() => reviewsProps.goToBack()}
      />
      <SafeAreaViewWrapper>
        <BusinessReviewsController {...reviewsProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default BusinessReviews
