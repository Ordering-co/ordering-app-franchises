import React from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { ListWrapper } from './styles'
import { PreviousBusinessOrderedParams } from '../../../types';
import { BusinessController } from '../../BusinessController'

import { useOrder } from '@components'

const BusinessControllerList = ({ businesses, onBusinessClick, navigation, orderState, handleCustomUpdate, style }: any) => {
  return (
    <>
      {businesses?.result?.map((business: any, i: number) => (
        <View style={style} key={`${business.id}_` + i}>
          <BusinessController
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={() => onBusinessClick(business)}
            orderType={orderState?.options?.type}
            navigation={navigation}
            businessHeader={business?.header}
            businessFeatured={business?.featured}
            businessLogo={business?.logo}
            businessReviews={business?.reviews}
            businessDeliveryPrice={business?.delivery_price}
            businessDeliveryTime={business?.delivery_time}
            businessPickupTime={business?.pickup_time}
            businessDistance={business?.distance}
            handleCustomUpdate={handleCustomUpdate}
          />
        </View>
      ))}
    </>
  )
}

export const PreviousBusinessOrdered = (props: PreviousBusinessOrderedParams) => {
  const {
    navigation,
    businesses,
    onNavigationRedirect,
    isBusinessesSearchList,
    handleUpdateBusinesses,
  } = props

  const [orderState] = useOrder()
  const windowWidth = Dimensions.get('window').width

  const onBusinessClick = (business: any) => {
    onNavigationRedirect('Business', {
      store: business.slug,
      logo: business.logo,
      header: business.header
    })
  }

  return (
    <ScrollView
      horizontal={isBusinessesSearchList}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <ListWrapper enableBG={isBusinessesSearchList}>
        <BusinessControllerList
          orderState={orderState}
          navigation={navigation}
          businesses={businesses}
          {...(isBusinessesSearchList ? {
            style: { width: windowWidth - 120, marginRight: 20 }
          } : {})}
          onBusinessClick={onBusinessClick}
          handleCustomUpdate={handleUpdateBusinesses}
        />
      </ListWrapper>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  }
})
