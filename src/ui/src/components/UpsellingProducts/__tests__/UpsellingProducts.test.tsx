import { UpsellingProducts } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockProduct } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('../UpsellingContent', () => ({
  UpsellingContent: ({ productsList }) => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, { testID: 'upselling-content' }, productsList?.[0]?.name || 'Upselling')
  }
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useOrder: jest.fn(() => [{ carts: {} }, {}]),
  UpsellingPage: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockProduct } = require('../../../../../../jest/helpers/appM4TestUtils')
    return React.createElement(UIComponent, {
      upsellingProducts: { loading: false, error: null, products: [mockProduct] },
      businessId: 1,
      products: [mockProduct],
      ...rest
    })
  }
}))

describe('UpsellingProducts UI', () => {
  it('renders filtered upselling products', () => {
    const { getByText } = renderWithProviders(
      <UpsellingProducts businessId={1} />
    )
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })
})
