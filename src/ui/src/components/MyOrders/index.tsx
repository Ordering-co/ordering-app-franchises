import React, { useState } from 'react'
import { useTheme } from 'styled-components/native';
import { RefreshControl } from 'react-native';

import { GiftCardOrdersList } from '../GiftCard/GiftCardOrdersList'
import { Container, OTabs, OTab } from './styles'

import { useConfig, useLanguage } from '@components';
import { OText, OrdersOption } from '@ui'

export const MyOrders = (props: any) => {
  const {
    hideOrders,
    businessesSearchList
  } = props

  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const theme = useTheme()
  const [refreshing] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false)
  const [businessOrderIds, setBusinessOrderIds] = useState([])
  const [ordersLength, setOrdersLength] = useState({
    activeOrdersLength: null,
    previousOrdersLength: 0,
    preordersLength: 0
  });
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')

  const hideProductsTab = theme?.orders?.components?.products_tab?.hidden
  const hideBusinessTab = theme?.orders?.components?.business_tab?.hidden

  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const MyOrdersMenu = [
    { key: 'orders', value: t('ORDERS', 'Orders'), disabled: false },
    { key: 'business', value: t('BUSINESSES', 'Businesses'), disabled: hideBusinessTab },
    { key: 'products', value: t('PRODUCTS', 'Products'), disabled: hideProductsTab },
    { key: 'giftCards', value: t('GIFT_CARD', 'Gift card'), disabled: isGiftCardDisabled }
  ]

  const handleOnRefresh = () => {
    setRefreshOrders(true)
  }

  return (
    <>
      <Container
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleOnRefresh()}
          />
        }
      >
        <OTabs
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {MyOrdersMenu.filter(option => (!hideOrders || option.key !== 'orders') && !option.disabled).map(option => (
            <OTab
              key={option.key}
              selected={selectedOption === option.key}
              onPress={() => setSelectedOption(option.key)}
            >
              <OText
                color={selectedOption === option.key ? theme.colors.white : theme.colors.secondaryLightGray}
                weight={selectedOption === option.key ? 'bold' : 'normal'}
              >
                {option?.value}
              </OText>
            </OTab>
          ))}
        </OTabs>
        {selectedOption === 'orders' && (
          <>
            <OrdersOption
              {...props}
              preOrders
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
            <OrdersOption
              {...props}
              activeOrders
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
            <OrdersOption
              {...props}
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
          </>
        )}
        {selectedOption === 'business' && (
          <OrdersOption
            {...props}
            isBusiness
            titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
            hideOrders
            horizontal
            activeOrders
            pastOrders
            preOrders
            businessesSearchList={businessesSearchList}
            businessOrderIds={businessOrderIds}
            setBusinessOrderIds={setBusinessOrderIds}
            ordersLength={ordersLength}
            setOrdersLength={setOrdersLength}
          />
        )}
        {selectedOption === 'products' && (
          <OrdersOption
            {...props}
            isProducts
            titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
            hideOrders
            horizontal
            activeOrders
            pastOrders
            preOrders
            businessesSearchList={businessesSearchList}
            businessOrderIds={businessOrderIds}
            setBusinessOrderIds={setBusinessOrderIds}
            ordersLength={ordersLength}
            setOrdersLength={setOrdersLength}
          />
        )}
        {selectedOption === 'giftCards' && (
          <GiftCardOrdersList onNavigationRedirect={props?.onNavigationRedirect} />
        )}
      </Container>
    </>
  )
}
