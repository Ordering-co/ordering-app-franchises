import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'

import { ProductItemAccordionParams } from '../../types'
import {
  Accordion,
  AccordionSection,
  ProductInfo,
  ContentInfo,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  WrapperCard,
  WrapperFooterCard,
} from './styles'

import { ProductItemAccordion, useUtils, useLanguage } from '@components'
import { OText, OAlert, OModal, ServiceForm } from '@ui'

const SingleProductCartUI = (props: ProductItemAccordionParams) => {

  const {
    isDisabledEdit,
    isCartPending,
    isCartProduct,
    product,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    isFromCheckout,
    productInfo,
    businessId
  } = props

  const theme = useTheme();
  const hideProductImage = isFromCheckout
    ? theme?.checkout?.components?.cart?.components?.product?.components?.image?.hidden
    : theme?.confirmation?.components?.cart?.components?.products?.components?.photo?.hidden

  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden
  const hideProductCommentHide = isFromCheckout && theme?.checkout?.components?.cart?.components?.product?.components?.comments?.hidden

  const styles = StyleSheet.create({
    productImage: {
      borderRadius: theme.utils.radius.l,
      width: 95,
      height: 95
    }
  })

  const [, t] = useLanguage()
  const [{ parsePrice, optimizeImage }] = useUtils()

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
          <WrapperCard>
            <ContentInfo>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
              >
                <View style={{ flex: 1, width: '90%' }}>
                  <OText size={theme.utils.tsize.m} lineHeight={20} weight={'700'} numberOfLines={1} style={{ width: '90%' }}>
                    {product.name}
                  </OText>
                  <AccordionContent>
                    {!isDisabledEdit && onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleEditProduct(product)}
                      >
                        <OText
                          weight={'400'}
                          color={theme.colors.textNormal}
                          style={{ textDecorationLine: 'underline', paddingVertical: 20 }}
                        >
                          {t('SEE_OPTIONS_DETAILS', 'See options details')}
                        </OText>
                      </TouchableOpacity>
                    )}
                    {/* {productInfo?.ingredients?.length > 0 && productInfo?.ingredients?.some((ingredient: any) => !ingredient.selected) && (
                      <ProductOptionsList>
                        <OText lineHeight={20} weight={'400'} color={theme.colors.textSecondary}>{t('INGREDIENTS', 'Ingredients')}</OText>
                        {productInfo?.ingredients?.map((ingredient: any, i: number) => !ingredient.selected && (
                          <OText lineHeight={20} weight={'400'} color={theme.colors.textThird} key={ingredient.id + i} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
                        ))}
                      </ProductOptionsList>
                    )} */}
                    {/* {productInfo?.options?.length > 0 && (
                      <ProductOptionsList>
                        {productInfo?.options.sort((a: any, b: any) => a.rank - b.rank).map((option: any) => (
                          <ProductOption key={option.id}>
                            {option.suboptions.map((suboption: any) => (
                              <ProductSubOption key={suboption.id}>
                                <OText lineHeight={20} weight={'400'} color={theme.colors.textSecondary}>
                                  {option.name}:{' '}
                                  <OText lineHeight={20} weight={'400'} color={theme.colors.textThird}>
                                    {getFormattedSubOptionName({
                                      quantity: suboption.quantity,
                                      name: suboption.name,
                                      position: (suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                                      price: parsePrice(suboption.price)
                                    })}
                                  </OText>
                                </OText>
                              </ProductSubOption>
                            ))}
                          </ProductOption>
                        ))}
                      </ProductOptionsList>
                    )} */}
                    {!!product.comment && !hideProductCommentHide && (
                      <OText lineHeight={20} weight={'400'} numberOfLines={2} style={{ width: '90%' }} color={theme.colors.disabled}>
                        {product.comment}
                      </OText>
                    )}
                  </AccordionContent>
                </View>
                {(product?.images || !hideProductDummyLogo) && !hideProductImage && (
                  <FastImage
                    style={styles.productImage}
                    source={product?.images ? {
                      uri: optimizeImage(product?.images, 'h_100,c_limit'),
                      priority: FastImage.priority.normal,
                    } : theme?.images?.dummies?.product}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                )}
              </View>

              <WrapperFooterCard>
                <OText lineHeight={18} weight={'400'}>{parsePrice(product.total || product.price)}</OText>
                {!isDisabledEdit && isCartProduct && !isCartPending && getProductMax && (
                  <ProductInfo>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: 20 }}>
                      {!isDisabledEdit && onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
                        <TouchableOpacity onPress={() => handleEditProduct(product)} style={{ marginRight: 5 }}>
                          <MaterialCommunityIcon
                            name='pencil-outline'
                            size={22}
                            color={theme.colors.secondaryLightGray}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {onDeleteProduct && isCartProduct && !isCartPending && (
                      <OAlert
                        title={t('DELETE_PRODUCT', 'Delete Product')}
                        message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
                        onAccept={() => onDeleteProduct(product)}
                      >
                        <MaterialCommunityIcon
                          name='trash-can-outline'
                          size={22}
                          color={theme.colors.danger5}
                        />
                      </OAlert>
                    )}
                  </ProductInfo>
                )}
              </WrapperFooterCard>
            </ContentInfo>
          </WrapperCard>
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

export const SingleProductCart = (props: any) => {
  const productProps = {
    ...props,
    UIComponent: SingleProductCartUI
  }

  return (
    <ProductItemAccordion {...productProps} />
  )
}
