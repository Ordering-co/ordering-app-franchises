import React from 'react'
import { ScrollView, Dimensions } from 'react-native'
import moment from 'moment';
import { useTheme } from 'styled-components/native'
import { OrderItAgainParams } from '../../types'
import { Container, ProductWrapper } from './styles'

import { useLanguage } from '@components'
import { SingleProductCard, OText } from '@ui'

export const OrderItAgain = (props: OrderItAgainParams) => {
  const {
    onProductClick,
    productList,
    businessId,
    categoryState,
    currentCart,
    handleUpdateProducts,
    navigation,
    searchValue,
    showCategoriesView,
    businessSingleId
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const { width } = Dimensions.get('window');
  const productsFilterd = productList?.length > 0 && productList.filter((product: any) => !searchValue || product?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()))?.sort((a: any, b: any) => moment(b?.last_ordered_date).valueOf() - moment(a?.last_ordered_date).valueOf())
  return (
    productsFilterd?.length > 0 ? (
      <Container>
        <OText
          size={16}
          lineHeight={24}
          color={theme.colors.textNormal}
          style={{
            fontWeight: '600',
            marginBottom: 6
          }}
        >
          {t('ORDER_IT_AGAIN', 'Order it again')}
        </OText>
        <OText
          size={12}
          lineHeight={18}
          color={theme.colors.disabled}
        >
          {t('ORDER_IT_AGAIN_DESC', 'Quickly add items from your past orders.')}
        </OText>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {productsFilterd.map((product: any, i: number) => (
            <ProductWrapper
              key={'prod_' + product.id + `_${i}`}
              {...(!showCategoriesView && { style: { width: width - 120 } })}
            >
              <SingleProductCard
                isSoldOut={product.inventoried && !product.quantity}
                product={product}
                businessId={businessId}
                categoryState={categoryState}
                showCategoriesView={showCategoriesView}
                onProductClick={() => onProductClick(product)}
                productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                handleUpdateProducts={handleUpdateProducts}
                navigation={navigation}
                isPreviously
                businessSingleId={businessSingleId}
              />
            </ProductWrapper>
          ))}
        </ScrollView>
      </Container>
    ) : null
  )
}
