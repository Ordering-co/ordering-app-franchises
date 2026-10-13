import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'

import { Divider, OrderBill, Table, Total } from './styles'
import { ProductList } from './ProductList'
import { OSRow } from '../OrderSummary/styles';
import { useConfig, useLanguage, useUtils } from '@components'
import { getPayIcon, OIcon, OModal, OText, TaxInformation, verifyDecimals } from '@ui'

export const Bill = (props: any) => {
  const {
    order,
    isPickup,
    hideTotal,
    isGiftCardOrder
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice, parseNumber }] = useUtils()

  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, tax: null, type: '' })

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const extraValueAdjustment = order?.metafields?.filter?.((meta: any) => meta?.key?.includes('extra_value') && ![0, -0].includes(parseFloat(meta?.value)))

  const getIncludedTaxes = (isDeliveryFee?: boolean) => {
    if (order?.taxes?.length === 0 || !order?.taxes) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') || (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1 && tax?.target === 'product')?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  return (
    <>
      <OrderBill>
        <View style={{ height: 1, backgroundColor: theme.colors.border }} />
        <View style={{ marginBottom: 20 }}>
          <ProductList order={order} />
        </View>
        <Table>
          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL', 'Subtotal')}</OText>
          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
            {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()))}
          </OText>
        </Table>
        {(order?.summary?.discount > 0 ?? order?.discount > 0) && order?.offers?.length === 0 && (
          <Table>
            {order?.offer_type === 1 ? (
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                {t('DISCOUNT', 'Discount')}
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(
                  order?.offer_rate,
                  parsePrice,
                )}%)`}</OText>
              </OText>
            ) : (
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DISCOUNT', 'Discount')}</OText>
            )}
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
              - {parsePrice(order?.summary?.discount || order?.discount)}
            </OText>
          </Table>
        )}
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {offer.name}
                  {offer.rate_type === 1 && (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                  <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
            </Table>
          ))
        }
        {order?.offers?.filter((offer: any) => offer?.target === 1)?.length > 0 &&
          order?.summary?.subtotal_with_discount > 0 &&
          order?.summary?.discount > 0 &&
          order?.summary?.total >= 0 && (
            <Table>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
              {order?.tax_type === 1 ? (
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice((order?.summary?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0))}</OText>
              ) : (
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</OText>
              )}
            </Table>
          )}
        {
          order?.taxes?.length === 0 && order?.tax_type === 2 && (
            <Table>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
              </OText>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.tax || 0)}</OText>
            </Table>
          )
        }
        {
          order?.fees?.length === 0 && (
            <Table>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                {t('SERVICE_FEE', 'Service fee')}
                {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
              </OText>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.service_fee || 0)}</OText>
            </Table>
          )
        }
        {
          order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map((tax: any) => (
            <Table key={tax.id}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                </OText>
                <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                  <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
            </Table>
          ))
        }
        {
          order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
            <Table key={fee.id}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
                </OText>
                <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                  <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(fee?.summary?.amount ?? (fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage)) ?? 0)}</OText>
            </Table>
          ))
        }
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {offer.name}
                  {offer.rate_type === 1 && (
                    <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                  <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
            </Table>
          ))
        }
        {typeof order?.summary?.delivery_price === 'number' && !isPickup && !isGiftCardOrder && (
          <Table>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.delivery_price + getIncludedTaxes(true))}</OText>
          </Table>
        )}
        {
          order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map((tax: any, i: number) => (
            <Table key={`${tax?.description}_${i}`}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), tax?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}
                </OText>
                {setOpenTaxModal && (
                  <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                    <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                )}
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
            </Table>
          ))
        }
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                  {offer.name}
                  {offer.rate_type === 1 && (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                  <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </OSRow>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
            </Table>
          ))
        }
        {order?.summary?.driver_tip > 0 && (
          <Table>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
              {t('DRIVER_TIP', 'Driver tip')}
              {order?.summary?.driver_tip > 0 &&
                parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                (
                  `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                )}
            </OText>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip)}</OText>
          </Table>
        )}
        {extraValueAdjustment?.length > 0 && extraValueAdjustment?.map((extra: any) => (
          <Table key={extra?.key}>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
              {t(extra?.key?.toUpperCase(), extra?.key)}{' '}
            </OText>
            <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parseFloat(extra?.value) > 0 ? parsePrice(parseFloat(extra?.value)) : `- ${parsePrice(parseFloat(extra?.value) * -1)}`}</OText>
          </Table>
        ))}
        {!hideTotal && (
          <Total>
            <Table>
              <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>{t('TOTAL', 'Total')}</OText>
              <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>
                {parsePrice(order?.summary?.total ?? order?.total)}
              </OText>
            </Table>
          </Total>
        )}
        {!hideTotal && order?.driver?.name && (
          <>
            <OText>
              {t('YOUR_DELIVERY_WAS_FOR', 'Your delivery was for')}
              <OText style={{ textTransform: 'uppercase' }}>{' '}{order?.driver?.name}</OText>
            </OText>
            <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 20 }} />
          </>
        )}
        {order?.payment_events?.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <OText size={16} lineHeight={24} weight={'500'}>{t('PAYMENTS', 'Payments')}</OText>
            <View
              style={{
                width: '100%',
                marginTop: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: theme?.colors?.black,
                padding: 10
              }}
            >
              {order?.payment_events?.map((event: any, i: number) => event.amount > 0 && (
                <View
                  key={event.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: 40,
                      width: '60%'
                    }}
                  >
                    <OIcon
                      src={getPayIcon(event?.paymethod?.gateway ?? event?.data?.gateway, theme)}
                      width={20}
                      height={20}
                    />
                    <OText
                      mLeft={10}
                      weight={500}
                    >
                      {(event?.wallet_event ?? event?.wallet_event_id)
                        ? walletName[event?.wallet_event?.wallet?.type ?? event?.data?.wallet_currency]?.name
                        : t(event?.data?.gateway?.toUpperCase()?.replace(/ /g, '_') || event?.paymethod?.name.toUpperCase()?.replace(/ /g, '_'), event?.data?.gateway || event?.paymethod?.name)}
                    </OText>
                  </View>
                  <View
                    style={{
                      width: '40%',
                      justifyContent: 'flex-end',
                      flexDirection: 'row'
                    }}
                  >
                    <OText>
                      -{parsePrice(event.amount, { isTruncable: true })}
                    </OText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </OrderBill>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={order?.products}
        />
      </OModal>
    </>
  )
}


