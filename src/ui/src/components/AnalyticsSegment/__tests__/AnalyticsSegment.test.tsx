import { Text } from 'react-native'
import { AnalyticsSegment } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockEventBus,
  mockSegmentClient,
  resetAppM9Mocks,
  segmentMock
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('@segment/analytics-react-native', () => require('../../../../../../jest/helpers/appM9TestUtils').segmentMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useEvent: jest.fn(() => [require('../../../../../../jest/helpers/appM9TestUtils').mockEventBus]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: {
      segment_track_id: { value: 'seg-key' }
    }
  }])
}))

const renderSegment = () => renderWithProviders(
  <AnalyticsSegment>
    <Text>segment-child</Text>
  </AnalyticsSegment>
)

describe('AnalyticsSegment', () => {
  afterEach(() => {
    resetAppM9Mocks()
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {
        segment_track_id: { value: 'seg-key' }
      }
    }])
  })

  it('creates a client and renders children when a write key exists', () => {
    const { getByText } = renderSegment()
    expect(getByText('segment-child')).toBeTruthy()
    expect(segmentMock.createClient).toHaveBeenCalledWith({ writeKey: 'seg-key' })
    expect(mockEventBus.on).toHaveBeenCalledWith('products_searched', expect.any(Function))
  })

  it('does not create a client without a write key', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      loading: false,
      configs: {}
    }])
    const { getByText } = renderSegment()
    expect(getByText('segment-child')).toBeTruthy()
    expect(segmentMock.createClient).not.toHaveBeenCalled()
    expect(mockEventBus.on).not.toHaveBeenCalled()
  })

  it('tracks search list view promotion and product clicks', () => {
    renderSegment()
    mockEventBus.trigger('products_searched', 'pizza')
    mockEventBus.trigger('product_list_viewed', {
      business_id: 1,
      id: 4,
      name: 'Pizzas'
    })
    mockEventBus.trigger('promotion_viewed', { id: 8, name: 'Deal', position: 0 })
    mockEventBus.trigger('promotion_clicked', { name: 'Deal', position: 1 })
    mockEventBus.trigger('product_clicked', {
      id: 10,
      name: 'Cheese',
      category_id: 4,
      price: 12
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Products Searched', { query: 'pizza' })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Product List Viewed', {
      business_id: 1,
      category_id: 4,
      category: 'Pizzas'
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Promotion Viewed', {
      promotion_id: '8',
      name: 'Deal',
      position: 0
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Promotion Clicked', {
      promotion_id: '',
      name: 'Deal',
      position: 1
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Product Clicked', {
      id: 10,
      name: 'Cheese',
      category: 4,
      price: 12
    })
  })

  it('tracks cart checkout and product add remove viewed', () => {
    renderSegment()
    const product = {
      id: 10,
      name: 'Cheese',
      category_id: 4,
      price: 12,
      quantity: 2
    }
    const cart = {
      uuid: 'cart-1',
      products: [product],
      business: { name: 'Demo Store' },
      total: 20,
      tax_total: 2,
      delivery_zone_price: 3
    }
    mockEventBus.trigger('product_viewed', product)
    mockEventBus.trigger('product_added', product, cart)
    mockEventBus.trigger('cart_product_removed', product)
    mockEventBus.trigger('cart_viewed', cart)
    mockEventBus.trigger('checkout_started', cart)
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Product Added', expect.objectContaining({
      cart_id: 'cart-1',
      product_id: 10,
      quantity: 2
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Checkout Started', expect.objectContaining({
      cart_id: 'cart-1',
      affiliation: 'Demo Store',
      revenue: 20
    }))
  })

  it('tracks order placed added and completed updates', () => {
    renderSegment()
    const order = {
      id: 99,
      business: { name: 'Demo Store' },
      business_id: 1,
      total: 22,
      tax_total: 2,
      delivery_zone_price: 3,
      paymethod: 'cash',
      history: [{
        data: [{ attribute: 'status', new: 15 }]
      }]
    }
    mockEventBus.trigger('order_placed', order)
    mockEventBus.trigger('order_added', order)
    mockEventBus.trigger('order_updated', order)
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Order Placed', expect.objectContaining({
      order_id: 99
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Payment Info Entered', expect.objectContaining({
      order: 99,
      paymethod: 'cash'
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Order Completed', expect.objectContaining({
      id: 99
    }))
  })

  it('tracks cancelled orders and coupon flows', () => {
    renderSegment()
    mockEventBus.trigger('order_updated', {
      id: 100,
      business: { name: 'Demo Store' },
      total: 10,
      tax_total: 1,
      delivery_zone_price: 2,
      history: [{
        data: [{ attribute: 'status', new: 2 }]
      }]
    })
    mockEventBus.trigger('coupon_entered', { uuid: 'cart-1', coupon: 'SAVE10' })
    mockEventBus.trigger('offer_applied', {
      uuid: 'cart-1',
      offers: [{ type: 2, id: 7, name: 'Save 10', summary: { discount: 10 } }]
    })
    mockEventBus.trigger('offer_denied', {
      business_id: 1,
      coupon: 'BAD',
      user_id: 7,
      reason: 'ERROR_INVALID_COUPON'
    })
    mockEventBus.trigger('offer_denied', {
      business_id: 1,
      coupon: 'BAD2',
      reason: ['ERROR_INVALID_OFFER']
    })
    mockEventBus.trigger('offer_removed', { business_id: 1, offer_id: 7 })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Order Cancelled', expect.objectContaining({
      id: 100
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Coupon Applied', expect.objectContaining({
      coupon_id: 7,
      discount: 10
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Coupon Denied', expect.objectContaining({
      coupon: 'BAD',
      reason: 'ERROR_INVALID_COUPON'
    }))
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Coupon Removed', {
      business_id: 1,
      coupon_id: 7
    })
  })

  it('identifies logins and tracks reviews plus wishlist events', () => {
    renderSegment()
    mockEventBus.trigger('userLogin', { id: 7, email: 'pat@test.com', name: 'Pat' })
    mockEventBus.trigger('product_reviewed', [{
      product_id: 10,
      comment: 'Great',
      qualification: 5
    }])
    mockEventBus.trigger('product_added_to_wishlist', { id: 10 })
    mockEventBus.trigger('product_removed_from_wishlist', { id: 10 })
    mockEventBus.trigger('wishlist_product_added_to_cart', {
      id: 10,
      name: 'Cheese',
      categoryId: 4,
      price: 12,
      quantity: 1
    }, { uuid: 'cart-1' })
    expect(mockSegmentClient.identify).toHaveBeenCalledWith(7, {
      email: 'pat@test.com',
      name: 'Pat'
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith('Product Reviewed', {
      product_id: 10,
      review_body: 'Great',
      rating: 5
    })
    expect(mockSegmentClient.track).toHaveBeenCalledWith(
      'Wishlist Product Added to Cart',
      expect.objectContaining({ cart_id: 'cart-1', product_id: 10 })
    )
  })

  it('unregisters listeners on unmount', () => {
    const { unmount } = renderSegment()
    unmount()
    expect(mockEventBus.off).toHaveBeenCalledWith('products_searched', expect.any(Function))
    expect(mockEventBus.off).toHaveBeenCalledWith('order_placed', expect.any(Function))
  })
})
