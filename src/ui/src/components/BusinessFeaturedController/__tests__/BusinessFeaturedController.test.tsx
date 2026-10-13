import { BusinessFeaturedCtrlUI } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockBusiness } from '../../../../../../jest/helpers/appM3TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM3TestUtils').mockUtils])
}))

describe('BusinessFeaturedController UI', () => {
  it('renders featured business name', () => {
    const { getByText } = renderWithProviders(
      <BusinessFeaturedCtrlUI
        business={mockBusiness}
        handleClick={jest.fn()}
        isBusinessOpen
      />
    )
    expect(getByText('Test Store')).toBeTruthy()
  })
})
