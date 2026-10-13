import React, { useEffect } from 'react'
import { useTheme } from 'styled-components/native'

import { LastOrdersParams } from '../../types'
import { OrderContainer } from './styles'
import { Skeletons } from '../Skeletons'

import { OrderList as OrderListController, useLanguage, useSession } from '@components'
import { NotFoundSource, OText, SingleOrderCard, useHomeValues } from '@ui'

const LastOrdersUI = (props: LastOrdersParams) => {
  const {
    orderList,
    setOrderList,
    loadOrders,
    refresh,
    setRefresh,
    onRedirect
  } = props

  const { loading, orders } = orderList

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [, { onChangeOrder }] = useHomeValues()
  const { OrderSkeleton } = Skeletons()

  const handleClickViewOrder = (uuid: string) => {
    onRedirect && onRedirect('OrderDetails', { orderId: uuid, fromHome: props.fromHome })
  }

  useEffect(() => {
    if (refresh || auth) {
      loadOrders && loadOrders(false, false, false, true)
      setRefresh && setRefresh(false)
    }
  }, [refresh, auth])

  useEffect(() => {
    if (!auth) {
      setOrderList({ loading: false, error: null, orders: [] })
    }
  }, [auth])

  useEffect(() => {
    if (orders?.[0]?.id) {
      onChangeOrder(orders[0])
    }
  }, [JSON.stringify(orders[0])])

  return (
    <OrderContainer>
      <OText size={theme.utils.tsize.l} weight={'bold'} style={{ marginBottom: 10 }}>
        {t('YOUR_LAST_ORDER', 'Your last order')}
      </OText>
      {!loading && orders.length > 0 && (
        <SingleOrderCard
          order={orders[0]}
          fromHome={props.fromHome}
          handleClickOrder={handleClickViewOrder}
          onNavigationRedirect={onRedirect}
        />
      )}

      {loading && (
        <OrderSkeleton />
      )}

      {!loading && orders.length === 0 && (
        <NotFoundSource
          simple
          content={t('NO_PREVIOUS_ORDERS', 'You have no previous orders')}
        />
      )}
    </OrderContainer>
  )
}

export const LastOrders = (props: any) => {
  const helpProps = {
    ...props,
    UIComponent: LastOrdersUI,
    useDefualtSessionManager: true,
    disabledLeaveOrderSocket: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 1,
      controlType: 'infinity'
    },
    noGiftCardOrders: true
  }
  return <OrderListController {...helpProps} />
}
