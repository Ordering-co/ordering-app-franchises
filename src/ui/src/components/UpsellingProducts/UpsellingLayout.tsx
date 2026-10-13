import React from 'react'
import { ScrollView } from 'react-native'

import { UpsellingContainer } from './styles'
// import { SingleProductCard } from '@ui';
import { ProductCard } from './ProductCard'

import { AnimatedItem } from '@ui'

export const UpsellingLayout = (props: any) => {
  const {
    productsList,
    business,
    onNavigationRedirect
  } = props

  const handleFormProduct = (product: any) => {
    onNavigationRedirect && onNavigationRedirect('ProductDetails', {
      product: product,
      businessId: product?.api?.businessId,
      businessSlug: business.slug,
    })
  }

  return (
    <UpsellingContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {productsList.map((product: any, index: number) => (
          <React.Fragment key={'prod_' + product.id + `_${index}`}>
            <AnimatedItem
              index={index}
              item={
                <ProductCard
                  isSoldOut={product.inventoried && !product.quantity}
                  product={product}
                  onProductClick={() => handleFormProduct(product)}
                />}
            />
          </React.Fragment>
        ))}
      </ScrollView>
    </UpsellingContainer>
  )
}
