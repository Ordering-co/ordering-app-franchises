import { fireEvent } from '@testing-library/react-native'
import { useBusiness } from '@components'

import MyOrders from '../MyOrders'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('../../config.js', () => ({
  __esModule: true,
  default: { franchiseSlug: 'franchise-a' }
}))

describe('MyOrders page', () => {
  beforeEach(() => {
    setupPageTestEnv()
    useBusiness.mockReturnValue([{ business: { id: 99 } }])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders orders list with franchise and business context', () => {
    const { getByTestId } = renderPage(MyOrders)
    expect(getByTestId('navbar-title').props.children).toBe('My Orders')
    expect(getByTestId('my-orders-franchise-id').props.children).toBe('franchise-a')
    expect(getByTestId('my-orders-controller')).toBeTruthy()
  })

  it('navbar back navigates to profile tab', () => {
    const { getByTestId, navigation } = renderPage(MyOrders)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Profile' })
  })

  it('navigates on redirect and skips empty page', () => {
    const { getByTestId, navigation } = renderPage(MyOrders)
    fireEvent.press(getByTestId('my-orders-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('OrderDetails', { orderId: 5 })
    fireEvent.press(getByTestId('my-orders-nav-empty'))
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('redirects to checkout when cart uuid is provided', () => {
    const { getByTestId, navigation } = renderPage(MyOrders)
    fireEvent.press(getByTestId('my-orders-checkout'))
    expect(navigation.navigate).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-uuid' })
    fireEvent.press(getByTestId('my-orders-checkout-empty'))
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('goes back only when navigation can go back', () => {
    const { getByTestId, navigation } = renderPage(MyOrders, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('my-orders-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
  })
})
