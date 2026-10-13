import React from 'react';
import { View } from 'react-native'
import { useTheme } from 'styled-components/native';
import settings from '../config.js'

import { useBusiness } from '@components'

import { BusinessesListing as BusinessListingController, NavBarCustomized, SafeAreaContainer, useBusinessSelected } from '@ui';

const BusinessesListing = (props: any) => {
  const theme = useTheme();
  const [businessState] = useBusiness();
  const [, { onChangeBusinessSelected }] = useBusinessSelected()

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    franchiseId: settings?.franchiseSlug,
    businessId: businessState?.business?.id ?? settings?.businessSlug,
    isGuestUser: props?.route?.params?.isGuestUser ?? null,
    propsToFetch: [
      'id',
      'name',
      'header',
      'logo',
      'location',
      'schedule',
      'open',
      'delivery_price',
      'distance',
      'ribbon',
      'delivery_time',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'address',
      'configs',
      'timezone',
      'today',
      'enabled',
      'disabled_reason',
      'available_drivers_count',
      'activated_orders'
    ],
    paginationSettings: {
      initialPage: 1,
      pageSize: 10,
      controlType: 'infinity'
    },
    onBusinessClick: (business: any) => {
      onChangeBusinessSelected(business)
      props.navigation.navigate('BottomTab');
    },
  };

  return (
    <SafeAreaContainer>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.backgroundPage,
        }}
      >
        <NavBarCustomized
          navigation={props.navigation}
        />
        <BusinessListingController {...BusinessesListingProps} />
      </View>
    </SafeAreaContainer>
  );
};

export default BusinessesListing;
