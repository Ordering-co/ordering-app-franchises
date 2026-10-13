import React from 'react'

import { UpsellingProductsParams } from '../../types'
import { UpsellingContent } from './UpsellingContent';

import { UpsellingPage as UpsellingPageController, useOrder } from '@components'

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const { upsellingProducts } = props

  const [{ carts }] = useOrder()

  const currentCart = carts?.[`businessId:${props.businessId}`] ?? {}
  const cartProducts = currentCart?.products?.length
    ? currentCart?.products.map((product: any) => product.id)
    : []

  const productsList = !upsellingProducts.loading && !upsellingProducts.error
    ? upsellingProducts?.products?.length
      ? upsellingProducts?.products.filter((product: any) => !cartProducts.includes(product.id))
      : (props?.products ?? []).filter((product: any) => !cartProducts.includes(product.id)) ?? []
    : []

  return (
    <UpsellingContent
      {...props}
      currentCart={currentCart}
      productsList={productsList}
    />
  )
}

export const UpsellingProducts = (props: UpsellingProductsParams) => {
  const [{ carts }] = useOrder()

  const currentCart = carts?.[`businessId:${props.businessId}`] ?? {}
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI,
    cartProducts: props.cartProducts ?? currentCart?.products?.length
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
