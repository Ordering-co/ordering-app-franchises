import { CartContent } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { mockNavigation } from '../../../../../../jest/helpers/appM4TestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useUtils: jest.fn(() => [require('../../../../../../jest/helpers/appM4TestUtils').mockUtils]),
  useOrder: jest.fn(() => [{
    options: { type: 1 },
    carts: {}
  }, { confirmCart: jest.fn() }])
}))

describe('CartContent UI', () => {
  it('renders empty carts state', () => {
    const { getByText } = renderWithProviders(
      <CartContent
        navigation={mockNavigation}
        onNavigationRedirect={jest.fn()}
      />
    )
    expect(getByText('My Carts')).toBeTruthy()
    expect(getByText('You don\'t have carts available')).toBeTruthy()
  })
})
