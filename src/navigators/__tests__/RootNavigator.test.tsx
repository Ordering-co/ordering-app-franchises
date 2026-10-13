import React from 'react'
import { waitFor } from '@testing-library/react-native'
import { renderWithProviders } from '../../../jest/helpers/renderWithProviders'
import { useApi, useConfig, useOrder, useSession, useWebsocket } from '@components'

jest.mock('@react-navigation/stack', () => {
  const ReactNative = require('react-native')
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => (
        <ReactNative.View testID='root-stack'>{children}</ReactNative.View>
      ),
      Screen: ({ name, initialParams }) => (
        <ReactNative.View testID={`root-${name}`}>
          <ReactNative.Text>{name}</ReactNative.Text>
          {initialParams?.loadingData ? <ReactNative.Text>loading-data</ReactNative.Text> : null}
        </ReactNative.View>
      )
    })
  }
})

const stubPage = (label) => {
  const { Text } = require('react-native')
  return { default: () => <Text>{label}</Text> }
}

jest.mock('../HomeNavigator', () => stubPage('HomeNavigatorPage'))
jest.mock('../../pages/Login', () => stubPage('LoginPage'))
jest.mock('../../pages/Signup', () => stubPage('SignupPage'))
jest.mock('../../pages/ForgotPassword', () => stubPage('ForgotPage'))
jest.mock('../../pages/Home', () => stubPage('HomePage'))
jest.mock('../../pages/IntroductoryTutorial', () => stubPage('TutorialPage'))
jest.mock('../../pages/Splash', () => stubPage('SplashPage'))
jest.mock('../../pages/NotFound', () => stubPage('NotFoundPage'))
jest.mock('../../pages/NetworkError', () => stubPage('NetworkErrorPage'))
jest.mock('../../pages/UserVerification', () => stubPage('UserVerificationPage'))
jest.mock('../../pages/ProjectForm', () => stubPage('ProjectFormPage'))

const mockRetrieveStoreData = jest.fn(async () => false)
const mockSetStoreData = jest.fn()
const mockOnChangeBusinessSelected = jest.fn()
const setStateInitialValues = jest.fn()
const changeMoment = jest.fn()

jest.mock('@ui', () => ({
  _retrieveStoreData: (...args) => mockRetrieveStoreData(...args),
  _setStoreData: (...args) => mockSetStoreData(...args),
  orderTypeList: ['delivery', 'pickup', 'eatin', 'curbside', 'drivethru', 'seatdelivery'],
  useBusinessSelected: () => [null, { onChangeBusinessSelected: mockOnChangeBusinessSelected }]
}))

jest.mock('react-native-onesignal', () => ({
  setLogLevel: jest.fn(),
  setAppId: jest.fn(),
  setEmail: jest.fn(),
  setSMSNumber: jest.fn(),
  setExternalUserId: jest.fn(),
  getDeviceState: jest.fn(async () => ({ userId: null, hasNotificationPermission: true })),
  promptForPushNotificationsWithUserResponse: jest.fn(),
  setNotificationOpenedHandler: jest.fn(),
  addSubscriptionObserver: jest.fn(),
  addTrigger: jest.fn()
}))

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn((cb) => {
    cb({ isConnected: true })
    return jest.fn()
  })
}))

jest.mock('react-native-version-check', () => ({
  needUpdate: jest.fn(async () => ({ isNeeded: false }))
}))

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: { IOS: { APP_TRACKING_TRANSPARENCY: 'ios.permission.APP_TRACKING_TRANSPARENCY' } },
  RESULTS: { GRANTED: 'granted' },
  request: jest.fn(async () => 'granted')
}))

import RootNavigator from '../RootNavigator'

describe('RootNavigator', () => {
  beforeEach(() => {
    mockRetrieveStoreData.mockResolvedValue(false)
    ;(useSession as jest.Mock).mockReturnValue([{
      auth: false,
      user: null,
      loading: false,
      token: null
    }])
    ;(useOrder as jest.Mock).mockReturnValue([{
      loading: false,
      options: {},
      carts: {}
    }, { changeMoment, setStateInitialValues }])
    ;(useConfig as jest.Mock).mockReturnValue([{
      configs: {},
      loading: false
    }])
    ;(useApi as jest.Mock).mockReturnValue([{
      project: 'demo',
      root: 'https://api.example.com',
      setCountryCode: jest.fn()
    }])
    ;(useWebsocket as jest.Mock).mockReturnValue({ on: jest.fn(), off: jest.fn() })
  })

  it('renders the guest stack after boot', async () => {
    const { getByTestId, getByText } = renderWithProviders(<RootNavigator />)
    await waitFor(() => {
      expect(getByTestId('root-MyAccount')).toBeTruthy()
    })
    expect(getByText('Login')).toBeTruthy()
    expect(getByText('Signup')).toBeTruthy()
    expect(getByText('Forgot')).toBeTruthy()
  })

  it('renders the authenticated account stack', async () => {
    ;(useSession as jest.Mock).mockReturnValue([{
      auth: true,
      user: { id: 4, email: 'user@example.com' },
      loading: false,
      token: 'tok'
    }])
    const { getByTestId, queryByText } = renderWithProviders(<RootNavigator />)
    await waitFor(() => {
      expect(getByTestId('root-MyAccount')).toBeTruthy()
    })
    expect(queryByText('Login')).toBeNull()
  })
})
