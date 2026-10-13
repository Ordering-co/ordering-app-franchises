import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, FlatList, ScrollView, View } from 'react-native';
import { usePlatformPay } from '@stripe/stripe-react-native';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from "rn-placeholder";
import SpinnerLoader from 'react-native-loading-spinner-overlay';

import { PMContainer, PMItem, PMPayItem } from './styles'
import { PayUtilities } from './utils'

import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  ToastType,
  useToast,
  useSession,
  useOrder,
  useApi
} from '@components';

import { OText, OIcon, getPayIcon, NotFoundSource, PaymentOptionsWebView, PaymentOptionCard } from '@ui';

const PaymentOptionsUI = (props: any) => {
  const {
    businessId,
    navigation,
    isLoading,
    isDisabled,
    paymethodData,
    paymethodsList,
    setPaymethodData,
    handleRedirect,
    handlePaymethodClick,
    handlePaymethodDataChange,
    isOpenMethod,
    handlePlaceOrder,
    setPlaceByMethodPay,
    // requiredFields,
    placeByMethodPay,
    paymethodV2Featured,
    setCardList,
    onPaymentChange,
    globalPayIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod
  } = props

  const theme = useTheme()
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [{ carts, loading }, { changePaymethod, confirmCart }] = useOrder()
  const [, { showToast }] = useToast()
  const [{ user, token }] = useSession()
  const { confirmPlatformPayPayment } = usePlatformPay()
  const {
    excludeGateways,
    webViewPaymentGateway,
    methodsPay,
    methodsWithoutRequirements,
    filterMethodsPay,
    methodsWithoutOnBack
  } = PayUtilities()

  const cart = (businessId >= 0 && typeof businessId === 'number') ? carts?.[`businessId:${businessId}`] : carts?.['businessId:null']

  const [paymethodSelected, setPaymethodSelected] = useState(props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod)
  const [showGateway, setShowGateway] = useState<any>({ closedByUser: false, open: false })
  const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false, card: false });

  const loadingPayment = useRef({ loading: false, id: null })
  const scrollViewRef = useRef<ScrollView>(null)

  const handlePaymentMethodClick = async (paymethod: any) => {
    loadingPayment.current = { loading: true, id: paymethod?.id }
    if (methodsWithoutRequirements.includes(paymethod?.gateway)) {
      handlePaymethodClick(paymethod, false)
      const result = await changePaymethod(businessId, paymethod?.id, {})
      loadingPayment.current = { loading: false, id: null }
      if (result && (!methodsWithoutOnBack.includes(paymethod?.gateway) || !paymethod?.featured?.includes('get_cards'))) {
        handleRedirect('CheckoutPage', { cartUuid: cart?.uuid })
        return
      }
      return
    }

    if (webViewPaymentGateway.includes(paymethod?.gateway)) {
      setPaymethodSelected(paymethod)
      handlePaymethodClick(paymethod, true)
      setShowGateway({ closedByUser: false, open: true })
      const result = await changePaymethod(businessId, paymethod?.id, JSON.stringify({}))
      if (result) {
        handleRedirect('CheckoutPage', { cartUuid: cart?.uuid })
      }
      loadingPayment.current = { loading: true, id: null }
      return
    }

    if (methodsPay.includes(paymethod?.gateway)) {
      loadingPayment.current = { loading: false, id: null }
    }

    if (cart?.balance > 0 || !!user?.guest_id) {
      if (methodsPay.includes(paymethod?.gateway)) {
        setPaymethodSelected(paymethod)
      }
      handleRedirect('PaymentDetails', {
        businessId,
        paymethodData: cart?.paymethod_data,
        payData: cart?.paymethod_data,
        paySelected: paymethodSelected,
        paymethodSelected: paymethod,
        handlePaymethodClick,
        handlePaymethodDataChange,
        setPlaceByMethodPay,
        placeByMethodPay
      })
      return
    }

    showToast(
      ToastType.Error,
      t('CART_BALANCE_ZERO', 'Sorry, the amount to pay is equal to zero and it is not necessary to select a payment method'))
  }

  useEffect(() => {
    if (!paymethodsList?.paymethods?.length) return
    setPaymethodSelected(paymethodsList?.paymethods
      ?.map((p: any) => ({ ...p, paymethodId: p?.id, data: cart?.paymethod_data }))
      ?.find((paymethod: any) => paymethod?.id === cart?.paymethod_id))
  }, [cart?.paymethod_id, paymethodsList?.paymethods?.length])

  useEffect(() => {
    if (cart?.balance > 0) return
    handlePaymethodClick(null)
  }, [cart?.balance])

  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick && handlePaymethodClick(paymethodsList.paymethods[0])
    }
  }, [paymethodsList.paymethods])

  useEffect(() => {
    if (props.paySelected && props.paySelected?.data) {
      requestAnimationFrame(() => {
        setPaymethodData && setPaymethodData(props.paySelected?.data)
      })
    }
  }, [props.paySelected])

  useEffect(() => {
    if (methodsPay.includes(paymethodSelected?.gateway) && paymethodData?.id && paymethodData?.card) {
      handlePlaceOrder(confirmPlatformPayPayment, false, {
        ...paymethodData,
        paymethod_id: paymethodSelected?.id,
      })
    }
  }, [paymethodData, paymethodSelected])

  useEffect(() => {
    const onFailPaypal = async () => {
      if (showGateway.closedByUser === true) {
        await confirmCart(cart.uuid)
      }
    }
    onFailPaypal()
  }, [showGateway.closedByUser])

  useEffect(() => {
    const onBackFunction = () => {
      if (paymethodSelected?.gateway === 'paypal' && showGateway.open) {
        setShowGateway({ open: false, closedByUser: true })
        return true
      } else {
        return false
      }
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackFunction)
    return () => {
      backHandler.remove()
    }
  }, [paymethodSelected?.gateway, showGateway.open])

  const renderPaymethods = ({ item }: any) => {
    return (
      <>
        {methodsPay.includes(item?.gateway) ? (
          <PMPayItem
            onPress={() => handlePaymentMethodClick(item)}>
            <OIcon
              src={getPayIcon(item.gateway, theme)}
              width={100}
              height={100}
              style={{ marginRight: 10 }}
            />
          </PMPayItem>
        ) : (
          <PMItem
            key={item.id}
            activeOpacity={0.7}
            isDisabled={isDisabled}
            isLoading={loadingPayment.current.loading && loadingPayment.current.id === item.id}
            isActive={paymethodSelected?.id === item.id && !loadingPayment.current.loading}
            onPress={() => handlePaymentMethodClick(item)}
          >
            <OIcon
              src={getPayIcon(item.gateway, theme)}
              width={90}
              height={90}
            />
            <OText
              size={theme.utils.tsize.m}
              weight={700}
              style={{ textAlign: 'center' }}
              color={paymethodSelected?.id === item.id ? theme.colors.primary : theme.colors.textNormal}
            >
              {t(item?.gateway?.toUpperCase(), item.name)}
            </OText>
            {loadingPayment.current.loading && loadingPayment.current.id === item.id && (
              <View
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
                }}
              >
                <ActivityIndicator size='large' color={theme.colors.textNormal} />
              </View>
            )}
          </PMItem>
        )}
      </>
    )
  }

  return (
    <>
      {paymethodsList.paymethods.length > 0 && (
        <OText
          weight={800}
          color={theme.colors.textNormal}
          size={theme.utils.tsize.m}
          style={{ textAlign: 'center', marginTop: 20 }}
        >
          {t('SELECT_PAYMENT_METHOD', 'Select payment method')}
        </OText>
      )}
      <PMContainer
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: theme.utils.margins.horizontal }}
      >
        <View style={{ paddingBottom: 80 }}>
          {paymethodsList.paymethods.length > 0 && (
            <FlatList
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)
                .filter((p: any) => filterMethodsPay(p.gateway) && !excludeGateways.includes(p.gateway))}
              renderItem={renderPaymethods}
              keyExtractor={(paymethod: any, i: number) => `${paymethod?.id?.toString?.()}_${i}`}
            />
          )}
          {paymethodV2Featured?.includes('get_cards') && (
            <PaymentOptionCard
              navigation={navigation}
              scrollViewRef={scrollViewRef}
              setCardList={setCardList}
              paymethodSelectedInfo={paymethodSelected}
              paymethod={isOpenMethod?.paymethod}
              businessId={props.businessId}
              publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
              gateway={isOpenMethod?.paymethod?.gateway || paymethodSelected?.gateway}
              onPaymentChange={onPaymentChange}
              payType={isOpenMethod?.paymethod?.name}
              onSelectCard={handlePaymethodDataChange}
              addCardOpen={addCardOpen}
              setAddCardOpen={setAddCardOpen}
              onCancel={() => handlePaymethodClick(null)}
              paymethodSelected={paymethodSelected?.data?.id}
              handlePaymentMethodClick={handlePaymentMethodClick}
              paymethodV2Featured={paymethodV2Featured}
              loadingPayment={loadingPayment}
              showGateway={showGateway}
              setShowGateway={setShowGateway}
              onNavigationRedirect={handleRedirect}
              globalPayIFrameUrl={globalPayIFrameUrl}
              cybersourceIFrameUrl={cybersourceIFrameUrl}
              createBusinessUserPaymethod={createBusinessUserPaymethod}
            />
          )}

          {(paymethodsList.loading || isLoading) && (
            <Placeholder Animation={Fade}>
              <FlatList
                data={[...Array(6)]}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ index }) => (
                  <PlaceholderLine
                    key={index}
                    width={48}
                    height={160}
                    noMargin
                    style={{ borderRadius: theme.utils.radius.l, marginBottom: 20 }}
                  />
                )}
              />
            </Placeholder>
          )}

          {paymethodsList.error && paymethodsList.error.length > 0 && (
            <NotFoundSource
              simple
              content={paymethodsList?.error?.[0]?.message ?? paymethodsList?.error?.[0] ?? 'an error was occurs'}
            />
          )}

          {!(paymethodsList.loading || isLoading) &&
            !paymethodsList.error &&
            (!paymethodsList?.paymethods || paymethodsList.paymethods.length === 0) && (
              <NotFoundSource
                simple
                content={t('NO_PAYMENT_METHODS', 'No payment methods!')}
              />
            )}
        </View>
      </PMContainer>
      {paymethodSelected?.gateway === 'paypal' && showGateway.open && (
        <PaymentOptionsWebView
          cart={cart}
          user={user}
          token={token}
          webviewPaymethod={paymethodSelected}
          uri={`${ordering.root}/html/paypal_react_native`}
          setShowGateway={setShowGateway}
          onNavigationRedirect={handleRedirect}
        />
      )}
      {methodsPay.includes(paymethodSelected?.gateway) && loading && (
        <SpinnerLoader visible={true} />
      )}
    </>
  )
}

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI,
    disableAutoUpdate: true,
    usePaymenthodSelectedForV2: true
  }
  return (
    <PaymentOptionsController {...paymentOptions} />
  )
}
