import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ToastType,
  useToast,
  useApi,
  useLanguage,
  useConfig,
  useOrder,
  useWebsocket
} from '@components';

import { OText } from '../shared';

interface PaymentOptionsWebViewParams {
  navigation?: any,
  isAvoidRerender?: boolean,
  onNavigationRedirect?: Function,
  uri?: any,
  user?: any,
  token?: any,
  cart?: any,
  currency?: any,
  webviewPaymethod?: any,
  setShowGateway?: any,
  setOpenOrderCreating?: any,
  locationId?: any,
  additionalParams?: any,
  title?: string,
  createBusinessUserPaymethod?: any,
  callbackAfterCardAction?: any,
  businessId?: any
}
export const PaymentOptionsWebView = (props: PaymentOptionsWebViewParams) => {
  const {
    navigation,
    isAvoidRerender,
    onNavigationRedirect,
    uri,
    user,
    token,
    cart,
    currency,
    webviewPaymethod,
    setShowGateway,
    setOpenOrderCreating,
    locationId,
    title,
    additionalParams = {},
    createBusinessUserPaymethod,
    callbackAfterCardAction,
    businessId
  } = props

  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const webviewRef = useRef<any>(null)
  const [, { showToast }] = useToast();
  const [ordering] = useApi()
  const [{ configs }] = useConfig();
  const [, t] = useLanguage();
  const socket = useWebsocket()
  const [, { confirmCart, refreshOrderOptions, changePaymethod }] = useOrder()
  const [hasLoaded, setHasLoaded] = useState(false);
  const [progClr, setProgClr] = useState('#424242');
  const [prog, setProg] = useState(true);

  const handleCloseWebview = async () => {
    setProg(true);
    setShowGateway({ open: false, closedByUser: true })
  }

  const onMessage = async (e: any) => {
    if (e?.nativeEvent?.data && e?.nativeEvent?.data !== 'undefined') {
      let payment;
      try {
        payment = JSON.parse(e.nativeEvent.data);
      } catch (error) {
        console.error('Error parsing message:', error);
        return;
      }

      if (Object.keys(payment).length > 0) {
        let paymentData = null
        if (['computop'].includes(cart?.paymethod_data?.gateway)) {
          paymentData = {
            [cart?.paymethod_data?.gateway]: {
              ...payment
            }
          }
        } else {
          paymentData = {
            [`${cart?.paymethod_data?.gateway}_data`]: {
              ...payment?.data
            }
          }
        }

        if (payment?.data?.action === 'payment_ready') {
          return
        }
        if (payment?.data?.transient_token) {
          const cybersourceData = {
            transient_token: payment?.data?.transient_token,
            transaction_type: payment?.data?.transaction_type || 'PAYMENT',
            billing: payment?.data?.billing,
            card_data: payment?.data?.card_data
          };

          try {
            await changePaymethod(
              businessId ?? cart?.business_id,
              webviewPaymethod?.id,
              JSON.stringify(cybersourceData)
            );
          } catch (error) {
            console.error('Error updating Cybersource payment method:', error);
          }
          setShowGateway((prev: any) => ({ ...prev, open: false }));
          navigation.goBack()
          return;
        }

        if (payment?.data?.card_token) {
          createBusinessUserPaymethod?.({
            external_id: payment?.data?.card_token,
            type_data: JSON.stringify(payment?.data?.card_data),
            type: 'card',
            paymethodId: webviewPaymethod?.id
          }, (result: any) => {
            callbackAfterCardAction?.(result)
          })
          return
        }

        const confirmCartRes = await confirmCart(payment.orderid ?? cart?.uuid, paymentData)
        if (confirmCartRes.result.order?.uuid) {
          refreshOrderOptions()
          onNavigationRedirect?.('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
        }
      }

      if (payment === 'api error' || payment === 'Cancelled by user') {
        setShowGateway({ closedByUser: true, open: false })
        setProg(true);
      }

      if (payment) {
        if (payment.error) {
          showToast(ToastType.Error, payment.result)
          setOpenOrderCreating && setOpenOrderCreating(false)
        } else if (payment?.result?.order?.uuid) {
          showToast(ToastType.Success, t('ORDER_PLACED_SUCCESSfULLY', 'The order was placed successfully'))
          refreshOrderOptions()
          onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: payment?.result?.order?.uuid, isFromCheckout: true })
        }
        setProg(true);
        if (['liqpay'].includes(cart?.paymethod_data?.gateway) && payment?.data?.action === 'payment_response' && payment?.data?.status === 'success') {
          setShowGateway((prev: any) => ({ ...prev, forceGetOrder: true }))
          return
        }
        setShowGateway({ closedByUser: false, open: false })
      }
    }
  }

  const handleChangedUrl = async (webViewState: any) => {
    if (webViewState.url.includes('https://secure.epayco.co/landingresume')) {
      setShowGateway(false)
    }
  }

  useEffect(() => {
    const handleCartUpdate = (cart: any) => {
      if (cart?.status !== 1 || !cart?.order?.uuid) return
      refreshOrderOptions()
      onNavigationRedirect?.('OrderDetails', { orderId: cart?.order?.uuid, isFromCheckout: true })
    }
    socket.on('carts_update', handleCartUpdate)
    return () => {
      socket.off('carts_update', handleCartUpdate)
    }
  }, [socket])

  return (
    <View style={{ zIndex: 9999, height: '100%', width: '100%', position: 'absolute', backgroundColor: 'white', top: 0 }}>
      <Icon
        name="x"
        size={35}
        color={theme?.colors?.textNormal}
        style={{ backgroundColor: 'white', paddingTop: insets.top, paddingLeft: theme.utils.margins.horizontal }}
        onPress={handleCloseWebview}
      />
      <OText
        style={{
          textAlign: 'center',
          fontSize: theme.utils.tsize.l,
          fontWeight: 'bold',
          color: '#00457C'
        }}>
        {title || (webviewPaymethod?.gateway === 'paypal' ? (t('PAYPAL_GATEWAY', 'PayPal GateWay')) : (t('SQUARE_PAYMENT', 'Square payment')))}
      </OText>
      <View style={{ padding: theme.utils.margins.horizontal, opacity: prog ? 1 : 0, backgroundColor: 'white' }}>
        <ActivityIndicator size={24} color={progClr} />
      </View>
      <WebView
        source={{ uri: uri }}
        onMessage={onMessage}
        ref={webviewRef}
        javaScriptEnabled={true}
        startInLoadingState={true}
        javaScriptEnabledAndroid={true}
        cacheEnabled={false}
        cacheMode='LOAD_NO_CACHE'
        style={{ flex: 1 }}
        onNavigationStateChange={handleChangedUrl}
        onShouldStartLoadWithRequest={() => true}
        originWhitelist={["*"]}
        onLoadStart={() => {
          setProg(true);
          setProgClr('#424242');
        }}
        onLoadProgress={() => {
          setProg(true);
          setProgClr('#00457C');
        }}
        onLoad={() => {
          setProg(true);
          setProgClr('#00457C');
        }}
        onLoadEnd={(e) => {
          if (!hasLoaded) {
            isAvoidRerender && setHasLoaded(true)
            const messageParams = locationId ? { locationId, clientId: webviewPaymethod?.credentials?.application_id } : {}
            const message = {
              action: 'init',
              data: {
                urlPlace: `${ordering.root}/carts/${cart?.uuid}/place`,
                urlConfirm: `${ordering.root}/carts/${cart?.uuid}/confirm`,
                payData: {
                  paymethod_id: webviewPaymethod?.id,
                  amount: cart?.balance ?? cart?.total,
                  delivery_zone_id: cart?.delivery_zone_id,
                  user_id: user?.id,
                  user_name: user?.name
                },
                xappx: ordering?.appId,
                currency: configs?.stripe_currency?.value || currency,
                userToken: token,
                clientId: webviewPaymethod?.credentials?.client_id,
                ...messageParams,
                ...additionalParams
              }
            }
            webviewRef?.current?.postMessage?.(JSON.stringify(message))
          }
          setProg(false)
        }}
      />
    </View>
  )
}
