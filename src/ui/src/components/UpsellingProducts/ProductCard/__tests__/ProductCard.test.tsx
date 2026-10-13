import { ProductCard } from '../index'
import { renderWithProviders } from '../../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  SingleProductCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, rest)
  }
}))

describe('Upselling ProductCard UI', () => {
  it('renders product name and add action', () => {
    const { getByText } = renderWithProviders(
      <ProductCard
        product={mockProduct}
        onProductClick={jest.fn()}
      />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
    expect(getByText('$12')).toBeTruthy()
    expect(getByText('Add')).toBeTruthy()
  })
})
