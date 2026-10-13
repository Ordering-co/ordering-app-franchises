import { fireEvent } from '@testing-library/react-native'

import RewardsTransactions from '../RewardsTransactions'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../ui/src/components/Rewards/Transactions', () => {
  const React = require('react')
  const { Text, TouchableOpacity, View } = require('react-native')
  return {
    Transactions: (props) => (
      React.createElement(View, { testID: 'rewards-transactions-controller' },
        React.createElement(TouchableOpacity, {
          testID: 'rewards-transactions-nav',
          onPress: () => props.onNavigationRedirect?.('Rewards', { walletId: 1 })
        }),
        React.createElement(TouchableOpacity, {
          testID: 'rewards-transactions-back',
          onPress: () => props.onBack?.()
        }),
        React.createElement(Text, { testID: 'rewards-wallet-id' }, String(props.walletId))
      )
    )
  }
})

describe('RewardsTransactions page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders transaction list with route params', () => {
    const { getByTestId } = renderPage(RewardsTransactions, {
      route: { params: { walletId: 5 } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Transaction List')
    expect(getByTestId('rewards-wallet-id').props.children).toBe('5')
  })

  it('goes back from navbar when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(RewardsTransactions, {
      route: { params: {} }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navigates from transactions controller', () => {
    const { getByTestId, navigation } = renderPage(RewardsTransactions, {
      route: { params: { walletId: 1 } }
    })
    fireEvent.press(getByTestId('rewards-transactions-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('Rewards', { walletId: 1 })
  })
})
