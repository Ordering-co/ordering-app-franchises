import { fireEvent } from '@testing-library/react-native'
import { OrderSummary } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import {
  mockCart,
  mockOrderState,
  mockProduct
} from '../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../Bill', () => ({
  Bill: () => {
    const React = require('react')
    const { View } = require('react-native')
    return React.createElement(View, { testID: 'summary-bill' })
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderState,
    require('../../../../../../jest/helpers/appM6TestUtils').mockOrderFns
  ]),
  Cart: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { orderSummaryUIProps } = require('../../../../../../jest/helpers/appM6TestUtils')
    return React.createElement(UIComponent, { ...orderSummaryUIProps, ...rest })
  }
}))

describe('OrderSummary UI', () => {
  it('renders products, bill, and add more action', () => {
    const onNavigationRedirect = jest.fn()
    const removeProduct = jest.fn()
    const { getByText, getByTestId } = renderWithProviders(
      <OrderSummary
        cart={mockCart}
        onNavigationRedirect={onNavigationRedirect}
        removeProduct={removeProduct}
      />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
    expect(getByTestId('summary-bill')).toBeTruthy()
    fireEvent.press(getByText('ADD MORE PRODUCTS'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('BottomTab', { screen: 'Business' })
    fireEvent.press(getByTestId('edit-cart-product'))
    expect(onNavigationRedirect).toHaveBeenCalledWith('ProductDetails', expect.objectContaining({
      isCartProduct: true,
      businessId: 1,
      productId: 10
    }))
    fireEvent.press(getByTestId('delete-cart-product'))
    expect(removeProduct).toHaveBeenCalled()
  })

  it('hides products and the add button for gift cards', () => {
    const { queryByText, queryByTestId } = renderWithProviders(
      <OrderSummary
        cart={mockCart}
        hideProducts
        isGiftCardCart
        hideAddProductsButton
      />
    )
    expect(queryByText('Cheese Pizza')).toBeNull()
    expect(queryByText('ADD MORE PRODUCTS')).toBeNull()
    expect(queryByTestId('summary-bill')).toBeTruthy()
  })

  it('shows the moment picker for catering carts', () => {
    const { getByTestId } = renderWithProviders(
      <OrderSummary
        cart={mockCart}
        cateringTypes={[1]}
        maxDate={new Date('2026-09-20')}
      />
    )
    expect(getByTestId('moment-option')).toBeTruthy()
  })

  it('renders nothing when the cart has no products', () => {
    const { useOrder } = require('@components')
    useOrder.mockReturnValueOnce([
      {
        ...mockOrderState,
        carts: { 'businessId:1': { ...mockCart, products: [] } }
      },
      {}
    ])
    const { queryByText, queryByTestId } = renderWithProviders(
      <OrderSummary cart={{ ...mockCart, products: [] }} />
    )
    expect(queryByText('ADD MORE PRODUCTS')).toBeNull()
    expect(queryByTestId('summary-bill')).toBeNull()
  })
})
