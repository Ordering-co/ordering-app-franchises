import { BusinessItemAccordion } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [{ parsePrice: (value) => `$${value}` }]),
  useOrder: jest.fn(() => [{ carts: {} }, {}])
}))

describe('BusinessItemAccordion UI', () => {
  it('renders cart business name', () => {
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        cart={{
          uuid: 'c1',
          status: 1,
          valid_schedule: true,
          products: [{ id: 1 }],
          total: 10,
          subtotal: 10,
          valid_products: true,
          valid_address: true,
          minimum: 0,
          business: mockBusiness
        }}
        isActive={false}
        changeActiveState={jest.fn()}
        handleClickCheckout={jest.fn()}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
