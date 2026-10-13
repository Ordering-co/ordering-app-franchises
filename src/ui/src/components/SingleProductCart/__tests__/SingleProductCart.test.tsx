import { SingleProductCart } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  ProductItemAccordion: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockProduct } = require('../../../../../../jest/helpers/appM4TestUtils')
    return React.createElement(UIComponent, {
      product: mockProduct,
      productInfo: { ingredients: [], options: [] },
      isCartProduct: false,
      isDisabledEdit: true,
      ...rest
    })
  }
}))

describe('SingleProductCart UI', () => {
  it('renders cart product name', () => {
    const { getByText } = renderWithProviders(
      <SingleProductCart product={mockProduct} />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })
})
