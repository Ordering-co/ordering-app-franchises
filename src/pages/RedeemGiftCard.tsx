import React from 'react'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { NavBar, RedeemGiftCard as RedeemGiftCardController } from '@ui'
import { useLanguage } from '@components'

const RedeemGiftCard = (props: any) => {
  const [, t] = useLanguage()
  const redeemProps = {
    ...props,
    ...props.route.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
  }
  return (
    <>
      <NavBar
        title={t('REDEEM_GIFT_CARD', 'Redeem a gift card')}
        onActionLeft={() => redeemProps.goToBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <RedeemGiftCardController {...redeemProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default RedeemGiftCard
