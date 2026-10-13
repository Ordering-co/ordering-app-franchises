import { BusinessProductsCategories } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockCategory } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessProductsCategories: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockCategory } = require('../../../../../../jest/helpers/appM4TestUtils')
    return React.createElement(UIComponent, {
      categories: [mockCategory],
      loading: false,
      selectedCategoryId: 'cat_1',
      handleCategoryScroll: jest.fn(),
      ...rest
    })
  }
}))

describe('BusinessProductsCategories UI', () => {
  it('renders category name', () => {
    const { getByText } = renderWithProviders(
      <BusinessProductsCategories categories={[mockCategory]} />
    )
    expect(getByText('Mains')).toBeTruthy()
  })
})
