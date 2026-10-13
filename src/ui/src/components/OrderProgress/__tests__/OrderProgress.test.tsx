import { fireEvent, waitFor } from '@testing-library/react-native'
import { OrderProgress } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCompletedOrder,
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockNavigation,
  mockOrder
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => require('../../../../../../jest/helpers/appM6TestUtils').placeholderMock)
jest.mock('../../OrderDetails/OrderEta', () => ({
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
  OrderList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { orderProgressUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...orderProgressUIProps, ...rest })
  }
}))

describe('OrderProgress UI', () => {
  it('renders an in progress order and navigates to MyOrders', async () => {
    const navigation = { ...mockNavigation, navigate: jest.fn() }
    const loadOrders = jest.fn()
    const { getByText } = renderWithProviders(
      <OrderProgress
        orderList={{ loading: false, orders: [mockOrder] }}
        navigation={navigation}
        loadOrders={loadOrders}
        isFocused
      />
    )
    await waitFor(() => {
      expect(getByText('Order in progress')).toBeTruthy()
    })
    expect(getByText('Go to my orders')).toBeTruthy()
    expect(getByText('Pending')).toBeTruthy()
    expect(getByText('Estimated delivery')).toBeTruthy()
    fireEvent.press(getByText('Go to my orders'))
    expect(navigation.navigate).toHaveBeenCalledWith('MyOrders')
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
  })

  it('renders a completed pickup order as a generic order', async () => {
    const { getByText, queryByText } = renderWithProviders(
      <OrderProgress
        orderList={{
          loading: false,
          orders: [{ ...mockCompletedOrder, delivery_type: 2, delivery_datetime_utc: null }]
        }}
        navigation={mockNavigation}
        loadOrders={jest.fn()}
        isFocused={false}
      />
    )
    await waitFor(() => {
      expect(getByText('Order')).toBeTruthy()
    })
    expect(queryByText('Order in progress')).toBeNull()
    expect(getByText('Estimated time')).toBeTruthy()
  })

  it('shows a placeholder while the first load is in progress', () => {
    const { queryByText } = renderWithProviders(
      <OrderProgress
        orderList={mockLoadingOrderList}
        navigation={mockNavigation}
        loadOrders={jest.fn()}
        isFocused={false}
      />
    )
    expect(queryByText('Order in progress')).toBeNull()
    expect(queryByText('Go to my orders')).toBeNull()
  })

  it('renders nothing when there are no orders after load', () => {
    const { queryByText } = renderWithProviders(
      <OrderProgress
        orderList={mockEmptyOrderList}
        navigation={mockNavigation}
        loadOrders={jest.fn()}
        isFocused={false}
      />
    )
    expect(queryByText('Go to my orders')).toBeNull()
  })
})
