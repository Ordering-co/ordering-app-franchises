import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

import { CardContainer, InnerContainer } from './styles'

import { useLanguage, useUtils } from '@components';
import { OText } from '@ui'

export const SingleGiftCard = (props: any) => {
  const {
    card,
    isSkeleton,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

  const styles = StyleSheet.create({
    logo: {
      borderRadius: theme.utils.radius.m,
      width: 75,
      height: 75
    }
  });

  const getGiftCardStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return t('PENDING', 'Pending')
      case 'activated':
        return t('REDEEMED', 'Redeemed')
      default:
        return status
    }
  }

  const handleClickGiftCardOrder = (card: any) => {
    onNavigationRedirect?.('OrderDetails', { orderId: card.order_product?.order_id });
  }

  return (
    <CardContainer
      activeOpacity={0.8}
      onPress={() => handleClickGiftCardOrder(card)}
    >
      {isSkeleton ? (
        <Placeholder style={{ marginBottom: 0 }} Animation={Fade}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 75, marginRight: 14 }}>
              <PlaceholderLine
                width={100}
                height={64}
                style={{ marginRight: 10, marginBottom: 0 }}
              />
            </View>
            <Placeholder style={{ paddingTop: 5, flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <PlaceholderLine width={55} style={{ marginBottom: 6 }} />
                <PlaceholderLine width={20} style={{ marginBottom: 6 }} />
              </View>
              <PlaceholderLine width={50} style={{ marginBottom: 6 }} />
              <PlaceholderLine width={20} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
        </Placeholder>
      ) : (
        <InnerContainer>
          <FastImage
            style={styles.logo}
            source={card?.order_product?.images ? {
              uri: optimizeImage(card?.order_product?.images, 'h_86,c_limit')
            } : theme?.images?.dummies?.businessLogo}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ width: '70%' }}>
                <OText size={theme.utils.tsize.m} lineHeight={25} numberOfLines={1}>{card?.order_product?.name}</OText>
              </View>
              <OText lineHeight={25}>{parsePrice(card?.order_product?.price)}</OText>
            </View>
            <OText color={theme.colors.secondaryLightGray} lineHeight={25}>{parseDate(card?.created_at)}</OText>
            <OText size={theme.utils.tsize.xs} lineHeight={25} color={theme.colors.primary}>{getGiftCardStatus(card?.status)}</OText>
          </View>
        </InnerContainer>
      )}
    </CardContainer>
  )
}
