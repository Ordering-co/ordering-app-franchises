import { WalletTransactions } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCreditWallet,
  mockTransaction,
  mockWallet
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/appM8TestUtils').walletTransactionsUiMock)
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM8TestUtils').placeholderMock)

const walletKey = `wallet:${mockWallet.id}`

describe('WalletTransactions UI', () => {
  it('renders a wallet history list', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockWallet}
        transactionsList={{
          loading: false,
          error: null,
          list: {
            [walletKey]: [mockTransaction]
          }
        }}
      />
    )
    expect(getByText('Transactions history')).toBeTruthy()
    expect(getByTestId('wallet-tx-301')).toBeTruthy()
    expect(getByText('cash-0-Promo credit')).toBeTruthy()
  })

  it('formats cash wallets and uses the selected wallet type', () => {
    const creditKey = `wallet:${mockCreditWallet.id}`
    const { getByText } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockCreditWallet}
        transactionsList={{
          loading: false,
          error: null,
          list: {
            [creditKey]: [{ ...mockTransaction, id: 401, description: 'Points' }]
          }
        }}
      />
    )
    expect(getByText('credit_point-0-Points')).toBeTruthy()
  })

  it('shows placeholders while transactions load', () => {
    const { getAllByTestId, queryByText } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockWallet}
        transactionsList={{
          loading: true,
          error: null,
          list: {}
        }}
      />
    )
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
    expect(queryByText('Transactions history')).toBeNull()
  })

  it('shows placeholders when the wallet list is missing', () => {
    const { getAllByTestId, getByText } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockWallet}
        transactionsList={{
          loading: false,
          error: null,
          list: {}
        }}
      />
    )
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
    expect(getByText('No transactions to show at this time.')).toBeTruthy()
  })

  it('shows an empty history message', () => {
    const { getByText, queryByText } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockWallet}
        transactionsList={{
          loading: false,
          error: null,
          list: {
            [walletKey]: []
          }
        }}
      />
    )
    expect(getByText('No transactions to show at this time.')).toBeTruthy()
    expect(queryByText('Transactions history')).toBeNull()
  })

  it('shows an error message when the list fails', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactions
        currentWalletSelected={mockWallet}
        transactionsList={{
          loading: false,
          error: ['failed'],
          list: {
            [walletKey]: []
          }
        }}
      />
    )
    expect(getByText('Sorry, an error has occurred')).toBeTruthy()
  })
})
