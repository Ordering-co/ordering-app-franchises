import React, { useState } from 'react'
import { useTheme } from 'styled-components/native'

import { TabContainer, Tab, Container } from './styles'
import { useLanguage, useOrder } from '@components'

import { FavoriteList, OText } from '@ui'

export const Favorite = (props: any) => {
  const {
    navigation,
    franchiseId
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [orderState] = useOrder()
  const [tabSelected, setTabSelected] = useState('businesses')

  const tabList = [
    { key: 'businesses', name: t('BUSINESSES', 'Businesses') },
    { key: 'products', name: t('PRODUCTS', 'Products') },
    { key: 'orders', name: t('MY_ORDERS', 'My Orders') }
  ]

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  return (
    <>
      <Container showsVerticalScrollIndicator={false}>
        <TabContainer>
          {tabList.map((menu, i) => (
            <Tab
              key={i}
              selected={menu.key === tabSelected}
              onPress={() => setTabSelected(menu.key)}
            >
              <OText
                color={menu.key === tabSelected ? theme.colors.white : theme.colors.secondaryLightGray}
                weight={menu.key === tabSelected ? 'bold' : 'normal'}
              >
                {menu.name}
              </OText>
            </Tab>
          ))}
        </TabContainer>
        {tabSelected === 'businesses' && (
          <FavoriteList
            isBusiness
            navigation={navigation}
            onNavigationRedirect={onRedirect}
            favoriteURL='favorite_businesses'
            originalURL='business'
            location={`${orderState.options?.address?.location?.lat},${orderState.options?.address?.location?.lng}`}
            propsToFetch={['id', 'name', 'header', 'logo', 'location', 'address', 'ribbon', 'timezone', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug', 'today', 'enabled', 'disabled_reason', 'available_drivers_count', 'activated_orders']}
            franchiseId={franchiseId}
          />
        )}
        {tabSelected === 'products' && (
          <FavoriteList
            favoriteURL='favorite_products'
            originalURL='products'
            onNavigationRedirect={onRedirect}
            isProduct
            franchiseId={franchiseId}
          />
        )}
        {tabSelected === 'orders' && (
          <FavoriteList
            onNavigationRedirect={onRedirect}
            favoriteURL='favorite_orders'
            originalURL='orders'
            isOrder
            franchiseId={franchiseId}
          />
        )}
      </Container>
    </>
  )
}
