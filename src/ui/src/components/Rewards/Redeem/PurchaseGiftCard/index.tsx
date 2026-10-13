import React from 'react'
import { ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native';

import { Container } from './styles'
import { GiftCard } from './Item'
import { useLanguage, PurchaseGiftCard as PurchaseGiftCardController } from '@components'
import { OText, FloatingButton, NotFoundSource } from '@ui';

const PurchaseGiftCardUI = (props: any) => {
  const {
    goToBack,
    productsListState,
    selectedProduct,
    setSelectedProduct,
    handleAccept
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  return (
    <>
      <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
          {productsListState.loading && (
            [...Array(4).keys()].map(i => (
              <GiftCard key={i} isSkeleton />
            ))
          )}
          {!productsListState.loading && !!productsListState.products?.length && (
            <>
              <OText color={theme.colors.textNormal} size={theme.utils.tsize.m} mBottom={20}>
                {t('SELECT_ONE_OPTION', 'Select one option')}
              </OText>
              {productsListState.products.map((product: any) => (
                <GiftCard
                  key={product.id}
                  product={product}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
              ))}
            </>
          )}
          {!productsListState.loading && !productsListState.products?.length && (
            <NotFoundSource
              simple
              content={t('NO_GIFT_CARDS', 'No Gift Cards to show')}
            />
          )}
        </ScrollView>
      </Container>
      <FloatingButton
        text={t('ACCEPT', 'Accept')}
        disabled={!selectedProduct}
        handleClick={() => handleAccept()}
      />
    </>
  )
}

export const PurchaseGiftCard = (props: any) => {
  const purchaseGiftCardProps = {
    ...props,
    UIComponent: PurchaseGiftCardUI
  }
  return <PurchaseGiftCardController {...purchaseGiftCardProps} />
}
