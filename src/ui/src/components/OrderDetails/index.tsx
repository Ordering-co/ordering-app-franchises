import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Linking, RefreshControl, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine } from 'rn-placeholder';
import FastImage from 'react-native-fast-image'

import {
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderData,
  OrderInfo,
  StaturBar,
  OrderSection,
  InfoBlock,
  Customer,
  Icons,
  OrderDriver,
  Map,
  PlaceSpotWrapper,
  HeaderTitle,
  HelpBtn,
  WrapperOptions,
  WrapperPhoto,
  Total,
  Table,
  WrapperAddress,
  Divider,
  WrapperFullTotal,
  WrapperActionBtns
} from './styles'

import { getOrderStatus, getOrderStatuPickUp } from '../../utils'
import { OrderDetailsParams } from '../../types';
import { OrderEta } from './OrderEta'
import { Bill } from './Bill'

import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useToast,
  ToastType,
  useUtils,
  useConfig
} from '@components';

import {
  _setStoreData,
  OIcon, OText,
  GoogleMap,
  PlaceSpot,
  SendGiftCard,
  PoweredBy,
  OButton,
  FloatingButton,
  REVIEW_STATUS,
  REORDER_STATUS
} from '@ui'

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    messages,
    setMessages,
    readMessages,
    reorderState,
    driverLocation,
    getOrder,
    onGoBack,
    handleReorder,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()

  const { order, loading } = props.order
  const isGiftCardOrder = !order?.business_id

  const isOrderCompleted = REORDER_STATUS.includes(parseInt(order?.status, 10))

  const [isReviewed, setIsReviewed] = useState(false)
  const [isGiftCardSent, setIsGiftCardSent] = useState(false)
  const [refreshing] = useState(false);

  const mapValidStatuses = [9, 18, 19, 23, 26]
  const placeSpotTypes = [3, 4, 5]
  const deliveryTypes = [1, 7]
  const [isPickup, setIsPickup] = useState(order?.delivery_type === 2)
  const hideDeliveryProgress = theme?.confirmation?.components?.order?.components?.progress?.hidden
  const hideDriverName = theme?.confirmation?.components?.driver?.components?.name?.hidden
  const hideDriverPhone = theme?.confirmation?.components?.driver?.components?.phone?.hidden
  const hideDriverMessages = theme?.confirmation?.components?.driver?.components?.messages?.hidden
  const hideReorderButton = theme?.orders?.components?.reorder_button?.hidden

  const progressBarObjt = isPickup ? (s: any) => getOrderStatuPickUp(s, t, theme) : (s: any) => getOrderStatus(s, t, theme)
  const resfreshOrder = () => getOrder && getOrder()

  const handleGoToMessages = (type: string) => {
    readMessages && readMessages()
    onNavigationRedirect(
      'MessageView',
      {
        type,
        order,
        messages,
        setMessages,
        orderId: order?.id,
        business: type === 'business',
        driver: type === 'driver',
        onClose: () => onGoBack?.()
      }
    )
  }

  const handleClickOrderReview = (order: any) => {
    onNavigationRedirect('ReviewOrder', { order, setIsReviewed })
  }

  const handleRedirectToCheckout = async (id: number) => {
    const result = await handleReorder(id)
    onNavigationRedirect('CheckoutPage', { cartUuid: result?.uuid })
  }

  useEffect(() => {
    const handleArrowBack: () => any = () => {
      if (props.isFromCheckout) {
        onNavigationRedirect('BottomTab', { screen: 'Business' })
        return true
      }
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleArrowBack)
    return () => {
      backHandler.remove()
    }
  }, [])

  const locations = [
    {
      ...order?.driver?.location,
      title: t('DRIVER', 'Driver'),
      icon:
        order?.driver?.photo ||
        theme?.images?.general?.driverPng,
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
    },
    {
      ...order?.customer?.location,
      title: t('YOUR_LOCATION', 'Your Location'),
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
    }
  ]

  const driverLocationString = typeof order?.driver?.location?.location === 'string' && order?.driver?.location?.location?.split(',').map((l: string) => l.replace(/[^-.0-9]/g, ''))
  const parsedLocations = locations.map(location => typeof location?.location === 'string' ? {
    ...location,
    lat: parseFloat(location?.location?.split(',')[0].replace(/[^-.0-9]/g, '')),
    lng: parseFloat(location?.location?.split(',')[1].replace(/[^-.0-9]/g, ''))
  } : location)

  useEffect(() => {
    if (driverLocation) {
      parsedLocations[0] = { ...locations[0], ...driverLocation }
    }
  }, [driverLocation]);

  useEffect(() => {
    if (props?.order?.error && !props?.order?.loading) {
      showToast(ToastType.Error, props?.order?.error)
      onNavigationRedirect('BottomTab', { screen: 'Business' })
    }
  }, [props?.order?.error, props?.order?.loading])

  useEffect(() => {
    if (!order?.delivery_type) return
    setIsPickup(order?.delivery_type === 2)
  }, [order?.delivery_type])

  return (
    <>
      {!loading && !!order?.id && (
        <Header>
          <HeaderTitle>
            <View style={{ width: '50%', alignItems: 'flex-start' }}>
              <OText
                size={theme.utils.tsize.s + 1}
                weight={'bold'}
                style={{ textTransform: 'uppercase' }}
              >
                {isPickup ? t('PICKUP_ORDER', 'Pickup Order') : t('ESTIMATED_TIME', 'Estimated Time')}
              </OText>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <OText color={theme.colors.textNormal}>
                <OrderEta order={order} outputFormat={configs?.dates_general_format?.value || 'dddd, MMMM D YYYY'} />
              </OText>
            </View>
          </HeaderTitle>
          {!isOrderCompleted && (
            <HeaderTitle>
              <OText color={theme.colors.primary} size={theme.utils.tsize.xxxl} weight={'bold'}>
                <OrderEta order={order} outputFormat={configs?.general_hour_format?.value || 'hh:mm A'} />
              </OText>
              <HelpBtn
                activeOpacity={0.7}
                onPress={() => handleGoToMessages('business')}
              >
                <OText>{t('HELP', 'Help')}</OText>
              </HelpBtn>
            </HeaderTitle>
          )}
          {!isGiftCardOrder && !hideDeliveryProgress && (
            <>
              {!isOrderCompleted && (
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: progressBarObjt(order?.status, t)?.percentage || 0, y: 0 }}
                  locations={[0.9999, 0.9999]}
                  colors={[theme.colors.primary, theme.colors.backgroundGray200]}
                  style={styles.statusBar}
                />
              )}
              <OText
                lineHeight={24}
                color={isOrderCompleted ? theme.colors.success500 : theme.colors.primary}
              >
                {progressBarObjt(order?.status, t)?.value}
              </OText>
            </>
          )}
        </Header>
      )}

      <OrderDetailsContainer
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => resfreshOrder()}
          />
        }
      >
        {!loading && order && Object.keys(order).length > 0 && (
          <>
            <OrderContent>
              {order?.driver &&
                order?.driver?.location &&
                !isOrderCompleted &&
                mapValidStatuses.includes(parseInt(order?.status)) &&
                (
                  <Map>
                    <GoogleMap
                      readOnly
                      manualZoom
                      locations={parsedLocations}
                      location={typeof order?.driver?.location?.location === 'string'
                        ? {
                          lat: parseFloat(driverLocationString[0]),
                          lng: parseFloat(driverLocationString[1]),
                        } : driverLocation ?? order?.driver?.location
                      }
                    />
                  </Map>
                )}

              {!isGiftCardOrder && placeSpotTypes.includes(order?.delivery_type) && !isOrderCompleted && (
                <PlaceSpotWrapper>
                  <PlaceSpot
                    isInputMode
                    cart={order}
                    spotNumberDefault={order?.spot_number}
                    vehicleDefault={order?.vehicle}
                  />
                </PlaceSpotWrapper>
              )}

              {!isOrderCompleted &&
                (
                  (!isGiftCardOrder && order?.delivery_option !== undefined && deliveryTypes?.includes?.(order?.delivery_type)) ||
                  !!order?.comment
                ) && (
                  <OrderSection>
                    {!isGiftCardOrder && order?.delivery_option !== undefined && deliveryTypes?.includes?.(order?.delivery_type) && (
                      <View>
                        <OText size={theme.utils.tsize.m} weight={600} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                          {t('DELIVERY_PREFERENCE', 'Delivery Preference')}
                        </OText>
                        <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                          {order?.delivery_option?.name ? t(order?.delivery_option?.name.toUpperCase().replace(/\s/g, '_')) : t('EITHER_WAY', 'Either way')}
                        </OText>
                      </View>
                    )}
                    {!!order?.comment && (
                      <View style={{ marginTop: 20 }}>
                        <OText size={theme.utils.tsize.m} weight={600} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                          {t('COMMENT', 'Comment')}
                        </OText>
                        <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>{order?.comment}</OText>
                      </View>
                    )}
                  </OrderSection>
                )}

              {order?.driver && !isOrderCompleted && (
                <OrderDriver>
                  <Customer>
                    {!!order?.driver?.photo && (
                      <WrapperPhoto>
                        <FastImage
                          style={styles.photo}
                          source={{
                            uri: order?.driver?.photo,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </WrapperPhoto>
                    )}
                    <InfoBlock>
                      <WrapperOptions>
                        {!hideDriverName && (
                          <OText
                            size={theme.utils.tsize.s + 1}
                            lineHeight={18}
                            weight={600}
                            color={theme.colors.textNormal}
                            mBottom={2}
                            style={{ flexGrow: 1, flexBasis: '80%' }}
                          >
                            {order?.driver?.name} {order?.driver?.lastname}
                          </OText>
                        )}
                        {!hideDriverMessages && (
                          <Icons>
                            {!!order?.driver?.cellphone && !hideDriverPhone && (
                              <TouchableOpacity
                                onPress={() => order?.driver?.cellphone &&
                                  Linking.openURL(`tel:${order?.driver?.cellphone}`)
                                }
                                style={{ paddingEnd: 5 }}
                              >
                                <OIcon
                                  src={theme.images.general.phone}
                                  width={16}
                                  color={theme.colors.disabled}
                                />
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() => handleGoToMessages('driver')}>
                              <OIcon
                                src={theme.images.general.chat}
                                width={16}
                                color={theme.colors.disabled}
                              />
                            </TouchableOpacity>
                          </Icons>
                        )}
                      </WrapperOptions>
                      <OText lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                        {t('YOUR_DRIVER', 'Your Driver')}
                      </OText>
                    </InfoBlock>
                  </Customer>
                </OrderDriver>
              )}

              {!isOrderCompleted && (
                <WrapperFullTotal>
                  <Table style={{ paddingBottom: 0 }}>
                    <OText size={theme.utils.tsize.xxl + 2} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText
                      size={
                        parsePrice(order?.summary?.total ?? order?.total).length > 11
                          ? theme.utils.tsize.m + 2
                          : theme.utils.tsize.xxl + 2
                      }
                      style={{ fontWeight: 'bold' }}
                      color={theme.colors.textNormal}
                    >
                      {parsePrice(order?.summary?.total ?? order?.total)}
                    </OText>
                  </Table>
                </WrapperFullTotal>
              )}

              {isOrderCompleted && (
                <OText
                  weight={800}
                  style={{ padding: theme.utils.margins.horizontal }}
                >
                  {t('YOUR_ORDER', 'Your Order')}
                </OText>
              )}

              <Bill
                hideTotal={!isOrderCompleted}
                order={order}
                isPickup={isPickup}
                isGiftCardOrder={isGiftCardOrder}
              />

              {isOrderCompleted && !!order?.business?.address && (
                <OrderSection>
                  <OText weight={600}>
                    {isPickup ? t('PICKUP_ADDRESS', 'Pickup Address') : t('DELIVERY_ADDRESS', 'Delivery Address')}
                  </OText>
                  <WrapperAddress>
                    {isPickup && (
                      <OText weight={'bold'}>
                        {order?.business?.name}
                      </OText>
                    )}
                    <OText>
                      {isPickup ? order?.business?.address : order?.customer?.address}
                    </OText>
                  </WrapperAddress>
                </OrderSection>
              )}

              {isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent && (
                <SendGiftCard
                  giftCardId={order?.products[0]?.gift_card?.id}
                  setIsGiftCardSent={setIsGiftCardSent}
                />
              )}
            </OrderContent>
            <PoweredBy containerStyle={{ paddingTop: 20, paddingBottom: 20 }} />
          </>
        )}

        {loading && (
          <Placeholder>
            <Header>
              <OrderInfo>
                <OrderData>
                  <PlaceholderLine width={60} height={15} />
                  <PlaceholderLine width={60} height={10} />
                  <StaturBar>
                    <PlaceholderLine height={15} />
                    <PlaceholderLine width={40} height={20} />
                  </StaturBar>
                </OrderData>
              </OrderInfo>
            </Header>
            <OrderContent>
              <OrderBusiness>
                <PlaceholderLine width={30} height={20} />
                <PlaceholderLine width={60} height={15} />
                <PlaceholderLine width={75} height={10} />
                <PlaceholderLine width={40} height={10} />
                <PlaceholderLine width={95} height={10} />
                <PlaceholderLine width={20} height={20} />
                <PlaceholderLine width={70} height={15} />
                <PlaceholderLine width={65} height={10} />
                <PlaceholderLine width={80} height={10} />
                <PlaceholderLine width={70} height={10} />
                <View>
                  <PlaceholderLine width={60} height={20} />
                  <PlaceholderLine width={40} height={10} />
                </View>
                <PlaceholderLine width={20} height={20} />
                <PlaceholderLine width={70} height={15} />
                <PlaceholderLine width={65} height={10} />
                <PlaceholderLine width={80} height={10} />
                <PlaceholderLine width={70} height={10} />
                <View>
                  <PlaceholderLine width={60} height={20} />
                  <PlaceholderLine width={40} height={10} />
                </View>
              </OrderBusiness>
            </OrderContent>
          </Placeholder>
        )}
      </OrderDetailsContainer>
      {(
        (REVIEW_STATUS.includes(parseInt(order?.status)) && !order.review && isOrderCompleted) ||
        ((REORDER_STATUS?.includes(parseInt(order?.status)) && order?.cart) && !isGiftCardOrder && !hideReorderButton)) &&
        (
          <FloatingButton
            secondaryBtn
            text={t('REVIEW_ORDER', 'Review')}
            hideBtn={!(REVIEW_STATUS.includes(parseInt(order?.status)) && !order.review && isOrderCompleted)}
            handleClick={() => handleClickOrderReview(order)}
            text2nd={((REORDER_STATUS?.includes(parseInt(order?.status)) && order?.cart) && !isGiftCardOrder && !hideReorderButton && !reorderState?.result?.uuid) && t('REORDER', 'REORDER')}
            loading2nd={reorderState?.loading}
            handle2ndClick={() => handleRedirectToCheckout(order.id)}
          />
        )}
    </>
  )
}

const styles = StyleSheet.create({
  statusBar: {
    height: 10,
    marginBottom: 10
  },
  photo: {
    height: 48,
    width: 48,
    borderRadius: 50
  }
})

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    disabledLeaveOrderSocket: true,
    UIComponent: OrderDetailsUI,
  }

  return <OrderDetailsConTableoller {...orderDetailsProps} />;
}
