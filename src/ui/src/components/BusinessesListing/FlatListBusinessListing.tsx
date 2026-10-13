import React, { useState } from 'react'
import { Dimensions, FlatList, RefreshControl, View } from 'react-native'

import { GoogleMapContainer, WrapperList } from './styles'
import { useOrder } from '@components'
import { BusinessController, GoogleMap, useDeviceOrientation } from '@ui'
import { isValidMapLocation } from '../GoogleMap/getMapRegion'

export const FlatListBusinessListing = (props: any) => {
  const {
    handleScroll,
    businessesList,
    handleBusinessClick,
    navigation,
    handleUpdateBusinessList,
    favoriteIds,
    setFavoriteIds,
    handleOnRefresh,
    locations
  } = props

  const [{ options }] = useOrder()
  const [refreshing] = useState(false)
  const [orientationState] = useDeviceOrientation()

  const HEIGHT_SCREEN = orientationState?.dimensions?.height ?? Dimensions.get('window').height

  const RenderItem = ({ item: business }: any) => {
    return (
      <BusinessController
        navigation={navigation}
        business={business}
        isBusinessOpen={business.open}
        handleCustomClick={handleBusinessClick}
        handleUpdateBusinessList={handleUpdateBusinessList}
        favoriteIds={favoriteIds}
        setFavoriteIds={setFavoriteIds}
      />
    )
  }

  return (
    <>
      {isValidMapLocation(options?.address?.location) && (
        <View
          style={{ height: HEIGHT_SCREEN * 0.25, marginBottom: 20 }}
        >
          <GoogleMapContainer>
            <GoogleMap
              manualZoom
              isIntGeoCoder
              readOnly
              unableAnimateLocation
              changeMarkerOnLocationChange
              useNearbyLocations
              location={options?.address?.location}
              locations={locations}
              timeMsToFit={5000}
            />
          </GoogleMapContainer>
        </View>
      )}
      <WrapperList>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={businessesList.businesses}
          keyExtractor={(business: any) => business?.id}
          renderItem={({ item }: any) => (
            <RenderItem item={item} />
          )}
          onScroll={(e: any) => handleScroll(e)}
        />
      </WrapperList>
    </>
  )
}

