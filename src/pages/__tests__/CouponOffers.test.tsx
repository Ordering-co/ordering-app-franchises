import { fireEvent } from '@testing-library/react-native'
import { useOrder } from '@components'

import CouponOffers from '../CouponOffers'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

describe('CouponOffers page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders coupon offers when cart exists', () => {
    useOrder.mockReturnValue([{
      carts: {
        'businessId:7': { uuid: 'cart-1', business_id: 7, total: 25, products: [{ id: 1 }] }
      }
    }, {}])
    const { getByTestId } = renderPage(CouponOffers, {
      route: { params: { businessId: 7 } }
    })
    expect(getByTestId('navbar-title').props.children).toBe('Offers and coupons')
    expect(getByTestId('coupon-offers-controller')).toBeTruthy()
    expect(getByTestId('coupon-business-id').props.children).toBe('7')
  })

  it('shows not found when cart is missing', () => {
    useOrder.mockReturnValue([{ carts: {} }, {}])
    const { getByTestId } = renderPage(CouponOffers, {
      route: { params: { businessId: 99 } }
    })
    expect(getByTestId('not-found-content').props.children).toBe('Cart not found')
  })

  it('navbar back goes back when possible', () => {
    useOrder.mockReturnValue([{
      carts: { 'businessId:7': { uuid: 'cart-1', business_id: 7, total: 25, products: [] } }
    }, {}])
    const { getByTestId, navigation } = renderPage(CouponOffers, {
      route: { params: { businessId: 7 } }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('navbar back navigates to bottom tab when cannot go back', () => {
    useOrder.mockReturnValue([{
      carts: { 'businessId:7': { uuid: 'cart-1', business_id: 7, total: 25, products: [] } }
    }, {}])
    const { getByTestId, navigation } = renderPage(CouponOffers, {
      route: { params: { businessId: 7 } },
      navigation: { canGoBack: jest.fn(() => false) }
    })
    fireEvent.press(getByTestId('navbar-back'))
    expect(navigation.navigate).toHaveBeenCalledWith('BottomTab')
  })
})
