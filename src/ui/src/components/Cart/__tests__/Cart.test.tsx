import { useFreeDeliveryProgress, useOrder, useUtils } from '@components'
import { Cart, CartUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCart } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../../../../config', () => ({ __esModule: true, default: { franchiseSlug: 'demo-franchise' } }))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  Cart: () => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'cart-controller' }, 'Cart')
  }
}))

describe('Cart UI', () => {
  beforeEach(() => {
    ;(useOrder as jest.Mock).mockReturnValue([{ options: { type: 1 }, carts: {} }])
    ;(useUtils as jest.Mock).mockReturnValue([{
      parsePrice: (value: number) => `$${value}`,
      parseNumber: (value: number) => String(value),
      parseDate: (value: string) => value
    }])
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({ status: 'hidden' })
  })

  it('renders full franchise progress after products and before the bill', () => {
    ;(useFreeDeliveryProgress as jest.Mock).mockReturnValue({
      status: 'progress', remainingAmount: 4, progressPercent: 80
    })
    const props = {
      cart: mockCart,
      onNavigationRedirect: jest.fn(),
      clearCart: jest.fn(),
      removeProduct: jest.fn(),
      cateringTypes: []
    }
    const { getByTestId, toJSON } = renderWithProviders(<CartUI {...props} />)
    const serialized = JSON.stringify(toJSON())

    expect(getByTestId('free-delivery-progress')).toHaveProp('variant', 'full')
    expect(serialized.indexOf('product-item-accordion')).toBeLessThan(serialized.indexOf('free-delivery-progress'))
    expect(serialized.indexOf('free-delivery-progress')).toBeLessThan(serialized.indexOf('Subtotal'))
    expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith({
      business: mockCart.business,
      cart: mockCart,
      franchiseId: 'demo-franchise',
      enabled: true
    })
  })
  it('does not look up offers for a collapsed cart', () => {
    renderWithProviders(<CartUI
      cart={mockCart}
      isActive={false}
      onNavigationRedirect={jest.fn()}
      clearCart={jest.fn()}
      removeProduct={jest.fn()}
      cateringTypes={[]}
    />)

    expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false })
    )
  })
  it.each([
    { valid_schedule: false },
    { business: { ...mockCart.business, open: false } }
  ])('does not look up offers for a closed cart: %j', (closedFields) => {
    renderWithProviders(<CartUI
      cart={{ ...mockCart, ...closedFields }}
      isActive
      onNavigationRedirect={jest.fn()}
      clearCart={jest.fn()}
      removeProduct={jest.fn()}
      cateringTypes={[]}
    />)

    expect(useFreeDeliveryProgress).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false })
    )
  })
  it('loads cart controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <Cart cart={mockCart} onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('cart-controller')).toBeTruthy()
  })
})
