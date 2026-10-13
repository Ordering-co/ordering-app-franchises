import React, { useState } from 'react'
import { RefreshControl } from 'react-native'

import { Container, Content, Header, WrapperNoAuth } from './styles'
import { Utils } from './constants'
import { Tabs } from '../Forms/Tabs'
import { Redeem } from './Redeem'
import { Status } from './Status'
import { Offers } from './Offers'

import { WalletList, useConfig, useSession, useLanguage } from '@components'
import { NotFoundSource } from '@ui'

const RewardsUI = (props: any) => {
  const {
    walletList,
    setRefresh,
    onNavigationRedirect
  } = props

  const { TABS, TABS_OPTIONS } = Utils()
  const [{ auth }] = useSession()
  const [, t] = useLanguage()

  const [tabState, setTabState] = useState(TABS_OPTIONS.REDEEM)
  const [refreshing] = useState(false)

  const onRefresh = () => {
    setRefresh(true)
    setTimeout(() => {
      setRefresh(false)
    }, 1000)
  }

  return (
    <>
      {auth ? (
        <>
          <Header>
            <Tabs
              defaultTab={tabState}
              defaultTabs={TABS}
              handleChangeTab={(val: string) => setTabState(val)}
            />
          </Header>
          <Container
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
          >
            <Content>
              {tabState === TABS_OPTIONS.REDEEM && (
                <Redeem
                  walletList={walletList}
                  isWalletCashEnabled={props.isWalletCashEnabled}
                  isWalletPointsEnabled={props.isWalletPointsEnabled}
                  transactionsList={props.transactionsList}
                  onNavigationRedirect={onNavigationRedirect}
                />
              )}
              {tabState === TABS_OPTIONS.STATUS && (
                <Status
                  userLoyaltyLevel={props.userLoyaltyLevel}
                  levelList={props.levelList}
                />
              )}
              {tabState === TABS_OPTIONS.OFFERS && (
                <Offers
                  handleBusinessClick={props.handleBusinessClick}
                  franchiseId={props.franchiseId}
                />
              )}
            </Content>
          </Container>
        </>
      ) : (
        <WrapperNoAuth>
          <NotFoundSource
            simple
            content={t('LOGIN_REQUIRED_FOR_REWARDS', 'You must be logged in to see the Rewards')}
          />
        </WrapperNoAuth>
      )}
    </>
  )
}

export const Rewards = (props: any) => {
  const [{ configs }] = useConfig()
  const [refresh, setRefresh] = useState(false)

  const walletsProps = {
    ...props,
    UIComponent: RewardsUI,
    notFetchTransactionsInWallets: true,
    fetchLevels: true,
    refresh,
    setRefresh,
    isWalletCashEnabled: configs?.wallet_cash_enabled?.value === '1',
    isWalletPointsEnabled: configs?.wallet_credit_point_enabled?.value === '1'
  }
  return (
    <WalletList {...walletsProps} />
  )
}
