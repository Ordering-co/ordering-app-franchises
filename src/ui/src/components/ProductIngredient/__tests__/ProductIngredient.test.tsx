import { ProductIngredient } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProductIngredient: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      state: { selected: true },
      ingredient: { id: 1, name: 'Cheese' },
      toggleSelect: jest.fn(),
      isSoldOut: false,
      ...rest
    })
  }
}))

describe('ProductIngredient UI', () => {
  it('renders ingredient name', () => {
    const { getByText } = renderWithProviders(
      <ProductIngredient />
    )
    expect(getByText('Cheese')).toBeTruthy()
  })
})
