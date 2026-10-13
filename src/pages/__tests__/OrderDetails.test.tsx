import { fireEvent } from '@testing-library/react-native'

import OrderDetails from '../OrderDetails'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('OrderDetails page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders order number in navbar title', () => {
    const { getByTestId } = renderPage(OrderDetails, {
      route: { params: { orderNumberId: 1234, orderId: 'ord-1' } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Order No. 1234')
    expect(getByTestId('order-details-controller')).toBeTruthy()
  })

  it('navbar back from checkout navigates to home tab', () => {
    const { getByTestId, navigation } = renderPage(OrderDetails, {
      route: { params: { isFromCheckout: true } }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
  })

  it('navbar back from home navigates to home tab', () => {
    const { getByTestId, navigation } = renderPage(OrderDetails, {
      route: { params: { fromHome: true } }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab', { screen: 'Home' })
  })

  it('navbar back uses goBack when possible', () => {
    const { getByTestId, navigation } = renderPage(OrderDetails)
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navbar back falls back to MyOrders screen when cannot go back', () => {
    const { getByTestId, navigation } = renderPage(OrderDetails, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('MyOrders')
  })

  it('handles controller go back and navigation redirect', () => {
    const { getByTestId, navigation } = renderPage(OrderDetails, {
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('order-details-go-back'))
    expect(navigation.goBack).not.toHaveBeenCalled()
    fireEvent.press(getByTestId('order-details-nav'))
    expect(navigation.navigate).toHaveBeenCalledWith('ReviewOrder', { order: { id: 1 } })
    fireEvent.press(getByTestId('order-details-nav-empty'))
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })
})
