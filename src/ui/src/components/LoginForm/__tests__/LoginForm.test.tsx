import { LoginForm } from '../index'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'

const loginUIPropsRef = { current: null }
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
jest.mock('../../Forms/Tabs', () => ({
  Tabs: () => null
}))

jest.mock('@components', () => ({
  ...require('../../../../../../jest/helpers/mockOrdering'),
  LoginForm: ({ UIComponent, ...rest }) => {
    const React = require('react')
    const { baseLoginUIProps } = require('../../../../../../jest/helpers/appUiTestUtils')
    return React.createElement(UIComponent, {
      ...(loginUIPropsRef.current || baseLoginUIProps),
      ...rest
    })
  },
  useConfig: jest.fn(() => [{ loading: false, configs: configRef.current }]),
  useSession: jest.fn(() => [{ auth: false, user: null }, {}]),
  useToast: jest.fn(() => [null, { showToast: jest.fn() }])
}))

describe('LoginForm UI', () => {
  afterEach(() => {
    loginUIPropsRef.current = null
    configRef.current = {}
  })

  it('renders email login fields', () => {
    const { baseLoginUIProps } = require('../../../../../../jest/helpers/appUiTestUtils')
    loginUIPropsRef.current = { ...baseLoginUIProps, useLoginByEmail: true }
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <LoginForm useLoginByEmail onNavigationRedirect={jest.fn()} />
    )
    expect(getByText('Welcome to OrderingPlus!')).toBeTruthy()
    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
    expect(getByText('Login')).toBeTruthy()
  })

  it('renders real SocialButtons and responds when provider flags are switched off []', () => {
    const { baseLoginUIProps } = require('../../../../../../jest/helpers/appUiTestUtils')
    loginUIPropsRef.current = {
      ...baseLoginUIProps,
      useLoginByEmail: true,
      loginTab: 'email',
      isCustomerMode: false
    }
    configRef.current = {
      facebook_login_enabled: { value: '1' },
      facebook_id: { value: 'facebook-id' },
      google_login_enabled: { value: '1' },
      google_login_client_id: { value: 'google-web-id' },
      google_login_ios_client_id: { value: 'google-ios-id' },
      apple_login_enabled: { value: '0', enabled: true }
    }

    const view = renderWithProviders(
      <LoginForm useLoginByEmail onNavigationRedirect={jest.fn()} />
    )
    expect(view.getByTestId('facebook-login')).toBeTruthy()
    expect(view.getByTestId('google-login')).toBeTruthy()

    configRef.current = {
      ...configRef.current,
      facebook_login_enabled: { value: '0', enabled: true },
      google_login_enabled: { value: '0', enabled: true }
    }
    view.rerender(
      <LoginForm useLoginByEmail onNavigationRedirect={jest.fn()} />
    )

    expect(view.queryByTestId('facebook-login')).toBeNull()
    expect(view.queryByTestId('google-login')).toBeNull()
  })
})
