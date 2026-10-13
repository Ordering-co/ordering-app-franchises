import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image'

import { SingleProductCardParams } from '../../types';
import { lightenDarkenColor, shape } from '../../utils';
import { CardInfo, SoldOut, SoldOutOverlay, QuantityContainer, PricesContainer, RibbonBox, LogoWrapper, TagsContainer, TitleWrapper } from './styles';
import { areSingleProductCardPropsEqual } from './areSingleProductCardPropsEqual';

import {
  useLanguage,
  useConfig,
  useOrder,
  useUtils,
  useSession,
  ToastType,
  useToast,
  SingleProductCard as SingleProductCardController
} from '@components';

import {
  CardAnimation,
  OButton,
  OText,
  LottieAnimation,
  SimpleCard as ProductCard
} from '@ui'

const SingleProductCardUI = React.memo((props: SingleProductCardParams) => {
  const {
    product,
    isSoldOut,
    onProductClick,
    productAddedToCartLength,
    style,
    handleFavoriteProduct,
    enableIntersection,
    navigation,
    isPreviously,
    viewString,
    showCategoriesView,
    businessSingleId,
    isTaxView
  } = props;

  const theme = useTheme();
  const hideAddButton = isTaxView ? true : theme?.business_view?.components?.products?.components?.add_to_cart_button?.hidden ?? true
  const hideProductDescription = theme?.business_view?.components?.products?.components?.product?.components?.description?.hidden
  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
  const hideProductLogo = viewString
    ? theme?.[viewString]?.components?.cart?.components?.products?.image?.hidden
    : theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden

  const logoPosition = theme?.business_view?.components?.products?.components?.product?.components?.image?.position
  const hideFavoriteIcon = isTaxView ? true : theme?.business_view?.components?.products?.components?.product?.components?.favorite?.hidden

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: isPreviously ? 0 : 25,
      minHeight: isPreviously ? 150 : 125,
      flex: 1,
      flexDirection: hideAddButton ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderRadius: theme.utils.radius.l,
      position: 'relative'
    },
    soldOutBackgroundStyle: {
      backgroundColor: theme.colors.backgroundGray100,
    },
    soldOutImageStyle: {
      opacity: 0.35,
    },
    soldOutTextStyle: {
      textTransform: 'uppercase',
    },
    productStyle: {
      width: 85,
      height: 85,
      borderRadius: theme.utils.radius.l
    },
    regularPriceStyle: {
      fontSize: theme.utils.tsize.xs,
      color: '#808080',
      textDecorationLine: 'line-through',
    },
    productTagsStyle: {
      width: 30,
      height: 30,
      marginRight: 5
    }
  });

  const [, t] = useLanguage();
  const [stateConfig] = useConfig();
  const [{ auth }] = useSession()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils();
  const [orderState] = useOrder()
  const [, { showToast }] = useToast()
  const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)

  const editMode = typeof product?.code !== 'undefined';

  const removeToBalance = editMode ? product?.quantity : 0;
  const cartProducts: any = Object.values(orderState.carts).reduce((products: any, _cart: any) => [...products, ..._cart?.products], [])
  const productBalance = cartProducts.reduce((sum: any, _product: any) => sum + (_product.id === product?.id ? _product.quantity : 0), 0)

  const totalBalance = (productBalance || 0) - removeToBalance

  const maxCartProductConfig =
    (stateConfig.configs.max_product_amount
      ? parseInt(stateConfig.configs.max_product_amount)
      : 100) - totalBalance;

  let maxCartProductInventory =
    (product?.inventoried ? product?.quantity : undefined) - totalBalance;
  maxCartProductInventory = !isNaN(maxCartProductInventory)
    ? maxCartProductInventory
    : maxCartProductConfig;

  const maxProductQuantity = Math.min(
    maxCartProductConfig,
    maxCartProductInventory,
  );
  const showSoldOut = isSoldOut || maxProductQuantity <= 0
  const hasProductImage = !hideProductLogo && !!product?.images

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProduct && handleFavoriteProduct(!product?.favorite)
    } else {
      navigation && navigation.navigate('Login');
    }
  }

  const handleClickproduct = () => {
    if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
      showToast(ToastType.Error, t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order'))
      return
    }
    onProductClick?.(product)
  }

  return (
    showCategoriesView ? (
      <ProductCard
        showIcon
        element={product}
        title={product.name}
        imageSource={product?.images ?? theme.images.dummies.product}
        onClick={handleClickproduct}
      />
    ) : (
      <View style={{ width: '100%' }}>
        {isIntersectionObserver ? (
          <CardAnimation
            onClick={() => handleClickproduct()}
            style={[
              styles.container,
              showSoldOut && styles.soldOutBackgroundStyle,
              (style && { ...style })
            ]}
            disabled={isTaxView}
          >
            <View style={{ flexDirection: logoPosition === 'left' ? 'row-reverse' : 'row', alignItems: 'center' }}>
              {productAddedToCartLength > 0 && (
                <QuantityContainer businessSingleId={businessSingleId} style={[{
                  transform: [{ translateX: logoPosition === 'left' ? -25 : 25 }, { translateY: -25 }],
                }]}>
                  <OText size={12} color={theme.colors.white}>{productAddedToCartLength.toString()}</OText>
                </QuantityContainer>
              )}
              <CardInfo>
                <TitleWrapper>
                  <OText
                    size={theme.utils.tsize.m}
                    weight={'500'}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={{ lineHeight: 18, flex: 1 }}>
                    {product?.name}
                  </OText>
                  {!isPreviously && !hideFavoriteIcon && (
                    <LottieAnimation
                      type='favorite'
                      onClick={handleChangeFavorite}
                      initialValue={product?.favorite ? 0.5 : 0}
                      toValue={product?.favorite ? 0 : 0.5}
                      disableAnimation={!auth}
                      iconProps={{ color: theme.colors.danger5, size: 18 }}
                      isActive={product?.favorite}
                    />
                  )}
                </TitleWrapper>
                {!isPreviously && product?.tags && product?.tags.length > 0 && (
                  <PricesContainer>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      style={{ marginLeft: 10 }}
                      contentContainerStyle={{ flexGrow: 1 }}
                    >
                      {product?.tags.map((tag: any, i: any) => (
                        <TouchableWithoutFeedback key={i}>
                          <TagsContainer>
                            <FastImage
                              style={styles.productTagsStyle}
                              source={tag.image ? {
                                uri: optimizeImage(tag.image, 'h_250,c_limit'),
                                priority: FastImage.priority.normal,
                              } : theme?.images?.dummies?.product}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          </TagsContainer>
                        </TouchableWithoutFeedback>
                      ))}
                    </ScrollView>
                  </PricesContainer>
                )}
                {!hideProductDescription && (
                  <OText
                    size={theme.utils.tsize.s}
                    numberOfLines={!isPreviously ? 2 : 1}
                    ellipsizeMode="tail"
                    color={theme.colors.textSecondary}
                    style={{ lineHeight: 15, marginBottom: 5 }}
                  >
                    {product?.description}
                  </OText>
                )}
                {!!product?.price && (
                  <OText
                    color={theme.colors.primary}
                    size={theme.utils.tsize.s}
                  >
                    {parsePrice(product?.price)}
                    {product?.offer_price !== null && !!product?.in_offer && (
                      <>
                        {'  '}
                        <OText
                          size={theme.utils.tsize.s}
                          style={styles.regularPriceStyle}
                        >
                          {product?.offer_price ? parsePrice(product?.offer_price) : ''}
                        </OText>
                      </>
                    )}
                  </OText>
                )}
                {isPreviously && (
                  <OText
                    size={theme.utils.tsize.s}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    color={theme.colors.primary}
                    style={{ lineHeight: 15 }}>
                    {t('LAST_ORDERED_ON', 'Last ordered on')} {parseDate(product?.last_ordered_date, { outputFormat: 'MMM DD, YYYY' })}
                  </OText>
                )}
              </CardInfo>
              <LogoWrapper logoPosition={logoPosition}>
                {!!product?.ribbon?.enabled && (
                  <RibbonBox
                    bgColor={product?.ribbon?.color}
                    colorText={lightenDarkenColor(product?.ribbon?.color)}
                    borderRibbon={lightenDarkenColor(product?.ribbon?.color)}
                    isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
                    isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
                  >
                    <OText
                      size={theme.utils.tsize.xs}
                      color={lightenDarkenColor(product?.ribbon?.color) ? theme.colors.black : theme.colors.white}
                      numberOfLines={2}
                      ellipsizeMode='tail'
                      lineHeight={13}
                    >
                      {product?.ribbon?.text}
                    </OText>
                  </RibbonBox>
                )}
                {!hideProductLogo && product?.images && (
                  <FastImage
                    style={[styles.productStyle, showSoldOut && styles.soldOutImageStyle]}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: optimizeImage(product?.images, 'h_250,c_limit'),
                      priority: FastImage.priority.normal,
                    }}
                  />
                )}
                {showSoldOut && hasProductImage && (
                  <SoldOutOverlay>
                    <SoldOut style={{ position: 'relative', top: 0, right: 0 }}>
                      <OText size={12} weight="bold" color={theme.colors.textSecondary} style={styles.soldOutTextStyle}>
                        {t('SOLD_OUT', 'SOLD OUT')}
                      </OText>
                    </SoldOut>
                  </SoldOutOverlay>
                )}
              </LogoWrapper>

              {showSoldOut && !hasProductImage && (
                <SoldOut>
                  <OText size={12} weight="bold" color={theme.colors.textSecondary} style={styles.soldOutTextStyle}>
                    {t('SOLD_OUT', 'SOLD OUT')}
                  </OText>
                </SoldOut>
              )}
            </View>
            {!hideAddButton && (
              <OButton
                onClick={() => handleClickproduct()}
                style={{
                  width: '100%',
                  borderRadius: theme.utils.radius.l,
                  marginTop: 10,
                  height: 40

                }}
                isDisabled={isSoldOut}
                text={t('ADD', 'Add')}
              />
            )}
          </CardAnimation>
        ) : (
          <View style={{ marginBottom: 28, padding: 12, height: hideAddButton ? 125 : 165 }}>
            <Placeholder style={{ padding: 5 }} Animation={Fade}>
              <View style={{ flexDirection: 'row' }}>
                <Placeholder style={{ paddingVertical: 10, flex: 1 }}>
                  <PlaceholderLine width={60} style={{ marginBottom: 15 }} />
                  <PlaceholderLine width={20} />
                </Placeholder>
                <PlaceholderLine
                  width={24}
                  height={70}
                  style={{ marginLeft: 10, marginBottom: 10 }}
                />
              </View>
              <PlaceholderLine
                height={52}
              />
            </Placeholder>
          </View>
        )}
      </View>
    )
  )
}, areSingleProductCardPropsEqual)

export const SingleProductCard = (props: SingleProductCardParams) => {
  const singleProductCardProps = {
    ...props,
    UIComponent: SingleProductCardUI
  }
  return <SingleProductCardController {...singleProductCardProps} />
}
