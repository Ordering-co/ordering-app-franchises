import React, { useEffect, useState, useRef } from 'react';
import { StackActions, useIsFocused } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import settings from '../config';
import { useApi, useOrder } from '@components';
import { BusinessProductsListing as BusinessProductsListController, NavBar, useBusinessSelected, useNearestBusiness } from '@ui';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

const BusinessProductsList = (props: any) => {
  const defaultSlug = props.route.params?.store ?? props.route.params?.productLogin?.store_slug ?? settings?.businessSlug
  const product = props.route.params?.productId
    ? {
      categoryId: props.route?.params?.categoryId,
      businessId: parseInt(props.route?.params?.store),
      id: props.route?.params?.productId
    }
    : props.route.params?.productLogin;

  const theme = useTheme()
  const [ordering] = useApi()
  const [orderState] = useOrder()
  const [businessSelected, { onChangeBusinessSelected }] = useBusinessSelected()
  const { getNearestBusiness, resolveBusinessForLocation, confirmBusinessChange } = useNearestBusiness()
  const isFocused = useIsFocused()

  const prevLocationRef = useRef(JSON.stringify(orderState?.options?.address?.location))
  const prevBusinessRef = useRef(businessSelected)
  const pendingLocationCheckRef = useRef(false)

  const [store, setStore] = useState('')
  const [nearestBusinessState, setNearestBusiness] = useState({ loading: false })

  const showCategoriesView =
    theme?.business_view?.components?.categories?.components?.show_first_categories.hidden !== undefined &&
    !theme?.business_view?.components?.categories?.components?.show_first_categories.hidden

  const handleFetchBusinesses = async () => {
    setNearestBusiness({ loading: true })
    const response: any = await getNearestBusiness()

    if (!response?.error) {
      await onChangeBusinessSelected(response?.business)
      setStore(response?.business?.slug)
    }
    setNearestBusiness({ loading: false })
  }

  const handleLocationChanged = async (selected: any) => {
    setNearestBusiness({ loading: true })
    const resolution = await resolveBusinessForLocation(selected)
    setNearestBusiness({ loading: false })

    if (resolution?.error || !resolution?.business?.slug || !resolution.changed) return

    const accepted = await confirmBusinessChange({ from: selected, to: resolution.business })
    if (!accepted) return

    await onChangeBusinessSelected(resolution.business)
    setStore(resolution.business.slug)
  }

  useEffect(() => {
    const currentLocation = JSON.stringify(orderState?.options?.address?.location)
    if (businessSelected) {
      setStore(businessSelected?.slug ?? defaultSlug)
    }

    if (prevLocationRef.current !== currentLocation) {
      pendingLocationCheckRef.current = true
    }
    if (prevBusinessRef.current !== businessSelected && businessSelected) {
      pendingLocationCheckRef.current = false
    }
    prevLocationRef.current = currentLocation
    prevBusinessRef.current = businessSelected

    if (!businessSelected) {
      pendingLocationCheckRef.current = false
      handleFetchBusinesses()
      return
    }

    // validate only while focused so the confirm alert is not shown under AddressList
    if (pendingLocationCheckRef.current && isFocused) {
      pendingLocationCheckRef.current = false
      handleLocationChanged(businessSelected)
    }
  }, [businessSelected, JSON.stringify(orderState?.options?.address?.location), isFocused])

  const businessProductsProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    businessSingleId: settings?.businessSlug,
    franchiseId: settings?.franchiseSlug,
    logo: props.route.params?.logo,
    header: props.route.params?.header,
    product,
    fromMulti: props.route.params?.fromMulti,
    businessProps: [
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'ribbon',
      'description',
      'address',
      'address_notes',
      'location',
      'timezone',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'products',
      'zones',
      'professionals',
      'facebook_profile',
      'instagram_profile',
      'tiktok_profile',
      'pinterest_profile',
      'whatsapp_number',
      'snapchat_profile',
      'city',
      'city_id',
      'previously_products',
      'available_products_count',
      'today',
      'lazy_load_products_recommended',
      'minimum',
      'valid_service'
    ],
    showCategoriesView,
    onNavigationRedirect: (route: string, params?: any, replace?: boolean) => {
      if (replace) {
        props.navigation.dispatch(StackActions.replace(route, params))
        return
      }
      props.navigation.navigate(route, params)
    },
    onBusinessClick: () => {
      props.navigation.navigate('BottomTab', { screen: 'Business' });
    }
  }

  return (
    <>
      <NavBar />
      <SafeAreaViewWrapper disableScrollView>
        <BusinessProductsListController
          {...businessProductsProps}
          slug={defaultSlug ?? store}
          isExternalLoading={nearestBusinessState?.loading && !store}
        />
      </SafeAreaViewWrapper>
    </>
  )
}

export default BusinessProductsList;
