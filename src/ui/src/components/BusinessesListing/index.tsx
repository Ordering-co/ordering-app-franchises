import React, { useCallback, useEffect, useRef, useState } from 'react';
import Geolocation from '@react-native-community/geolocation'
import { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native';
import settings from '../../../../config.js'

import { BusinessSimpleList as BusinessesListingController, useOrder } from '@components';

import { BusinessesListingParams } from '../../types';
import { FlatListBusinessListing } from './FlatListBusinessListing'
import { useBusinessSelected } from '@ui'

const PIXELS_TO_SCROLL = 1000;

const BusinessesListingUI = (props: BusinessesListingParams) => {
  const {
    navigation,
    businessesList,
    getBusinesses,
    paginationProps,
    citiesState,
    logosLayout
  } = props

  const theme = useTheme()
  const [orderState, { changeCityFilter }] = useOrder()

  const [featuredBusiness, setFeaturedBusinesses] = useState(Array);
  const [isFarAway, setIsFarAway] = useState(false)
  const [orderTypeValue, setOrderTypeValue] = useState(orderState?.options?.value)
  const timerId = useRef<any>(false)
  const [favoriteIds, setFavoriteIds] = useState<any>([])

  const locations = businessesList?.businesses?.map((business: any) => ({
    id: business?.id,
    title: business?.name,
    location: business?.location,
    lat: business?.location?.lat,
    lng: business?.location?.lng,
    icon: theme?.images?.logos?.logotype,
    ...business
  }))

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y;
    const height = nativeEvent.contentSize.height;
    const hasMore = !(
      paginationProps?.totalPages === paginationProps?.currentPage
    );

    if (y + PIXELS_TO_SCROLL > height && businessesList && !businessesList.loading && hasMore && businessesList?.businesses?.length > 0) {
      getBusinesses && getBusinesses()
    }
  };

  const convertToRadian = (value: number) => {
    return value * Math.PI / 180
  }

  const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371 // km
    const dLat = convertToRadian(lat2 - lat1)
    const dLon = convertToRadian(lon2 - lon1)
    const curLat1 = convertToRadian(lat1)
    const curLat2 = convertToRadian(lat2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const resetInactivityTimeout = () => {
    if (!logosLayout) {
      clearTimeout(timerId.current)
      timerId.current = setInterval(() => {
        getBusinesses && getBusinesses(true)
      }, 120000)
    }
  }

  useEffect(() => {
    if (businessesList && !businessesList?.loading) {
      const fb = businessesList.businesses.filter((b) => b?.featured && b?.open);
      const ary = [];
      while (fb.length > 0) {
        ary.push(fb.splice(0, 2));
      }
      setFeaturedBusinesses(ary);
    }
    resetInactivityTimeout()
  }, [businessesList?.loading, businessesList?.businesses])

  const handleOnRefresh = () => {
    if (!businessesList?.loading) {
      getBusinesses && getBusinesses(true)
    }
  }

  const checkUserLocation = async () => {
    Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
      if (distance > 20) setIsFarAway(true)
      else setIsFarAway(false)
    }, (err) => {
      console.log(`ERROR(${err.code}): ${err.message}`)
    }, {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
    })
  }

  useEffect(() => {
    if (!logosLayout) {
      checkUserLocation()
    }
  }, [orderState?.options?.address?.location])

  useEffect(() => {
    if (!orderState?.loading) {
      setOrderTypeValue(orderState?.options?.type)
    }
  }, [orderState?.options?.type])

  useFocusEffect(
    useCallback(() => {
      resetInactivityTimeout()
      return () => clearTimeout(timerId.current)
    }, [navigation])
  )

  useEffect(() => {
    if (!businessesList?.businesses?.length || businessesList?.loading) return
    const ids = [...favoriteIds]
    businessesList.businesses.forEach((business: any) => {
      if (business?.favorite) {
        ids.push(business?.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length, businessesList?.loading])

  useEffect(() => {
    if (!citiesState?.cities?.length || !orderState?.options?.city_id) return
    const selectedCity = citiesState?.cities?.find((city: any) => city?.id === orderState?.options?.city_id)
    if (!selectedCity || !selectedCity?.enabled) changeCityFilter(null)
  }, [citiesState, orderState?.options?.city_id])

  return (
    <FlatListBusinessListing
      {...props}
      locations={locations}
      navigation={navigation}
      businessesList={businessesList}
      favoriteIds={favoriteIds}
      handleScroll={handleScroll}
      setFavoriteIds={setFavoriteIds}
      handleOnRefresh={handleOnRefresh}
    />
  );
};

export const BusinessesListing = (props: BusinessesListingParams) => {
  const [businessSelected, { onChangeBusinessSelected }] = useBusinessSelected()

  const businessesProps = {
    ...props,
    UIComponent: BusinessesListingUI,
    franchiseId: settings?.franchiseSlug,
    actualSlug: businessSelected?.slug,
    handleBusinessClick: async (business: any) => {
      await onChangeBusinessSelected(business)
      props.navigation.navigate('BottomTab', { screen: 'Business', store: business?.slug })
    }
  }

  return <BusinessesListingController {...businessesProps} />
}
