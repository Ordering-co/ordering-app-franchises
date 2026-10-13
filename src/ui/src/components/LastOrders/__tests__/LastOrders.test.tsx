import { LastOrders } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockOrder
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../Skeletons', () => ({
  Skeletons: () => ({
    OrderSkeleton: () => {
      const React = require('react')
      const { Text } = require('react-native')
      return React.createElement(Text, null, 'Order skeleton')
    }
  })
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ auth: true, user: { id: 1 }, token: 'tok' }, {}]),
  OrderList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { lastOrdersUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...lastOrdersUIProps, ...rest })
  }
}))

describe('LastOrders UI', () => {
  it('renders the last order card and notifies home values', () => {
    const { useHomeValues } = require('@ui')
    const onChangeOrder = jest.fn()
    useHomeValues.mockReturnValue([{ userAddressStoraged: null }, { onChangeOrder }])

    const { getByText, getByTestId } = renderWithProviders(
      <LastOrders onRedirect={jest.fn()} />
    )
    expect(getByText('Your last order')).toBeTruthy()
    expect(getByTestId('single-order-card')).toBeTruthy()
    expect(onChangeOrder).toHaveBeenCalledWith(mockOrder)
  })

  it('loads orders for an authenticated session', () => {
    const loadOrders = jest.fn()
    renderWithProviders(
      <LastOrders loadOrders={loadOrders} />
    )
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
  })

  it('clears orders when the user is signed out', () => {
    const { useSession } = require('@components')
    useSession.mockReturnValueOnce([{ auth: false, user: null, token: null }, {}])
    const setOrderList = jest.fn()
    renderWithProviders(
      <LastOrders setOrderList={setOrderList} orderList={mockEmptyOrderList} />
    )
    expect(setOrderList).toHaveBeenCalledWith({ loading: false, error: null, orders: [] })
  })

  it('renders the empty previous orders state', () => {
    const { getByText } = renderWithProviders(
      <LastOrders orderList={mockEmptyOrderList} />
    )
    expect(getByText('You have no previous orders')).toBeTruthy()
  })

  it('renders a skeleton while loading', () => {
    const { getByText } = renderWithProviders(
      <LastOrders orderList={mockLoadingOrderList} />
    )
    expect(getByText('Order skeleton')).toBeTruthy()
  })
})
