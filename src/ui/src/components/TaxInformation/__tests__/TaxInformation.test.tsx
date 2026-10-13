import { TaxInformation } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockTaxData, mockTaxProduct } from '../../../../../../jest/helpers/appM5TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM5TestUtils').mockUtils]),
  useOrder: jest.fn(() => [
    {
      carts: {
        'businessId:1': {
          products: [require('../../../../../../jest/helpers/appM5TestUtils').mockTaxProduct]
        }
      }
    },
    { setStateValues: jest.fn() }
  ])
}))

describe('TaxInformation UI', () => {
  it('renders included tax details and matching products', () => {
    const { getByText } = renderWithProviders(
      <TaxInformation
        data={mockTaxData}
        type='tax'
        businessId={1}
        products={[mockTaxProduct]}
      />
    )
    expect(getByText(/Sales Tax/)).toBeTruthy()
    expect(getByText(/8.875%/)).toBeTruthy()
    expect(getByText(/Included on price/)).toBeTruthy()
    expect(getByText('Other products with this Tax:')).toBeTruthy()
    expect(getByText('Cheese Pizza')).toBeTruthy()
  })

  it('renders the empty description state', () => {
    const { getByText, queryByText } = renderWithProviders(
      <TaxInformation
        data={{ ...mockTaxData, description: undefined, type: 2 }}
        type='tax'
        products={[mockTaxProduct]}
      />
    )
    expect(getByText('Without description')).toBeTruthy()
    expect(queryByText(/Not included on price/)).toBeNull()
  })

  it('hides products for delivery fee data', () => {
    const { queryByText, getByText } = renderWithProviders(
      <TaxInformation
        data={{ ...mockTaxData, target: 'delivery_fee' }}
        type='fee'
        products={[mockTaxProduct]}
      />
    )
    expect(getByText(/Sales Tax/)).toBeTruthy()
    expect(queryByText('Other products with this Fee:')).toBeNull()
  })
})
