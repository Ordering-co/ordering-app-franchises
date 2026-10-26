import * as Sentry from '@sentry/react-native'
import DeviceInfo from 'react-native-device-info'
import settings from '../../config'
import sentrySettings from '../../sentry.json'
import { initSentry } from '../sentry'

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  setTag: jest.fn()
}))

jest.mock('react-native-device-info', () => ({
  getBundleId: jest.fn(() => 'com.appfranchises'),
  getVersion: jest.fn(() => '2.3.4'),
  getBuildNumber: jest.fn(() => '56')
}))

jest.mock('../../sentry.json', () => ({ dsn: '' }))

const DSN = 'https://public@o0.ingest.sentry.io/0'
const globalScope = global as unknown as { __DEV__: boolean }

describe('initSentry', () => {
  const originalDev = globalScope.__DEV__

  beforeEach(() => {
    globalScope.__DEV__ = false
    sentrySettings.dsn = DSN
  })

  afterEach(() => {
    globalScope.__DEV__ = originalDev
    sentrySettings.dsn = ''
  })

  it('does not initialize in development builds', () => {
    globalScope.__DEV__ = true

    initSentry()

    expect(Sentry.init).not.toHaveBeenCalled()
    expect(Sentry.setTag).not.toHaveBeenCalled()
  })

  it('does not initialize when the dsn is empty', () => {
    sentrySettings.dsn = ''

    initSentry()

    expect(Sentry.init).not.toHaveBeenCalled()
    expect(Sentry.setTag).not.toHaveBeenCalled()
  })

  it('initializes with the production options and tags when a dsn is set', () => {
    initSentry()

    expect(Sentry.init).toHaveBeenCalledTimes(1)
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: DSN,
      environment: 'production',
      release: 'com.appfranchises@2.3.4+56',
      dist: '56',
      enableNativeCrashHandling: false,
      enableAppHangTracking: false,
      tracesSampleRate: 0.1
    })
    expect(Sentry.setTag).toHaveBeenCalledWith('app', 'app-franchises')
    expect(Sentry.setTag).toHaveBeenCalledWith('project', settings.project)
  })

  it('swallows errors thrown by Sentry.init', () => {
    (Sentry.init as jest.Mock).mockImplementationOnce(() => {
      throw new Error('init failed')
    })

    expect(() => initSentry()).not.toThrow()
    expect(Sentry.setTag).not.toHaveBeenCalled()
  })

  it('swallows errors thrown while reading device info', () => {
    (DeviceInfo.getBuildNumber as jest.Mock).mockImplementationOnce(() => {
      throw new Error('native module unavailable')
    })

    expect(() => initSentry()).not.toThrow()
    expect(Sentry.init).not.toHaveBeenCalled()
  })
})
