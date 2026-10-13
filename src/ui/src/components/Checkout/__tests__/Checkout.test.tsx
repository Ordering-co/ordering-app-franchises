import { AppState } from 'react-native'
import { Checkout } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@stripe/stripe-react-native', () => require('../../../../../../jest/helpers/appM5TestUtils').stripeNativeMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  Checkout: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'checkout-controller' }, 'Checkout')
  },
  useSession: jest.fn(() => [{ token: null, user: null, loading: false }, { login: jest.fn() }])
}))

describe('Checkout UI', () => {
  beforeEach(() => {
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('loads checkout controller wiring without fetching an order', () => {
    const { getByTestId } = renderWithProviders(
      <Checkout
        cartUuid='cart-1'
        token={null}
        onNavigationRedirect={jest.fn()}
        showGateway={{ open: false }}
      />
    )
    expect(getByTestId('checkout-controller')).toBeTruthy()
  })

  it('toasts checkout errors from the wrapper', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])

    renderWithProviders(
      <Checkout
        cartUuid='cart-1'
        errors={[{ message: 'Missing address' }]}
        clearErrors={jest.fn()}
        onNavigationRedirect={jest.fn()}
        showGateway={{ open: false }}
      />
    )

    expect(showToast).toHaveBeenCalled()
  })
})
