import { BusinessListingSearchUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('../BusinessSearchHeader', () => ({
  BusinessSearchHeader: () => null
}))
jest.mock('../BusinessSearchFooter', () => ({
  BusinessSearchFooter: () => null
}))
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM3TestUtils').mockUtils])
}))

describe('BusinessListingSearch UI', () => {
  it('renders matching store action', () => {
    const { getByText } = renderWithProviders(
      <BusinessListingSearchUI
        businessesSearchList={{
          loading: false,
          businesses: [{
            ...mockBusiness,
            categories: [{ id: 1, products: [{ id: 1, name: 'Burger', inventoried: false }] }]
          }]
        }}
        termValue=''
        filters={{ business_types: [], orderBy: 'default', franchise_ids: [] }}
        paginationProps={{ currentPage: 1, totalPages: 1 }}
        navigation={mockNavigation}
        onBusinessClick={jest.fn()}
        handleChangeTermValue={jest.fn()}
        handleSearchbusinessAndProducts={jest.fn()}
        handleChangeFilters={jest.fn()}
        setFilters={jest.fn()}
        brandList={[]}
        businessTypes={[]}
        handleUpdateProducts={jest.fn()}
      />
    )
    expect(getByText('Go to store')).toBeTruthy()
  })
})
