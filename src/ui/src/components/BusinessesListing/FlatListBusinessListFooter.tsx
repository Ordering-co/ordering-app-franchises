import React from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { ListWrapper, GoogleMapContainer } from './styles'

import { useLanguage, useOrder } from '@components'
import { BusinessController, GoogleMap, OButton, useBusinessSelected, useDeviceOrientation } from '@ui'
import { isValidMapLocation } from '../GoogleMap/getMapRegion'

export const FlatListBusinessListFooter = (props: any) => {
  const {
    navigation,
    businessesList,
    paginationProps,
    viewSelected,
    locations,
    favoriteIds,
    setFavoriteIds,
    handleBusinessClick,
    handleUpdateBusinessList,
    getBusinesses
  } = props

  const [orientationState] = useDeviceOrientation();
  const HEIGHT_SCREEN = orientationState?.dimensions?.height
  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [businessSelected, { onChangeBusinessSelected }] = useBusinessSelected()

  return (
    <>
      {viewSelected === 'map' ? (
        <View
          style={{
            height: HEIGHT_SCREEN - 160,
            overflow: 'hidden',
          }}>
          <GoogleMapContainer>
            {!orderState?.loading && isValidMapLocation(orderState?.options?.address?.location) && (
              <GoogleMap
                manualZoom
                isIntGeoCoder
                readOnly
                unableAnimateLocation
                changeMarkerOnLocationChange
                useNearbyLocations
                location={orderState?.options?.address?.location}
                locations={locations}
                timeMsToFit={5000}
                onPressMarker={(business: any) => onChangeBusinessSelected(business)}
              />
            )}
            {paginationProps.totalPages !== paginationProps.currentPage && businessesList?.businesses?.length > 0 && (
              <View>
                <OButton
                  text={t('FETCH_MORE_BUSINESSES', 'fetch more businesses')}
                  onClick={() => getBusinesses?.()}
                  style={{
                    margin: 20,
                    borderRadius: 10
                  }}
                  isDisabled={businessesList?.loading}
                />
              </View>
            )}
            {businessSelected && (
              <BusinessController
                navigation={navigation}
                business={businessSelected}
                isBusinessOpen={businessSelected.open}
                handleCustomClick={handleBusinessClick}
                handleUpdateBusinessList={handleUpdateBusinessList}
                favoriteIds={favoriteIds}
                setFavoriteIds={setFavoriteIds}
                containerStyle={{
                  position: 'absolute',
                  bottom: 30,
                  zIndex: 20000,
                  marginLeft: 20,
                  width: WIDTH_SCREEN - 40,
                }}
              />
            )}
          </GoogleMapContainer>
        </View>
      ) : (
        <ListWrapper style={{ paddingHorizontal: 20, marginTop: 30 }}>
          {(businessesList.loading || !businessesList?.fetched) && (
            <>
              {[
                ...Array(
                  paginationProps.nextPageItems
                    ? paginationProps.nextPageItems
                    : 8,
                ).keys(),
              ].map((item, i) => (
                <Placeholder
                  Animation={Fade}
                  key={i}
                  style={{ marginBottom: 20 }}>
                  <View style={{ width: '100%' }}>
                    <PlaceholderLine
                      height={30}
                      style={{ marginBottom: 20, borderRadius: 25 }}
                    />
                    <View style={{ paddingHorizontal: 10 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <PlaceholderLine
                          height={25}
                          width={40}
                          style={{ marginBottom: 10 }}
                        />
                        <PlaceholderLine
                          height={25}
                          width={20}
                          style={{ marginBottom: 10 }}
                        />
                      </View>
                      <PlaceholderLine
                        height={20}
                        width={30}
                        style={{ marginBottom: 10 }}
                      />
                      <PlaceholderLine
                        height={20}
                        width={80}
                        style={{ marginBottom: 10 }}
                      />
                    </View>
                  </View>
                </Placeholder>
              ))}
            </>
          )}
        </ListWrapper>
      )}
    </>
  )
}
