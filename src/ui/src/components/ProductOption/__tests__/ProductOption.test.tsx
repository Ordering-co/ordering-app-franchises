import { ProductOption } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ProductOption: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      option: { id: 1, name: 'Size', min: 1, max: 1 },
      error: false,
      ...rest
    })
  }
}))

describe('ProductOption UI', () => {
  it('renders option name and required label', () => {
    const { getByText } = renderWithProviders(
      <ProductOption />
    )
    expect(getByText('Size')).toBeTruthy()
    expect(getByText('Required')).toBeTruthy()
  })
})
