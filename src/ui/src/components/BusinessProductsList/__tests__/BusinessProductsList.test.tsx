import { BusinessProductsList } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { m4ThemeOverrides, mockCategory, mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProductsList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockCategory, mockProduct } = require('../../../../../../jest/helpers/appM4TestUtils')
    return React.createElement(UIComponent, {
      category: mockCategory,
      categories: [mockCategory],
      categoryState: { loading: false, products: [mockProduct], pagination: {} },
      currentCart: { products: [] },
      subcategoriesSelected: [],
      onProductClick: jest.fn(),
      setCategoriesLayout: jest.fn(),
      setSubcategoriesSelected: jest.fn(),
      setSelectedCategoryId: jest.fn(),
      ...rest
    })
  }
}))

describe('BusinessProductsList UI', () => {
  it('renders products for the selected category', () => {
    const { getByText } = renderWithProviders(
      <BusinessProductsList
        category={mockCategory}
        categories={[mockCategory]}
        categoryState={{ loading: false, products: [mockProduct], pagination: {} }}
      />,
      { themeOverrides: m4ThemeOverrides }
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })
})
