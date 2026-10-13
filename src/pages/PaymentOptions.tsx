import React from 'react'
import { StackActions } from '@react-navigation/native';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

import { useLanguage } from '@components'
import { NavBar, PaymentOptions as PaymentOptionsPage } from '@ui';

const PaymentOptions = (props: any) => {
  const [, t] = useLanguage()

  const paymentOptionsProps = {
    ...props,
    ...props.route.params,
    usePaymenthodSelectedForV2: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    handleRedirect: (page: string, params: any, replace?: false) => {
      if (!page) return
      if (replace) {
        props.navigation.dispatch(StackActions.replace(page, params))
      } else {
        props.navigation.navigate(page, params)
      }
    }
  }
  return (
    <>
      <NavBar
        title={t('PAYMENT_METHOD', 'Payment method')}
        onActionLeft={() => props.navigation?.canGoBack() && props.navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <PaymentOptionsPage {...paymentOptionsProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default PaymentOptions
