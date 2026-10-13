import React from 'react'

import settings from '../config'
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'

import { useLanguage } from '@components'
import { NavBar, PaymentDetails as PaymentDetailsComponent } from '@ui'

const PaymentDetails = (props: any) => {
  const payProps = {
    ...props,
    ...props.route?.params,
    merchantId: settings?.merchantId,
    urlscheme: settings?.app_scheme,
    androidAppId: settings.android_app_id,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (page: string, params: any) => props.navigation.navigate(page, params)
  }

  const [, t] = useLanguage()

  return (
    <>
      <NavBar
        title={t('PAYMENT_METHOD', 'Payment method')}
        onActionLeft={() => payProps.navigation?.canGoBack() && payProps.navigation.goBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <PaymentDetailsComponent {...payProps} />
      </SafeAreaViewWrapper>
    </>
  )
}

export default PaymentDetails
