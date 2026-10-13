import React, { useEffect } from 'react';
import { useTheme } from 'styled-components/native';

import { SingleGiftCard } from '../SingleGiftCard';
import { ProductsListContainer, WrappButton } from './styles'

import { useLanguage, GiftCardOrdersList as GiftCardOrdersListController } from '@components';
import { OButton, OText } from '../../shared';

const VerticalGiftCardOrdersLayoutUI = (props: any) => {
  const {
    giftCards,
    paginationProps,
    loadMoreOrders,
    title,
    setIsEmpty,
    onNavigationRedirect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()

  useEffect(() => {
    if (giftCards.loading) return
    if (giftCards.list?.length === 0) setIsEmpty(true)
  }, [giftCards])

  return (
    <ProductsListContainer>
      {giftCards.list?.length > 0 && (
        <OText
          size={16}
          lineHeight={24}
          weight={'700'}
          color={theme.colors.textNormal}
          mBottom={24}
        >
          {title}
        </OText>
      )}
      {giftCards.list.map((card: any) => (
        <SingleGiftCard
          key={card.id}
          card={card}
          onNavigationRedirect={onNavigationRedirect}
        />
      ))}
      {giftCards.loading && props.allowLoading && (
        [...Array(7).keys()].map(i => (
          <SingleGiftCard key={i} isSkeleton />
        ))
      )}
      {paginationProps.totalPages && paginationProps.currentPage < paginationProps.totalPages && (
        <WrappButton>
          <OButton
            onClick={loadMoreOrders}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            imgRightSrc={null}
            style={{ borderRadius: 7.6, shadowOpacity: 0 }}
          />
        </WrappButton>
      )}
    </ProductsListContainer>
  )
}

export const VerticalGiftCardOrdersLayout = (props: any) => {
  const giftCardsProps = {
    ...props,
    UIComponent: VerticalGiftCardOrdersLayoutUI
  }
  return <GiftCardOrdersListController {...giftCardsProps} />
}
