import { Home } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fast-image', () => require('../../../../../../jest/helpers/fastImageMock'))
jest.mock('../Alternative', () => ({
  Home: () => null
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useSession: jest.fn(() => [{ auth: false, user: null }, {}]),
  useOrder: jest.fn(() => [{ loading: false, options: { type: 1 }, carts: {} }, {}])
}))

describe('Home UI', () => {
  it('renders order now action for guest home', () => {
    const { getByText } = renderWithProviders(
      <Home onNavigationRedirect={jest.fn()} navigation={{ canGoBack: jest.fn() }} />
    )
    expect(getByText('Order Now')).toBeTruthy()
  })
})
