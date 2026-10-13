import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import { ProductItemAccordionParams } from '../../types'
import {
  Accordion,
  AccordionSection,
  ProductInfo,
  ProductQuantity,
  ContentInfo,
  ProductImage,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  ProductComment,
  QuantityButton
} from './styles'
import { ProductItemAccordion as ProductItemAccordionController, useUtils, useLanguage, useOrder } from '@components'

import { OIcon, OText, OAlert, OModal, ServiceForm } from '@ui'

const ProductItemAccordionUI = (props: ProductItemAccordionParams) => {
  const {
    isDisabledEdit,
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    hideProductOptions,
    isFromCheckout,
    productInfo,
    businessId
  } = props

  const theme = useTheme();
  const hideProductImage = props?.hideProductImage ?? (isFromCheckout
    ? theme?.checkout?.components?.cart?.components?.product?.components?.image?.hidden
    : theme?.confirmation?.components?.cart?.components?.products?.components?.photo?.hidden)

  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
  const hideProductCommentHide = isFromCheckout && theme?.checkout?.components?.cart?.components?.product?.components?.comments?.hidden

  const styles = StyleSheet.create({
    productImage: {
      borderRadius: theme.utils.radius.l,
      width: 48,
      height: 48
    }
  })

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

  const [isActive, setActiveState] = useState(false)
  const [isServiceOpen, setIsServiceOpen] = useState(false)
  const [productQuantityState, setProductQuantityState] = useState<any>(product.quantity.toString())

  const handleEditProduct = (curProduct: any) => {
    if (!curProduct?.calendar_event) {
      onEditProduct && onEditProduct(curProduct)
      return
    }
    setIsServiceOpen(true)
  }

  const handleChangeQuantity = (value: string) => {
    if (!orderState.loading) {
      setProductQuantityState(value)
      if (parseInt(value) === 0) {
        onDeleteProduct && onDeleteProduct(product)
      } else {
        changeQuantity && changeQuantity(product, parseInt(value))
      }
    }
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }: { quantity: number, name: string, position: string, price: number }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  useEffect(() => {
    if (product.quantity.toString() === productQuantityState || productQuantityState) {
      setProductQuantityState(null)
    }
  }, [product.quantity])

  return (
    <>
      <AccordionSection>
        <Accordion
          activeOpacity={1}
          isValid={product?.valid ?? true}
          onPress={
            (!product?.valid_menu && isCartProduct) ||
              !(productInfo?.ingredients?.length > 0 || productInfo?.options?.length > 0 || !!product.comment)
              ? null : () => setActiveState(!isActive)
          }
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <ContentInfo>
              {!!product?.calendar_event ? (
                <>
                  {onDeleteProduct && isCartProduct && !isCartPending && (
                    <OAlert
                      title={t('DELETE_PRODUCT', 'Delete Product')}
                      message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
                      onAccept={() => onDeleteProduct(product)}
                    >
                      <MaterialCommunityIcon
                        name='trash-can-outline'
                        size={20}
                        color={theme.colors.secondaryLightGray}
                      />
                    </OAlert>
                  )}
                  <View style={{ flex: 1, marginLeft: 10, flexDirection: 'column' }}>
                    <View>
                      <OText size={12} lineHeight={18} weight={'400'} numberOfLines={1}>{product?.name}</OText>
                    </View>
                    <OText size={10} color={theme.colors.textSecondary} style={{ marginTop: 3 }}>
                      {parseDate(product?.calendar_event?.start, { outputFormat: 'hh:mm a' })} - {parseDate(product?.calendar_event?.end, { outputFormat: 'hh:mm a' })}
                    </OText>
                  </View>
                </>
              ) : (
                <>
                  {!isDisabledEdit && isCartProduct && !isCartPending && getProductMax && (
                    <ProductInfo>
                      {onDeleteProduct && isCartProduct && !isCartPending && (
                        <OAlert
                          title={t('DELETE_PRODUCT', 'Delete Product')}
                          message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
                          onAccept={() => onDeleteProduct(product)}
                        >
                          <MaterialCommunityIcon
                            name='trash-can-outline'
                            size={20}
                            color={theme.colors.secondaryLightGray}
                            style={{ top: 1 }}
                          />
                        </OAlert>
                      )}
                      <QuantityButton
                        disabled={orderState.loading || getProductMax(product) <= product.quantity}
                        onPress={() => handleChangeQuantity(product.quantity + 1)}
                      >
                        <OText mRight={8} mLeft={5} size={14} weight={600}>
                          {product.quantity}
                        </OText>
                        <IconAntDesign
                          name='pluscircleo'
                          size={16}
                          color={orderState.loading || getProductMax(product) <= product.quantity ? theme.colors.disabled : theme.colors.primary}
                        />
                      </QuantityButton>
                    </ProductInfo>
                  )}
                  {isFromCheckout && (
                    <ProductQuantity>
                      <OText size={14} weight={600} lineHeight={18}>
                        {product?.quantity}
                      </OText>
                    </ProductQuantity>
                  )}
                  {(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && !hideProductImage && (
                    <ProductImage>
                      {isFromCheckout ? (
                        product?.images ? (
                          <FastImage
                            style={{ ...styles.productImage, ...{ width: 82, height: 82 } }}
                            source={{
                              uri: optimizeImage(product?.images, 'h_100,c_limit'),
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <OIcon
                            src={theme?.images?.dummies?.product}
                            style={{ ...styles.productImage, ...{ width: 82, height: 82 } }}
                          />
                        )
                      ) : (
                        product?.images ? (
                          <FastImage
                            style={styles.productImage}
                            source={{
                              uri: optimizeImage(product?.images, 'h_100,c_limit'),
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <OIcon
                            src={theme?.images?.dummies?.product}
                            style={styles.productImage}
                          />
                        )
                      )}
                    </ProductImage>
                  )}
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}
                    >
                      <OText size={12} lineHeight={18} weight={'400'} mLeft={8} style={{ flex: 1 }}>{product.name}</OText>
                      {isDisabledEdit && (
                        <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(product.total || product.price)}</OText>
                      )}
                    </View>

                    {!hideProductOptions && (
                      <AccordionContent>
                        {productInfo?.ingredients?.length > 0 && productInfo?.ingredients?.some((ingredient: any) => !ingredient.selected) && (
                          <ProductOptionsList>
                            <OText size={10} lineHeight={18} weight={'400'} mLeft={8} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
                            {productInfo?.ingredients?.map((ingredient: any, i: number) => !ingredient.selected && (
                              <OText size={10} lineHeight={18} weight={'400'} mLeft={8} color={theme.colors.textThird} key={ingredient.id + i} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
                            ))}
                          </ProductOptionsList>
                        )}
                        {productInfo?.options?.length > 0 && (
                          <ProductOptionsList>
                            {productInfo?.options.sort((a: any, b: any) => a.rank - b.rank).map((option: any) => (
                              <ProductOption key={option.id}>
                                {option.suboptions.map((suboption: any) => (
                                  <ProductSubOption key={suboption.id}>
                                    <OText size={10} lineHeight={18} weight={'400'} mLeft={8} color={theme.colors.textSecondary}>{option.name}:</OText>
                                    <OText size={10} lineHeight={18} weight={'400'} mLeft={8} color={theme.colors.textThird}>
                                      {getFormattedSubOptionName({
                                        quantity: suboption.quantity,
                                        name: suboption.name,
                                        position: (suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                                        price: parsePrice(suboption.price)
                                      })}
                                    </OText>
                                  </ProductSubOption>
                                ))}
                              </ProductOption>
                            ))}
                          </ProductOptionsList>
                        )}
                        {!!product.comment && !hideProductCommentHide && (
                          <ProductComment>
                            <OText size={10} color={theme.colors.textSecondary}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
                            <OText size={10} color={theme.colors.textThird}>{product.comment}</OText>
                          </ProductComment>
                        )}
                      </AccordionContent>
                    )}
                  </View>
                </>
              )}
              {!isDisabledEdit && (
                <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end', maxWidth: 100 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <OText size={12} lineHeight={18} weight={'400'}>{parsePrice(product.total || product.price)}</OText>
                  </View>
                  {!isDisabledEdit && onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: 20 }}>
                      <TouchableOpacity onPress={() => handleEditProduct(product)} style={{ marginRight: 5 }}>
                        <MaterialCommunityIcon
                          name='pencil-outline'
                          size={20}
                          color={theme.colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </ContentInfo>
          </View>
          {((isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
            (!product?.valid_menu && isCartProduct && !isCartPending)) && (
              <View style={{ alignItems: 'flex-end', width: '100%', }}>
                <OText size={14} color={theme.colors.red} style={{ textAlign: 'right', marginTop: 5 }}>
                  {t('NOT_AVAILABLE', 'Not available')}
                </OText>
              </View>
            )}
        </Accordion>
      </AccordionSection>
      <OModal
        open={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
        entireModal
      >
        <ServiceForm
          isCartProduct
          isService
          businessId={product?.business_id || businessId}
          categoryId={product?.category_id}
          productId={product?.id}
          productCart={product}
          onSave={() => setIsServiceOpen(false)}
          onClose={() => setIsServiceOpen(false)}
          professionalSelected={product?.calendar_event?.professional}
        />
      </OModal>
    </>
  )
}

export const ProductItemAccordion = (props: any) => {
  const productItemAccordionProps = {
    ...props,
    UIComponent: ProductItemAccordionUI
  }

  return (
    <ProductItemAccordionController {...productItemAccordionProps} />
  )
}
