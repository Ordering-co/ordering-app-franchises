import { UserVerification } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseUserVerificationUIProps } from '../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  UserVerification: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appUiTestUtils').baseUserVerificationUIProps,
      ...rest
    })
  },
  UserFormDetails: () => null,
  useSession: jest.fn(() => [{
    auth: true,
    user: { email_verified: false, phone_verified: true, email: 'user@test.com' }
  }, {}]),
  useConfig: jest.fn(() => [{
    loading: false,
    configs: {
      verification_email_required: { value: '1' },
      verification_phone_required: { value: '0' }
    }
  }]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

describe('UserVerification UI', () => {
  it('renders email verification prompt', () => {
    const { getByText } = renderWithProviders(<UserVerification />)
    expect(getByText('Verification Code')).toBeTruthy()
    expect(getByText('In order to continue using our platform please verify your email')).toBeTruthy()
  })
})
