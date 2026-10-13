import React, { useEffect } from 'react'
import { Platform, View } from 'react-native';
import { usePlatformPay, PlatformPay } from '@stripe/stripe-react-native'
import { useLanguage, useConfig, useOrder } from '@components'
import { StripeMethodFormParams } from '../../types';
import { OText, currencyWithoutDecimals } from '@ui';

export const StripeMethodForm = (props: StripeMethodFormParams) => {
  const {
    cart,
    handleSource,
    onCancel,
    setErrors,
    paymethod,
    devMode,
    setPlaceByMethodPay,
    cartTotal,
    androidAppId
  } = props
  const { isPlatformPaySupported, createPlatformPayPaymentMethod } = usePlatformPay()
  const [{ loading: loadingCart }] = useOrder()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const applePay = ['global_apple_pay', 'apple_pay']
  const [methodPaySupported, setMethodPaySupported] = React.useState({ enabled: false, loading: false })

  const createPaymentMethod = async () => {
    try {
      setMethodPaySupported({
        ...methodPaySupported,
        loading: true
      })

      const total = cartTotal ?? cart?.balance ?? cart?.total
      const totalConverted = currencyWithoutDecimals.includes(configs?.stripe_currency?.value) ? total : total * 100
      const { error, paymentMethod } = await createPlatformPayPaymentMethod({
        googlePay: {
          testEnv: !!devMode,
          merchantName: androidAppId,
          merchantCountryCode: 'US',
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: false,
          },
          existingPaymentMethodRequired: false,
          isEmailRequired: true,
          amount: totalConverted,
          currencyCode: configs?.stripe_currency?.value ?? 'USD',
        }
      });
      if (error) {
        setErrors(error.code + ' - ' + error.message);
        setMethodPaySupported({
          enabled: true,
          loading: false
        })
      } else if (paymentMethod) {
        setMethodPaySupported({
          enabled: true,
          loading: false
        })
        const source = {
          ...paymentMethod?.Card,
          id: paymentMethod.id,
          type: paymentMethod.paymentMethodType,
          source_id: paymentMethod?.id,
          card: {
            brand: paymentMethod.Card.brand,
            last4: paymentMethod.Card.last4
          }
        }
        handleSource(cartTotal ? JSON.stringify(source) : source)
      }

    } catch (err: any) {
      setErrors(err.message);
    } finally {
      onCancel()
      setPlaceByMethodPay(false)
    }
  };

  const pay = async () => {
    try {
      setMethodPaySupported({
        ...methodPaySupported,
        loading: true
      })
      if (!isPlatformPaySupported()) {
        setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
        setMethodPaySupported({
          enabled: false,
          loading: false
        })
        setPlaceByMethodPay(false)
        return
      }

      const { error, paymentMethod } = await createPlatformPayPaymentMethod({
        applePay: {
          cartItems: [{
            label: t('CART_APPLE_PAY_LABEL', 'Cart'),
            amount: cartTotal?.toString?.() ?? cart?.balance?.toString() ?? cart?.total?.toString?.(),
            paymentType: PlatformPay.PaymentType.Immediate
          }],
          merchantCountryCode: 'US',
          currencyCode: configs?.stripe_currency?.value ?? 'USD',
        }
      });
      if (error) {
        setErrors(error.code + ' - ' + error.message);
        setMethodPaySupported({
          enabled: true,
          loading: false
        })
      } else if (paymentMethod) {
        setMethodPaySupported({
          enabled: true,
          loading: false
        })
        const source = {
          ...paymentMethod?.Card,
          id: paymentMethod.id,
          type: paymentMethod.paymentMethodType,
          source_id: paymentMethod?.id,
          card: {
            brand: paymentMethod.Card.brand,
            last4: paymentMethod.Card.last4
          }
        }
        handleSource(cartTotal ? JSON.stringify(source) : source)
      }
    } catch (err: any) {
      setErrors(err.message)
    } finally {
      onCancel()
      setPlaceByMethodPay(false)
    }
  }

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return
    }
    if (!loadingCart) {
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
      setPlaceByMethodPay(false)
      setErrors('')
    }
  }, [paymethod, loadingCart]);

  useEffect(() => {
    (async () => {
      if (applePay.includes(paymethod)) {
        const supported = await isPlatformPaySupported();
        if (supported) {
          setMethodPaySupported({
            enabled: true,
            loading: false
          });
          setErrors('');
        } else {
          setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
          onCancel()
        }
      }
    })();
  }, [isPlatformPaySupported, paymethod]);

  useEffect(() => {
    if (methodPaySupported.enabled) {
      applePay.includes(paymethod) ? pay() : createPaymentMethod()
    }
  }, [methodPaySupported.enabled])

  return (
    <View>
      <OText
        size={20}
        mTop={10}
        style={{
          textAlign: 'center'
        }}
      >
        {t('PLEASE_COMPLETE_THE_PAYMENT_PROCESS', 'Please complete the payment process.')}
      </OText>
    </View>
  )
}
