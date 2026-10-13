import { BusinessCart } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  useOrder: jest.fn(() => [{ options: { type: 1 }, carts: {} }, {}])
}))

describe('BusinessCart UI', () => {
  it('renders store name and select action', () => {
    const { getByText } = renderWithProviders(
      <BusinessCart
        business={{ ...mockBusiness, reviews: { total: 4.5 } }}
        handleCartStoreClick={jest.fn()}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
    expect(getByText('Select')).toBeTruthy()
  })

  it('renders skeleton placeholders', () => {
    const { queryByText } = renderWithProviders(
      <BusinessCart business={{}} isSkeleton />
    )
    expect(queryByText('Select')).toBeNull()
  })
})
