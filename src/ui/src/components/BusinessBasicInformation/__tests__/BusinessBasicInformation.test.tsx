import { BusinessBasicInformation } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  createDayjsWithTimezone: () => require('../../../../../../jest/helpers/appM3TestUtils').createDayjsMock(),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM3TestUtils').mockUtils])
}))

describe('BusinessBasicInformation UI', () => {
  it('renders business name', () => {
    const { getByText } = renderWithProviders(
      <BusinessBasicInformation
        businessState={{ loading: false, business: mockBusiness }}
        navigation={mockNavigation}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
