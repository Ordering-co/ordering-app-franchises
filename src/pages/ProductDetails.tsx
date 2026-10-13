import React, { useState } from 'react';
import { NavBar, ProductForm as ProductFormController } from '@ui';
import { useTheme } from 'styled-components/native';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper';

const ProductDetails = (props: any) => {
  const theme = useTheme()
  const [showTitle, setShowTitle] = useState('')
  const showCategoriesView =
    theme?.business_view?.components?.categories?.components?.show_first_categories.hidden !== undefined &&
    !theme?.business_view?.components?.categories?.components?.show_first_categories.hidden
  const productProps = {
    ...props,
    ...props.route.params,
    productAddedToCartLength: props.route.params?.productAddedToCartLength || 0,
    showCategoriesView,
    onSave: props?.navigation?.canGoBack()
      ? (props?.route?.params?.isRedirect === 'business' && !props?.route?.params?.alreadyInBusinessListing ? () => props?.navigation?.replace('BottomTab', {
        screen: 'Business',
        store: props?.route?.params?.business?.store,
        header: props?.route?.params?.business?.header,
        logo: props?.route?.params?.business?.logo,
      }) : () => props?.navigation?.goBack())
      : () => props?.navigation?.navigate('BottomTab'),
    handleGoBack: props.navigation?.canGoBack()
      ? () => props.navigation.goBack()
      : () => props.navigation.navigate('BottomTab', { screen: 'Business', store: props.businessSlug })
  }

  return (
    <>
      <NavBar
        title={showTitle.length > 30 ? '' : showTitle}
        textStyle={{ fontSize: showTitle?.length > 16 ? theme.utils.tsize.m : theme.utils.tsize.l }}
        onActionLeft={() => productProps.handleGoBack()}
      />
      <SafeAreaViewWrapper disableScrollView>
        <ProductFormController {...productProps} setShowTitle={setShowTitle} />
      </SafeAreaViewWrapper>
    </>
  );
};

export default ProductDetails;
