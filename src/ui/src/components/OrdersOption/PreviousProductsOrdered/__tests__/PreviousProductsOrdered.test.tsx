import { fireEvent } from '@testing-library/react-native'
import { PreviousProductsOrdered } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../../jest/helpers/appM6TestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('../../../SingleProductCard', () => ({
  SingleProductCard: ({ product, onProductClick }) => {
    const React = require('react')
    const { Text, TouchableOpacity } = require('react-native')
    return React.createElement(
      TouchableOpacity,
      { testID: `product-${product.id}`, onPress: () => onProductClick?.(product) },
      React.createElement(Text, null, product?.name)
    )
  }
}))

describe('PreviousProductsOrdered UI', () => {
  const availableProduct = {
    ...mockProduct,
    business: { id: 1, available: true }
  }
  const unavailableProduct = {
    ...mockProduct,
    id: 99,
    name: 'Hidden Pie',
    business: { id: 1, available: false }
  }

  it('renders available products and handles a click', () => {
    const onProductClick = jest.fn()
    const { getByText, getByTestId, queryByText } = renderWithProviders(
      <PreviousProductsOrdered
        products={[availableProduct, unavailableProduct]}
        onProductClick={onProductClick}
        handleUpdateProducts={jest.fn()}
      />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
    expect(queryByText('Hidden Pie')).toBeNull()
    fireEvent.press(getByTestId('product-10'))
    expect(onProductClick).toHaveBeenCalledWith(availableProduct)
  })

  it('renders the search list layout', () => {
    const { getByText } = renderWithProviders(
      <PreviousProductsOrdered
        products={[availableProduct]}
        onProductClick={jest.fn()}
        isBusinessesSearchList
      />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })
})
