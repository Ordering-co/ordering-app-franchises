import React from 'react';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components'
import { NavBar, OrderDetails as OrderDetailsController } from '@ui';

const OrderDetails = ({ navigation, route }: any) => {
  const isFromCheckout = route.params?.isFromCheckout
  const orderNumberId = route.params?.orderNumberId
  const fromHome = route.params?.fromHome

  const [, t] = useLanguage()

  const orderDetailsProps = {
    navigation,
    ...route.params,
    onGoBack: () => navigation?.canGoBack?.() && navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params)
    }
  }

  return (
    <>
      <NavBar
        title={orderNumberId ? `${t('ORDER_SHORT_TEXT', 'Order')} No. ${orderNumberId}` : ''}
        onActionLeft={() => (isFromCheckout || fromHome)
          ? navigation.navigate('BottomTab', { screen: 'Home' })
          : navigation?.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('MyOrders')}
      />
      <SafeAreaViewWrapper disableScrollView>
        <OrderDetailsController {...orderDetailsProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default OrderDetails;
