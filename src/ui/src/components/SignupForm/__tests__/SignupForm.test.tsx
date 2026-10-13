import { SignupForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const signupUIPropsRef = { current: null }
const configRef = { current: {} }

jest.mock('@ui', () => {
  const mockUi = require('../../../../../../jest/helpers/franchiseAppUiMock')
  const React = require('react')
  const { Text } = require('react-native')
  return {
    ...mockUi,
    FacebookLogin: () => React.createElement(Text, { testID: 'facebook-login' }, 'Facebook'),
    GoogleLogin: () => React.createElement(Text, { testID: 'google-login' }, 'Google'),
    AppleLogin: () => React.createElement(Text, { testID: 'apple-login' }, 'Apple')
  }
})
jest.mock('react-native-recaptcha-that-works', () => 'Recaptcha')
jest.mock('@fatnlazycat/react-native-recaptcha-v3', () => 'ReCaptcha')
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner')
jest.mock('../../Forms/Tabs', () => ({ Tabs: () => null }))
jest.mock('@react-native-community/checkbox', () => 'CheckBox')
jest.mock('../../LoginForm/Otp', () => ({ Otp: () => null }))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  SignupForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { Text } = require('react-native')
    if (signupUIPropsRef.current) {
      const { baseSignupUIProps } = require('../../../../../../jest/helpers/appUiTestUtils')
      return React.createElement(UIComponent, {
        ...baseSignupUIProps,
        ...signupUIPropsRef.current,
        ...rest
      })
    }
    return React.createElement(Text, { testID: 'signup-controller' }, 'Signup')
  },
  useConfig: jest.fn(() => [{ loading: false, configs: configRef.current }]),
  useSession: jest.fn(() => [{ auth: false, user: null }, {}]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

describe('SignupForm UI', () => {
  afterEach(() => {
    signupUIPropsRef.current = null
    configRef.current = {}
  })

  it('loads signup controller wiring', () => {
    const { getByTestId } = renderWithProviders(
      <SignupForm navigation={{}} onNavigationRedirect={jest.fn()} />
    )
    expect(getByTestId('signup-controller')).toBeTruthy()
  })

  it('renders real SocialButtons and responds when provider flags are switched off []', () => {
    const { baseSignupUIProps } = require('../../../../../../jest/helpers/appUiTestUtils')
    signupUIPropsRef.current = {
      ...baseSignupUIProps,
      isCustomerMode: false
    }
    configRef.current = {
      business_signup_allow: { value: '1' },
      driver_signup_allow: { value: '0' },
      terms_and_conditions: { value: 'true' },
      facebook_login_enabled: { value: '1' },
      facebook_id: { value: 'facebook-id' },
      google_login_enabled: { value: '1' },
      google_login_client_id: { value: 'google-web-id' },
      google_login_ios_client_id: { value: 'google-ios-id' },
      apple_login_enabled: { value: '0', enabled: true }
    }

    const view = renderWithProviders(
      <SignupForm navigation={{ navigate: jest.fn() }} onNavigationRedirect={jest.fn()} />
    )
    expect(view.getByTestId('facebook-login')).toBeTruthy()
    expect(view.getByTestId('google-login')).toBeTruthy()

    configRef.current = {
      ...configRef.current,
      facebook_login_enabled: { value: '0', enabled: true },
      google_login_enabled: { value: '0', enabled: true }
    }
    view.rerender(
      <SignupForm navigation={{ navigate: jest.fn() }} onNavigationRedirect={jest.fn()} />
    )

    expect(view.queryByTestId('facebook-login')).toBeNull()
    expect(view.queryByTestId('google-login')).toBeNull()
  })
})
