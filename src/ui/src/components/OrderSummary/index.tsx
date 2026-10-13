import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { OSContainer, OSProductList } from './styles'
import { OButton } from '../shared'
import { Bill } from './Bill'

import { Cart, useOrder, useLanguage, useUtils } from '@components'
import { MomentOption, SingleProductCart } from '@ui'

const OrderSummaryUI = (props: any) => {
  const {
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    isCartPending,
    isFromCheckout,
    commentState,
    handleChangeComment,
    onNavigationRedirect,
    handleRemoveOfferClick,
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMaximumDays,
    preorderMinimumDays,
    cateringTypes,
    hideDeliveryFee,
    loyaltyRewardRate,
    maxDate,
    hideProducts,
    hideCommentsByValidationCheckout,
    hideCouponByValidationCheckout,
    isGiftCardCart,
    hideDetails,
    hideAddProductsButton
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const hideCartDiscount = hideCouponByValidationCheckout
  const hideCartComments = hideCommentsByValidationCheckout
  const cart = orderState?.carts?.[`businessId:${props.cart.business_id}`]

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect('ProductDetails', {
      isCartProduct: true,
      productCart: product,
      businessSlug: cart?.business?.slug,
      businessId: cart?.business_id,
      categoryId: product?.category_id,
      productId: product?.id
    })
  }

  return (
    <OSContainer>
      {cart?.products?.length > 0 && (
        <>
          {!hideProducts && cart?.products?.map((product: any, idx: number) => (
            <OSProductList key={product.code + idx}>
              <SingleProductCart
                product={product}
                isCartPending={isCartPending}
                isCartProduct
                changeQuantity={changeQuantity}
                getProductMax={getProductMax}
                offsetDisabled={offsetDisabled}
                onDeleteProduct={handleDeleteClick}
                onEditProduct={handleEditProduct}
                isFromCheckout={isFromCheckout}
                isDisabledEdit={!cart?.business_id}
              />
            </OSProductList>
          ))}
          {!isGiftCardCart && !hideAddProductsButton && (
            <OButton
              text={t('ADD_MORE_PRODUCTS', 'ADD MORE PRODUCTS')}
              onClick={() => onNavigationRedirect('BottomTab', { screen: 'Business' })}
              bgColor={theme?.colors?.white}
              textStyle={{
                color: theme?.colors?.primary
              }}
            />
          )}
          {cart?.valid && !hideDetails && (
            <Bill
              businessId={props.cart.business_id}
              handleRemoveOfferClick={handleRemoveOfferClick}
              hideDeliveryFee={hideDeliveryFee}
              hideCartDiscount={hideCartDiscount}
              isCartPending={isCartPending}
              loyaltyRewardRate={loyaltyRewardRate}
              hideCartComments={hideCartComments}
              handleChangeComment={handleChangeComment}
              commentState={commentState}
              onNavigationRedirect={onNavigationRedirect}
            />
          )}
          {cateringTypes.includes(orderState?.options?.type) && maxDate && cart?.business && (
            <View>
              <MomentOption
                maxDate={maxDate}
                cateringPreorder
                isCart
                preorderSlotInterval={preorderSlotInterval}
                preorderLeadTime={preorderLeadTime}
                preorderTimeRange={preorderTimeRange}
                preorderMaximumDays={preorderMaximumDays}
                preorderMinimumDays={preorderMinimumDays}
                business={cart?.business}
              />
            </View>
          )}
        </>
      )}
    </OSContainer>
  )
}

export const OrderSummary = (props: any) => {
  const orderSummaryProps = {
    ...props,
    UIComponent: OrderSummaryUI
  }

  return (
    <Cart {...orderSummaryProps} />
  )
}
