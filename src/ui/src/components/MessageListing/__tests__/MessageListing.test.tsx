import { RefreshControl } from 'react-native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { MessageListing, OrderListing } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockEmptyOrderList,
  mockLoadingOrderList,
  mockOrder
} from '../../../../../../jest/helpers/appM7TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => {
    const React = require('react')
    const { View } = require('react-native')
    return React.createElement(View, { testID: 'message-placeholder' }, children)
  },
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useBusiness: jest.fn(() => [{ business: { id: 1 } }]),
  OrderList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { messageListingUIProps } = require('../../../../../../jest/helpers/appM7TestUtils')
    return React.createElement(UIComponent, { ...messageListingUIProps, ...rest })
  }
}))

describe('MessageListing UI', () => {
  beforeEach(() => {
    const { useFocusEffect } = require('@react-navigation/native')
    useFocusEffect.mockImplementation((cb) => {
      const React = require('react')
      React.useEffect(() => {
        const cleanup = cb()
        return typeof cleanup === 'function' ? cleanup : undefined
      }, [])
    })
  })

  it('renders active message orders and opens a thread', async () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <MessageListing
        franchiseId='franchise-a'
        onNavigationRedirect={onNavigationRedirect}
        setRefreshOrders={jest.fn()}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    fireEvent.press(getByTestId('active-order'))
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('MessageView', {
        order: expect.objectContaining({ uuid: 'ord-101' }),
        orderId: 'ord-101'
      })
    })
  })

  it('shows placeholders while the order list is loading', () => {
    const { getAllByTestId, queryByText } = renderWithProviders(
      <OrderListing
        orderList={mockLoadingOrderList}
        ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
        setOrderList={jest.fn()}
        loadOrders={jest.fn()}
      />
    )
    expect(getAllByTestId('message-placeholder')).toHaveLength(6)
    expect(queryByText('No messages to show at this time.')).toBeNull()
  })

  it('shows an empty state when there are no messages', () => {
    const { getByText } = renderWithProviders(
      <OrderListing
        orderList={mockEmptyOrderList}
        ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
        setOrderList={jest.fn()}
        loadOrders={jest.fn()}
      />
    )
    expect(getByText('No messages to show at this time.')).toBeTruthy()
  })

  it('uses a custom order array and reloads when refresh is requested', () => {
    const loadOrders = jest.fn()
    const setRefreshOrders = jest.fn()
    const { getByText } = renderWithProviders(
      <OrderListing
        customArray={[{ ...mockOrder, id: 303, uuid: 'ord-303' }]}
        orderList={mockEmptyOrderList}
        refreshOrders
        setRefreshOrders={setRefreshOrders}
        loadOrders={loadOrders}
        ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
        setOrderList={jest.fn()}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
    expect(setRefreshOrders).toHaveBeenCalledWith(false)
  })

  it('pulls to refresh the listing', () => {
    const setRefreshOrders = jest.fn()
    const { UNSAFE_getByType } = renderWithProviders(
      <MessageListing
        onNavigationRedirect={jest.fn()}
        setRefreshOrders={setRefreshOrders}
      />
    )
    fireEvent(UNSAFE_getByType(RefreshControl), 'refresh')
    expect(setRefreshOrders).toHaveBeenCalledWith(true)
  })

  it('loads orders when the screen is focused', () => {
    const loadOrders = jest.fn()
    renderWithProviders(
      <OrderListing
        loadOrders={loadOrders}
        orderList={mockEmptyOrderList}
        ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
        setOrderList={jest.fn()}
      />
    )
    expect(loadOrders).toHaveBeenCalled()
  })
})
