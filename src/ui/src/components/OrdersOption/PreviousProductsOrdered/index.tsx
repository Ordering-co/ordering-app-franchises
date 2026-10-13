import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ListWrapper } from './styles'

import { PreviousProductsOrderedParams } from '../../../types'
import { SingleProductCard } from '../../SingleProductCard'

export const PreviousProductsOrdered = (props: PreviousProductsOrderedParams) => {
  const {
    products,
    onProductClick,
    handleUpdateProducts,
    isBusinessesSearchList
  } = props

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });

  const ProductList = () => {
    return (
      <>
        {products?.filter((product: any) => product?.business?.available)?.map((product: any) => (
          <SingleProductCard
            key={product?.id}
            isProductId
            isSoldOut={(product.inventoried && !product.quantity)}
            product={product}
            businessId={product?.business?.id}
            onProductClick={onProductClick}
            productAddedToCartLength={0}
            handleUpdateProducts={handleUpdateProducts}
          />
        ))}
      </>
    )
  }
  return (
    <ScrollView horizontal={isBusinessesSearchList} style={styles.container} showsVerticalScrollIndicator={false}>
      {isBusinessesSearchList ? (
        <ProductList />
      ) : (
        <ListWrapper isBusinessesSearchList={isBusinessesSearchList}>
          <ProductList />
        </ListWrapper>
      )}
    </ScrollView>
  )
}
