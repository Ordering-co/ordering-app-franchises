import React from 'react';
import { View } from 'react-native'
import { StackActions } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';

import { NavBar, BusinessProductsList as ProductsController, useBusinessSelected } from '@ui';
import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

const BusinessProductsList = (props: any) => {
  const theme = useTheme()
  const [businessSelected] = useBusinessSelected()

  const businessId = businessSelected?.id
  const categorySelected = props.route.params?.categorySelected

  const businessProductsProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    useCategorySelectedForProducts: true,
    businessId,
    categorySelected,
    slug: businessSelected.slug,
    businessNearestState: props.route.params?.businessNearestState,
    businessState: props.route.params?.businessState,
    fromMulti: props.route.params?.fromMulti,
    onProductClick: ({ category, product, productAddedToCartLength }: any) => {
      props.navigation.navigate('ProductDetails', {
        businessId: businessSelected?.id,
        categoryId: category?.id,
        productId: product?.id,
        product: product,
        business: {
          store: businessSelected.slug,
          header: businessSelected.header,
          logo: businessSelected.logo,
        },
        productAddedToCartLength
      })
    },
    onNavigationRedirect: (route: string, params: any, replace: boolean) => {
      if (replace) {
        props.navigation.dispatch(StackActions.replace(route, params))
        return
      }
      props.navigation.navigate(route, params)
    }
  };

  return (
    <SafeAreaViewWrapper>
      <NavBar
        title={categorySelected?.name}
        onActionLeft={() => props.navigation?.canGoBack() && props.navigation.goBack()}
      />
      <ProductsController {...businessProductsProps} />
    </SafeAreaViewWrapper>
  );
};

export default BusinessProductsList;
