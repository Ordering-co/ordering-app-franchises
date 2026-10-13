import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import { GiftCardActions, RedeemCashWallet, TabContainer, RedeemContent, RedeemDivider, RedeemGiftCard, RedeemHeader, RedeemTransactionsList, WrapperBtn } from '../styles'
import { Utils } from '../constants'
import { useConfig, useLanguage, useUtils } from '@components'
import { OButton, OModal, OText } from '@ui'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

export const Redeem = (props: any) => {
  const {
    walletList,
    isWalletCashEnabled,
    isWalletPointsEnabled,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice }] = useUtils()

  const [openModal, setOpenModal] = useState<any>(null)

  const { walletName } = Utils()

  const cashWallet = walletList?.wallets?.find((wallet: any) => wallet.type === 'cash')
  const creditWallet = walletList?.wallets?.find((wallet: any) => wallet.type === 'credit_point')

  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const walletsIds = [
    { type: 'cash', id: cashWallet?.id, active: isWalletCashEnabled },
    { type: 'points', id: creditWallet?.id, active: isWalletPointsEnabled }
  ]

  const handleCustomGoToCheckout = (uuid: any) => {
    setOpenModal(null)
    onNavigationRedirect('CheckoutPage', { cartUuid: uuid })
  }

  return (
    <>
      <TabContainer>
        {!walletList?.loading && !walletList?.error && isWalletPointsEnabled && (
          <RedeemHeader>
            <FastImage
              source={theme.images.general.trophie}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.icon}
            />
            <OText
              color={theme.colors.textNormal}
              size={theme.utils.tsize.xs}
              style={{ textTransform: 'uppercase' }}
            >
              {t('SPECIAL_MEMBER', 'Special member')}
            </OText>
            <OText
              color={theme.colors.textNormal}
              size={64}
              weight={600}
            >
              {creditWallet?.balance}
            </OText>
            <OText
              color={theme.colors.textNormal}
              weight={600}
            >
              {t('AVAILABLE_POINTS', 'Available Points')}
            </OText>
          </RedeemHeader>
        )}
        {!walletList?.loading && !walletList?.error && (isWalletCashEnabled || isWalletPointsEnabled) && (
          <RedeemContent>
            {isWalletCashEnabled && (
              <RedeemCashWallet>
                <OText weight={600} size={theme.utils.tsize.m}>
                  {walletName.cash.name}
                </OText>
                <OText weight={600} size={theme.utils.tsize.l}>
                  {parsePrice(cashWallet?.balance)} {configs?.stripe_currency?.value}
                </OText>
              </RedeemCashWallet>
            )}
            <RedeemTransactionsList
              activeOpacity={1}
              onPress={() => onNavigationRedirect('RewardsTransactions', {
                walletsIds: walletsIds.filter(wallet => wallet.active)
              })}
            >
              <OText
                color={theme.colors.primary}
                style={{ textDecorationLine: 'underline' }}
              >
                {t('TRANSACTION_LIST', 'Transaction List')}
              </OText>
            </RedeemTransactionsList>
            <RedeemDivider />
          </RedeemContent>
        )}
        {walletList?.loading && (
          <RedeemHeader style={{ marginBottom: 20 }}>
            <Placeholder
              Animation={Fade}
              style={{ padding: 10 }}
            >
              <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <PlaceholderLine height={120} width={100} style={{ marginBottom: 0, borderRadius: 10 }} />
                </View>
              </View>
            </Placeholder>
          </RedeemHeader>
        )}
        {!isGiftCardDisabled && (
          <RedeemGiftCard>
            <FastImage
              source={theme.images.general.gift_card}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.gift_card}
            />
            <OText weight={500} size={theme.utils.tsize.l}>
              {t('GIFT_CARD', 'Gift Card')}
            </OText>
            <GiftCardActions>
              <WrapperBtn>
                <OButton
                  text={t('PURCHASE_GIFT_CARD_SHORT', 'Purchase')}
                  imgRightSrc={null}
                  textStyle={styles.btns}
                  style={styles.wrapBtn}
                  onClick={() => onNavigationRedirect('RewardsPurchaseGiftCard', { handleCustomGoToCheckout })}
                />
              </WrapperBtn>
              <WrapperBtn>
                <OButton
                  text={t('REDEEM_GIFT_CARD_SHORT', 'Redeem')}
                  imgRightSrc={null}
                  bgColor={theme.colors.white}
                  style={styles.wrapBtn}
                  borderColor={theme.colors.primary}
                  textStyle={{ color: theme.colors.primary, ...styles.btns }}
                  onClick={() => onNavigationRedirect('RewardsRedeemGiftCard')}
                />
              </WrapperBtn>
            </GiftCardActions>
          </RedeemGiftCard>
        )}
      </TabContainer>
    </>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40
  },
  gift_card: {
    width: 110,
    height: 110
  },
  btns: {
    fontSize: 14,
    marginLeft: 0,
    marginRight: 0
  },
  wrapBtn: {
    paddingLeft: 0,
    paddingRight: 0
  }
})
