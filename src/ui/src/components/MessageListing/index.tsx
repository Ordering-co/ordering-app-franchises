import React, { useState, useEffect } from 'react'
import { View, RefreshControl, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useFocusEffect } from '@react-navigation/native'

import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'

import { useLanguage, OrderList, useBusiness } from '@components'
import { NotFoundSource, ActiveOrders, NavBar } from '@ui'

import { MessageListingWrapper, MessageContainer } from './styles'
import { MessageListingParams, OrdersOptionParams } from '../../types'

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    navigation,
    orderList,
    pagination,
    customArray,
    onNavigationRedirect,
    orderStatus,
    loadMoreOrders,
    loadOrders,
    setOrderList,
    setRefreshOrders,
    refreshOrders,
    onClickOrder
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const { loading, error, orders: values } = orderList
  const orders = customArray || values || []

  useFocusEffect(
    React.useCallback(() => {
      loadOrders()
    }, [navigation])
  )

  useEffect(() => {
    if (loading) return
    setOrderList(orderList)
  }, [orderList, loading])

  useEffect(() => {
    if (refreshOrders) {
      loadOrders(false, false, false, true)
      setRefreshOrders && setRefreshOrders(false)
    }
  }, [refreshOrders])

  return (
    <>
      {!loading && !error && orders.length > 0 && (
        <ActiveOrders
          isMessageView
          orders={orders.filter((order: any) => orderStatus.includes(order.status))}
          pagination={pagination}
          loadMoreOrders={loadMoreOrders}
          customArray={customArray}
          onNavigationRedirect={onNavigationRedirect}
          handleClickOrder={onClickOrder}
        />
      )}
      {loading && (
        [...Array(6)].map((_, i) => (
          <Placeholder
            key={i}
            Animation={Fade}
            style={{
              marginBottom: 20,
              borderWidth: .5,
              borderRadius: 10,
              padding: 10,
              borderColor: theme.colors.border
            }}
          >
            <View style={{ width: '100%' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <PlaceholderLine height={20} width={45} style={styles.skeleton} />
                  <PlaceholderLine height={40} width={80} style={styles.skeleton} />
                </View>
                <PlaceholderLine height={20} width={15} style={[styles.skeleton, { marginRight: 10 }]} />
                <PlaceholderLine height={20} width={15} style={styles.skeleton} />
              </View>
            </View>
          </Placeholder>
        ))
      )}
      {!loading && orders.length === 0 && (
        <NotFoundSource
          simple
          content={t('NO_FOUND_MESSAGES_LIST', 'No messages to show at this time.')}
        />
      )}
    </>
  )
}

export const OrderListing = (props: OrdersOptionParams) => {
  const [businessState] = useBusiness()

  const OrderListingProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    orderStatus: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    disabledLeaveOrderSocket: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 10,
      controlType: 'infinity'
    },
    businessId: businessState?.business?.id,
    profileMessages: true,
    orderBy: 'last_direct_message_at',
    orderDirection: 'asc'
  }

  return <OrderList {...OrderListingProps} />
}

export const MessageListing = (props: MessageListingParams) => {
  const { onNavigationRedirect, setRefreshOrders } = props

  const [refreshing] = useState(false)
  const [orderListStatus, setOrderListStatus] = useState({
    error: null,
    loading: false,
    orders: []
  })

  return (
    <MessageContainer
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshOrders(true)}
        />
      }
    >
      <MessageListingWrapper>
        <OrderListing
          franchiseId={props.franchiseId}
          ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
          setOrderList={setOrderListStatus}
          onClickOrder={(id: string) => onNavigationRedirect('MessageView', {
            order: orderListStatus?.orders?.find?.((order: any) => order?.uuid === id),
            orderId: id
          })}
        />
      </MessageListingWrapper>
    </MessageContainer>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: 10,
    borderRadius: 5
  }
})
