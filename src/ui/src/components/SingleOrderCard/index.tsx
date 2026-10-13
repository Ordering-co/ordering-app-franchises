import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';

import { getOrderStatus } from '../../utils'
import { SingleOrderCardParams } from '../../types';
import { ORDER_TYPES } from '../../config/constants';
import { OrderEta } from '../OrderDetails/OrderEta'
import {
  InnerContainer,
  CardInfoWrapper,
  ContentHeader,
  ButtonWrapper,
  ContentFooter,
  WrapperFooterContent,
} from './styles';

import {
  SingleOrderCard as SingleOrderCardController,
  useUtils,
  useOrder,
  useLanguage,
  useConfig
} from '@components';

import { OAlertOriginal as OAlert, OText, OButton, CardAnimation, LottieAnimation, REVIEW_STATUS } from '@ui'

const SingleOrderCardUI = (props: SingleOrderCardParams) => {
  const {
    order,
    reorderLoading,
    handleReorder,
    handleFavoriteOrder,
    onNavigationRedirect,
    pastOrders,
    isMessageView,
    handleClickOrder,
    handleRemoveCart,
    cartState
  } = props;

  const [{ parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ carts }] = useOrder()
  const [{ configs }] = useConfig()
  const theme = useTheme();
  const isFocused = useIsFocused();

  let [reorderSelected, setReorderSelected] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const [isPressed, setIsPressed] = useState(false)

  const isGiftCardOrder = !order?.business_id
  const changeIdToExternalId = configs?.change_order_id?.value === '1'

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 25,
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderRadius: theme.utils.radius.l,
      position: 'relative'
    },
    buttonText: {
      fontSize: 14,
      marginLeft: 2,
      marginRight: 2,
      color: theme?.colors?.white
    },
    reorderLoading: {
      height: 30,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: theme.utils.radius.l,
      shadowOpacity: 0,
      backgroundColor: theme.colors.primary,
      borderWidth: 0
    },
    reorderbutton: {
      paddingLeft: 5,
      height: 'auto',
      paddingRight: 5,
      padding: 5,
      borderRadius: theme.utils.radius.l,
      shadowOpacity: 0,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
    },
    reviewButton: {
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      borderRadius: theme.utils.radius.l,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    infoText: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    cardAnimation: {
      elevation: isPressed ? 2 : 0,
      shadowColor: '#888',
      shadowOffset: { width: 0, height: isPressed ? 2 : 0 },
      shadowRadius: 18,
      shadowOpacity: isPressed ? 0.8 : 0,
      borderRadius: 12,
    }
  });

  const handleReorderClick = (order: any) => {
    setReorderSelected(null)
    reorderSelected = null
    const isMultiOrders = Array.isArray(order?.id)

    const isRemoveCart = isMultiOrders
      ? order?.business_id?.some((businessId: any) => !!carts[`businessId:${businessId}`]?.uuid)
      : carts[`businessId:${order?.business_id}`] && !!carts[`businessId:${order?.business_id}`]?.uuid

    if (isRemoveCart) {
      setConfirm({
        open: true,
        content: [t('QUESTION_DELETE_PRODUCTS_FROM_CART', 'Are you sure that you want to delete all products from cart?')],
        title: t('ORDER', 'Order'),
        handleOnAccept: async () => {
          handleRemoveCart(order)
          setConfirm({ ...confirm, open: false })
        }
      })
    } else {
      const orderId = Array.isArray(order?.id) ? order?.id[0] : order?.id
      setReorderSelected(orderId)
      reorderSelected = orderId
      handleReorder && handleReorder(order?.id)
    }
  };

  const handleClickOrderReview = (order: any) => {
    if (pastOrders) {
      onNavigationRedirect &&
        onNavigationRedirect('ReviewOrder', {
          order: {
            id: order?.id,
            business_id: order?.business_id,
            logo: order?.business?.length > 1 ? order?.business?.map?.((business: any) => business?.logo) : order?.business?.logo,
            driver: order?.driver,
            products: order?.products,
            review: order?.review,
            user_review: order?.user_review,
            business: order?.business
          },
        });
      return
    }
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { orderId: order?.uuid, orderNumberId: order?.id });
  };

  const handleClickViewOrder = (order: any) => {
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    onNavigationRedirect?.('OrderDetails', { orderId: order?.uuid, orderNumberId: order?.id, fromHome: props.fromHome });
  };

  const handleChangeFavorite = () => {
    handleFavoriteOrder && handleFavoriteOrder(!order?.favorite)
  };

  const handleOriginalReorder = () => {
    setConfirm({ ...confirm, open: false, title: null })
  }

  const hideDate = theme?.orders?.components?.date?.hidden
  const hideBusinessName = theme?.orders?.components?.business_name?.hidden
  const hideOrderNumber = theme?.orders?.components?.order_number?.hidden
  const hideReviewOrderButton = theme?.orders?.components?.review_order_button?.hidden
  const hideReorderButton = theme?.orders?.components?.reorder_button?.hidden
  const hideFavorite = theme?.orders?.components?.favorite?.hidden
  const hideOrderStatus = theme?.orders?.components?.order_status?.hidden

  useEffect(() => {
    if (isFocused) setReorderSelected(null)
  }, [isFocused])

  return (
    <>
      <CardAnimation
        style={[styles.container]}
        onClick={() => handleClickViewOrder(order)}
      >
        <InnerContainer>
          <CardInfoWrapper>
            <ContentHeader>
              {(order?.business?.length > 1 && !hideOrderNumber) || (!order?.business?.length && !hideBusinessName) && (
                <View style={{ flex: 1 }}>
                  <OText size={18} weight={'700'} numberOfLines={1} ellipsizeMode={'tail'}>
                    {order?.business?.length > 1 ? `${t('GROUP_ORDER', 'Group Order')} ${t('No', 'No')}. ${order?.cart_group_id}` : order.business?.name}
                  </OText>
                </View>
              )}
              {order?.business_id === null && (
                <OText size={18} weight={'700'} numberOfLines={1} ellipsizeMode={'tail'}>
                  {t('GIFT_CARD', 'Gift Card')}
                </OText>
              )}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                {!!pastOrders && !isGiftCardOrder && (
                  <ButtonWrapper>
                    {!hideReviewOrderButton &&
                      REVIEW_STATUS.includes(parseInt(order?.status)) &&
                      !order.review && order?.cart && (
                        <TouchableOpacity
                          onPress={() => handleClickOrderReview(order)}
                          style={styles.reviewButton}>
                          <OText color={theme.colors.primary} numberOfLines={1}>
                            {t('REVIEW', 'Review')}
                          </OText>
                        </TouchableOpacity>
                      )}
                  </ButtonWrapper>
                )}
                {!!pastOrders && !isGiftCardOrder && !hideReorderButton && (typeof order?.id === 'number') && order?.cart && (
                  <OButton
                    text={t('REORDER', 'Reorder')}
                    imgRightSrc={''}
                    bgColor={theme?.colors?.primary}
                    textStyle={styles.buttonText}
                    style={
                      ((reorderLoading && order.id === reorderSelected) || cartState?.loading)
                        ? styles.reorderLoading
                        : styles.reorderbutton
                    }
                    isLoading={(reorderLoading && order.id === reorderSelected) || cartState?.loading}
                    onClick={() => handleReorderClick(order)}
                  />
                )}
              </View>
            </ContentHeader>
            <ContentFooter>
              <View style={styles.infoText}>
                {(!!!pastOrders || order?.business?.length > 1) && !hideOrderNumber && (
                  <>
                    <OText
                      space
                      style={{ marginVertical: 3 }}
                      lineHeight={18}
                      numberOfLines={1}
                      color={theme.colors.disabled}
                      size={13}
                    >
                      {order?.business?.length > 1 ? order?.business?.length : !(changeIdToExternalId && order?.external_id) && (t('ORDER_NO', 'Order No') + '.')}
                    </OText>
                    <OText
                      style={{ marginVertical: 3 }}
                      lineHeight={18}
                      numberOfLines={1}
                      color={theme.colors.disabled}
                      size={13}
                    >
                      {order?.business?.length > 1 ? t('ORDERS', 'orders') + ' \u2022 ' : ((changeIdToExternalId && order?.external_id) || order.id) + ` \u2022 `}
                    </OText>
                  </>
                )}
                {!hideDate && (
                  <View style={styles.infoText}>
                    <OText
                      lineHeight={18}
                      style={{ marginVertical: 3 }}
                      numberOfLines={1}
                      color={theme.colors.disabled}
                      size={13}
                    >
                      {
                        pastOrders
                          ? order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })
                          : <OrderEta order={order} />
                      }
                    </OText>
                  </View>
                )}
              </View>
              <WrapperFooterContent>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
                  <OText
                    size={theme.utils.tsize.xs}
                    lineHeight={18}
                    numberOfLines={1}
                    color={theme.colors.primary}
                  >
                    {t(ORDER_TYPES[order?.delivery_type - 1]?.content) + ' \u2022 '}
                  </OText>
                  {!hideOrderStatus && (
                    <View style={{ width: '90%' }}>
                      <OText
                        color={theme.colors.primary}
                        size={theme.utils.tsize.xs}
                        lineHeight={18}
                        ellipsizeMode={'tail'}
                        numberOfLines={1}
                      >
                        {getOrderStatus(order.status, t, theme)?.value}
                      </OText>
                    </View>
                  )}
                </View>
                {!isMessageView && !order?.business?.length && !hideFavorite && (
                  <LottieAnimation
                    type='favorite'
                    onClick={handleChangeFavorite}
                    initialValue={order?.favorite ? 0.5 : 0}
                    toValue={order?.favorite ? 0 : 0.5}
                    isActive={order?.favorite}
                  />
                )}
              </WrapperFooterContent>
            </ContentFooter>
          </CardInfoWrapper>
        </InnerContainer>
      </CardAnimation>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => handleOriginalReorder()}
        onClose={() => handleOriginalReorder()}
      />
    </>

  )
}

export const SingleOrderCard = (props: any) => {
  const [order, setOrder] = useState(props.order)

  useEffect(() => {
    setOrder(props.order)
  }, [props.order])

  const singleOrderCardProps = {
    ...props,
    order,
    handleUpdateSingleOrder: (values: any) => setOrder({ ...order, ...values }),
    UIComponent: SingleOrderCardUI
  }
  return <SingleOrderCardController {...singleOrderCardProps} />
}
