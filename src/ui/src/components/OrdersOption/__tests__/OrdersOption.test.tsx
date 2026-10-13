import { fireEvent, waitFor } from '@testing-library/react-native'
import { OrdersOption } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockBusiness,
  mockCompletedOrder,
  mockEmptyOrderList,
  mockEmptyOrdersLength,
  mockLoadingOrderList,
  mockNavigation,
  mockOrder,
  mockOrdersLength,
  mockPagination,
  mockProduct
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../PreviousBusinessOrdered', () => ({
  PreviousBusinessOrdered: ({ businesses }) => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, null, businesses?.result?.[0]?.name || 'Previous businesses')
  }
}))
jest.mock('../PreviousProductsOrdered', () => ({
  PreviousProductsOrdered: ({ products, onProductClick }) => {
    const React = require('react')
    const { Text, TouchableOpacity } = require('react-native')
    return React.createElement(
      TouchableOpacity,
      { testID: 'previous-products', onPress: () => onProductClick?.(products?.[0]) },
      React.createElement(Text, null, products?.[0]?.name || 'Previous products')
    )
  }
}))
jest.mock('../../Skeletons', () => ({
  Skeletons: () => ({
    BusinessSkeleton: () => {
      const React = require('react')
      const { Text } = require('react-native')
      return React.createElement(Text, null, 'Business skeleton')
    },
    OrderSkeleton: () => {
      const React = require('react')
      const { Text } = require('react-native')
      return React.createElement(Text, null, 'Order skeleton')
    },
    ProductSkeleton: () => {
      const React = require('react')
      const { Text } = require('react-native')
      return React.createElement(Text, null, 'Product skeleton')
    }
  })
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    {}
  ]),
  OrderList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { ordersOptionUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...ordersOptionUIProps, ...rest })
  }
}))

describe('OrdersOption UI', () => {
  it('renders active orders after reducing the list', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrdersOption
        activeOrders
        orderList={{ loading: false, error: null, orders: [mockOrder] }}
        ordersLength={mockOrdersLength}
      />
    )
    await waitFor(() => {
      expect(getByText('Active')).toBeTruthy()
      expect(getByTestId('active-orders')).toBeTruthy()
    })
  })

  it('renders past orders', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrdersOption
        orderList={{ loading: false, error: null, orders: [mockCompletedOrder] }}
        ordersLength={mockOrdersLength}
      />
    )
    await waitFor(() => {
      expect(getByText('Past')).toBeTruthy()
      expect(getByTestId('previous-orders')).toBeTruthy()
    })
  })

  it('renders preorders', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OrdersOption
        preOrders
        orderList={{ loading: false, error: null, orders: [{ ...mockOrder, status: 13 }] }}
        ordersLength={mockOrdersLength}
      />
    )
    await waitFor(() => {
      expect(getByText('Preorders')).toBeTruthy()
      expect(getByTestId('active-orders')).toBeTruthy()
    })
  })

  it('renders previously ordered businesses and products', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId, rerender } = renderWithProviders(
      <OrdersOption
        isBusiness
        hideOrders
        businesses={{ loading: false, result: [mockBusiness] }}
        orderList={mockEmptyOrderList}
        ordersLength={mockEmptyOrdersLength}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()

    rerender(
      <OrdersOption
        isProducts
        hideOrders
        products={[{
          ...mockProduct,
          product_id: 10,
          category_id: 1,
          businessId: 1,
          business: {
            available: true,
            slug: 'test-store',
            header: 'h',
            logo: 'l',
            id: 1
          }
        }]}
        orderList={mockEmptyOrderList}
        ordersLength={mockEmptyOrdersLength}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    fireEvent.press(getByTestId('previous-products'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ProductDetails', expect.objectContaining({
      businessId: 1,
      productId: 10
    }))
  })

  it('toasts when a previous product is missing ids', () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const { getByTestId } = renderWithProviders(
      <OrdersOption
        isProducts
        hideOrders
        products={[{ name: 'Broken', business: { available: true } }]}
        orderList={mockEmptyOrderList}
        ordersLength={mockEmptyOrdersLength}
      />
    )
    fireEvent.press(getByTestId('previous-products'))
    expect(showToast).toHaveBeenCalled()
  })

  it('shows the empty orders state', () => {
    const { getByText } = renderWithProviders(
      <OrdersOption
        orderList={mockEmptyOrderList}
        ordersLength={mockEmptyOrdersLength}
      />
    )
    expect(getByText("You don't have any orders")).toBeTruthy()
  })

  it('shows skeletons while loading', () => {
    const { getAllByText } = renderWithProviders(
      <OrdersOption
        orderList={mockLoadingOrderList}
        ordersLength={mockEmptyOrdersLength}
      />
    )
    expect(getAllByText('Order skeleton').length).toBeGreaterThan(0)
  })

  it('refreshes and loads more orders', () => {
    const loadOrders = jest.fn()
    const loadMoreOrders = jest.fn()
    const setRefreshOrders = jest.fn()
    const { rerender } = renderWithProviders(
      <OrdersOption
        activeOrders
        orderList={{ loading: false, error: null, orders: [mockOrder] }}
        ordersLength={mockOrdersLength}
        refreshOrders
        setRefreshOrders={setRefreshOrders}
        loadOrders={loadOrders}
        loadMoreOrders={loadMoreOrders}
        pagination={mockPagination}
      />
    )
    expect(loadOrders).toHaveBeenCalledWith(false, false, false, true)
    expect(setRefreshOrders).toHaveBeenCalledWith(false)

    rerender(
      <OrdersOption
        activeOrders
        orderList={{ loading: false, error: null, orders: [mockOrder] }}
        ordersLength={mockOrdersLength}
        loadMoreStatus
        loadMoreOrders={loadMoreOrders}
        loadOrders={loadOrders}
        pagination={mockPagination}
      />
    )
    expect(loadMoreOrders).toHaveBeenCalled()
  })

  it('toasts reorder errors and groups shared carts', async () => {
    const { useToast } = require('@components')
    const showToast = jest.fn()
    useToast.mockReturnValue([null, { showToast }])
    const { getByTestId } = renderWithProviders(
      <OrdersOption
        activeOrders
        orderList={{
          loading: false,
          error: null,
          orders: [
            { ...mockOrder, id: 1, cart_group_id: 'g1', summary: { total: 10 } },
            { ...mockOrder, id: 2, cart_group_id: 'g1', summary: { total: 8 } }
          ]
        }}
        ordersLength={mockOrdersLength}
        reorderState={{ loading: false, error: true, result: 'Cannot reorder' }}
      />
    )
    await waitFor(() => {
      expect(getByTestId('active-orders')).toBeTruthy()
    })
    expect(showToast).toHaveBeenCalled()
  })

  it('redirects after a successful reorder when the cart matches', async () => {
    const onNavigationRedirect = jest.fn()
    const orderWithMatch = {
      ...mockOrder,
      products: [{ id: 10, valid: true, order_id: 101 }]
    }
    const { rerender, getByTestId } = renderWithProviders(
      <OrdersOption
        activeOrders
        navigation={mockNavigation}
        orderList={{ loading: false, error: null, orders: [orderWithMatch] }}
        ordersLength={mockOrdersLength}
        onNavigationRedirect={onNavigationRedirect}
        reorderState={{ loading: false, error: null, result: null }}
      />
    )
    await waitFor(() => {
      expect(getByTestId('active-orders')).toBeTruthy()
    })
    rerender(
      <OrdersOption
        activeOrders
        navigation={mockNavigation}
        orderList={{ loading: false, error: null, orders: [orderWithMatch] }}
        ordersLength={mockOrdersLength}
        onNavigationRedirect={onNavigationRedirect}
        reorderState={{
          loading: false,
          error: false,
          result: {
            business_id: 1,
            uuid: 'cart-1',
            orderId: 101,
            business: { slug: 'test-store' }
          }
        }}
      />
    )
    await waitFor(() => {
      expect(onNavigationRedirect).toHaveBeenCalledWith('CheckoutPage', { cartUuid: 'cart-1' })
    })
  })
})
