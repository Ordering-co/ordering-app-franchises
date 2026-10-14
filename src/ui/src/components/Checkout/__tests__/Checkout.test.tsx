import { AppState } from 'react-native'
import { fireEvent } from '@testing-library/react-native'
import { Checkout } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const mockCheckoutUIPropsRef = { current: null }

jest.mock('@ui', () => ({
  ...require('../../../../../../jest/helpers/franchiseAppUiMock'),
  OrderSummary: () => null,
  PaymentOptionWallet: () => null,
  SignupForm: () => null,
  LoginForm: () => null,
  UserDetails: () => null
}))
jest.mock('@stripe/stripe-react-native', () => require('../../../../../../jest/helpers/appM5TestUtils').stripeNativeMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  Checkout: ({ UIComponent, ...props }) => {
    const React = require('react')
    const { Text } = require('react-native')
    if (mockCheckoutUIPropsRef.current) {
      return React.createElement(UIComponent, { ...props, ...mockCheckoutUIPropsRef.current })
    }
    return React.createElement(Text, { testID: 'checkout-controller' }, 'Checkout')
  },
  useSession: jest.fn(() => [{ token: null, user: null, loading: false }, { login: jest.fn() }])
}))
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: jest.fn(() => true)
}))

describe('Checkout UI', () => {
  beforeEach(() => {
    mockCheckoutUIPropsRef.current = null
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

  it('disables a persisted guest CTA and rejects a retained PaymentOptions callback after revocation', () => {
    const { useConfig, useOrder, useSession, useUtils } = require('@components')
    const configsRef = {
      current: {
        guest_checkout_enabled: { value: '1' },
        allowed_order_types_guest_checkout: { value: ['delivery'] }
      }
    }
    const handlerClickPlaceOrder = jest.fn()
    const onNavigationRedirect = jest.fn()
    const cart = {
      uuid: 'cart-1',
      business_id: 1,
      balance: 10,
      valid: true,
      valid_maximum: true,
      valid_minimum: true,
      valid_address: true,
      valid_products: true,
      products: [],
      offers: [],
      total: 10,
      status: 0
    }
    mockCheckoutUIPropsRef.current = {
      cart,
      cartState: { loading: false, cart },
      cartUuid: cart.uuid,
      checkoutFieldsState: { fields: [] },
      loyaltyPlansState: { result: [] },
      businessDetails: { business: { paymethods: [], configs: [] } },
      handlerClickPlaceOrder,
      setPlaceSpotNumber: jest.fn(),
      maxDate: new Date(),
      onNavigationRedirect,
      showGateway: { open: false },
      setShowGateway: jest.fn(),
      handlePaymethodChange: jest.fn(),
      globalPayIFrameUrl: null,
      cybersourceIFrameUrl: null,
      createBusinessUserPaymethod: jest.fn()
    }
    useConfig.mockReturnValue([{ configs: configsRef.current }])
    useOrder.mockReturnValue([
      { options: { type: 1 }, carts: [], loading: false },
      { changePaymethod: jest.fn(), confirmCart: jest.fn() }
    ])
    useSession.mockReturnValue([{ token: 'token', user: { guest_id: 'guest' }, loading: false }, { login: jest.fn() }])
    useUtils.mockReturnValue([{
      parsePrice: jest.fn(() => '10'),
      parseDate: jest.fn(),
      GiftCardPaymethods: []
    }])

    const view = renderWithProviders(
      <Checkout
        cartUuid={cart.uuid}
        onNavigationRedirect={onNavigationRedirect}
        showGateway={{ open: false }}
        clearErrors={jest.fn()}
      />
    )

    const placeButton = view.getByTestId('floating-button')
    expect(placeButton.props.disabled).toBeFalsy()
    fireEvent.press(placeButton)
    const paymentOptions = onNavigationRedirect.mock.calls.find(([route]) => route === 'PaymentOptions')
    expect(paymentOptions).toBeTruthy()
    const retainedPlaceOrder = paymentOptions[1].handlePlaceOrder

    configsRef.current = {}
    useConfig.mockReturnValue([{ configs: configsRef.current }])
    view.rerender(
      <Checkout
        cartUuid={cart.uuid}
        onNavigationRedirect={onNavigationRedirect}
        showGateway={{ open: false }}
        clearErrors={jest.fn()}
      />
    )

    expect(view.getAllByText('Login/Sign up to complete your order.').length).toBeGreaterThan(0)
    onNavigationRedirect.mockClear()
    fireEvent.press(view.getByTestId('floating-button'))
    expect(onNavigationRedirect).not.toHaveBeenCalled()
    retainedPlaceOrder(null, true)
    expect(handlerClickPlaceOrder).not.toHaveBeenCalled()
  })
})
