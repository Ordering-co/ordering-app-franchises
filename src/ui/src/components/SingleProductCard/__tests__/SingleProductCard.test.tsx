import { SingleProductCard } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { m4ThemeOverrides, mockNavigation, mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  useConfig: jest.fn(() => [{ configs: {} }]),
  useSession: jest.fn(() => [{ auth: true }, {}]),
  useOrder: jest.fn(() => [{ carts: {} }, {}]),
  SingleProductCard: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, rest)
  }
}))

describe('SingleProductCard UI', () => {
  it('renders compact product card', () => {
    const { getByText } = renderWithProviders(
      <SingleProductCard
        product={mockProduct}
        showCategoriesView
        onProductClick={jest.fn()}
        navigation={mockNavigation}
      />,
      { themeOverrides: m4ThemeOverrides }
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })

  it('renders detailed product card', () => {
    const { getByText } = renderWithProviders(
      <SingleProductCard
        product={mockProduct}
        onProductClick={jest.fn()}
        navigation={mockNavigation}
        productAddedToCartLength={0}
      />,
      { themeOverrides: m4ThemeOverrides }
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
    expect(getByText('Melted cheddar')).toBeTruthy()
    expect(getByText('$12')).toBeTruthy()
  })
})
