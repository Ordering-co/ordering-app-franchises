import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native'

import { OrdersOptionParams } from '../../types'
import { flatArray } from '../../utils'

import { OptionTitle } from './styles'
import { PreviousBusinessOrdered } from './PreviousBusinessOrdered'
import { PreviousProductsOrdered } from './PreviousProductsOrdered'
import { getOrdersListKey } from './getOrdersListKey'
import { Skeletons } from '../Skeletons'

import { OrderList, useLanguage, useOrder, ToastType, useToast } from '@components'
import {
  OText,
  ActiveOrders,
  PreviousOrders,
  _setStoreData,
  NotFoundSource
} from '@ui'

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    navigation,
    activeOrders,
    preOrders,
    orderList,
    pagination,
    titleContent,
    customArray,
    onNavigationRedirect,
    orderStatus,
    loadMoreStatus,
    loadMoreOrders,
    loadOrders,
    setOrdersLength,
    ordersLength,
    refreshOrders,
    setRefreshOrders,
    reorderState,
    handleReorder,
    handleUpdateOrderList,
    isBusiness,
    isProducts,
    businessOrderIds,
    products,
    businessesSearchList,
    hideOrders,
    businesses,
    handleUpdateProducts,
    handleUpdateBusinesses,
    selectedOption
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [{ carts, }] = useOrder()
  const [, { showToast }] = useToast()
  const [orders, setOrders] = useState<any>([])

  const { loading, error, orders: values } = orderList
  const _orders = customArray || values || []
  const uniqueOrders: any = []

  const noFoundOrders = !loading &&
    ordersLength.activeOrdersLength === 0 &&
    ordersLength.previousOrdersLength === 0 &&
    ordersLength?.preordersLength === 0 &&
    !activeOrders && !preOrders && !isBusiness && !isProducts

  const noFoundBusinesses = !loading && !businesses?.loading && !businesses?.result?.length && isBusiness

  const noFoundProducts = !loading && !products?.length && isProducts

  const onProductClick = (product: any) => {
    if (product?.product_id && product?.category_id && product?.businessId &&
      product?.business.slug && product?.business.header && product?.business.logo) {
      onNavigationRedirect('ProductDetails', {
        isRedirect: 'business',
        businessId: product?.businessId,
        categoryId: product?.category_id,
        productId: product?.product_id,
        business: {
          store: product?.business.slug,
          header: product?.business.header,
          logo: product?.business.logo,
        }
      })
    } else {
      showToast(ToastType.Error, t('ERROR_FAILED_REDIRECT_IDS', 'Failed to redirect product for ids'))
    }
  }

  useEffect(() => {
    if (loading || error) return
    const ordersReduced = _orders.map((order: any) => order?.cart_group_id
      ? _orders
        .filter((_order: any) => _order?.cart_group_id === order?.cart_group_id)
        .map((_o: any, _: any, _ordersList: any) => {
          const obj = {
            ..._o,
            id: _ordersList.map((o: any) => o.id),
            review: _o.review,
            user_review: _o.user_review,
            total: _ordersList.reduce((acc: any, o: any) => acc + o.summary.total, 0),
            business: _ordersList.map((o: any) => o.business),
            business_id: _ordersList.map((o: any) => o.business_id),
            products: _ordersList.map((o: any) => o.products)
          }
          return obj
        }).find((o: any) => o)
      : order)
    const orders = ordersReduced?.filter((order: any) => {
      if (!order?.cart_group_id) return true
      const isDuplicate = uniqueOrders.includes(order?.cart_group_id)
      if (!isDuplicate) {
        uniqueOrders.push(order?.cart_group_id)
        return true
      }
      return false
    })
    setOrders(orders)
  }, [getOrdersListKey(_orders)])

  useEffect(() => {
    if (reorderState?.loading) return
    const _businessId = 'businessId:' + reorderState?.result?.business_id
    if (reorderState?.error) {
      if (reorderState?.result?.business_id) {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        navigation.navigate('Business', { store: reorderState?.result?.business?.slug })
      }
    }
    if (!reorderState?.error && !reorderState.loading && reorderState?.result?.business_id) {
      const cartProducts = carts?.[_businessId]?.products

      const available = cartProducts.every((product: any) => product.valid)
      const orderProducts = orders.find(
        (order: any) => Array.isArray(order?.id)
          ? order?.id?.includes(reorderState?.result?.orderId)
          : order?.id === reorderState?.result?.orderId
      )?.products

      const productsFlatten = orderProducts?.length && flatArray(orderProducts)?.filter((product: any) => product?.order_id === reorderState?.result?.orderId)

      if (available && reorderState?.result?.uuid && (cartProducts?.length === productsFlatten?.length)) {
        onNavigationRedirect && onNavigationRedirect('CheckoutPage', { cartUuid: reorderState?.result.uuid })
      } else {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        cartProducts?.length !== productsFlatten?.length && _setStoreData('already-removed', JSON.stringify('removed'))
        navigation.navigate('Business', { store: reorderState?.result?.business?.slug })
      }
    }
  }, [reorderState])

  useEffect(() => {
    if (reorderState?.error) {
      const errorMessage = (Array.isArray(reorderState?.result) || typeof reorderState?.result === 'string')
        ? reorderState?.result
        : t('CANT_REORDER_FOR_THIS_BUSINESS', 'Can’t reorder for this store, please create order manually.')
      showToast(ToastType.Error, errorMessage)
    }
  }, [reorderState])

  useFocusEffect(
    React.useCallback(() => {
      if (!businessesSearchList) {
        loadOrders(false, false, false, true)
      }
    }, [navigation])
  )

  useEffect(() => {
    const hasMore = pagination?.totalPages && pagination?.currentPage !== pagination?.totalPages
    if (loadMoreStatus && hasMore && !loading) {
      loadMoreOrders()
    }
  }, [loadMoreStatus, loading, pagination])

  useEffect(() => {
    if (loading) return

    const updateOrders = _orders.filter((order: any) => orderStatus.includes(order?.status))

    if (activeOrders) {
      setOrdersLength && setOrdersLength({ ...ordersLength, activeOrdersLength: updateOrders?.length })
    } else if (!preOrders) {
      setOrdersLength && setOrdersLength({ ...ordersLength, previousOrdersLength: updateOrders?.length })
    } else {
      setOrdersLength && setOrdersLength({ ...ordersLength, preordersLength: updateOrders?.length })
    }
  }, [_orders, activeOrders, preOrders])

  useEffect(() => {
    if (refreshOrders) {
      loadOrders(false, false, false, true)
      setRefreshOrders && setRefreshOrders(false)
    }
  }, [refreshOrders, selectedOption])

  return (
    <>
      {
        !!((ordersLength?.activeOrdersLength > 0 && activeOrders) ||
          (ordersLength?.previousOrdersLength > 0 && !activeOrders && !preOrders) ||
          (ordersLength?.preordersLength && ordersLength?.preordersLength > 0 && preOrders)
        ) && (
          <>
            {((titleContent && ((isBusiness && businessOrderIds?.length > 0) || isProducts)) || !titleContent) && (
              <OptionTitle titleContent={!!titleContent} isBusinessesSearchList={!!businessesSearchList}>
                <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={10} >
                  {titleContent || (activeOrders
                    ? t('ACTIVE', 'Active')
                    : preOrders
                      ? t('PREORDERS', 'Preorders')
                      : t('PAST', 'Past'))}
                </OText>
              </OptionTitle>
            )}
          </>
        )}

      {!error && orders.length > 0 && !hideOrders && (
        preOrders ? (
          <ActiveOrders
            orders={orders.filter((order: any) => orderStatus.includes(order?.status))}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            reorderLoading={reorderState?.loading}
            customArray={customArray}
            onNavigationRedirect={onNavigationRedirect}
            handleUpdateOrderList={handleUpdateOrderList}
          />
        ) : activeOrders ? (
          <ActiveOrders
            orders={orders.filter((order: any) => orderStatus.includes(order?.status))}
            pagination={pagination}
            reorderLoading={reorderState?.loading}
            customArray={customArray}
            onNavigationRedirect={onNavigationRedirect}
            handleUpdateOrderList={handleUpdateOrderList}
            loadMoreOrders={loadMoreOrders}
            loading={loading}
          />
        ) : (
          <PreviousOrders
            reorderLoading={reorderState?.loading}
            orders={orders.filter((order: any) => orderStatus.includes(order?.status)).sort((a: any, b: any) => (a?.id > b?.id) ? -1 : 1)}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            onNavigationRedirect={onNavigationRedirect}
            handleReorder={handleReorder}
            handleUpdateOrderList={handleUpdateOrderList}
            loading={loading}
          />
        )
      )}

      {isBusiness && !businesses?.loading && (
        <PreviousBusinessOrdered
          onNavigationRedirect={onNavigationRedirect}
          isBusinessesSearchList={!!businessesSearchList}
          businesses={businesses}
          handleUpdateBusinesses={handleUpdateBusinesses}
        />
      )}

      {isProducts && !loading && (
        <PreviousProductsOrdered
          products={products}
          onProductClick={onProductClick}
          handleUpdateProducts={handleUpdateProducts}
          isBusinessesSearchList={!!businessesSearchList}
        />
      )}

      {(loading || businesses?.loading) && (
        <LoadingComponent
          preOrders={preOrders}
          hideOrders={hideOrders}
          isBusiness={isBusiness}
          isProducts={isProducts}
        />
      )}

      {(noFoundOrders || noFoundBusinesses || noFoundProducts) && (
        <View style={{ marginTop: 20 }}>
          <NotFoundSource
            simple
            content={t('YOU_DONT_HAVE_ORDERS', 'You don\'t have any orders')}
          />
        </View>
      )}
    </>
  )
}

export const LoadingComponent = (props: any) => {
  const { preOrders, hideOrders, isBusiness, isProducts } = props
  const { BusinessSkeleton, OrderSkeleton, ProductSkeleton } = Skeletons()

  return (
    <View style={{ marginTop: preOrders && !isBusiness && !isProducts ? 0 : 20 }}>
      {[...Array(4).keys()].map(i => (
        <React.Fragment key={i}>
          {!hideOrders && !preOrders && <OrderSkeleton />}
          {isProducts && <ProductSkeleton />}
          {isBusiness && <BusinessSkeleton />}
        </React.Fragment>
      ))}
    </View>
  )
}

export const OrdersOption = (props: OrdersOptionParams) => {
  const getAllOrders = (props.activeOrders && props.pastOrders && props.preOrders) ||
    props.selectedOption === 'favorite_orders'

  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    noGiftCardOrders: true,
    disabledLeaveOrderSocket: true,
    orderStatus: getAllOrders
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
      : props.preOrders ? [13] : props.activeOrders
        ? [0, 3, 4, 7, 8, 9, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        : [1, 2, 5, 6, 10, 11, 12, 15, 16, 17],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: getAllOrders ? 30 : 10,
      controlType: 'infinity'
    }
  }

  return <OrderList {...MyOrdersProps} />

}
