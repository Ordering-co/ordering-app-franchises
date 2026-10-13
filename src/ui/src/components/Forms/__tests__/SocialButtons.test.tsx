import React from 'react'
import { Platform, Text } from 'react-native'
import { renderWithProviders } from '../../../../../../jest/helpers/renderWithProviders'
import { SocialButtons } from '../SocialButtons'

const configRef = { current: {} as Record<string, any> }

jest.mock('@components', () => ({
  ToastType: { Error: 'error' },
  useConfig: () => [{ configs: configRef.current }],
  useToast: () => [null, { showToast: jest.fn() }],
  useLanguage: () => [{}, (_key: string, fallback: string) => fallback],
  useSession: () => [{ auth: false, user: null }, { login: jest.fn() }]
}))

jest.mock('@ui', () => {
  const React = require('react')
  const { Text } = require('react-native')
  return {
    OText: ({ children, ...props }: any) => React.createElement(Text, props, children),
    FacebookLogin: () => React.createElement(Text, { testID: 'facebook-login' }, 'Facebook'),
    GoogleLogin: () => React.createElement(Text, { testID: 'google-login' }, 'Google'),
    AppleLogin: () => React.createElement(Text, { testID: 'apple-login' }, 'Apple')
  }
})

const makeConfigs = (
  facebookFlag?: Record<string, any>,
  googleFlag?: Record<string, any>,
  overrides: Record<string, any> = {}
) => {
  const configs: Record<string, any> = {
    facebook_login_enabled: facebookFlag,
    google_login_enabled: googleFlag,
    facebook_id: { value: 'facebook-id' },
    google_login_client_id: { value: 'google-web-id' },
    google_login_ios_client_id: { value: 'google-ios-id' },
    apple_login_enabled: { value: '0', enabled: true },
    ...overrides
  }

  if (facebookFlag === undefined) delete configs.facebook_login_enabled
  if (googleFlag === undefined) delete configs.google_login_enabled
  return configs
}

const setPlatform = (platform: 'ios' | 'android') => {
  Object.defineProperty(Platform, 'OS', { configurable: true, value: platform })
}

const renderButtons = (configs: Record<string, any>, platform: 'ios' | 'android' = 'android') => {
  setPlatform(platform)
  configRef.current = configs
  return renderWithProviders(
    <SocialButtons notificationState={{}} setIsFBLoading={jest.fn()} />
  )
}

describe('SocialButtons', () => {
  it.each([
    ['0', '0', false, false],
    ['0', '1', false, true],
    ['1', '0', true, false],
    ['1', '1', true, true]
  ])("gates Facebook and Google independently for flags %s/%s", (facebookValue, googleValue, showFacebook, showGoogle) => {
    const { queryByTestId, queryByText } = renderButtons(
      makeConfigs({ value: facebookValue }, { value: googleValue })
    )

    expect(Boolean(queryByTestId('facebook-login'))).toBe(showFacebook)
    expect(Boolean(queryByTestId('google-login'))).toBe(showGoogle)
    expect(queryByTestId('apple-login')).toBeNull()
    expect(Boolean(queryByText('or'))).toBe(showFacebook || showGoogle)
  })

  it.each([
    ['reduced zero', { value: '0' }],
    ['dictionary zero', { value: '0', enabled: true }],
    ['empty value with enabled fallback', { value: '', enabled: true }],
    ['missing value with enabled fallback', { enabled: true }],
    ['missing flags', undefined]
  ])("keeps Facebook and Google disabled for %s", (_label, flag) => {
    const { queryByTestId, queryByText } = renderButtons(makeConfigs(flag, flag))

    expect(queryByTestId('facebook-login')).toBeNull()
    expect(queryByTestId('google-login')).toBeNull()
    expect(queryByTestId('apple-login')).toBeNull()
    expect(queryByText('or')).toBeNull()
  })

  it.each([
    ['Android with only the web ID', 'android', { value: 'web-id' }, undefined, true],
    ['iOS without the iOS ID', 'ios', { value: 'web-id' }, undefined, false],
    ['Android without the web ID', 'android', undefined, { value: 'ios-id' }, false],
    ['iOS with both IDs', 'ios', { value: 'web-id' }, { value: 'ios-id' }, true]
  ])("requires Google credentials for %s", (_label, platform, webId, iosId, showGoogle) => {
    const configs = makeConfigs({ value: '0' }, { value: '1' }, {
      google_login_client_id: webId,
      google_login_ios_client_id: iosId
    })
    const { queryByTestId } = renderButtons(configs, platform)

    expect(Boolean(queryByTestId('google-login'))).toBe(showGoogle)
  })

  it.each([
    ['legacy flag off', { value: '0' }, 'facebook-id', true],
    ['legacy flag missing', undefined, 'facebook-id', true],
    ['Facebook ID missing', { value: '1' }, undefined, false]
  ])("ignores the legacy Facebook flag when %s", (_label, legacyFlag, facebookId, showFacebook) => {
    const configs = makeConfigs({ value: '1' }, { value: '0' }, {
      facebook_login: legacyFlag,
      facebook_id: facebookId ? { value: facebookId } : undefined
    })
    const { queryByTestId } = renderButtons(configs)

    expect(Boolean(queryByTestId('facebook-login'))).toBe(showFacebook)
  })

  it('preserves Apple fallback behavior on iOS and ignores it on Android', () => {
    const configs = makeConfigs({ value: '0' }, { value: '0' }, {
      apple_login_enabled: { enabled: true },
      apple_login_client_id: { value: 'apple-id' }
    })

    expect(renderButtons(configs, 'ios').getByTestId('apple-login')).toBeTruthy()
    expect(renderButtons(configs, 'android').queryByTestId('apple-login')).toBeNull()
  })

  it('keeps Apple disabled for an explicit zero even when enabled is true', () => {
    const configs = makeConfigs({ value: '0' }, { value: '0' }, {
      apple_login_enabled: { value: '0', enabled: true },
      apple_login_client_id: { value: 'apple-id' }
    })

    expect(renderButtons(configs, 'ios').queryByTestId('apple-login')).toBeNull()
  })

  it('removes Facebook and Google after their flags change from on to off', () => {
    const view = renderButtons(makeConfigs({ value: '1' }, { value: '1' }))
    expect(view.getByTestId('facebook-login')).toBeTruthy()
    expect(view.getByTestId('google-login')).toBeTruthy()

    configRef.current = makeConfigs(
      { value: '0', enabled: true },
      { value: '0', enabled: true }
    )
    view.rerender(
      <SocialButtons notificationState={{}} setIsFBLoading={jest.fn()} />
    )

    expect(view.queryByTestId('facebook-login')).toBeNull()
    expect(view.queryByTestId('google-login')).toBeNull()
    expect(view.queryByText('or')).toBeNull()
  })
})
