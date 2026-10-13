import React from 'react'

import { useLanguage, useOrder } from '@components'
import {
  CouponOffers as CouponOffersControl,
  NavBar,
  NotFoundSource
} from '@ui'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

const CouponOffers = (props: any) => {
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const { businessId, cartUuid } = props.route?.params || {}
  const cart = orderState?.carts?.[`businessId:${businessId}`] ||
    Object.values(orderState?.carts || {}).find((item: any) => item?.uuid === cartUuid)
  const goBack = () => props.navigation?.canGoBack()
    ? props.navigation.goBack()
    : props.navigation.navigate('BottomTab')

  return (
    <>
      <NavBar
        title={t('OFFERS_AND_COUPONS', 'Offers and coupons')}
        onActionLeft={goBack}
      />
      <SafeAreaViewWrapper disableScrollView>
        {cart
          ? (
            <CouponOffersControl
              businessId={cart.business_id}
              price={cart.total}
              cart={cart}
              onGoBack={goBack}
            />
            )
          : (
            <NotFoundSource
              content={t('CART_NOT_FOUND', 'Cart not found')}
              btnTitle={t('GO_BACK', 'Go back')}
              onClickButton={goBack}
            />
            )}
      </SafeAreaViewWrapper>
    </>
  )
}

export default CouponOffers
