import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder'

import {
  PromotionsContainer,
  SingleBusinessOffer,
  OfferData,
  Code,
  BusinessInfo
} from './styles'
import { TabContainer } from '../styles';

import { Offer } from './Item'
import { PromotionParams } from '../../../types'
import { PromotionsController, useLanguage, useUtils } from '@components'
import {
  OButton, OIcon, OModal, OText,
  NotFoundSource,
  OTextClipboard
} from '@ui'

const OffersUI = (props: PromotionParams) => {
  const {
    handleBusinessClick,
    offersState,
    searchValue,
    loadOffers,
    offerSelected,
    setOfferSelected
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    productStyle: {
      width: 44,
      height: 44,
      borderRadius: 50
    },
    modalButtonStyle: {
      width: 100,
      height: 35,
      paddingLeft: 0,
      paddingRight: 0
    },
    skeletonContainer: {
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      padding: 10
    }
  });

  const [, t] = useLanguage()
  const [{ parseDate, parsePrice, optimizeImage }] = useUtils()
  const [openModal, setOpenModal] = useState(false)
  const [refreshing] = useState(false);

  const handleClickOffer = (offer: any) => {
    setOpenModal(true)
    setOfferSelected(offer)
  }

  const onBusinessClick = (store: any) => {
    setOpenModal(false)
    handleBusinessClick(store)
  }

  const handleOnRefresh = () => {
    if (!offersState.loading) {
      loadOffers();
    }
  }

  const filteredOffers = offersState?.offers?.filter((offer: any) => offer.name.toLowerCase().includes(searchValue?.toLowerCase()))
  const targetString = offerSelected?.target === 1
    ? t('SUBTOTAL', 'Subtotal')
    : offerSelected?.target === 2
      ? t('DELIVERY_FEE', 'Delivery fee')
      : t('SERVICE_FEE', 'Service fee')

  return (
    <TabContainer>
      <PromotionsContainer>
        <ScrollView>
          {!offersState?.loading && offersState.offers?.length > 0 && filteredOffers?.map((offer: any) => (
            <Offer
              key={offer?.id}
              offer={offer}
              handleClick={handleClickOffer}
            />
          ))}
        </ScrollView>
        {offersState?.loading && (
          <>
            {[...Array(5).keys()].map((_, i) => (
              <Placeholder
                key={i}
                style={styles.skeletonContainer}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PlaceholderMedia size={80} isRound />
                  <View style={{ flexDirection: 'column', width: '80%', marginLeft: 20 }}>
                    <PlaceholderLine height={10} width={60} />
                    <PlaceholderLine height={10} width={75} />
                    <PlaceholderLine height={10} width={75} noMargin />
                  </View>
                </View>
              </Placeholder>
            ))}
          </>
        )}
        {((!offersState?.loading && filteredOffers?.length === 0) || offersState?.error) && (
          <NotFoundSource
            simple
            content={offersState?.error || t('NOT_FOUND_OFFERS', 'Not found offers')}
          />
        )}
        <OModal
          open={openModal}
          entireModal
          title={``}
          showToastInsideModal
          onClose={() => setOpenModal(false)}
        >
          <ScrollView style={{ padding: 20 }}>
            <OText size={theme.utils.tsize.m} style={{ textAlign: 'center', fontWeight: '700' }} mBottom={20}>
              {offerSelected?.name} / {t('VALUE_OF_OFFER', 'Value of offer')}: {offerSelected?.rate_type === 1 ? `${offerSelected?.rate}%` : `${parsePrice(offerSelected?.rate)}`}
            </OText>
            <OfferData>
              {offerSelected?.type === 2 && !!offerSelected.coupon && (
                <Code>
                  <OText>{t('YOUR_CODE', 'Your code')}:</OText>
                  <OTextClipboard text={offerSelected.coupon}>
                    <OText
                      color={theme.colors.primary}
                      mLeft={10}
                      lineHeight={18}
                      ellipsizeMode={'tail'}
                      weight={'bold'}
                      size={20}
                  >
                      {offerSelected.coupon}
                    </OText>
                  </OTextClipboard>
                </Code>
              )}
              <OText>{t('APPLIES_TO', 'Applies to')}: {targetString}</OText>
              {offerSelected?.auto && (
                <OText>{t('OFFER_AUTOMATIC', 'This offer applies automatic')}</OText>
              )}
              {!!offerSelected?.minimum && (
                <OText>{t('MINIMUM_PURCHASE_FOR_OFFER', 'Minimum purchase for use this offer')}: {parsePrice(offerSelected?.minimum)}</OText>
              )}
              {!!offerSelected?.max_discount && (
                <OText>{t('MAX_DISCOUNT_ALLOWED', 'Max discount allowed')}: {parsePrice(offerSelected?.max_discount)}</OText>
              )}
              {!!offerSelected?.description && (
                <OText>{offerSelected?.description}</OText>
              )}
            </OfferData>
            {!!offerSelected?.businesses?.length && (
              <View style={{ marginTop: 10 }}>
                <OText style={{ marginTop: 10, marginBottom: 10 }}>
                  {t('AVAILABLE_BUSINESSES_FOR_OFFER', 'Available businesses for this offer')}:
                </OText>
                <View style={{ marginBottom: 70 }}>
                  {offerSelected?.businesses?.filter((b: any) => b.franchise_id === props.franchiseId).map((business: any) => {
                    return (
                      <SingleBusinessOffer key={business.id}>
                        {business?.logo ? (
                          <FastImage
                            style={styles.productStyle}
                            source={{
                              uri: optimizeImage(business?.logo, 'h_250,c_limit'),
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <OIcon
                            src={theme?.images?.dummies?.product}
                            style={styles.productStyle}
                          />
                        )}
                        <BusinessInfo>
                          <OText style={{ maxWidth: '65%' }}>{business.name}</OText>
                          <OButton
                            onClick={() => onBusinessClick(business)}
                            text={t('GO_TO_BUSINESSS', 'Go to business')}
                            bgColor={theme.colors.white}
                            borderColor={theme.colors.primary}
                            style={{ borderWidth: 1, paddingLeft: 0, paddingRight: 0, height: 35 }}
                            textStyle={{ fontSize: 10, color: theme.colors.primary }}
                          />
                        </BusinessInfo>
                      </SingleBusinessOffer>
                    )
                  })}
                </View>
              </View>
            )}
          </ScrollView>
        </OModal>
      </PromotionsContainer>
    </TabContainer>
  )
}

export const Offers = (props: PromotionParams) => {
  const OffersProps = {
    ...props,
    UIComponent: OffersUI
  }

  return (
    <PromotionsController {...OffersProps} />
  )
}
