import { fireEvent } from '@testing-library/react-native'
import { SingleOrderCard } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCompletedOrder,
  mockOrder,
  mockOrderState
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
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
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    {}
  ]),
  SingleOrderCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { singleOrderCardUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...singleOrderCardUIProps, ...rest })
  }
}))

describe('SingleOrderCard UI', () => {
  it('opens order details from an in progress card', () => {
    const onNavigationRedirect = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <SingleOrderCard
        order={mockOrder}
        onNavigationRedirect={onNavigationRedirect}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText(/DELIVERY/)).toBeTruthy()
    expect(getByText('Pending')).toBeTruthy()
    expect(getByTestId('order-eta')).toBeTruthy()
    fireEvent.press(getByTestId('card-animation'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('OrderDetails', {
      orderId: 'ord-101',
      orderNumberId: 101,
      fromHome: false
    })
  })

  it('reviews and reorders a completed order', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValueOnce([{ carts: {} }, {}])
    const onNavigationRedirect = jest.fn()
    const handleReorder = jest.fn()
    const { getByText } = renderWithProviders(
      <SingleOrderCard
        order={mockCompletedOrder}
        pastOrders
        onNavigationRedirect={onNavigationRedirect}
        handleReorder={handleReorder}
      />
    )
    fireEvent.press(getByText('Review'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ReviewOrder', expect.objectContaining({
      order: expect.objectContaining({ id: 202 })
    }))
    fireEvent.press(getByText('Reorder'))
    expect(handleReorder).toHaveBeenCalledWith(202)
  })

  it('asks to clear the cart before reordering', () => {
    const handleRemoveCart = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <SingleOrderCard
        order={mockCompletedOrder}
        pastOrders
        handleRemoveCart={handleRemoveCart}
        handleReorder={jest.fn()}
      />
    )
    fireEvent.press(getByText('Reorder'))
    expect(getByTestId('alert')).toBeTruthy()
    fireEvent.press(getByTestId('alert-accept'))
    expect(handleRemoveCart).toHaveBeenCalled()
  })

  it('renders a gift card order and message view click', () => {
    const handleClickOrder = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <SingleOrderCard
        order={{ ...mockOrder, business_id: null }}
        isMessageView
        handleClickOrder={handleClickOrder}
      />
    )
    expect(getByText('Gift Card')).toBeTruthy()
    fireEvent.press(getByTestId('card-animation'))
    expect(handleClickOrder).toHaveBeenCalledWith('ord-101')
  })

  it('toggles favorite on a single store card', () => {
    const handleFavoriteOrder = jest.fn()
    const { getByTestId } = renderWithProviders(
      <SingleOrderCard
        order={mockOrder}
        handleFavoriteOrder={handleFavoriteOrder}
      />
    )
    fireEvent.press(getByTestId('lottie-animation'))
    expect(handleFavoriteOrder).toHaveBeenCalledWith(true)
  })

  it('shows a group order title', () => {
    const { getByText } = renderWithProviders(
      <SingleOrderCard
        order={{
          ...mockOrder,
          cart_group_id: 55,
          business: [{ name: 'A', logo: 'a' }, { name: 'B', logo: 'b' }]
        }}
      />
    )
    expect(getByText('2')).toBeTruthy()
    expect(getByText(/orders/)).toBeTruthy()
  })
})
