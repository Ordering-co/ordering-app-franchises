import { BusinessesListing } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('../FlatListBusinessListing', () => ({
  FlatListBusinessListing: ({ businessesList }) => {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, null, businessesList?.businesses?.[0]?.name)
  }
}))
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn()
}))
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn()
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  BusinessSimpleList: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { mockBusiness, mockNavigation } = require('../../../../../../jest/helpers/appM3TestUtils')
    return React.createElement(UIComponent, {
      businessesList: { loading: false, businesses: [mockBusiness] },
      paginationProps: {},
      citiesState: { cities: [] },
      navigation: mockNavigation,
      getBusinesses: jest.fn(),
      ...rest
    })
  }
}))

describe('BusinessesListing UI', () => {
  it('renders listed businesses', () => {
    const { getByText } = renderWithProviders(
      <BusinessesListing navigation={mockNavigation} />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
