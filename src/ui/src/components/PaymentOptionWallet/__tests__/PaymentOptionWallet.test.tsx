import { fireEvent } from '@testing-library/react-native'
import { PaymentOptionWallet } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockUtils } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM5TestUtils').placeholderMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockUtils]),
  useConfig: jest.fn(() => [{
    configs: require('../../../../../../jest/helpers/appM5TestUtils').mockWalletConfigs
  }]),
  useOrder: jest.fn(() => [{
    carts: {
      'businessId:1': {
        ...require('../../../../../../jest/helpers/appM5TestUtils').mockCheckoutCart,
        balance: 12,
        payment_events: []
      }
    }
  }, {}]),
  PaymentOptionWallet: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { paymentOptionWalletUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...paymentOptionWalletUIProps,
      ...rest
    })
  }
}))

describe('PaymentOptionWallet UI', () => {
  it('renders a cash wallet and selects it', () => {
    const selectWallet = jest.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptionWallet selectWallet={selectWallet} />
    )
    expect(getByText('Pay with Cash Wallet')).toBeTruthy()
    expect(getByText(mockUtils.parsePrice(20, { isTruncable: true }))).toBeTruthy()
    fireEvent.press(getByText('Pay with Cash Wallet'))
    expect(selectWallet).toHaveBeenCalled()
  })

  it('renders credit points wallet', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptionWallet
        walletsState={{
          loading: false,
          error: null,
          result: [{ id: 3, type: 'credit_point', valid: true, balance: 40, redemption_rate: 2 }]
        }}
      />
    )
    expect(getByText('Pay with Credit Points Wallet')).toBeTruthy()
    expect(getByText('40 Pts')).toBeTruthy()
  })

  it('renders wallet loading placeholders', () => {
    const { toJSON } = renderWithProviders(
      <PaymentOptionWallet
        walletsState={{ loading: true, error: null, result: [] }}
      />
    )
    expect(toJSON()).toBeTruthy()
  })
})
