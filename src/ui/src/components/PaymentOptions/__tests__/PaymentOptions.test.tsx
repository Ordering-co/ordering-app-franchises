import { fireEvent } from '@testing-library/react-native'
import { PaymentOptions } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockPaymethodCash } from '../../../../../../jest/helpers/appM5TestUtils'

const mockHandleRedirect = jest.fn()
const mockHandlePaymethodClick = jest.fn()
const mockChangePaymethod = jest.fn(async () => true)

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@stripe/stripe-react-native', () => require('../../../../../../jest/helpers/appM5TestUtils').stripeNativeMock)
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM5TestUtils').placeholderMock)
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockOrderingApi, {}]),
  useSession: jest.fn(() => [{ user: { id: 1 }, token: 'tok_test' }, {}]),
  useOrder: jest.fn(() => [
    {
      carts: {
        'businessId:1': require('../../../../../../jest/helpers/appM5TestUtils').mockCheckoutCart
      },
      loading: false
    },
    { changePaymethod: mockChangePaymethod, confirmCart: jest.fn(async () => ({ error: false, result: {} })) }
  ]),
  PaymentOptions: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { paymentOptionsUIProps } = require('../../../../../../jest/helpers/appM5TestUtils')
    return React.createElement(UIComponent, {
      ...paymentOptionsUIProps,
      handleRedirect: mockHandleRedirect,
      handlePaymethodClick: mockHandlePaymethodClick,
      ...rest
    })
  }
}))

describe('PaymentOptions UI', () => {
  beforeEach(() => {
    mockHandleRedirect.mockClear()
    mockHandlePaymethodClick.mockClear()
    mockChangePaymethod.mockClear()
  })

  it('renders paymethods and opens payment details', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptions businessId={1} />
    )
    expect(getByText('Select payment method')).toBeTruthy()
    expect(getByText('Cash')).toBeTruthy()
    fireEvent.press(getByText('Cash'))
    expect(mockHandleRedirect).toHaveBeenCalledWith('PaymentDetails', expect.objectContaining({
      businessId: 1,
      paymethodSelected: mockPaymethodCash
    }))
  })

  it('shows an empty payment methods state', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptions
        paymethodsList={{ loading: false, error: null, paymethods: [] }}
      />
    )
    expect(getByText('No payment methods!')).toBeTruthy()
  })

  it('shows payment method errors', () => {
    const { getByText } = renderWithProviders(
      <PaymentOptions
        paymethodsList={{ loading: false, error: [{ message: 'Gateway down' }], paymethods: [] }}
      />
    )
    expect(getByText('Gateway down')).toBeTruthy()
  })
})
