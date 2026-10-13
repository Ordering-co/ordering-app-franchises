import React from 'react'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { NavBar, PurchaseGiftCard as PurchaseGiftCardController } from '@ui'
import { useLanguage } from '@components'

const PurchaseGiftCard = (props: any) => {
  const [, t] = useLanguage()
  const purchaseProps = {
    ...props,
    ...props.route.params,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
  }
  return (
    <>
      <NavBar
        title={t('PURCHASE_GIFT_CARD', 'Purchase gift card')}
        onActionLeft={() => purchaseProps.goToBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <PurchaseGiftCardController {...purchaseProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default PurchaseGiftCard
