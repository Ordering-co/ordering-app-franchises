import React, { useState } from 'react';
import { useTheme } from 'styled-components/native'

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import settings from '../config.js'
import { checkoutPaymentUtilities } from '../utils';
import {
  useOrder,
  useLanguage,
  useConfig
} from '@components';
import { Checkout, NavBar, useBusinessSelected } from '@ui';

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect', 'google_pay', 'apple_pay'];
const methodsWithoutAction = ['stripe_checkout', 'checkout_pro_mercadopago']

interface Config {
  key: string;
  value: string;
}

const cateringTypes = [7, 8]

export const CheckoutPage = (props: any) => {
  const theme = useTheme()
  const [, t] = useLanguage();
  const [{ configs }] = useConfig()
  const [orderState] = useOrder();
  const [businessSelected] = useBusinessSelected()
  const { handleOrderRedirect, handleStripePayment, handleRedirectPaymentCheckout } = checkoutPaymentUtilities();
  const [showGateway, setShowGateway] = useState<any>({ closedByUser: false, open: false });
  const currentDate = new Date();

  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const splitCateringValue = (configName: string) => {
    const _config = Object.values(configs)?.find((config: any) => config.key === configName) as Config;
    return _config?.value?.split('|')?.find((val: any) => val.includes(cateringTypeString))?.split(',')[1];
  }
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days') ?? '')
  const limitDays = cateringTypes.includes(orderState?.options?.type) ? preorderMaximumDays ?? configs?.max_days_preorder?.value : configs?.max_days_preorder?.value;
  const time =
    limitDays > 1
      ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000
      : limitDays === 1
        ? currentDate.getTime()
        : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;

  currentDate.setTime(time);
  currentDate.setHours(23);
  currentDate.setMinutes(59);

  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    businessLogo: props.route?.params?.businessLogo,
    businessName: props.route?.params?.businessName,
    cartTotal: props.route?.params?.cartTotal,
    fromProductsList: props.route?.params?.fromProductsList,
    stripePaymentOptions,
    isFranchiseApp: !!settings?.franchiseSlug,
    maxDate: currentDate,
    fromMulti: props.route?.params?.fromMulti,
    urlscheme: settings?.app_scheme,
    showGateway,
    propsToFetch: [
      'id',
      'name',
      'slug',
      'logo',
      'name',
      'email',
      'cellphone',
      'address',
      'address_notes',
      'paymethods',
      'open',
      'description',
      'location',
      'timezone',
      'schedule',
      'distance',
      'zones',
      'city',
      'city_id',
      'today',
      'valid_service',
      'configs'
    ],
    setShowGateway,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any, options: any = {}) => {
      if (cart?.order?.uuid) {
        handleOrderRedirect({ orderId: cart?.order?.uuid, navigation: props.navigation });
        return;
      }

      if (cart?.status === 2) {
        if (stripePaymentOptions.includes(paymethod?.gateway)) {
          await handleStripePayment({ handleIsRedirect: props.handleIsRedirect, navigation: props.navigation, data, paymethod, cart });
        } else {
          if (cart?.paymethod_data?.result?.action?.type === 'redirect') {
            options?.scrollToTop?.()
            await handleRedirectPaymentCheckout(cart.paymethod_data.result.action.redirect_url);
            return
          }
          if (methodsWithoutAction.includes(paymethod.gateway)) {
            options?.scrollToTop?.()
            await handleRedirectPaymentCheckout(cart?.paymethod_data.result?.redirect_url);
          }
        }
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
    },
    onGoBack: () => props.navigation.canGoBack() && props.navigation.goBack()
  };
  return (
    <>
      <NavBar
        title={t('CHECKOUT_TITLE_HEADER', 'Does everything look right?')}
        textStyle={{ fontSize: theme.utils.tsize.m }}
        onActionLeft={() => checkoutProps.onNavigationRedirect('UpsellingPage', {
          business: businessSelected,
          businessId: businessSelected?.id,
          cartProducts: props?.cartProducts
        })}
      />
      <SafeAreaViewWrapper disableScrollView>
        <Checkout {...checkoutProps} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default CheckoutPage;
