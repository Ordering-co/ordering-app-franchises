import React from 'react';

import settings from '../config.js'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useBusiness, useLanguage } from '@components'
import { MyOrders as MyOrdersController, NavBar } from '@ui'

const MyOrders = ({ navigation, route }: any) => {
  const [, t] = useLanguage()
  const [businessState] = useBusiness()

  const myOrderProps = {
    navigation,
    businessId: businessState?.business?.id,
    franchiseId: settings?.franchiseSlug,
    hideBackBtn: route?.params?.hideBackBtn,
    goToBack: () => navigation?.canGoBack() && navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      navigation.navigate(page, params);
    },
    handleRedirectToCheckout: (uuid: number) => {
      if (!uuid) return
      navigation.navigate('CheckoutPage', { cartUuid: uuid })
    },
  }

  return (
    <>
      <NavBar
        title={t('MY_ORDERS', 'My Orders')}
        onActionLeft={() => myOrderProps.onNavigationRedirect('BottomTab', { screen: 'Profile' })}
      />
      <SafeAreaViewWrapper disableScrollView>
        <MyOrdersController {...myOrderProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default MyOrders;
