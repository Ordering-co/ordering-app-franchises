import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Header } from '../styles'
import { TransactionsContainer } from './styles'
import { TransactionsController } from './functions'
import { Tabs } from '../../Forms/Tabs'
import { Utils } from '../constants'
import { TransactionItem } from './Item'

import { useLanguage } from '@components'
import { AnimatedItem, NotFoundSource } from '@ui'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

const TransactionsUI = (props: any) => {
  const {
    walletsIds,
    transactions,
    walletSelected,
    setWalletSelected
  } = props

  const [, t] = useLanguage()
  const { getTransactionsTabs } = Utils()

  const tabs = getTransactionsTabs(walletsIds)

  return (
    <>
      {tabs?.length > 1 && (
        <Header>
          <Tabs
            defaultTab={walletSelected}
            defaultTabs={tabs}
            handleChangeTab={(val: any) => transactions?.loading ? null : setWalletSelected(val)}
          />
        </Header>
      )}
      <TransactionsContainer>
        {!transactions?.loading && !!transactions.list?.[`wallet:${walletSelected}`]?.length && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={transactions.list?.[`wallet:${walletSelected}`]}
            keyExtractor={(business: any) => business?.id}
            renderItem={({ item, index }: any) => (
              <AnimatedItem
                index={index}
                item={
                  <TransactionItem
                    item={item}
                    withFormatPrice={walletsIds?.find((w: any) => w.id === walletSelected)?.type === 'cash'}
                  />
                }
              />
            )}
          />
        )}
        {transactions?.loading && (
          [...Array(6)].map((_, i) => (
            <LoadingComponent key={i} />
          ))
        )}

        {!transactions?.loading && (
          !transactions.list?.[`wallet:${walletSelected}`]?.length ||
          transactions?.error
        ) && (
            <NotFoundSource
              simple
              content={transactions?.error
                ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
                : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
              }
            />
          )}
      </TransactionsContainer>
    </>
  )
}

const LoadingComponent = () => {
  const theme = useTheme()
  return (
    <Placeholder
      Animation={Fade}
      style={{
        marginBottom: 20,
        borderWidth: .5,
        borderRadius: 10,
        padding: 10,
        borderColor: theme.colors.border
      }}
    >
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <PlaceholderLine height={53} width={18} style={{ ...styles.skeleton, marginBottom: 0 }} />
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', width: '80%', marginLeft: '2%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <PlaceholderLine height={20} width={65} style={styles.skeleton} />
              <PlaceholderLine height={20} width={15} style={styles.skeleton} />
            </View>
            <PlaceholderLine height={20} width={80} style={{ ...styles.skeleton, marginBottom: 0 }} />
          </View>
        </View>
      </View>
    </Placeholder>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: 10,
    borderRadius: 5
  }
})

export const Transactions = (props: any) => {
  const transactionsProps = {
    ...props,
    UIComponent: TransactionsUI
  }
  return (
    <TransactionsController {...transactionsProps} />
  )
}
