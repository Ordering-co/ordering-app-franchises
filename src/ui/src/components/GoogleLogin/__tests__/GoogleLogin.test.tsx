import { GoogleLogin } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn(),
    revokeAccess: jest.fn(),
    signOut: jest.fn()
  },
  statusCodes: {}
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [{
    users: () => ({ authGoogle: jest.fn() })
  }]),
  useSession: jest.fn(() => [{ auth: false, user: null }, {}])
}))

describe('GoogleLogin UI', () => {
  it('renders continue with Google label', () => {
    const { getByText } = renderWithProviders(
      <GoogleLogin
        webClientId='web-client-id'
        iosClientId='ios-client-id'
        handleErrors={jest.fn()}
        handleLoading={jest.fn()}
      />
    )
    expect(getByText('Continue with Google')).toBeTruthy()
  })
})
