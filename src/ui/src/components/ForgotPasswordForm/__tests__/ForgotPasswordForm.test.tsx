import { ForgotPasswordForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { baseForgotPasswordUIProps } from '../../../../../../jest/helpers/appUiTestUtils'

jest.mock('@ui', () => require('../../../../../../jest/helpers/franchiseAppUiMock'))
jest.mock('react-native-recaptcha-that-works', () => 'Recaptcha')

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  ForgotPasswordForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    return React.createElement(UIComponent, {
      ...require('../../../../../../jest/helpers/appUiTestUtils').baseForgotPasswordUIProps,
      ...rest
    })
  },
  useConfig: jest.fn(() => [{ loading: false, configs: {} }]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

describe('ForgotPasswordForm UI', () => {
  it('renders forgot password email form', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <ForgotPasswordForm navigation={{}} />
    )
    expect(getByText("Enter your email address and we'll sent a link to reset your password.")).toBeTruthy()
    expect(getByPlaceholderText('Email')).toBeTruthy()
  })
})
