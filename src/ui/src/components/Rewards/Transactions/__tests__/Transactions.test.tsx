import { fireEvent } from '@testing-library/react-native'
import { Transactions } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockDebitTransaction,
  mockTransaction,
  mockWalletsIds,
  transactionsUIProps
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils])
}))
jest.mock('../functions', () => ({
  TransactionsController: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { transactionsUIProps } = require('../../../../../../../jest/helpers/appM9RewardsTestUtils')
    return React.createElement(UIComponent, { ...transactionsUIProps, ...rest })
  }
}))

const renderTransactions = (props = {}) => renderWithProviders(
  <Transactions {...transactionsUIProps} {...props} />
)

describe('Transactions UI', () => {
  it('renders cash transactions and wallet tabs', () => {
    const { getByText } = renderTransactions()
    expect(getByText('Cash')).toBeTruthy()
    expect(getByText('Points')).toBeTruthy()
    expect(getByText('2026-09-07 16:00:00')).toBeTruthy()
    expect(getByText('+ $15')).toBeTruthy()
    expect(getByText('Promo credit')).toBeTruthy()
  })

  it('formats point amounts without a currency prefix', () => {
    const { getByText, queryByText } = renderTransactions({
      walletSelected: 22,
      transactions: {
        loading: false,
        error: null,
        list: {
          'wallet:22': [mockDebitTransaction]
        }
      }
    })
    expect(getByText('-8')).toBeTruthy()
    expect(queryByText('Promo credit')).toBeNull()
  })

  it('shows skeletons while transactions load', () => {
    const { getAllByTestId, queryByText } = renderTransactions({
      transactions: { loading: true, error: null, list: {} }
    })
    expect(getAllByTestId('placeholder').length).toBe(6)
    expect(queryByText('Promo credit')).toBeNull()
  })

  it('shows an empty transactions message', () => {
    const { getByText } = renderTransactions({
      transactions: {
        loading: false,
        error: null,
        list: { 'wallet:11': [] }
      }
    })
    expect(getByText('No transactions to show at this time.')).toBeTruthy()
  })

  it('shows a transactions error', () => {
    const { getByText } = renderTransactions({
      transactions: {
        loading: false,
        error: ['failed'],
        list: { 'wallet:11': [] }
      }
    })
    expect(getByText('Sorry, an error has occurred')).toBeTruthy()
  })

  it('changes wallet tab when the list is idle', () => {
    const setWalletSelected = jest.fn()
    const { getByText } = renderTransactions({ setWalletSelected })
    fireEvent.press(getByText('Points'))
    expect(setWalletSelected).toHaveBeenCalledWith(22)
  })

  it('ignores tab changes while transactions load', () => {
    const setWalletSelected = jest.fn()
    const { getByText } = renderTransactions({
      setWalletSelected,
      transactions: { loading: true, error: null, list: {} }
    })
    fireEvent.press(getByText('Points'))
    expect(setWalletSelected).not.toHaveBeenCalled()
  })

  it('hides tabs for a single wallet', () => {
    const { queryByText, getByText } = renderTransactions({
      walletsIds: [{ type: 'cash', id: 11, active: true }],
      transactions: {
        loading: false,
        error: null,
        list: { 'wallet:11': [mockTransaction] }
      }
    })
    expect(queryByText('Cash')).toBeNull()
    expect(queryByText('Points')).toBeNull()
    expect(getByText('Promo credit')).toBeTruthy()
  })
})
