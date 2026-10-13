import { HighestRatedBusinesses } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockBusiness, mockNavigation } = require('../../../../../../jest/helpers/appM3TestUtils')
    return React.createElement(UIComponent, {
      businessesList: { loading: false, businesses: [mockBusiness] },
      onBusinessClick: jest.fn(),
      navigation: mockNavigation,
      isLoading: false,
      getBusinesses: jest.fn(),
      favoriteIds: [],
      setFavoriteIds: jest.fn(),
      handleUpdateBusinessList: jest.fn(),
      ...rest
    })
  }
}))

describe('HighestRatedBusinesses UI', () => {
  it('renders highest rated heading', () => {
    const { getByText } = renderWithProviders(
      <HighestRatedBusinesses navigation={mockNavigation} />
    )
    expect(getByText('Highest rated')).toBeTruthy()
  })
})
