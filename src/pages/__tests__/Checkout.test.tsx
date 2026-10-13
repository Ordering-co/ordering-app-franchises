import { act, fireEvent } from '@testing-library/react-native'
import { useBusinessSelected } from '@ui'

import CheckoutPage from '../Checkout'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

const mockHandleOrderRedirect = jest.fn()
const mockHandleStripePayment = jest.fn()
const mockHandleRedirectPaymentCheckout = jest.fn()

jest.mock('../../utils', () => ({
  checkoutPaymentUtilities: jest.fn(() => ({
    handleOrderRedirect: mockHandleOrderRedirect,
    handleStripePayment: mockHandleStripePayment,
    handleRedirectPaymentCheckout: mockHandleRedirectPaymentCheckout
  }))
}))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: {
    franchiseSlug: 'franchise-a',
    app_scheme: 'orderingapp'
  }
}))

describe('Checkout page', () => {
  beforeEach(() => {
    setupPageTestEnv({
      config: [{
        configs: {
          max_days_preorder: { key: 'max_days_preorder', value: '3' },
          preorder_maximum_days: {
            key: 'preorder_maximum_days',
            value: 'catering_delivery,5|catering_pickup,7'
          }
        }
      }]
    })
    useBusinessSelected.mockReturnValue([
      { id: 9, slug: 'demo-store' },
      {}
    ])
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders checkout with route params', () => {
    const { getByTestId } = renderPage(CheckoutPage, {
      route: {
        params: {
          cartUuid: 'cart-abc',
          businessLogo: 'logo.png',
          businessName: 'Store',
          cartTotal: 25,
          fromProductsList: true
        }
      }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Does everything look right?')
    expect(getByTestId('checkout-controller')).toBeTruthy()
  })

  it('navbar back navigates to upselling page', () => {
    const { getByTestId, navigation } = renderPage(CheckoutPage, {
      pageProps: { cartProducts: [{ id: 1 }] }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('UpsellingPage', {
      business: { id: 9, slug: 'demo-store' },
      businessId: 9,
      cartProducts: [{ id: 1 }]
    })
  })

  it('redirects existing order on place order click', () => {
    const { getByTestId, navigation } = renderPage(CheckoutPage)
    fireEvent.press(getByTestId('checkout-place-order-existing'))
    expect(mockHandleOrderRedirect).toHaveBeenCalledWith({
      orderId: 'ord-1',
      navigation
    })
  })

  it('handles stripe and redirect payment flows', async () => {
    const { getByTestId } = renderPage(CheckoutPage)
    await act(async () => {
      fireEvent.press(getByTestId('checkout-place-order-stripe'))
    })
    expect(mockHandleStripePayment).toHaveBeenCalled()
    await act(async () => {
      fireEvent.press(getByTestId('checkout-place-order-redirect'))
    })
    expect(mockHandleRedirectPaymentCheckout).toHaveBeenCalledWith('https://pay.test')
  })

  it('navigates on redirect and ignores empty page', () => {
    const { getByTestId, navigation } = renderPage(CheckoutPage)
    fireEvent.press(getByTestId('checkout-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('PaymentOptions', { cartUuid: 'c1' })
    fireEvent.press(getByTestId('checkout-nav-empty'))
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })
})
