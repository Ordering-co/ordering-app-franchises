import React, { useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native'

import { WrapperMethods } from './styles'
import { PayUtilities } from '../PaymentOptions/utils'

import { useApi, useOrder, useLanguage } from '@components'
import { PaymentOptionCash, StripeElementsForm, StripeCardsList, FloatingButton } from '@ui'

const redirectMethods = ['stripe_checkout', 'checkout_pro_mercadopago', 'interswitch']

export const PaymentDetails = (props: any) => {
  const {
    businessId,
    paymethodSelected,
    paymethodData,
    goToBack,
    handlePaymethodClick,
    onNavigationRedirect,
    handlePaymethodDataChange
  } = props

  const theme = useTheme()
  const [ordering] = useApi()
  const [orderState, { changePaymethod, setStateValues }] = useOrder()
  const [, t] = useLanguage()
  const { methodsPay } = PayUtilities()

  const [cashState, setCashState] = useState({ value: null })
  const [readyToSave, setReadyToSave] = useState(false)

  const loadingPayment = useRef(false)

  const isPopupMethod = ['paypal'].includes(paymethodSelected?.gateway)
  const cart = (businessId >= 0 && typeof businessId === 'number') ? orderState.carts?.[`businessId:${businessId}`] : orderState.carts?.['businessId:null']

  const returnUrl = `${props.urlscheme}://checkout/${cart?.uuid}`

  const orderTotal = cart?.balance ?? cart?.total
  const errorCash = !!(cashState.value) && parseFloat((cashState.value)) < orderTotal

  const handleSave = async () => {
    loadingPayment.current = true
    if (paymethodSelected?.gateway === 'cash' &&
      ((cashState.value !== null &&
        (cashState.value >= orderTotal) ||
        !cashState.value))
    ) {
      const _paymethodData: any = { cash: !cashState.value ? null : cashState.value }
      if (redirectMethods.includes(paymethodSelected?.gateway)) {
        _paymethodData.success_url = returnUrl
        _paymethodData.cancel_url = returnUrl
      }
      const result = await changePaymethod(businessId, paymethodSelected?.id, JSON.stringify(_paymethodData))
      result && onNavigationRedirect('CheckoutPage', { cartUuid: cart?.uuid })
      loadingPayment.current = false
      return
    }
    goToBack()
  }

  const handleSelectCard = async (paymethodData: any) => {
    loadingPayment.current = true
    handlePaymethodClick(paymethodSelected, false, paymethodData)
    if (businessId === -1) {
      const giftCart = {
        ...orderState?.carts?.['businessId:null'],
        paymethod_id: paymethodSelected?.id,
        paymethod_data: paymethodData
      }
      const carts = orderState.carts
      carts[`businessId:null`] = giftCart
      setStateValues({ carts })
      loadingPayment.current = false
      onNavigationRedirect('CheckoutPage', { cartUuid: cart?.uuid })
    } else {
      const result = await changePaymethod(businessId, paymethodSelected?.id, JSON.stringify(paymethodData))
      result && onNavigationRedirect('CheckoutPage', { cartUuid: cart?.uuid })
      loadingPayment.current = false
    }
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: theme.utils.margins.horizontal }}
      >
        {/* Cash */}
        {paymethodSelected?.gateway === 'cash' && (
          <PaymentOptionCash
            orderTotal={orderTotal}
            defaultValue={paymethodData?.cash}
            setCashState={(val: any) => setCashState({ ...cashState, ...val })}
          />
        )}

        {/* Stripe */}
        {paymethodSelected?.gateway === 'stripe' && (
          <WrapperMethods>
            <StripeCardsList
              paymethod={paymethodSelected}
              businessId={businessId}
              merchantId={props.merchantId}
              urlscheme={props.urlscheme}
              clientSecret={props.clientSecret}
              paySelected={props.paySelected}
              publicKey={paymethodSelected?.credentials?.publishable}
              setReadyToSave={setReadyToSave}
              onNavigationRedirect={onNavigationRedirect}
              onSelectCard={handleSelectCard}
            />
          </WrapperMethods>
        )}

        {/* Stripe Connect */}
        {paymethodSelected?.gateway === 'stripe_connect' && (
          <WrapperMethods>
            <StripeCardsList
              paymethod={paymethodSelected}
              businessId={businessId}
              paySelected={props.paySelected}
              onSelectCard={handleSelectCard}
              onNavigationRedirect={onNavigationRedirect}
              publicKey={paymethodSelected?.credentials.publishable}
              publicKeyAddCard={paymethodSelected?.credentials?.stripe?.publishable || paymethodSelected?.credentials?.publishable}
            />
          </WrapperMethods>
        )}

        {/* Google pay, Apple pay */}
        {methodsPay.includes(paymethodSelected?.gateway) && (
          <StripeElementsForm
            cart={cart}
            paymethod={paymethodSelected?.gateway}
            methodsPay={methodsPay}
            businessId={props.businessId}
            publicKey={paymethodSelected?.credentials?.publishable || paymethodSelected?.credentials?.publishable_key}
            handleSource={handlePaymethodDataChange}
            onCancel={() => goToBack()}
            merchantId={props.merchantId}
            urlscheme={props.urlscheme}
            androidAppId={props.androidAppId}
            loadingPayment={props.loadingPayment}
            placeByMethodPay={props.placeByMethodPay}
            setPlaceByMethodPay={props.setPlaceByMethodPay}
            publicKeyAddCard={paymethodSelected?.credentials?.stripe?.publishable || paymethodSelected?.credentials?.publishable}
          />
        )}
      </ScrollView>

      {(readyToSave || paymethodSelected?.gateway === 'cash' || loadingPayment.current) && (
        <FloatingButton
          text={t('SAVE', 'Save')}
          disabled={errorCash}
          loading={loadingPayment.current}
          handleClick={() => handleSave()}
        />
      )}
    </>
  )
}
