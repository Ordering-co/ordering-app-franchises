import { FacebookLogin } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-fbsdk-next', () => ({
  AccessToken: { getCurrentAccessToken: jest.fn() },
  LoginManager: { logInWithPermissions: jest.fn(), logOut: jest.fn() }
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [{
    users: () => ({ authFacebook: jest.fn() })
  }]),
  useSession: jest.fn(() => [{ auth: false, user: null }, {}])
}))

describe('FacebookLogin UI', () => {
  it('renders continue with Facebook label', () => {
    const { getByText } = renderWithProviders(
      <FacebookLogin handleErrors={jest.fn()} handleLoading={jest.fn()} />
    )
    expect(getByText('Continue with Facebook')).toBeTruthy()
  })
})
