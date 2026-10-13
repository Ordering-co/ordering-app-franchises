import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Container,
  SectionLeft,
  SectionRight,
} from './styles'

import {
  PaymentOptionWallet as PaymentOptionWalletController,
  useLanguage,
  useUtils,
  useOrder,
  useConfig
} from '@components'

import { OText } from '../shared'
import {
  getWalletCheckedMap,
  getWalletTogglePlan,
  isVisibleWallet
} from './getWalletCheckboxState'

const PaymentOptionWalletUI = (props: any) => {
  const {
    businessConfigs,
    businessId,
    walletsState,
    selectWallet,
    deletetWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ carts }] = useOrder()
  const [{ parsePrice }] = useUtils()

  const cart = carts?.[`businessId:${businessId}`] ?? {}

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const isBusinessWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
  const isBusinessWalletPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({})

  const creditBalance: any = (wallet: any) => ` = ${parsePrice(wallet.balance / wallet.redemption_rate, { isTruncable: true })}`

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
      isActive: isWalletCashEnabled && isBusinessWalletCashEnabled
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
      isActive: isWalletPointsEnabled && isBusinessWalletPointsEnabled
    }
  }

  const handleOnChange = (wallet: any) => {
    const plan = getWalletTogglePlan(checkedState, wallet)
    if (plan.action === 'select') {
      selectWallet(wallet)
    } else {
      deletetWalletSelected(wallet)
    }

    setCheckedState({
      ...checkedState,
      [plan.walletId]: plan.nextChecked
    })
  }

  useEffect(() => {
    if (!walletsState.loading && walletsState.result?.length) {
      setCheckedState(getWalletCheckedMap(walletsState.result, cart?.payment_events))
    }
  }, [walletsState.result?.length])

  return (
    <>
      {!walletsState.loading &&
        !walletsState.error &&
        walletsState.result?.length > 0 &&
        (
          <>
            {walletsState.result
              ?.filter((w: any) => isVisibleWallet(w, walletName))
              ?.map((wallet: any, idx: any, visibleWallets: any[]) => (
                <Container
                  key={wallet.id}
                  isBottomBorder={idx === visibleWallets.length - 1}
                  disabled={(cart?.balance === 0 && !checkedState[wallet.id]) || wallet.balance === 0}
                  onPress={() => handleOnChange(wallet)}
                >
                  <SectionLeft>
                    <MaterialCommunityIcons
                      name={checkedState[wallet.id] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={25}
                      color={checkedState[wallet.id] ? theme.colors.primary : theme.colors.disabled}
                    />
                    <View style={{ alignItems: 'baseline', marginLeft: 5, width: '80%' }}>
                      <View>
                        <OText
                          style={((cart?.balance === 0 && !checkedState[wallet.id]) || wallet.balance === 0)
                            ? { color: theme.colors.disabled } : {}}
                        >
                          {walletName[wallet.type]?.name}
                        </OText>
                      </View>
                    </View>
                  </SectionLeft>

                  <SectionRight>
                    {wallet.type === 'cash' && (
                      <OText>
                        {parsePrice(wallet?.balance, { isTruncable: true })}
                      </OText>
                    )}
                    {wallet.type === 'credit_point' && (
                      <View>
                        <OText color={theme.colors.primary} weight='bold' style={{ textAlign: 'right' }}>
                          {`${wallet?.balance} ${t('POINTS_SHORT_ABBREVIATION', 'Pts')}`}
                        </OText>
                        <OText>
                          {wallet?.balance > 0
                            ? creditBalance(wallet)
                            : null}
                        </OText>
                      </View>
                    )}
                  </SectionRight>
                </Container>
              ))}
          </>
        )}

      {walletsState?.loading && (
        <View>
          {[...Array(2).keys()].map(i => (
            <View style={{ marginBottom: 10 }} key={i}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} height={40} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            </View>
          ))}
        </View>
      )}
    </>
  )
}

export const PaymentOptionWallet = (props: any) => {
  const paymentWalletProps = {
    ...props,
    UIComponent: PaymentOptionWalletUI
  }

  return (
    <PaymentOptionWalletController {...paymentWalletProps} />
  )
}
