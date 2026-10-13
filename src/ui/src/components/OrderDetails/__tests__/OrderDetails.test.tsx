import { BackHandler, Linking } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { OrderDetails } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCompletedOrder,
  mockDriver,
  mockOrder
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('react-native-linear-gradient', () => {
  const React = require('react')
  const { View } = require('react-native')
  return ({ children }) => React.createElement(View, { testID: 'linear-gradient' }, children)
})
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM6TestUtils').placeholderMock)
jest.mock('../Bill', () => ({
  Bill: () => {
    const React = require('react')
    const { View } = require('react-native')
    return React.createElement(View, { testID: 'order-bill' })
  }
}))
jest.mock('../OrderEta', () => ({
  OrderEta: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'order-eta' }, 'ETA')
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: require('../../../../../../jest/helpers/appM6TestUtils').mockConfigs
  }]),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM6TestUtils').mockUtils]),
  OrderDetails: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { orderDetailsUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...orderDetailsUIProps, ...rest })
  }
}))

describe('OrderDetails UI', () => {
  beforeEach(() => {
    jest.spyOn(BackHandler, 'addEventListener').mockReturnValue({ remove: jest.fn() })
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders an in progress delivery order and opens help', () => {
    const onNavigationRedirect = jest.fn()
    const readMessages = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <OrderDetails
        order={{ order: mockOrder, loading: false, error: null }}
        onNavigationRedirect={onNavigationRedirect}
        readMessages={readMessages}
      />
    )
    expect(getByText('Estimated Time')).toBeTruthy()
    expect(getByText('Help')).toBeTruthy()
    expect(getByText('Pending')).toBeTruthy()
    expect(getByText('Delivery Preference')).toBeTruthy()
    expect(getByText('Leave at door')).toBeTruthy()
    expect(getByText('Comment')).toBeTruthy()
    expect(getByText('Total')).toBeTruthy()
    expect(getByText('$18.5')).toBeTruthy()
    expect(getByTestId('order-bill')).toBeTruthy()
    expect(getByTestId('powered-by')).toBeTruthy()
    fireEvent.press(getByText('Help'))
    expect(readMessages).toHaveBeenCalled()
    expect(onNavigationRedirect).toHaveBeenCalledWith('MessageView', expect.objectContaining({
      type: 'business',
      business: true
    }))
  })

  it('renders a completed pickup order with review and reorder', async () => {
    const onNavigationRedirect = jest.fn()
    const handleReorder = jest.fn(async () => ({ uuid: 'cart-9' }))
    const { getByText, getByTestId } = renderWithProviders(
      <OrderDetails
        order={{
          order: {
            ...mockCompletedOrder,
            delivery_type: 2,
            comment: null,
            delivery_option: undefined
          },
          loading: false,
          error: null
        }}
        onNavigationRedirect={onNavigationRedirect}
        handleReorder={handleReorder}
      />
    )
    expect(getByText('Your Order')).toBeTruthy()
    expect(getByText('Pickup Address')).toBeTruthy()
    expect(getByText('Test Store')).toBeTruthy()
    fireEvent.press(getByText('Review'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewOrder', expect.objectContaining({
      order: expect.objectContaining({ id: 202 })
    }))
    fireEvent.press(getByTestId('floating-button-secondary'))
    await waitFor(() => {
      expect(handleReorder).toHaveBeenCalledWith(202)
      expect(onNavigationRedirect).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-9' })
    })
  })

  it('renders driver details, map, and phone link', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId, getAllByTestId } = renderWithProviders(
      <OrderDetails
        order={{
          order: {
            ...mockOrder,
            status: 9,
            driver: mockDriver
          },
          loading: false,
          error: null
        }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    expect(getByText('Alex Rivera')).toBeTruthy()
    expect(getByText('Your Driver')).toBeTruthy()
    expect(getByTestId('google-map')).toBeTruthy()
    fireEvent.press(getAllByTestId('o-icon')[0])
    expect(Linking.openURL).toHaveBeenCalledWith('tel:555-0199')
    fireEvent.press(getAllByTestId('o-icon')[1])
    expect(onNavigationRedirect).toHaveBeenCalledWith('MessageView', expect.objectContaining({
      type: 'driver',
      driver: true
    }))
  })

  it('renders a gift card send form', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <OrderDetails
        order={{
          order: {
            ...mockOrder,
            business_id: null,
            products: [{ gift_card: { id: 77, status: 'pending' } }]
          },
          loading: false,
          error: null
        }}
      />
    )
    expect(getByTestId('send-gift-card')).toBeTruthy()
    expect(queryByTestId('place-spot')).toBeNull()
  })

  it('renders a place spot for curbside orders', () => {
    const { getByTestId } = renderWithProviders(
      <OrderDetails
        order={{
          order: {
            ...mockOrder,
            delivery_type: 4,
            spot_number: 12
          },
          loading: false,
          error: null
        }}
      />
    )
    expect(getByTestId('place-spot')).toBeTruthy()
  })

  it('shows placeholders while loading', () => {
    const { queryByText, queryByTestId } = renderWithProviders(
      <OrderDetails
        order={{ order: {}, loading: true, error: null }}
      />
    )
    expect(queryByText('Estimated Time')).toBeNull()
    expect(queryByTestId('order-bill')).toBeNull()
  })

  it('toasts order errors and redirects home', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const onNavigationRedirect = jest.fn()
    renderWithProviders(
      <OrderDetails
        order={{ order: null, loading: false, error: 'Missing order' }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    expect(showToast).toHaveBeenCalled()
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })

  it('registers a hardware back handler from checkout', () => {
    renderWithProviders(
      <OrderDetails
        isFromCheckout
        order={{ order: mockOrder, loading: false, error: null }}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(BackHandler.addEventListener).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function))
    const handler = BackHandler.addEventListener.mock.calls[0][1]
    const onNavigationRedirect = jest.fn()
    renderWithProviders(
      <OrderDetails
        isFromCheckout
        order={{ order: mockOrder, loading: false, error: null }}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    const latest = BackHandler.addEventListener.mock.calls.at(-1)[1]
    expect(latest()).toBe(true)
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
  })
})
