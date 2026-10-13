import { Platform } from 'react-native'
import { AppleLogin } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    Operation: { LOGIN: 1 },
    Scope: { EMAIL: 0, FULL_NAME: 1 },
    performRequest: jest.fn()
  }
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  useApi: jest.fn(() => [{ root: 'https://api.test' }]),
  useSession: jest.fn(() => [{ auth: false }, {}])
}))

describe('AppleLogin UI', () => {
  beforeEach(() => {
    Platform.OS = 'ios'
  })

  it('renders continue with Apple on iOS', () => {
    const { getByText } = renderWithProviders(
      <AppleLogin handleErrors={jest.fn()} handleLoading={jest.fn()} />
    )
    expect(getByText('Continue with Apple')).toBeTruthy()
  })
})
