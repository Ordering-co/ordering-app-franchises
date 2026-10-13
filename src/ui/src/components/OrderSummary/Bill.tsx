import React, { useRef, useState } from 'react'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'styled-components/native';
import AntIcon from 'react-native-vector-icons/AntDesign'

import { Divider, OSBill, OSRow, OSTable } from './styles'
import { verifyDecimals } from '../../utils';

import { useConfig, useLanguage, useOrder, useUtils } from '@components'
import { CouponControl, OAlert, OInput, OModal, OText, TaxInformation } from '@ui'

export const Bill = (props: any) => {
  const {
    handleRemoveOfferClick,
    hideDeliveryFee,
    hideCartDiscount,
    isCartPending,
    loyaltyRewardRate,
    hideCartComments,
    handleChangeComment,
    commentState,
    onNavigationRedirect
  } = props
  const [{ parsePrice, parseNumber }] = useUtils();
  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const commentRef = useRef<any>(null)

  const cart = orderState?.carts?.[`businessId:${props.businessId}`]
  const extraValueAdjustment = cart?.metafields?.filter?.((meta: any) => meta?.key?.includes('extra_value') && ![0, -0].includes(parseFloat(meta?.value)))
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null, type: '' })

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const getIncludedTaxes = (isDeliveryFee?: boolean, taxProperty = 'tax') => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart?.business?.tax_type === 1 ? cart?.[taxProperty] : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded +
          (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') ||
            (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.[taxProperty] : 0)
      }, 0)
    }
  }
  const clearAmount = (value: any) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))
  const loyaltyRewardValue = clearAmount((cart?.subtotal_with_discount + getIncludedTaxes(false, 'tax_after_discount')) * loyaltyRewardRate)

  const OfferAlert = ({ offerId }: any) => {
    return (
      <OAlert
        title={t('OFFER', 'Offer')}
        message={t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')}
        onAccept={() => handleRemoveOfferClick(offerId)}
      >
        <AntIcon style={{ marginLeft: 3, top: 3 }} name='closecircle' size={16} color={theme.colors.primary} />
      </OAlert>
    )
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  return (
    <OSBill>
      <OSTable>
        <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
        <OText>
          {parsePrice(cart?.subtotal + getIncludedTaxes())}
        </OText>
      </OSTable>
      {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
        <OSTable>
          {cart?.discount_type === 1 ? (
            <OText>
              {t('DISCOUNT', 'Discount')}
              <OText>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
            </OText>
          ) : (
            <OText>{t('DISCOUNT', 'Discount')}</OText>
          )}
          <OText>- {parsePrice(cart?.discount || 0)}</OText>
        </OSTable>
      )}
      {
        cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
          <OSTable key={offer.id}>
            <OSRow>
              <OText>
                {offer.name}
                {offer.rate_type === 1 && (
                  <>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', left: 5 }}>
                  <TouchableOpacity style={{ marginLeft: 5, top: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  {!!offer?.id && (
                    <OfferAlert offerId={offer?.id} />
                  )}
                </View>
              </OText>
            </OSRow>
            <OText>
              - {parsePrice(offer?.summary?.discount)}
            </OText>
          </OSTable>
        ))
      }
      {cart?.business_id && (
        <Divider />
      )}
      {cart?.offers?.filter((offer: any) => offer?.target === 1)?.length > 0 &&
        cart?.subtotal_with_discount > 0 &&
        cart?.discount > 0 &&
        cart?.total >= 0 && (
          <OSTable>
            <OText numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
            {cart?.business?.tax_type === 1 ? (
              <OText>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts())}</OText>
            ) : (
              <OText>{parsePrice(cart?.subtotal_with_discount ?? 0)}</OText>
            )}
          </OSTable>
        )}
      {
        cart.taxes?.length > 0 && cart.taxes.filter((tax: any) => tax.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map((tax: any, i: number) => (
          <OSTable key={tax.id}>
            <OSRow>
              <OText numberOfLines={1} >
                {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
              </OText>
              <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })} >
                <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </OSRow>
            <OText>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
          </OSTable>
        ))
      }
      {
        cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any, i: number) => (
          <OSTable key={fee?.id + i}>
            <OSRow>
              <OText numberOfLines={1}>
                {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
              </OText>
              <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })} >
                <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </OSRow>
            <OText>{parsePrice(fee?.summary?.amount ?? (fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage)))}</OText>
          </OSTable>
        ))
      }
      {
        cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
          <OSTable key={offer.id}>
            <OSRow>
              <OText>
                {offer.name}
                {offer.rate_type === 1 && (
                  <>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', left: 5 }}>
                  <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  {!!offer?.id && (
                    <OfferAlert offerId={offer?.id} />
                  )}
                </View>
              </OText>
            </OSRow>
            <OText>
              - {parsePrice(offer?.summary?.discount)}
            </OText>
          </OSTable>
        ))
      }
      {orderState?.options?.type === 1 && !hideDeliveryFee && (
        <OSTable>
          <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
          <OText>{parsePrice(cart?.delivery_price + getIncludedTaxes(true))}</OText>
        </OSTable>
      )}
      {cart?.extra_value_checkprice && cart?.extra_value_checkprice > 0 && (
        <OSTable>
          <OText>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</OText>
          <OText>{parsePrice(cart?.extra_value_checkprice)}</OText>
        </OSTable>
      )}
      {
        cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map((tax: any, i: number) => (
          <OSTable key={`${tax.description}_${i}`}>
            <OSRow>
              <OText numberOfLines={1}>
                {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}
              </OText>
              <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </OSRow>
            <OText>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
          </OSTable>
        ))
      }
      {
        cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
          <OSTable key={offer.id}>
            <OSRow>
              <OText>
                {offer.name}
                {offer.rate_type === 1 && (
                  <>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', left: 5 }}>
                  <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  {!!offer?.id && (
                    <OfferAlert offerId={offer?.id} />
                  )}
                </View>
              </OText>
            </OSRow>
            <OText>
              - {parsePrice(offer?.summary?.discount)}
            </OText>
          </OSTable>
        ))
      }
      {cart?.driver_tip > 0 && (
        <OSTable>
          <OText>
            {t('DRIVER_TIP', 'Driver tip')}
            {cart?.driver_tip_rate > 0 &&
              parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
              !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
              (
                `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
              )}
          </OText>
          <OText>{parsePrice(cart?.driver_tip)}</OText>
        </OSTable>
      )}
      {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map((extraValue: any) => (
        <OSTable key={extraValue?.key}>
          <OText>
            {t(extraValue?.key?.toUpperCase(), extraValue?.key)}{' '}
          </OText>
          <OText>{parseFloat(extraValue?.value) > 0 ? parsePrice(parseFloat(extraValue?.value)) : `- ${parsePrice(parseFloat(extraValue?.value) * -1)}`}</OText>
        </OSTable>
      ))}
      {cart?.payment_events?.length > 0 && cart?.payment_events?.map((event: any) => (
        <OSTable key={event.id}>
          <OText numberOfLines={1}>
            {walletName[cart?.wallets?.find((wallet: any) => wallet.id === event.wallet_id)?.type]?.name}
          </OText>
          <OText>-{parsePrice(event.amount, { isTruncable: true })}</OText>
        </OSTable>
      ))}
      {!hideCartDiscount && !isCartPending && cart?.business_id && (
        <View>
          <View style={{ paddingVertical: 5 }}>
            <CouponControl
              businessId={cart.business_id}
              price={cart.total}
              cart={cart}
              onOpenOffers={() => onNavigationRedirect?.('CouponOffers', {
                businessId: cart.business_id,
                cartUuid: cart.uuid
              })}
            />
          </View>
        </View>
      )}
      {cart?.total >= 1 && (
        <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: theme.colors.backgroundGray200 }}>
          <OSTable style={{ marginTop: 15 }}>
            <OText size={14} weight={'bold'} color={theme.colors.textNormal}>
              {t('TOTAL', 'Total')}
            </OText>
            <OText size={14} weight={'bold'} color={theme.colors.textNormal}>
              {parsePrice(cart?.balance >= 0 ? cart?.balance : 0)}
            </OText>
          </OSTable>
          {!isDisabledRewards && !!loyaltyRewardValue && (
            <OSTable style={{ justifyContent: 'flex-end' }}>
              <OText color={theme.colors.textNormal}>
                {t('REWARD_LOYALTY_POINT', 'Reward :amount: on loyalty points').replace(':amount:', loyaltyRewardValue)}
              </OText>
            </OSTable>
          )}
        </View>
      )}
      {cart?.business_id && cart?.status !== 2 && !hideCartComments && (
        <OSTable>
          <View style={{ width: '100%', marginTop: 20 }}>
            <OText>{t('COMMENTS', 'Comments')}</OText>
            <View style={{ flex: 1, width: '100%' }}>
              <OInput
                value={cart?.comment}
                placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                onChange={(value: string) => handleChangeComment(value)}
                style={{
                  alignItems: 'flex-start',
                  width: '100%',
                  height: 100,
                  borderColor: theme.colors.border,
                  paddingRight: 50,
                  marginTop: 10,
                  borderRadius: 8,
                }}
                inputStyle={{
                  fontSize: 12
                }}
                ref={commentRef}
                multiline
              />
              {commentState?.loading && (
                <View style={{ position: 'absolute', right: 20 }}>
                  <ActivityIndicator
                    size='large'
                    style={{ height: 100 }}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </View>
          </View>
        </OSTable>
      )}
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
        title={`${openTaxModal.data?.name ||
          t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${openTaxModal.data?.rate_type !== 2 ? `(${typeof openTaxModal.data?.rate === 'number' ? `${openTaxModal.data?.rate}%` : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})` : ''}  `}
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          businessId={props.businessId}
        />
      </OModal>
    </OSBill>
  )
}
