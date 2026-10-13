import { WalletTransactionItem } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockDebitTransaction,
  mockOrderTransaction,
  mockTransaction,
  mockWalletUtils
} from '../../../../../../jest/helpers/appM8TestUtils'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM8TestUtils').mockWalletUtils])
}))

describe('WalletTransactionItem UI', () => {
  it('renders a formatted credit with a description', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactionItem
        item={mockTransaction}
        idx={0}
        type='cash'
        withFormatPrice
      />
    )
    expect(getByText(mockWalletUtils.parseDate(mockTransaction.created_at))).toBeTruthy()
    expect(getByText(`+ ${mockWalletUtils.parsePrice(15)}`)).toBeTruthy()
    expect(getByText('Promo credit')).toBeTruthy()
    expect(getByText('Add money')).toBeTruthy()
  })

  it('renders a debit without a plus sign or formatted price', () => {
    const { getByText, queryByText } = renderWithProviders(
      <WalletTransactionItem
        item={mockDebitTransaction}
        idx={1}
        type='credit_point'
        withFormatPrice={false}
      />
    )
    expect(getByText('-8')).toBeTruthy()
    expect(queryByText('+ -8')).toBeNull()
    expect(getByText('Reduce money')).toBeTruthy()
  })

  it('includes the author and order id in the event copy', () => {
    const { getByText } = renderWithProviders(
      <WalletTransactionItem
        item={mockOrderTransaction}
        idx={2}
        type='cash'
        withFormatPrice
      />
    )
    expect(getByText('Pat Add money in Order No. 101 ')).toBeTruthy()
    expect(getByText('Order credit')).toBeTruthy()
  })
})
