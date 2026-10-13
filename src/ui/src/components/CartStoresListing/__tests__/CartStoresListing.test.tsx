import { CartStoresListing } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  CartStoresListing: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockBusiness } = require('../../../../../../jest/helpers/appM4TestUtils')
    return React.createElement(UIComponent, {
      storesState: { loading: false, error: null, result: [mockBusiness] },
      changeStoreState: { loading: false },
      handleCartStoreChange: jest.fn(),
      businessIdSelect: null,
      onClose: jest.fn(),
      ...rest
    })
  }
}))

describe('CartStoresListing UI', () => {
  it('renders available stores', () => {
    const { getByText } = renderWithProviders(
      <CartStoresListing cartuuid='cart-1' />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
