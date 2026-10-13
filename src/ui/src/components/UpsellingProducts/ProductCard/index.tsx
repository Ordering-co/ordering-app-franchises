import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image'

import { SingleProductCardParams } from '../../../types';
import { CardInfo, LogoWrapper, ProductCardContainer, TitleWrapper } from './styles';

import { useLanguage, useUtils, SingleProductCard } from '@components';

import { OButton, OText } from '@ui'

function SingleProductCardPropsAreEqual(prevProps: any, nextProps: any) {
  return JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product)
}

const ProductCardUI = React.memo((props: SingleProductCardParams) => {
  const { isSoldOut, product, onProductClick } = props

  const [, t] = useLanguage()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const theme = useTheme()

  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
  const hideProductLogo = theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden

  const styles = StyleSheet.create({
    productStyle: {
      width: 100,
      height: 100,
      borderRadius: theme.utils.radius.l
    },
    regularPriceStyle: {
      fontSize: 12,
      color: '#808080',
      textDecorationLine: 'line-through',
      marginLeft: 7,
      marginRight: 0
    }
  })

  return (
    <ProductCardContainer
      activeOpacity={0.7}
      onPress={() => onProductClick?.(product)}
    >
      <CardInfo>
        <LogoWrapper>
          {(!hideProductLogo && (product?.images || !hideProductDummyLogo)) && (
            <FastImage
              style={styles.productStyle}
              source={product?.images ? {
                uri: optimizeImage(product?.images, 'h_250,c_limit'),
                priority: FastImage.priority.normal,
              } : theme?.images?.dummies?.product}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </LogoWrapper>
        <TitleWrapper>
          <OText
            size={theme.utils.tsize.m - 1}
            weight={'500'}
            lineHeight={20}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ lineHeight: 18, flex: 1, width: '100%' }}>
            {product?.name}
          </OText>
        </TitleWrapper>
        {!!product?.price && (
          <OText
            lineHeight={20}
            size={theme.utils.tsize.s - 1}
          >
            {parsePrice(product?.price)}
          </OText>
        )}
        {product?.offer_price !== null && !!product?.in_offer && (
          <OText
            size={theme.utils.tsize.s}
            style={styles.regularPriceStyle}
          >
            {product?.offer_price ? parsePrice(product?.offer_price) : ''}
          </OText>
        )}
      </CardInfo>
      <View style={{ paddingBottom: 10, paddingHorizontal: 10, flexDirection: 'row' }}>
        <OButton
          text={t('ADD', 'Add')}
          bgColor={theme.colors.white}
          isDisabled={isSoldOut}
          textStyle={{
            color: theme.colors.primary,
            fontWeight: 'normal',
            marginRight: 0,
            marginLeft: 0,
            fontSize: 14
          }}
          style={{
            width: '100%',
            borderRadius: theme.utils.radius.l,
            height: 40,
            borderWidth: 1
          }}
          onClick={() => onProductClick?.(product)}
        />
      </View>
    </ProductCardContainer>
  )
}, SingleProductCardPropsAreEqual)

export const ProductCard = (props: SingleProductCardParams) => {
  const productCardProps = {
    ...props,
    UIComponent: ProductCardUI
  }
  return <SingleProductCard {...productCardProps} />
}
