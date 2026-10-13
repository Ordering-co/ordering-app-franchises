import { fireEvent } from '@testing-library/react-native'
import { Redeem } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import {
  mockErrorWalletList,
  mockGiftDisabledConfigs,
  mockLoadingWalletList,
  mockRewardsConfigs,
  mockWalletList
} from '../../../../../../../jest/helpers/appM9RewardsTestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').appM9UiMock)
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../../jest/helpers/appM9RewardsTestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockUtils]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../../jest/helpers/appM9RewardsTestUtils').mockRewardsConfigs
  }])
}))

const renderRedeem = (props = {}) => renderWithProviders(
  <Redeem
    walletList={mockWalletList}
    isWalletCashEnabled
    isWalletPointsEnabled
    onNavigationRedirect={jest.fn()}
    {...props}
  />
)

describe('Redeem UI', () => {
  afterEach(() => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockRewardsConfigs
    }])
  })

  it('renders points cash balance and gift card actions', () => {
    const { getByText } = renderRedeem()
    expect(getByText('Special member')).toBeTruthy()
    expect(getByText('40')).toBeTruthy()
    expect(getByText('Available Points')).toBeTruthy()
    expect(getByText('Cash Wallet')).toBeTruthy()
    expect(getByText('$12.5 USD')).toBeTruthy()
    expect(getByText('Transaction List')).toBeTruthy()
    expect(getByText('Gift Card')).toBeTruthy()
    expect(getByText('Purchase')).toBeTruthy()
    expect(getByText('Redeem')).toBeTruthy()
  })

  it('shows a loading placeholder instead of wallet totals', () => {
    const { getAllByTestId, queryByText } = renderRedeem({
      walletList: mockLoadingWalletList
    })
    expect(getAllByTestId('placeholder').length).toBeGreaterThan(0)
    expect(queryByText('Special member')).toBeNull()
    expect(queryByText('Cash Wallet')).toBeNull()
  })

  it('hides wallet totals when the list fails', () => {
    const { queryByText, getByText } = renderRedeem({
      walletList: mockErrorWalletList
    })
    expect(queryByText('Special member')).toBeNull()
    expect(queryByText('Cash Wallet')).toBeNull()
    expect(getByText('Gift Card')).toBeTruthy()
  })

  it('hides points when only cash is enabled', () => {
    const { queryByText, getByText } = renderRedeem({
      isWalletPointsEnabled: false
    })
    expect(queryByText('Special member')).toBeNull()
    expect(getByText('Cash Wallet')).toBeTruthy()
    expect(getByText('Transaction List')).toBeTruthy()
  })

  it('opens the transaction list for active wallets', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderRedeem({ onNavigationRedirect })
    fireEvent.press(getByText('Transaction List'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('RewardsTransactions', {
      walletsIds: [
        { type: 'cash', id: 11, active: true },
        { type: 'points', id: 22, active: true }
      ]
    })
  })

  it('opens purchase and redeem gift card flows', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText } = renderRedeem({ onNavigationRedirect })
    fireEvent.press(getByText('Purchase'))
    expect(onNavigationRedirect).toHaveBeenCalledWith(
      'RewardsPurchaseGiftCard',
      expect.objectContaining({ handleCustomGoToCheckout: expect.any(Function) })
    )
    fireEvent.press(getByText('Redeem'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('RewardsRedeemGiftCard')
  })

  it('hides gift cards when the store flag is disabled', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: mockGiftDisabledConfigs
    }])
    const { queryByText, getByText } = renderRedeem()
    expect(queryByText('Gift Card')).toBeNull()
    expect(queryByText('Purchase')).toBeNull()
    expect(getByText('Special member')).toBeTruthy()
  })
})
