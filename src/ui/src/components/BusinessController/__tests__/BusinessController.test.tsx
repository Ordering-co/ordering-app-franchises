import { BusinessControllerUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness, mockNavigation } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('rn-placeholder', () => ({
  Fade: ({ children }) => children,
  Placeholder: ({ children }) => children,
  PlaceholderLine: () => null
}))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  createDayjsWithTimezone: () => require('../../../../../../jest/helpers/appM3TestUtils').createDayjsMock(),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM3TestUtils').mockUtils])
}))

describe('BusinessController UI', () => {
  it('renders store name and order action', () => {
    const { getByText } = renderWithProviders(
      <BusinessControllerUI
        business={mockBusiness}
        handleClick={jest.fn()}
        navigation={mockNavigation}
        isBusinessOpen
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
