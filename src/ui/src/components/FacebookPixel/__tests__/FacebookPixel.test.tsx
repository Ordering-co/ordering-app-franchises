import { Text } from 'react-native'
import { FacebookPixel } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  facebookSdkMock,
  mockEventBus,
  resetAppM9Mocks
} from '../../../../../../jest/helpers/appM9TestUtils'

jest.mock('react-native-fbsdk-next', () => require('../../../../../../jest/helpers/appM9TestUtils').facebookSdkMock)
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useEvent: jest.fn(() => [require('../../../../../../jest/helpers/appM9TestUtils').mockEventBus]),
  useConfig: jest.fn(() => [{
    stripe_currency: { value: 'USD' }
  }])
}))

const renderPixel = () => renderWithProviders(
  <FacebookPixel>
    <Text>pixel-child</Text>
  </FacebookPixel>
)

describe('FacebookPixel', () => {
  afterEach(() => {
    resetAppM9Mocks()
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      stripe_currency: { value: 'USD' }
    }])
  })

  it('renders children and registers event listeners', () => {
    const { getByText } = renderPixel()
    expect(getByText('pixel-child')).toBeTruthy()
    expect(mockEventBus.on).toHaveBeenCalledWith('userLogin', expect.any(Function))
    expect(mockEventBus.on).toHaveBeenCalledWith('product_added', expect.any(Function))
    expect(mockEventBus.on).toHaveBeenCalledWith('order_placed', expect.any(Function))
  })

  it('logs login and signup registration events', () => {
    renderPixel()
    mockEventBus.trigger('userLogin')
    mockEventBus.trigger('singup_user')
    expect(facebookSdkMock.AppEventsLogger.logEvent).toHaveBeenCalledWith(
      'CompletedRegistration',
      expect.objectContaining({ fb_registration_method: 'login' })
    )
    expect(facebookSdkMock.AppEventsLogger.logEvent).toHaveBeenCalledWith(
      'CompletedRegistration',
      expect.objectContaining({ fb_registration_method: 'signup' })
    )
  })

  it('logs add-to-cart with currency and quantity', () => {
    renderPixel()
    mockEventBus.trigger('product_added', {
      id: 10,
      name: 'Pizza',
      total: 12,
      quantity: 2
    })
    expect(facebookSdkMock.AppEventsLogger.logEvent).toHaveBeenCalledWith(
      'AddedToCart',
      12,
      expect.objectContaining({
        fb_description: 'Pizza',
        fb_currency: 'USD',
        fb_content_id: 10,
        fb_quantity: 2
      })
    )
  })

  it('logs product edits using price when total is missing', () => {
    const { useConfig } = require('@components')
    useConfig.mockReturnValue([{
      stripe_currency: { value: 'EUR' }
    }])
    renderPixel()
    mockEventBus.trigger('product_edited', {
      id: 11,
      name: 'Salad',
      price: 8,
      quantity: 1
    })
    expect(facebookSdkMock.AppEventsLogger.logEvent).toHaveBeenCalledWith(
      'CustomizeProduct',
      8,
      expect.objectContaining({
        fb_currency: 'EUR',
        fb_content_id: 11
      })
    )
  })

  it('logs payment info and purchases', () => {
    renderPixel()
    mockEventBus.trigger('add_payment_option', { gateway: 'stripe', id: 'pm_1' })
    mockEventBus.trigger('order_placed', { id: 99, total: 22 })
    expect(facebookSdkMock.AppEventsLogger.logEvent).toHaveBeenCalledWith(
      'AddedPaymentInfo',
      expect.objectContaining({
        fb_content_type: 'stripe',
        fb_content_id: 'pm_1'
      })
    )
    expect(facebookSdkMock.AppEventsLogger.logPurchase).toHaveBeenCalledWith(
      22,
      'USD',
      { param: 'value', id: 99 }
    )
  })

  it('unregisters listeners on unmount', () => {
    const { unmount } = renderPixel()
    unmount()
    expect(mockEventBus.off).toHaveBeenCalledWith('userLogin', expect.any(Function))
    expect(mockEventBus.off).toHaveBeenCalledWith('product_added', expect.any(Function))
    expect(mockEventBus.off).toHaveBeenCalledWith('order_placed', expect.any(Function))
  })
})
